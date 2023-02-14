import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactElement,
  Dispatch,
  SetStateAction,
} from "react";
import { doc, getDoc } from "firebase/firestore";
import { useFirebase } from "contexts/firebase";

import { User } from "interfaces";

interface SessionProviderProps {
  children: ReactElement;
}

interface ISessionContext {
  user: User | null;
  setUser: Dispatch<SetStateAction<User | null>>;
}

const SessionContext = createContext<ISessionContext>({
  user: null,
  setUser: () => {},
});

export const SessionProvider = ({ children }: SessionProviderProps) => {
  // Local state
  const [user, setUser] = useState<User | null>(null);

  // Access db
  const { db } = useFirebase();

  // Check if user is logged in
  useEffect(() => {
    if (typeof window !== "undefined") {
      if (sessionStorage.length > 0) {
        // Get stored name
        const name = JSON.parse(
          sessionStorage[Object.keys(sessionStorage)[0]]
        ).displayName;

        // Get/set user info from firestore
        getDoc(doc(db, "users", name)).then((info) => {
          setUser(info.data() as User);
        });
      }
    }
  }, [db]);

  return (
    <SessionContext.Provider value={{ user, setUser }}>
      {children}
    </SessionContext.Provider>
  );
};

export const useSession = () => useContext(SessionContext);

// login

// logout

// register
