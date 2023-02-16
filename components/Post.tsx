import Link from "next/link";
import { useState, MouseEvent } from "react";
import { doc, setDoc } from "firebase/firestore";

import { IPost } from "@/interfaces";
import { useSession } from "@/contexts/session";
import { useFirebase } from "@/contexts/firebase";

import Button from "./Button";
import Modal from "./Modal";

type PostProp = {
  post: IPost;
  showGroupButton: boolean;
};

export default function Post({ post, showGroupButton = true }: PostProp) {
  // Access contexts
  const { user, setUser } = useSession();
  const { db } = useFirebase();

  // Local state
  const [showFullPost, setShowFullPost] = useState(false);

  const handlePostSelect = () => {
    // Open modal with post info inside
    if (!showFullPost) setShowFullPost(true);
  };

  const handleJoinGroup = async (
    group: string,
    e: MouseEvent<HTMLButtonElement, globalThis.MouseEvent>
  ) => {
    // Stop parent element onClick
    e.stopPropagation();

    if (!user) return; // Prompt to login

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

  const handleLeaveGroup = async (
    group: string,
    e: MouseEvent<HTMLButtonElement, globalThis.MouseEvent>
  ) => {
    // Stop parent element onClick
    e.stopPropagation();

    if (!user) return; // Prompt to login

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

  return (
    <div
      className="p-4 border border-gray-800 hover:border-white flex flex-col gap-2 rounded  hover:cursor-pointer"
      onClick={!showFullPost ? handlePostSelect : undefined}
    >
      {/* Heading */}
      <div className="flex justify-between gap-2 items-center">
        <div className="flex gap-2 items-center">
          {/* TODO: Add image to group */}
          <div className="rounded-full h-6 w-6 bg-red-400" />
          <Link
            href={`/groups/${post.group}`}
            className="text-sm font-semibold hover:underline hover:opacity-80"
            onClick={(e) => e.stopPropagation()}
          >
            {post.group}
          </Link>
          <p className="text-sm opacity-70">
            Posted by:{" "}
            <Link
              className="hover:underline hover:opacity-80"
              href={`/users/${post.user}`}
              onClick={(e) => e.stopPropagation()}
            >
              {post.user}
            </Link>{" "}
            on {new Date(post.timestamp).toLocaleDateString()}
          </p>
        </div>
        {/* Join/leave button */}
        {showGroupButton && (
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
        )}
      </div>
      {/* Title */}
      <h6 className="font-bold text-lg">{post.title}</h6>
      {/* Image */}
      {post.image && (
        <div className="w-1/2 self-center relative">
          <img src={post.image} alt="" />
        </div>
      )}
      {/* Modal */}
      {showFullPost && (
        <Modal
          onClose={() => {
            setShowFullPost(false);
          }}
          info={post}
        />
      )}
    </div>
  );
}
