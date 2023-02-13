import { createContext, useContext, useEffect, useState } from "react";
import { getFirestore } from "firebase/firestore";
import { initializeApp } from "firebase/app";

// Only want this to run once
const initApp = initializeApp({
  apiKey: process.env.NEXT_PUBLIC_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_APP_ID,
});

// Init DB
const initDb = getFirestore(initApp);
console.log("init ran");
//////////////////////////////////

// Create context
const FirebaseContext = createContext({
  app: initApp,
  setApp: () => {},
  db: initDb,
  setDb: () => {},
});

export const FirebaseProvider = ({ children }) => {
  const [app, setApp] = useState(initApp);
  const [db, setDb] = useState(initDb);
  const value = { app, setApp, db, setDb };

  return (
    <FirebaseContext.Provider value={value}>
      {children}
    </FirebaseContext.Provider>
  );
};

export const useFirebase = () => useContext(FirebaseContext);
