import {
  ArrowDownCircleIcon,
  ArrowUpCircleIcon,
} from "@heroicons/react/24/solid";
import { useState } from "react";

import { IComment } from "@/interfaces";
import { useSession } from "@/contexts/session";
import { useVoting } from "@/hooks/votes";

import LocalLink from "./LocalLink";

interface CommentProp {
  comment: IComment;
}

export default function Comment({ comment }: CommentProp) {
  // Access contexts
  const { user } = useSession();

  // Local state
  const [likeCount, setLikeCount] = useState(comment.likes);

  // Access hook
  const { handleUpVote, handleDownVote } = useVoting({
    content: comment,
    type: "comments",
    likeCount,
    setLikeCount,
  });

  return (
    <div className="space-y-1">
      {/* Heading */}
      <div className="flex gap-4 items-center">
        <LocalLink href={`/users/${comment.user}`} text={comment.user} />
        <span className="text-gray-500 text-xs">
          {new Date(comment.timestamp).toLocaleDateString()}
        </span>
      </div>
      <p>{comment.content}</p>
      {/* Footing */}
      <div className="flex items-center gap-2">
        <button onClick={handleDownVote}>
          <ArrowDownCircleIcon
            className={`h-4 w-4 ${
              user?.hates.includes(comment.id) ? "text-orange-400" : ""
            } hover:opacity-70`}
          />
        </button>

        <span>{likeCount}</span>
        <button onClick={handleUpVote}>
          <ArrowUpCircleIcon
            className={`h-4 w-4 ${
              user?.likes.includes(comment.id) ? "text-green-400" : ""
            } hover:opacity-70`}
          />
        </button>
      </div>
    </div>
  );
}
