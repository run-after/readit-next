import { useState, MouseEvent, MouseEventHandler } from "react";
import { doc, setDoc } from "firebase/firestore";
import {
  ArrowDownCircleIcon,
  ArrowUpCircleIcon,
} from "@heroicons/react/24/solid";
import { useRouter } from "next/router";

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

type HeadingProp = {
  post: IPost;
  handleUpVote: MouseEventHandler<HTMLButtonElement>;
  handleDownVote: MouseEventHandler<HTMLButtonElement>;
  likeCount: number;
};

const Heading = ({
  post,
  handleUpVote,
  handleDownVote,
  likeCount,
}: HeadingProp) => {
  // Access context
  const { user } = useSession();

  return (
    <div className="flex gap-4 text-white">
      <div className="flex gap-2 items-center border-r border-gray-700 pr-4">
        <button onClick={handleDownVote}>
          <ArrowDownCircleIcon
            className={`${
              user?.hates.includes(post.id) ? "text-orange-400" : ""
            } h-4 w-4 hover:opacity-70`}
          />
        </button>
        <span>{likeCount}</span>
        <button onClick={handleUpVote}>
          <ArrowUpCircleIcon
            className={`${
              user?.likes.includes(post.id) ? "text-green-400" : ""
            } h-4 w-4 hover:opacity-70`}
          />
        </button>
      </div>
      <span className="overflow-hidden">{post.title}</span>
    </div>
  );
};

export default function Post({ post, showGroupButton = true }: PostProp) {
  // Access router
  const router = useRouter();

  // Access contexts
  const { user, setUser } = useSession();
  const { db } = useFirebase();

  // Local state
  const [showFullPost, setShowFullPost] = useState(false);
  const [likeCount, setLikeCount] = useState(post.likes);

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

  const handleUpVote = async () => {
    if (!user) return; // TODO: redirect to login

    // Don't allow more than 1 upvote
    if (user.likes.includes(post.id)) return;
    try {
      // Update post with a like
      await setDoc(doc(db, "posts", post.id), {
        ...post,
        likes: post.likes + 1,
      });

      const tempUser = {
        ...user,
        likes: [...user.likes, post.id],
        hates: user.hates.filter((hatedPost) => hatedPost !== post.id),
      };

      // Update user with a like
      await setDoc(doc(db, "users", user.displayName), tempUser);
      setUser(tempUser);

      // Update like count
      setLikeCount(likeCount + 1);
    } catch (e) {
      console.log("err", e);
    }
  };

  const handleDownVote = async () => {
    if (!user) return; // TODO: redirect to login

    // Don't allow more than 1 downvote
    if (user.hates.includes(post.id)) return;

    try {
      // Update post with a like
      await setDoc(doc(db, "posts", post.id), {
        ...post,
        likes: post.likes - 1,
      });

      const tempUser = {
        ...user,
        hates: [...user.hates, post.id],
        likes: user.likes.filter((likedPost) => likedPost !== post.id),
      };

      // Update user with a like
      await setDoc(doc(db, "users", user.displayName), tempUser);
      setUser(tempUser);

      // Update like count
      setLikeCount(likeCount - 1);
    } catch (e) {
      console.log("err", e);
    }
  };

  return (
    <div className="flex gap-6 p-4 border border-gray-800 hover:border-white">
      <div className="flex flex-col gap-1 items-center">
        <button onClick={handleUpVote}>
          <ArrowUpCircleIcon
            className={`${
              user?.likes.includes(post.id) ? "text-green-400" : ""
            } h-4 w-4 hover:opacity-70`}
          />
        </button>
        <span>{likeCount}</span>
        <button onClick={handleDownVote}>
          <ArrowDownCircleIcon
            className={`${
              user?.hates.includes(post.id) ? "text-orange-400" : ""
            } h-4 w-4 hover:opacity-70`}
          />
        </button>
      </div>
      <div
        className="flex flex-col flex-1 gap-2 rounded  hover:cursor-pointer"
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
            heading={
              <Heading
                handleUpVote={handleUpVote}
                handleDownVote={handleDownVote}
                likeCount={likeCount}
                post={post}
              />
            }
            onClose={() => {
              setShowFullPost(false);
            }}
          >
            <FullPost post={post} />
          </Modal>
        )}
      </div>
    </div>
  );
}
