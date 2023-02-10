import { initializeApp } from "firebase/app";
import type { AppProps } from "next/app";

import "@/styles/globals.css";

// Initialize firebase
const app = initializeApp({
  apiKey: process.env.NEXT_PUBLIC_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_APP_ID,
});

export default function App({ Component, pageProps }: AppProps) {
  return <Component {...pageProps} />;
}
