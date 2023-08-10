import { useEffect, useState } from "react";
import Link from "next/link";
import {
  getDocs,
  collection,
  limit,
  query,
  where,
  getCountFromServer,
} from "firebase/firestore";

import { useFirebase } from "@/contexts/firebase";
import { IPost } from "@/interfaces";
import { useSession } from "@/contexts/session";

import Main from "@/components/layouts/Main";
import PostFeed from "@/components/PostFeed";
import Button from "@/components/Button";

export default function Home() {
  // Local state
  const [allPosts, setAllPosts] = useState<IPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [numOfPosts, setNumOfPosts] = useState(10);
  const [displayShowMoreBtn, setDisplayShowMoreBtn] = useState(false);

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
          where("group", "in", user.groups)
        );
      } else {
        theQuery = query(collection(db, "posts"));
      }

      // Get server count
      const serverCount = await getCountFromServer(theQuery);

      // Determine if to display show more btn
      setDisplayShowMoreBtn(serverCount.data().count > numOfPosts);

      // Get posts
      const querySnapshot = await getDocs(query(theQuery, limit(numOfPosts)));

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
  }, [user, numOfPosts]);

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
      <div className="flex flex-col md:flex-row gap-4 justify-between px-12 pb-4">
        {displayShowMoreBtn && (
          <Button
            text="Show more posts"
            size="sm"
            onClick={() => setNumOfPosts(numOfPosts + 10)}
          />
        )}
        <p className="text-white/70">
          To see more content, join more{" "}
          <Link href="/groups" className="underline hover:text-white">
            groups
          </Link>
          ...
        </p>
      </div>
    </Main>
  );
}
