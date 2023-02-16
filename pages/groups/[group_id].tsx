import { useRouter } from "next/router";
import { useState, useEffect, MouseEvent } from "react";
import {
  collection,
  query,
  where,
  getDocs,
  doc,
  getDoc,
  setDoc,
} from "firebase/firestore";

import { useSession } from "@/contexts/session";
import { useFirebase } from "@/contexts/firebase";
import { IPost } from "@/interfaces";

import Main from "@/components/layouts/Main";
import Button from "@/components/Button";
import PostFeed from "@/components/PostFeed";

export interface IGroup {
  description: string;
}

export default function Group() {
  // Access router
  const router = useRouter();
  const { group_id } = router.query;

  // Access context
  const { user, setUser } = useSession();
  const { db } = useFirebase();

  // Local state
  const [posts, setPosts] = useState<IPost[]>([]);
  const [groupDescription, setGroupDescription] = useState<IGroup>();

  const getPosts = async () => {
    try {
      let arr: IPost[] = [];

      // Get all group posts
      const querySnapshot = await getDocs(
        query(collection(db, "posts"), where("group", "==", group_id))
      );
      querySnapshot.forEach((doc) => arr.push(doc.data() as IPost));

      setPosts(arr);
    } catch (e) {
      console.log("err", e);
    }
  };

  const getGroupDetails = async () => {
    try {
      const docRef = doc(db, "groups", group_id as string);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) setGroupDescription(docSnap.data() as IGroup);
    } catch (e) {
      console.log("err", e);
    }
  };

  const handleJoinGroup = async (
    group: string,
    e: MouseEvent<HTMLButtonElement, globalThis.MouseEvent>
  ) => {
    // Stop parent element onClick
    e.stopPropagation();

    if (!user) return; // Prompt to login

    // Copy user groups
    const tempGroups = [...user.groups];

    // Push new group
    tempGroups.push(group);

    // Update user
    await setDoc(doc(db, "users", user.displayName), {
      ...user,
      groups: tempGroups,
    });

    // Update user context
    setUser({ ...user, groups: tempGroups });
  };

  const handleLeaveGroup = async (
    group: string,
    e: MouseEvent<HTMLButtonElement, globalThis.MouseEvent>
  ) => {
    // Stop parent element onClick
    e.stopPropagation();

    if (!user) return; // Prompt to login

    // Copy user groups
    const tempGroups = [...user.groups].filter((x) => x !== group);

    // Update user
    await setDoc(doc(db, "users", user.displayName), {
      ...user,
      groups: tempGroups,
    });

    // Update user context
    setUser({ ...user, groups: tempGroups });
  };

  useEffect(() => {
    if (group_id) {
      getPosts();
      getGroupDetails();
    }
  }, [group_id]);

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
        <PostFeed posts={posts} showGroupButtons={false} />
        {/* Community card */}
        <div className="w-1/4 border border-gray-800 m-4 p-4 rounded space-y-4">
          <h6 className="text-gray-500 text-bold">About Community</h6>
          <p className="text-gray-300 text-sm">
            {groupDescription?.description}
          </p>
          <Button text="Create post" color="gray" block rounded />
        </div>
      </div>
    </Main>
  );
}
