import Link from "next/link";
import { useRouter } from "next/router";
import { useState, FormEvent } from "react";
import {
  browserSessionPersistence,
  createUserWithEmailAndPassword,
  getAuth,
  updateProfile,
  setPersistence,
} from "firebase/auth";
import { doc, getDoc, setDoc } from "firebase/firestore";

import { useSession } from "@/contexts/session";
import { useFirebase } from "@/contexts/firebase";
import { User } from "interfaces";

import Button from "@/components/Button";
import Input from "@/components/Input";
import Main from "@/components/layouts/Main";

export default function Register() {
  const router = useRouter();

  const { setUser } = useSession();
  const { db } = useFirebase();

  const [error, setError] = useState("");

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // Clear error
    setError("");

    // Destructure email/password
    const { email, password, verify, display_name } = e.currentTarget;

    // Check verfied password
    if (password.value !== verify.value) {
      setError("Passwords do not match");
      return;
    }

    // TODO: make sure display_name is unique

    // Access auth
    const auth = getAuth();

    try {
      // Set persistence
      await setPersistence(auth, browserSessionPersistence);

      // Create account
      const userCredentials = await createUserWithEmailAndPassword(
        auth,
        email.value,
        password.value
      );

      // Update profile
      await updateProfile(userCredentials.user, {
        displayName: display_name.value,
      });

      // Create new user and store
      await setDoc(doc(db, "users", display_name.value), {
        displayName: display_name.value,
        email: email.value,
        groups: [],
        likes: [],
        hates: [],
      });

      // Get/set user info from firestore
      const userInfo = await getDoc(doc(db, "users", display_name.value));
      setUser(userInfo.data() as User);

      // Redirect to home
      router.replace("/");
    } catch (e: any) {
      console.log("e", e);

      // TODO: Find a better way to display errors
      switch (e.code) {
        default:
          setError("Please try again");
          break;
        case "auth/email-already-in-use":
          setError("Email already in use");
          break;
        case "auth/weak-password":
          setError("Weak password: must be at least 6 chars");
          break;
      }
    }
  };

  return (
    <Main>
      <div className="h-full flex items-center justify-center">
        <div className="flex flex-col items-center p-8 rounded gap-4 shadow-lg shadow-gray-500 border">
          <h4 className="font-semibold text-xl">Sign up for Readit</h4>
          <form
            className={`${
              error ? "border border-red-500 p-4 rounded" : ""
            } space-y-2`}
            onSubmit={handleSubmit}
          >
            {error && <p className="text-red-500 text-sm">{error}</p>}
            <div className="space-y-1 w-full">
              <Input label="Display name" name="display_name" />
              <Input label="Email" name="email" />
              <Input label="Password" name="password" type="password" />
              <Input label="Verify password" name="verify" type="password" />
            </div>

            <Button text="Sign up" block />
          </form>

          <div className="">
            <p className="text-sm font-gray-500">
              Or if you already have an account
            </p>
            <Link
              href="/login"
              className="underline hover:opacity-80 text-blue-500"
            >
              Sign in
            </Link>
          </div>
        </div>
      </div>
    </Main>
  );
}
