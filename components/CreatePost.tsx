import { ChangeEvent, useEffect, useState } from "react";
import { useRouter } from "next/router";
import { collection, getDocs, addDoc } from "firebase/firestore";
import { getStorage, ref, getDownloadURL, uploadBytes } from "firebase/storage";

import { useFirebase } from "@/contexts/firebase";
import { useSession } from "@/contexts/session";

import Input from "./Input";
import Button from "./Button";
import ImageUploader from "./ImageUploader";

interface ICreatePost {
  group?: string | string[] | undefined;
  closeModal: Function;
}

export default function CreatePost({ group, closeModal }: ICreatePost) {
  // Access router
  const router = useRouter();

  // Access contexts
  const { user } = useSession();
  const { db } = useFirebase();

  // Local state
  const [postType, setPostType] = useState("text");
  const [groups, setGroups] = useState<String[]>([]);
  const [selectedGroup, setSelectedGroup] = useState<String>("");
  const [errorArr, setErrorArr] = useState<String[]>([]);
  const [image, setImage] = useState<File | null>(null);

  const handleCreatePost = async (e: ChangeEvent<HTMLFormElement>) => {
    e.preventDefault();

    let errors = [];

    // Destructure form
    const { title, content, group } = e.currentTarget;

    // Default image url
    let imageURL = null;

    // Check for errors
    if (!title.value) errors.push("titleError");
    if (!content?.value && postType === "text") errors.push("contentError");
    if (!group.value) errors.push("groupError");
    if (postType === "image") {
      if (!image || image.size > 2000000) errors.push("imageError");
    }

    // Do not submit if errors
    if (errors.length > 0) {
      setErrorArr(errors);
      return;
    }

    // Redirect to login if no user
    if (!user) {
      router.replace("/login");
      return;
    }

    try {
      // Check for image
      if (image) {
        const imageRef = ref(getStorage(), image.name);
        const snapshot = await uploadBytes(imageRef, image);
        if (snapshot) imageURL = await getDownloadURL(imageRef);
      }

      // Create new post
      const newPost = {
        content: content?.value ?? null,
        likes: 0,
        timestamp: new Date().getTime(),
        user: user.displayName,
        group: group.value,
        title: title.value,
        image: imageURL,
      };

      const docRef = await addDoc(collection(db, "posts"), newPost);

      // Close modal
      if (docRef) closeModal();

      // Clear form
      e.target.reset();
    } catch (e) {
      console.log("e", e);
    }
  };

  const getAllGroups = async () => {
    try {
      let arr: String[] = [];

      // Get groups
      const querySnapshot = await getDocs(collection(db, "groups"));
      // Add to arr
      querySnapshot.forEach((group) => {
        arr.push(group.id);
      });
      setGroups(arr);
    } catch (e) {
      console.log("e", e);
    }
  };

  useEffect(() => {
    getAllGroups();
    setSelectedGroup(group);
  }, []);

  return (
    <div className="flex flex-col justify-center h-full p-4">
      {/* Buttons */}
      <div className="flex gap-8 py-2">
        <button
          className={`${
            postType === "text" ? "bg-gray-800" : ""
          } flex-1 border border-gray-700 hover:bg-gray-800`}
          onClick={() => setPostType("text")}
        >
          Text
        </button>
        <button
          className={`${
            postType === "image" ? "bg-gray-800" : ""
          } flex-1 border border-gray-700 hover:bg-gray-800`}
          onClick={() => setPostType("image")}
        >
          Image
        </button>
      </div>

      <form className="space-y-4" onSubmit={handleCreatePost}>
        <Input
          name="title"
          placeholder="Title"
          error={errorArr.includes("titleError")}
          onChange={() =>
            setErrorArr(errorArr.filter((err) => err !== "titleError"))
          }
        />

        {postType === "text" ? (
          <Input
            type="textarea"
            name="content"
            placeholder="Content"
            error={errorArr.includes("contentError")}
            onChange={() =>
              setErrorArr(errorArr.filter((err) => err !== "contentError"))
            }
          />
        ) : (
          <ImageUploader
            image={image}
            onChange={setImage}
            errorArr={errorArr}
            setErrorArr={setErrorArr}
          />
        )}

        <div className="flex gap-2 justify-end">
          <select
            name="group"
            className="bg-black border px-2 py-1 flex-1"
            value={`${selectedGroup}`}
            onChange={(e) => setSelectedGroup(e.target.value)}
          >
            {groups?.map((theGroup) => (
              <option key={`${theGroup}`} value={`${theGroup}`}>
                {theGroup}
              </option>
            ))}
          </select>
          <Button
            rounded
            size="sm"
            color="gray"
            text="Cancel"
            onClick={() => {
              closeModal();
            }}
          />
          <Button
            rounded
            size="sm"
            text="Post"
            disabled={errorArr.length > 0}
          />
        </div>
      </form>
    </div>
  );
}
