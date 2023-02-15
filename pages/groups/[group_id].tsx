import { useRouter } from "next/router";

import Main from "@/components/layouts/Main";

export default function Group() {
  // Access router
  const router = useRouter();
  const { group_id } = router.query;

  return (
    <Main>
      <div>{group_id}</div>
    </Main>
  );
}
