import {
  ArrowDownCircleIcon,
  ArrowUpCircleIcon,
} from "@heroicons/react/24/solid";

import { IComment } from "@/interfaces";
import { useSession } from "@/contexts/session";

import LocalLink from "./LocalLink";

interface CommentProp {
  comment: IComment;
}

export default function Comment({ comment }: CommentProp) {
  // Access context
  const { user } = useSession();

  const handleUpVote = async () => {
    try {
    } catch (e) {}
  };

  const handleDownVote = async () => {
    try {
    } catch (e) {}
  };

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

        <span>{comment.likes}</span>
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

// TODO: Handle up/down vote
