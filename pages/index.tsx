import { useEffect, useState } from "react";
import { getDocs, collection, limit, query, where } from "firebase/firestore";

import { useFirebase } from "@/contexts/firebase";
import { IPost } from "@/interfaces";
import { useSession } from "@/contexts/session";

import Main from "@/components/layouts/Main";
import PostFeed from "@/components/PostFeed";

export default function Home() {
  // Local state
  const [allPosts, setAllPosts] = useState<IPost[]>([]);
  const [loading, setLoading] = useState(true);

  // Access contexts
  const { db } = useFirebase();
  const { user } = useSession();

  const getPosts = async () => {
    try {
      let arr: IPost[] = [];
      let theQuery;

      if (user?.groups.length) {
        theQuery = query(
          collection(db, "posts"),
          where("group", "in", user.groups),
          limit(10)
        );
      } else {
        theQuery = query(collection(db, "posts"), limit(10));
      }

      // Get posts
      const querySnapshot = await getDocs(theQuery);

      // Add id to each post
      querySnapshot.forEach((doc) => {
        const post = { ...doc.data(), id: doc.id };
        arr.push(post as IPost);
      });

      setAllPosts(arr.sort((x, y) => y.timestamp - x.timestamp));

      // End loading
      setLoading(false);
    } catch (e) {
      console.log("err", e);
    }
  };

  useEffect(() => {
    getPosts();
  }, [user]);

  if (loading)
    return (
      <Main>
        <div className="flex justify-center">
          <img src="/loading.gif" />
        </div>
      </Main>
    );

  return (
    <Main>
      <PostFeed posts={allPosts} />
    </Main>
  );
}

// TODO:
// Pagination
