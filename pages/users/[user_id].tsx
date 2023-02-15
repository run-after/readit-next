import Main from "@/components/layouts/Main";
import { useRouter } from "next/router";

export default function User() {
  const router = useRouter();
  const { user_id } = router.query;

  return (
    <Main>
      <div>{user_id}</div>
    </Main>
  );
}
