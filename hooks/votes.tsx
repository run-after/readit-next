import { doc, setDoc } from "firebase/firestore";
import { useRouter } from "next/router";

import { useSession } from "@/contexts/session";
import { useFirebase } from "@/contexts/firebase";
import { IComment, IPost } from "@/interfaces";

type VoteProp = {
  content: IPost | IComment;
  type: string;
};

// VV: need to pass setLikeCount && likeCount into here?
function useVoting() {
  // Access router
  const router = useRouter();

  // Access contexts
  const { user, setUser } = useSession();

  const { db } = useFirebase();

  const handleUpVote = async ({ content, type }: VoteProp) => {
    // Redirect to login if no user
    if (!user) {
      router.replace("/login");
      return;
    }

    // Don't allow more than 1 upvote
    if (user.likes.includes(content.id)) return;
    try {
      // Update post with a like
      await setDoc(doc(db, type, content.id), {
        ...content,
        likes: content.likes + 1,
      });

      const tempUser = {
        ...user,
        likes: [...user.likes, content.id],
        hates: user.hates.filter((hatedPost) => hatedPost !== content.id),
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

  // VV: need to pass setLikeCount && likeCount into here?
  const handleDownVote = async ({ content, type }: VoteProp) => {
    // Redirect to login if no user
    if (!user) {
      router.replace("/login");
      return;
    }

    // Don't allow more than 1 downvote
    if (user.hates.includes(content.id)) return;

    try {
      // Update post with a like
      await setDoc(doc(db, type, content.id), {
        ...content,
        likes: content.likes - 1,
      });

      const tempUser = {
        ...user,
        hates: [...user.hates, content.id],
        likes: user.likes.filter((likedPost) => likedPost !== content.id),
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

  return { handleUpVote, handleDownVote };
}

export { useVoting };

// TODO: setLikeCount && likeCount
