import Link from "next/link";

import Button from "@/components/Button";
import Input from "@/components/Input";
import Main from "@/components/layouts/Main";

export default function Login() {
  return (
    <Main>
      <div className="h-full flex items-center justify-center">
        <div className="flex flex-col items-center p-8 rounded gap-4 drop-shadow-lg border">
          <h4 className="font-semibold text-xl">Login to Readit</h4>
          <div className="space-y-1 w-full">
            <Input label="Email" />
            <Input label="Password" />
          </div>

          <Button text="Sign in" block />
          <div className="">
            <p className="text-sm font-gray-500">
              Or if you don't have an account, you can
            </p>
            <Link
              href="/register"
              className="underline hover:opacity-70 text-blue-500"
            >
              Sign up
            </Link>
          </div>
        </div>
      </div>
    </Main>
  );
}
