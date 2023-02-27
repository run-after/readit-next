import { MouseEvent, useEffect, useState, ChangeEvent } from "react";
import { useRouter } from "next/router";
import {
  setDoc,
  doc,
  query,
  collection,
  getDocs,
  where,
  addDoc,
} from "firebase/firestore";

import { useSession } from "@/contexts/session";
import { useFirebase } from "@/contexts/firebase";
import { IComment, IPost } from "@/interfaces";

import Button from "./Button";
import Input from "./Input";
import Comment from "./Comment";
import LocalLink from "./LocalLink";

interface PostProps {
  post: IPost;
}

export default function FullPost({ post }: PostProps) {
  const router = useRouter();

  // Access contexts
  const { user, setUser } = useSession();
  const { db } = useFirebase();

  // Local state
  const [comments, setComments] = useState<IComment[]>([]);

  // TODO: Move into helper
  const handleJoinGroup = async (
    group: string,
    e: MouseEvent<HTMLButtonElement, globalThis.MouseEvent>
  ) => {
    // Stop parent element onClick
    e.stopPropagation();

    if (!user) {
      router.replace("/login");
      return;
    }

    // Copy user groups
    const tempGroups = [...user.groups];

    // Push new group
    tempGroups.push(group);

    // Update user
    await setDoc(doc(db, "users", user.displayName), {
      ...user,
      groups: tempGroups,
    });

    // Update user context
    setUser({ ...user, groups: tempGroups });
  };

  // TODO: Move into helper
  const handleLeaveGroup = async (
    group: string,
    e: MouseEvent<HTMLButtonElement, globalThis.MouseEvent>
  ) => {
    // Stop parent element onClick
    e.stopPropagation();

    if (!user) {
      router.replace("/login");
      return;
    }

    // Copy user groups
    const tempGroups = [...user.groups].filter((x) => x !== group);

    // Update user
    await setDoc(doc(db, "users", user.displayName), {
      ...user,
      groups: tempGroups,
    });

    // Update user context
    setUser({ ...user, groups: tempGroups });
  };

  const handleSubmitComment = async (e: ChangeEvent<HTMLFormElement>) => {
    e.preventDefault();
    const { comment } = e.currentTarget;

    if (!user) {
      router.replace("/login");
      return;
    }

    try {
      const newComment = {
        content: comment.value,
        likes: 0,
        timestamp: new Date().getTime(),
        user: user.displayName,
        post: post.id,
      };

      const docRef = await addDoc(collection(db, "comments"), newComment);

      // Refresh comments
      if (docRef) getComments();

      // Clear form
      e.target.reset();
    } catch (e) {
      console.log(e);
    }
  };

  // Maybe SSR
  const getComments = async () => {
    try {
      let arr: IComment[] = [];
      // Get all post comments
      const querySnapshot = await getDocs(
        query(collection(db, "comments"), where("post", "==", post.id))
      );
      querySnapshot.forEach((doc) => {
        const temp = { ...doc.data(), id: doc.id };
        arr.push(temp as IComment);
      });

      setComments(arr.sort((x, y) => y.timestamp - x.timestamp));
    } catch (e) {
      console.log("err", e);
    }
  };

  useEffect(() => {
    getComments();
  }, []);

  return (
    <div className="space-y-8">
      {/* Heading */}
      <div className="flex justify-between gap-2 items-center mt-12 bg-gray-800 p-4">
        <div className="flex gap-2 items-center">
          {/* TODO: Add image to group */}
          <div className="rounded-full h-6 w-6 bg-red-400" />
          <LocalLink
            href={`/groups/${post.group}`}
            onClick={(e) => e.stopPropagation()}
            text={post.group}
          />
          <p className="text-sm opacity-70">
            Posted by:{" "}
            <LocalLink
              text={post.user}
              href={`/users/${post.user}`}
              onClick={(e) => e.stopPropagation()}
            />{" "}
            on {new Date(post.timestamp).toLocaleDateString()}
          </p>
        </div>
        {/* Join/leave button */}

        <Button
          text={user?.groups.includes(post.group) ? "Leave" : "Join"}
          color="gray"
          size="sm"
          rounded
          onClick={
            user?.groups.includes(post.group)
              ? (e) => handleLeaveGroup(post.group, e)
              : (e) => handleJoinGroup(post.group, e)
          }
        />
      </div>
      {post.image ? (
        <div className="self-center p-4">
          <img src={post.image} alt="" />
        </div>
      ) : (
        <div className="px-4">{post.content}</div>
      )}
      {/* Comment form */}
      <div className="p-4 m-4">
        <form className="flex flex-col gap-4" onSubmit={handleSubmitComment}>
          <Input
            name="comment"
            placeholder="What are your thoughts?"
            label={`Comment as ${user?.displayName}`}
            type="textarea"
          />
          <div className="self-end">
            <Button text="Comment" size="sm" rounded />
          </div>
        </form>
      </div>
      {/* Comments */}
      <div className="p-4 border-t border-gray-600 space-y-4">
        {comments.map((x) => (
          <Comment key={x.id} comment={x} />
        ))}
      </div>
    </div>
  );
}
