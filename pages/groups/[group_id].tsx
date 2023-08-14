import { useRouter } from "next/router";
import { useState, useEffect } from "react";
import {
  collection,
  query,
  where,
  getDocs,
  doc,
  getDoc,
  limit,
  getCountFromServer,
} from "firebase/firestore";

import { useSession } from "@/contexts/session";
import { useFirebase } from "@/contexts/firebase";
import { IPost } from "@/interfaces";
import { useGroupStatus } from "@/hooks/groupStatus";

import Main from "@/components/layouts/Main";
import Button from "@/components/Button";
import PostFeed from "@/components/PostFeed";
import Modal from "@/components/Modal";
import CreatePost from "@/components/CreatePost";
import Error from "@/components/Error";

export interface IGroup {
  description: string;
}

export default function Group() {
  // Access router
  const router = useRouter();
  const { group_id } = router.query;

  // Access context
  const { user } = useSession();
  const { db } = useFirebase();

  // Access hooks
  const { handleJoinGroup, handleLeaveGroup } = useGroupStatus();

  // Local state
  const [posts, setPosts] = useState<IPost[]>([]);
  const [groupDescription, setGroupDescription] = useState<IGroup>();
  const [showCreatePostModal, setShowCreatePostModal] = useState(false);
  const [showErrorPage, setShowErrorPage] = useState(false);
  const [loading, setLoading] = useState(true);
  const [numOfPosts, setNumOfPosts] = useState(10);
  const [displayShowMoreBtn, setDisplayShowMoreBtn] = useState(false);

  const handleCloseModal = () => {
    getPosts();
    setShowCreatePostModal(false);
  };

  const getPosts = async () => {
    try {
      let arr: IPost[] = [];
      let theQuery;

      if (group_id === "all") {
        // Set query to all posts
        theQuery = query(collection(db, "posts"));

        // Get posts
        const querySnapshot = await getDocs(query(theQuery, limit(numOfPosts)));

        // Add id to each post
        querySnapshot.forEach((doc) => {
          const post = { ...doc.data(), id: doc.id };
          arr.push(post as IPost);
        });
      } else {
        // Set query to posts just in group
        theQuery = query(
          collection(db, "posts"),
          where("group", "==", group_id)
        );
        // Get all group posts
        const querySnapshot = await getDocs(query(theQuery, limit(numOfPosts)));
        querySnapshot.forEach((doc) => {
          const post = { ...doc.data(), id: doc.id };
          arr.push(post as IPost);
        });
      }

      // Get server count
      const serverCount = await getCountFromServer(theQuery);

      // Determine if to display show more btn
      setDisplayShowMoreBtn(serverCount.data().count > numOfPosts);

      setPosts(arr.sort((x, y) => y.timestamp - x.timestamp));
    } catch (e) {
      console.log("err", e);
    }
  };

  const getGroupDetails = async () => {
    try {
      const docRef = doc(db, "groups", group_id as string);
      const docSnap = await getDoc(docRef);
      if (docSnap.data() || group_id === "all") {
        setGroupDescription(docSnap.data() as IGroup);
      } else {
        setShowErrorPage(true);
      }
      setLoading(false);
    } catch (e) {
      console.log("err", e);
    }
  };

  // Maybe SSR
  useEffect(() => {
    if (group_id) {
      getPosts();
      getGroupDetails();
    }
  }, [group_id, numOfPosts]);

  if (loading)
    return (
      <Main>
        <div className="flex justify-center">
          <img src="/loading.gif" />
        </div>
      </Main>
    );

  if (showErrorPage) return <Error />;

  return (
    <Main>
      {/* Heading */}
      <div>
        <div className="w-full bg-blue-400 h-14"></div>
        <div className="w-full bg-white/10 h-16 relative flex justify-center items-start ">
          <div className="flex items-end gap-2 absolute -top-6">
            {/* TODO: Add image to group */}
            <div className="bg-red-400 rounded-full h-14 w-14 border-4 border-white"></div>
            <div className="flex gap-6 items-center">
              <h6 className="font-bold text-2xl text-gray-400">{group_id}</h6>
              <Button
                text={
                  user?.groups.includes(group_id as string) ? "Leave" : "Join"
                }
                rounded
                size="sm"
                color="gray"
                onClick={
                  user?.groups.includes(group_id as string)
                    ? (e) => handleLeaveGroup(group_id as string, e)
                    : (e) => handleJoinGroup(group_id as string, e)
                }
              />
            </div>
          </div>
        </div>
      </div>
      {/* Main section */}
      <div className="flex gap-4 items-start">
        {/* Feed */}
        <div className="w-full">
          <PostFeed posts={posts} showGroupButtons={false} />
          {displayShowMoreBtn && (
            <div className="p-2 px-12">
              <Button
                text="Show more posts"
                size="sm"
                onClick={() => setNumOfPosts(numOfPosts + 10)}
              />
            </div>
          )}
        </div>

        {/* Community card */}
        {group_id === "all" ? (
          <div className="w-1/4 border border-gray-800 m-4 p-4 rounded space-y-4">
            <h6 className="text-gray-500 text-bold">About Community</h6>
            <p className="text-gray-300 text-sm">
              All the posts across all the groups in our community are present
              here.
            </p>
          </div>
        ) : (
          <div className="w-1/4 border border-gray-800 m-4 p-4 rounded space-y-4">
            <h6 className="text-gray-500 text-bold">About Community</h6>
            <p className="text-gray-300 text-sm">
              {groupDescription?.description}
            </p>
            <Button
              disabled={!user}
              onClick={() => setShowCreatePostModal(true)}
              text="Create post"
              color="gray"
              block
              rounded
            />
          </div>
        )}
      </div>
      {showCreatePostModal && (
        <Modal onClose={() => setShowCreatePostModal(false)}>
          <CreatePost group={group_id} closeModal={handleCloseModal} />
        </Modal>
      )}
    </Main>
  );
}
