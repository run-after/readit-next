import { useEffect, useState } from "react";
import { getDocs, collection } from "firebase/firestore";

import { useFirebase } from "@/contexts/firebase";
import { IPost } from "@/interfaces";

import Main from "@/components/layouts/Main";
import Post from "@/components/Post";

export default function Home() {
  // Local state
  const [allPosts, setAllPosts] = useState<IPost[]>([]);

  // Access context
  const { db } = useFirebase();

  const getPosts = async () => {
    try {
      let arr: IPost[] = [];
      const querySnapshot = await getDocs(collection(db, "posts"));
      querySnapshot.forEach((doc) => arr.push(doc.data() as IPost));

      setAllPosts(arr);
    } catch (e) {
      console.log("err", e);
    }
  };

  useEffect(() => {
    getPosts();
  }, []);

  return (
    <Main>
      <div className="p-4 px-12 space-y-6">
        {allPosts.map((post: IPost) => (
          <Post key={post.timestamp} post={post} />
        ))}
      </div>
    </Main>
  );
}

// TODO:
// Add loader
// Make a link component with hover effects
