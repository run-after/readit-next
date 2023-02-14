import type { AppProps } from "next/app";

import { SessionProvider } from "contexts/session";
import { FirebaseProvider } from "@/contexts/firebase";

import "@/styles/globals.css";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <FirebaseProvider>
      <SessionProvider>
        <Component {...pageProps} />
      </SessionProvider>
    </FirebaseProvider>
  );
}
