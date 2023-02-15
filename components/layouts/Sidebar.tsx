import Link from "next/link";

import { useSession } from "@/contexts/session";

export default function Sidebar() {
  const { user } = useSession();

  return (
    <div className="w-32 p-4 h-screen fixed left-0 top-14 border-r border-gray-700 text-white space-y-4 min-w">
      {user?.groups.map((group) => (
        <div key={group}>
          <Link href={`/groups/${group}`}>{group}</Link>
        </div>
      ))}
    </div>
  );
}
