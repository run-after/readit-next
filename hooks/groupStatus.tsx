import { useEffect, useState, MouseEvent, FormEvent } from "react";
import { collection, doc, getDocs, setDoc } from "firebase/firestore";
import { useFirebase } from "@/contexts/firebase";
import { useRouter } from "next/router";
import { useSession } from "@/contexts/session";

function useGroupStatus() {
  // Access router
  const router = useRouter();

  // Access contexts
  const { db } = useFirebase();
  const { user, setUser } = useSession();

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

  return { handleLeaveGroup, handleJoinGroup };
}

export { useGroupStatus };
