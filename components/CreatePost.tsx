import { ChangeEvent, useEffect, useState, MouseEvent } from "react";
import { useRouter } from "next/router";
import { collection, getDocs, addDoc } from "firebase/firestore";
import { useFirebase } from "@/contexts/firebase";

import { useSession } from "@/contexts/session";

import Input from "./Input";
import Button from "./Button";

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
  const [errorArr, setErrorArr] = useState<String[]>([]);

  const handleCreatePost = async (e: ChangeEvent<HTMLFormElement>) => {
    e.preventDefault();

    let errors = [];

    // Destructure form
    const { title, content, group, image } = e.currentTarget;

    // Check for errors
    if (!title.value) errors.push("titleError");
    if (!content.value && !image) errors.push("contentError");
    if (!group.value) errors.push("groupError");

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
      // Create new post
      const newPost = {
        content: content.value,
        likes: 0,
        timestamp: new Date().getTime(),
        user: user.displayName,
        group: group.value,
        title: title.value,
        image: image?.value || null,
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
  }, []);

  return (
    <div className="flex flex-col justify-center h-full p-4">
      {/* Buttons */}
      <div className="flex gap-8 p-1">
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
        />
        {/* TODO: IMAGE FORM */}
        {postType === "text" ? (
          <Input
            type="textarea"
            name="content"
            placeholder="Content"
            error={errorArr.includes("contentError")}
          />
        ) : (
          // Need to select an image picker (2MB max) https://www.npmjs.com/package/react-images-uploading
          <input type="file" accept=".png .jpeg .jpg .gif" />
        )}

        <div className="flex gap-2 justify-end">
          <select name="group" className="bg-black border px-2 py-1 flex-1">
            {groups?.map((theGroup) => (
              <option
                key={`${theGroup}`}
                value={`${theGroup}`}
                selected={theGroup === group}
              >
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
          <Button rounded size="sm" text="Post" />
        </div>
      </form>
    </div>
  );
}
