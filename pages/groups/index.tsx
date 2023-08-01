import { collection, doc, getDocs, setDoc } from "firebase/firestore";
import { useEffect, useState, MouseEvent, FormEvent } from "react";
import { useRouter } from "next/router";

import { useFirebase } from "@/contexts/firebase";
import { useSession } from "@/contexts/session";
import { useGroupStatus } from "@/hooks/groupStatus";

import Button from "@/components/Button";
import Main from "@/components/layouts/Main";
import Modal from "@/components/Modal";
import Input from "@/components/Input";

type Group = {
  description: string;
  id: string;
};

export default function Groups() {
  // Access router
  const router = useRouter();

  // Access contexts
  const { db } = useFirebase();
  const { user } = useSession();

  // Access hooks
  const { handleJoinGroup, handleLeaveGroup } = useGroupStatus();

  // Local state
  const [groups, setGroups] = useState<Group[]>([]);
  const [showGroupModal, setShowGroupModal] = useState<Boolean>(false);
  const [errorArr, setErrorArr] = useState<String[]>([]);
  const [loading, setLoading] = useState(true);

  const handleNavigate = (
    e: MouseEvent<HTMLDivElement, globalThis.MouseEvent>,
    url: string
  ) => {
    e.stopPropagation();

    router.replace(url);
  };

  const createGroup = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    let errors = [];

    // Destructure inputs
    const { groupName, description } = e.currentTarget;

    // Check for errors
    if (!groupName?.value) errors.push("nameError");
    if (!description?.value) errors.push("descriptionError");

    // Do not submit if errors
    if (errors.length > 0) {
      setErrorArr(errors);
      return;
    }

    try {
      // Create group
      await setDoc(doc(db, "groups", groupName.value), {
        description: description.value,
      });

      // Redirect to new group page
      router.replace(`groups/${groupName.value}`);
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

      // End loading
      setLoading(false);
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
      <div className="flex flex-col-reverse lg:flex-row gap-4 items-start">
        <div className="flex flex-col gap-4 w-3/4">
          {loading && (
            <div className="flex justify-center">
              <img src="/loading.gif" />
            </div>
          )}
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
        <div className="py-4 px-8 space-y-4 w-full lg:w-1/4">
          <h6 className="font-bold text-lg">New group</h6>
          <p>
            If you don't see a group that you're looking for, you can create
            your own group here...
          </p>
          <Button
            text="Create group"
            rounded
            onClick={() => setShowGroupModal(true)}
            disabled={!user}
          />
        </div>
      </div>
      {showGroupModal && (
        <Modal
          heading={
            <h1 className="text-xl font-bold px-4 py-2">Create Group</h1>
          }
          onClose={() => {
            setShowGroupModal(false);
          }}
        >
          {/* TODO: Better layout */}
          <form className="space-y-4 p-4 text-right" onSubmit={createGroup}>
            {/* TODO: Add image uploader */}
            <Input
              name="groupName"
              placeholder="Group name"
              error={errorArr.includes("nameError")}
              onChange={() =>
                setErrorArr(errorArr.filter((err) => err !== "nameError"))
              }
              maxLength={25}
            />
            <Input
              type="textarea"
              name="description"
              placeholder="Description"
              error={errorArr.includes("descriptionError")}
              onChange={() =>
                setErrorArr(
                  errorArr.filter((err) => err !== "descriptionError")
                )
              }
            />
            <Button rounded text="Create" disabled={errorArr.length > 0} />
          </form>
        </Modal>
      )}
    </Main>
  );
}
