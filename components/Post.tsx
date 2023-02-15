import Link from "next/link";
import { useState } from "react";

import { IPost } from "@/interfaces";

import Button from "./Button";
import Modal from "./Modal";

type PostProp = {
  post: IPost;
};

export default function Post({ post }: PostProp) {
  const [showFullPost, setShowFullPost] = useState(false);

  const handlePostSelect = () => {
    // Open modal with post info inside
    if (!showFullPost) setShowFullPost(true);
  };

  return (
    <div
      className="p-4 border border-gray-800 flex flex-col gap-2 rounded hover:border-white hover:cursor-pointer"
      onClick={!showFullPost ? handlePostSelect : undefined}
    >
      {/* Heading */}
      <div className="flex justify-between gap-2 items-center">
        <div className="flex gap-2 items-center">
          <div className="rounded-full h-6 w-6 bg-red-400" />
          <Link
            href={`/groups/${post.group}`}
            className="text-sm font-semibold hover:underline hover:opacity-80"
          >
            {post.group}
          </Link>
          <p className="text-sm opacity-70">
            Posted by:{" "}
            <Link
              className="hover:underline hover:opacity-80"
              href={`/users/${post.user}`}
            >
              {post.user}
            </Link>{" "}
            on {new Date(post.timestamp).toLocaleDateString()}
          </p>
        </div>
        {/* TODO: make join button work */}
        <Button text="Join" color="gray" size="sm" rounded />
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
