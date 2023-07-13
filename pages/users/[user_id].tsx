import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import {
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  where,
} from "firebase/firestore";
import { useFirebase } from "@/contexts/firebase";

import { IPost, IComment } from "@/interfaces";

import PostFeed from "@/components/PostFeed";
import Main from "@/components/layouts/Main";
import Comment from "@/components/Comment";
import FullPost from "@/components/FullPost";
import Modal from "@/components/Modal";

export default function User() {
  // Access router
  const router = useRouter();
  const { user_id } = router.query;

  // Access db
  const { db } = useFirebase();

  // Local state
  const [userPosts, setUserPosts] = useState<IPost[]>([]);
  const [postComments, setPostComments] = useState<IComment[]>([]);
  const [userComments, setUserComments] = useState<IComment[]>([]);
  const [selectedPost, setSelectedPost] = useState<IPost | null>(null);

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

  // TODO: Move to helper
  const getComments = async () => {
    try {
      let arr: IComment[] = [];
      // Get all post comments
      const querySnapshot = await getDocs(
        query(collection(db, "comments"), where("post", "==", selectedPost?.id))
      );
      querySnapshot.forEach((doc) => {
        const temp = { ...doc.data(), id: doc.id };
        arr.push(temp as IComment);
      });

      setPostComments(arr.sort((x, y) => y.timestamp - x.timestamp));
    } catch (e) {
      console.log("err", e);
    }
  };

  useEffect(() => {
    getComments();
  }, []);

  const getUserComments = async () => {
    let commentArr: IComment[] = [];
    try {
      const snapshot = await getDocs(
        query(collection(db, "comments"), where("user", "==", user_id))
      );

      snapshot.forEach((doc) => {
        const comment = { ...doc.data(), id: doc.id };
        commentArr.push(comment as IComment);
      });

      setUserComments(commentArr.sort((x, y) => y.timestamp - x.timestamp));
    } catch (e) {
      console.log("err", e);
    }
  };

  const getSelectedPost = async (id: string) => {
    try {
      const docRef = doc(db, "posts", id);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists())
        setSelectedPost({ ...docSnap.data(), id: docSnap.id } as IPost);
    } catch (e) {
      console.log("err", e);
    }
  };

  useEffect(() => {
    if (user_id) {
      getPosts();
      getUserComments();
    }
  }, [user_id]);

  return (
    <Main>
      <div className="flex gap-4 items-start">
        <div>
          {/* Feed */}
          <h3 className="px-12 font-bold text-green-400 text-xl">Posts</h3>
          <PostFeed posts={userPosts} showGroupButtons={false} />
          {/* Comments */}
          <h3 className="px-12 font-bold text-green-400 text-xl">Comments</h3>
          <div className="p-4 px-12 space-y-6 flex-1">
            {userComments.map((comment) => (
              <div
                key={comment.id}
                className="flex gap-6 p-4 border border-gray-800 hover:border-white cursor-pointer"
                onClick={() => {
                  getSelectedPost(comment.post);
                }}
              >
                <Comment comment={comment} />
              </div>
            ))}
          </div>
        </div>

        {/* User card */}
        <div className="w-1/4 border border-gray-800 m-4 p-4 rounded space-y-4">
          <h6 className="text-gray-500 text-bold">About {user_id}</h6>
          <p className="text-gray-300 text-sm">{user_id}</p>
        </div>
      </div>
      {/* Modal */}
      {selectedPost && (
        <Modal
          onClose={() => {
            setSelectedPost(null);
          }}
        >
          <FullPost
            post={selectedPost}
            comments={postComments}
            getComments={getComments}
          />
        </Modal>
      )}
    </Main>
  );
}
