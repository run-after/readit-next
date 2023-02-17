import { useSession } from "@/contexts/session";

import LocalLink from "../LocalLink";

export default function Sidebar() {
  const { user } = useSession();

  return (
    <div className="w-32 p-4 h-screen fixed left-0 top-14 border-r border-gray-700 text-white space-y-4 min-w">
      {user?.groups.map((group) => (
        <div key={group}>
          <LocalLink href={`/groups/${group}`} text={group} />
        </div>
      ))}
    </div>
  );
}
