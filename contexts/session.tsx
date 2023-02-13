import { createContext, useContext, useState } from "react";

const SessionContext = createContext({ user: null, setUser: () => {} });

// login

// logout

// register

// user

export const SessionProvider = ({ children }) => {
  //const data = useSessionProvider();

  const [user, setUser] = useState(null);
  const value = { user, setUser };

  return (
    <SessionContext.Provider value={value}>{children}</SessionContext.Provider>
  );
};

export const useSession = () => useContext(SessionContext);
