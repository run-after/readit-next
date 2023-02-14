import { useState, FormEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import {
  browserSessionPersistence,
  getAuth,
  setPersistence,
  signInWithEmailAndPassword,
} from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { useSession } from "@/contexts/session";
import { useFirebase } from "@/contexts/firebase";

import { User } from "interfaces";

import Button from "@/components/Button";
import Input from "@/components/Input";
import Main from "@/components/layouts/Main";

export default function Login() {
  // Access router
  const router = useRouter();

  // Access context
  const { setUser } = useSession();
  const { db } = useFirebase();

  // Local state
  const [error, setError] = useState("");

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // Clear error
    setError("");

    // Destructure email/password
    const { email, password } = e.currentTarget;

    const auth = getAuth();

    try {
      // Set persistence
      await setPersistence(auth, browserSessionPersistence);

      // Login
      const userCredentials = await signInWithEmailAndPassword(
        auth,
        email.value,
        password.value
      );

      // Get display name
      const displayName = userCredentials.user.displayName || "";

      // Get/set user info from firestore
      const userInfo = await getDoc(doc(db, "users", displayName));
      setUser(userInfo.data() as User);

      // Redirect to home
      router.replace("/");
    } catch (e: any) {
      console.log("e", e);

      // TODO: Find a better way to display errors
      switch (e.code) {
        default:
          setError("Please try again");
        case "auth/user-not-found":
          setError("User not found");
          break;
        case "auth/invalid-password":
          setError("Invalid password");
          break;
        case "auth/wrong-password":
          setError("Incorrect password");
          break;
      }
    }
  };

  return (
    <Main>
      <div className="h-full flex items-center justify-center ">
        <div className="flex flex-col items-center p-8 rounded gap-4 shadow-lg shadow-gray-500 border">
          <h4 className="font-semibold text-xl">Login to Readit</h4>
          <form
            className={`${
              error ? "border border-red-500 p-4 rounded" : ""
            } space-y-2`}
            onSubmit={handleSubmit}
          >
            {error && <p className="text-red-500 text-sm">{error}</p>}
            <div className="space-y-1 w-full">
              <Input name="email" type="email" label="Email" />
              <Input name="password" type="password" label="Password" />
            </div>
            <Button text="Sign in" block />
          </form>

          <div className="">
            <p className="text-sm font-gray-500">
              Or if you do not have an account, you can
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
