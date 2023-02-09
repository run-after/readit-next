import Link from "next/link";

import Image from "next/image";
import Button from "../Button";

export default function Header() {
  return (
    <div className="w-full h-14 bg-black text-white flex items-center justify-between px-4 fixed top-0 border-b border-gray-800">
      <Link href="/" className="flex gap-1 items-center">
        <Image src="/../public/alien.png" width="40" height="20" alt="alien" />
        <h6 className="font-bold text-xl text-green-400">Readit</h6>
      </Link>
      <div>
        <Button text="Sign in" href="/login" />
      </div>
    </div>
  );
}
