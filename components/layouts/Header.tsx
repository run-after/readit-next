import Link from "next/link";
import { signOut, getAuth } from "firebase/auth";

import { useSession } from "@/contexts/session";

import Image from "next/image";
import Button from "../Button";

export default function Header() {
  const { user, setUser } = useSession();

  const auth = getAuth();

  const handleLogOut = async () => {
    try {
      await signOut(auth);
      setUser(null);
    } catch (e) {
      console.log("error", e);
    }
  };

  return (
    <div className="w-full h-14 bg-black text-white flex items-center justify-between px-4 fixed top-0 border-b border-gray-800 z-10">
      <Link href="/" className="flex gap-1 items-center">
        <Image src="/../public/alien.png" width="40" height="20" alt="alien" />
        <h6 className="font-bold text-xl text-green-400">Readit</h6>
      </Link>
      <div>
        {user ? (
          <Button text="Log out" onClick={handleLogOut} />
        ) : (
          <Button text="Sign in" href="/login" />
        )}
      </div>
    </div>
  );
}
