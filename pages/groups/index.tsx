import { collection, doc, getDocs, setDoc } from "firebase/firestore";
import { useEffect, useState, MouseEvent } from "react";
import { useRouter } from "next/router";

import { useFirebase } from "@/contexts/firebase";
import { useSession } from "@/contexts/session";

import Button from "@/components/Button";
import Main from "@/components/layouts/Main";

type Group = {
  description: string;
  id: string;
};

export default function Groups() {
  // Access router
  const router = useRouter();

  // Access contexts
  const { db } = useFirebase();
  const { user, setUser } = useSession();

  // Local state
  const [groups, setGroups] = useState<Group[]>([]);

  // TODO: Move into helper
  const handleJoinGroup = async (
    group: string,
    e: MouseEvent<HTMLButtonElement, globalThis.MouseEvent>
  ) => {
    // Stop parent element onClick
    e.stopPropagation();

    if (!user) {
      router.replace("/login");
      return;
    }

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

  // TODO: Move into helper
  const handleLeaveGroup = async (
    group: string,
    e: MouseEvent<HTMLButtonElement, globalThis.MouseEvent>
  ) => {
    // Stop parent element onClick
    e.stopPropagation();

    if (!user) {
      router.replace("/login");
      return;
    }

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

  const handleNavigate = (
    e: MouseEvent<HTMLDivElement, globalThis.MouseEvent>,
    url: string
  ) => {
    e.stopPropagation();

    router.replace(url);
  };

  // TODO: Wire up
  const createGroup = async () => {
    try {
    } catch (e) {
      console.log("e", e);
    }
  };

  const getGroups = async () => {
    try {
      let arr: Group[] = [];

      // Get groups
      const querySnapshot = await getDocs(collection(db, "groups"));
      // Add to arr
      querySnapshot.forEach((group) => {
        const { description } = group.data();
        arr.push({ description, id: group.id });
      });
      setGroups(arr);
    } catch (e) {
      console.log("e", e);
    }
  };

  useEffect(() => {
    getGroups();
  }, []);

  // List all the groups
  return (
    <Main>
      {/* Main section */}
      <div className="flex gap-4 items-start">
        <div className="flex flex-col gap-4">
          {groups?.map((group) => (
            <div
              className="border hover:opacity-80 cursor-pointer p-4 ml-2 flex gap-8 justify-between items-center"
              key={group.id}
              onClick={(e) => handleNavigate(e, `/groups/${group.id}`)}
            >
              <div className="flex flex-col items-start gap-2">
                <div className="flex gap-2">
                  {/* TODO: Add image to group */}
                  <div className="rounded-full h-6 w-6 bg-red-400" />
                  <h6 className="font-bold capitalize">{group.id}</h6>
                </div>
                <p className="text-gray-400 text-start text-sm">
                  {group.description}
                </p>
              </div>
              {user && (
                <Button
                  text={user?.groups.includes(group.id) ? "Leave" : "Join"}
                  onClick={
                    user?.groups.includes(group.id)
                      ? (e) => handleLeaveGroup(group.id, e)
                      : (e) => handleJoinGroup(group.id, e)
                  }
                  color="gray"
                  size="sm"
                  rounded
                />
              )}
            </div>
          ))}
        </div>
        {/* Create group section */}
        <div className="py-4 px-8 space-y-4 border w-1/4">
          <h6 className="font-bold text-lg">Create group</h6>
          <p>
            If you don't see a group that you're looking for, you can create
            your own group here...
          </p>
          <Button text="Create group" rounded onClick={createGroup} />
        </div>
      </div>
    </Main>
  );
}
