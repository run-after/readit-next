import {
  createContext,
  Dispatch,
  ReactElement,
  SetStateAction,
  useContext,
  useState,
} from "react";
import { Firestore, getFirestore } from "firebase/firestore";
import { FirebaseApp, initializeApp } from "firebase/app";

interface FirebaseProviderProps {
  children: ReactElement;
}

interface IFirebaseContext {
  app: FirebaseApp;
  setApp: Dispatch<SetStateAction<FirebaseApp>>;
  db: Firestore;
  setDb: Dispatch<SetStateAction<Firestore>>;
}

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
const FirebaseContext = createContext<IFirebaseContext>({
  app: initApp,
  setApp: () => {},
  db: initDb,
  setDb: () => {},
});

export const FirebaseProvider = ({ children }: FirebaseProviderProps) => {
  const [app, setApp] = useState(initApp);
  const [db, setDb] = useState(initDb);

  return (
    <FirebaseContext.Provider value={{ app, setApp, db, setDb }}>
      {children}
    </FirebaseContext.Provider>
  );
};

export const useFirebase = () => useContext(FirebaseContext);
