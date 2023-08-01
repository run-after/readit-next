import { useEffect, useState } from "react";
import { getDocs, collection } from "firebase/firestore";

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

      // Get posts
      const querySnapshot = await getDocs(collection(db, "posts"));

      // Add id to each post
      querySnapshot.forEach((doc) => {
        const post = { ...doc.data(), id: doc.id };
        arr.push(post as IPost);
      });

      // If user belongs to at least 1 group, personalize feed
      if (user?.groups.length)
        arr = arr.filter((post) => user?.groups.includes(post.group));

      setAllPosts(arr.sort((x, y) => y.timestamp - x.timestamp));

      // End loaing
      setLoading(false);
    } catch (e) {
      console.log("err", e);
    }
  };

  useEffect(() => {
    getPosts();
  }, []);

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
