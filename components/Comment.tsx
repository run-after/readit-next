import {
  ArrowDownCircleIcon,
  ArrowUpCircleIcon,
} from "@heroicons/react/24/solid";
import { doc, setDoc } from "firebase/firestore";
import { useState } from "react";

import { IComment } from "@/interfaces";
import { useSession } from "@/contexts/session";
import { useFirebase } from "@/contexts/firebase";

import LocalLink from "./LocalLink";

interface CommentProp {
  comment: IComment;
}

export default function Comment({ comment }: CommentProp) {
  // Access contexts
  const { user, setUser } = useSession();
  const { db } = useFirebase();

  // Local state
  const [likeCount, setLikeCount] = useState(comment.likes);

  const handleUpVote = async () => {
    if (!user) return; // TODO: redirect to login

    // Don't allow more than 1 upvote
    if (user.likes.includes(comment.id)) return;
    try {
      // Update comment with a like
      await setDoc(doc(db, "comments", comment.id), {
        ...comment,
        likes: comment.likes + 1,
      });

      const tempUser = {
        ...user,
        likes: [...user.likes, comment.id],
        hates: user.hates.filter((hatedComment) => hatedComment !== comment.id),
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
    if (user.hates.includes(comment.id)) return;
    try {
      // Update comment with a like
      await setDoc(doc(db, "comments", comment.id), {
        ...comment,
        likes: comment.likes - 1,
      });

      const tempUser = {
        ...user,
        hates: [...user.hates, comment.id],
        likes: user.likes.filter((likedComment) => likedComment !== comment.id),
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

// TODO: Handle unauthed user
