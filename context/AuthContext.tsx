"use client";

import {
  createContext,
  useState,
  ReactNode,
  useContext,
} from "react";
import type { IUser } from "@/types/user";

interface Props {
  children: ReactNode;
}

interface SessionState {
  session: IUser | null;
  setSessionState: (session: IUser | null) => void;
  removeSession: () => void;
  handleFollowed: (id: string, type: string) => void;
}

const defaultState: SessionState = {
  session: null,
  setSessionState: (userSession: IUser | null) => { }, // Placeholder, should match actual implementation
  removeSession: () => { },
  handleFollowed: (id: string, type: string) => { },
};

export const AuthContext = createContext<SessionState>(defaultState);

export function AuthProvider({ children }: Props) {
  const [session, setSession] = useState<IUser | null>(() => {
    const storedSession = localStorage.getItem("session");
    return storedSession ? JSON.parse(storedSession) : null;
  });

  const setSessionState = (userSession: IUser | null) => {
    if (userSession) {
      localStorage.setItem("session", JSON.stringify(userSession));
      setSession(userSession);
    } else {
      localStorage.removeItem("session");
      setSession(null);
    }
  };

  const removeSession = () => {
    localStorage.removeItem("session");
    setSession(null);
  };

  const handleFollowed = (id: string, type: string) => {
    if (session) {
      let followed;
      if (type === "unfollow" && session.followed) {
        followed = session.followed.filter((item) => item !== id);
      } else {
        if (session.followed) followed = [...session?.followed, id];
      }
      const updatedSession = { ...session, followed };
      setSession(updatedSession);
      localStorage.setItem("session", JSON.stringify(updatedSession));
    }
  };

  return (
    <AuthContext.Provider
      value={{
        session,
        setSessionState,
        removeSession,
        handleFollowed,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuthProvider = () => useContext(AuthContext);
