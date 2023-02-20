import { useState, MouseEvent } from "react";
import { doc, setDoc } from "firebase/firestore";

import { IPost } from "@/interfaces";
import { useSession } from "@/contexts/session";
import { useFirebase } from "@/contexts/firebase";

import Button from "./Button";
import Modal from "./Modal";
import FullPost from "./FullPost";
import LocalLink from "./LocalLink";

type PostProp = {
  post: IPost;
  showGroupButton?: boolean;
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

    if (!user) return; // TODO: Prompt to login

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

    if (!user) return; // TODO: Prompt to login

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
          <LocalLink
            text={post.group}
            href={`/groups/${post.group}`}
            onClick={(e) => e.stopPropagation()}
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
        >
          <FullPost post={post} />
        </Modal>
      )}
    </div>
  );
}

// TODO: Redirect to login if no user for join/leave group
