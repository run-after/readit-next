import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { collection, getDocs, query, where } from "firebase/firestore";
import { useFirebase } from "@/contexts/firebase";

import { IPost } from "@/interfaces";

import PostFeed from "@/components/PostFeed";
import Main from "@/components/layouts/Main";

export default function User() {
  // Access router
  const router = useRouter();
  const { user_id } = router.query;

  // Access db
  const { db } = useFirebase();

  // Local state
  const [userPosts, setUserPosts] = useState<IPost[]>([]);

  const getPosts = async () => {
    let postArr: IPost[] = [];
    try {
      const snapshot = await getDocs(
        query(collection(db, "posts"), where("user", "==", user_id))
      );

      snapshot.forEach((doc) => {
        const post = { ...doc.data(), id: doc.id };
        postArr.push(post as IPost);
      });

      setUserPosts(postArr.sort((x, y) => y.timestamp - x.timestamp));
    } catch (e) {
      console.log("err", e);
    }
  };

  useEffect(() => {
    if (user_id) getPosts();
  }, [user_id]);

  return (
    <Main>
      <div className="flex gap-4 items-start">
        {/* Feed */}
        <PostFeed posts={userPosts} showGroupButtons={false} />
        {/* Community card */}
        <div className="w-1/4 border border-gray-800 m-4 p-4 rounded space-y-4">
          <h6 className="text-gray-500 text-bold">About {user_id}</h6>
          <p className="text-gray-300 text-sm">{user_id}</p>
        </div>
      </div>
    </Main>
  );
}
