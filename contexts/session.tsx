import { createContext, useContext, useState, useEffect } from "react";
import { doc, getDoc } from "firebase/firestore";

import { useFirebase } from "contexts/firebase";

const SessionContext = createContext({ user: null, setUser: () => {} });

// login

// logout

// register

export const SessionProvider = ({ children }) => {
  //const data = useSessionProvider();

  const [user, setUser] = useState(null);
  const value = { user, setUser };

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
          console.log("info", info);
          console.log("info.data", info.data());
          setUser(info.data());
        });
      }
    }
  }, []);

  return (
    <SessionContext.Provider value={value}>{children}</SessionContext.Provider>
  );
};

export const useSession = () => useContext(SessionContext);
