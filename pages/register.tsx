import Link from "next/link";

import Button from "@/components/Button";
import Input from "@/components/Input";
import Main from "@/components/layouts/Main";

export default function Register() {
  return (
    <Main>
      <div className="h-full flex items-center justify-center">
        <div className="flex flex-col items-center p-8 rounded gap-4 shadow-lg shadow-gray-500 border">
          <h4 className="font-semibold text-xl">Sign up for Readit</h4>
          <div className="space-y-1 w-full">
            <Input label="Email" />
            <Input label="Password" />
          </div>

          <Button text="Sign up" block />
          <div className="">
            <p className="text-sm font-gray-500">
              Or if you already have an account
            </p>
            <Link
              href="/login"
              className="underline hover:opacity-70 text-blue-500"
            >
              Sign in
            </Link>
          </div>
        </div>
      </div>
    </Main>
  );
}
