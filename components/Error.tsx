import Link from "next/link";

import Main from "@/components/layouts/Main";

export default function Error() {
  return (
    <Main>
      <div className="flex flex-col items-center gap-4 pt-12">
        <h1 className="text-3xl font-bold">
          Oops... This group does not exist.
        </h1>
        <p>
          Feel free to explore all the groups in our community{" "}
          <Link href="/groups" className="underline">
            here
          </Link>
          ...
        </p>
      </div>
    </Main>
  );
}
