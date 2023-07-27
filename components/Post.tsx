import { useState, MouseEventHandler, useEffect } from "react";
import { query, collection, getDocs, where } from "firebase/firestore";
import {
  ArrowDownCircleIcon,
  ArrowUpCircleIcon,
} from "@heroicons/react/24/solid";
import { ChatBubbleLeftIcon } from "@heroicons/react/24/outline";

import { IComment, IPost } from "@/interfaces";
import { useSession } from "@/contexts/session";
import { useFirebase } from "@/contexts/firebase";
import { useGroupStatus } from "@/hooks/groupStatus";
import { useVoting } from "@/hooks/votes";

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
  fullPost: boolean;
};

const Heading = ({
  post,
  handleUpVote,
  handleDownVote,
  likeCount,
  fullPost,
}: HeadingProp) => {
  // Access context
  const { user } = useSession();

  return (
    <div className={`${fullPost ? "text-xl" : ""} flex gap-4 text-white`}>
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
  // Local state
  const [showFullPost, setShowFullPost] = useState(false);
  const [likeCount, setLikeCount] = useState(post.likes);
  const [comments, setComments] = useState<IComment[]>([]);

  const { handleUpVote, handleDownVote } = useVoting({
    content: post,
    type: "posts",
    likeCount,
    setLikeCount,
  });

  // Access contexts
  const { user } = useSession();
  const { db } = useFirebase();

  // Access hooks
  const { handleJoinGroup, handleLeaveGroup } = useGroupStatus();

  const handlePostSelect = () => {
    // Open modal with post info inside
    if (!showFullPost) setShowFullPost(true);
  };

  // TODO: Move to helper
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
    <div className="flex gap-6 p-4 border border-gray-800 hover:border-white">
      {/* Left side vote section */}
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
        <div className="flex justify-between gap-2 items-start">
          <div className="flex flex-wrap gap-2 items-center">
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
        {/* Comments */}
        <div className="pt-2 flex gap-2 items-center">
          <ChatBubbleLeftIcon className="h-4 w-4" />
          <p className="text-sm">
            {comments.length} Comment{comments.length !== 1 && "s"}
          </p>
        </div>

        {/* Modal */}
        {showFullPost && (
          <Modal
            heading={
              <Heading
                handleUpVote={handleUpVote}
                handleDownVote={handleDownVote}
                likeCount={likeCount}
                post={post}
                fullPost
              />
            }
            onClose={() => {
              setShowFullPost(false);
            }}
          >
            <FullPost
              post={post}
              comments={comments}
              getComments={getComments}
            />
          </Modal>
        )}
      </div>
    </div>
  );
}
