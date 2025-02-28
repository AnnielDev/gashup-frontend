"use client";

import {
  createContext,
  useState,
  useEffect,
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
  setSessionState: () => {},
  removeSession: () => {},
  handleFollowed: () => {},
};

export const AuthContext = createContext<SessionState>(defaultState);

export function AuthProvider({ children }: Props) {
  const [session, setSession] = useState<IUser | null>(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedSession = localStorage.getItem("session");
      setSession(storedSession ? JSON.parse(storedSession) : null);
    }
  }, []);

  const setSessionState = (userSession: IUser | null) => {
    if (typeof window !== "undefined") {
      if (userSession) {
        localStorage.setItem("session", JSON.stringify(userSession));
      } else {
        localStorage.removeItem("session");
      }
    }
    setSession(userSession);
  };

  const removeSession = () => {
    if (typeof window !== "undefined") {
      localStorage.removeItem("session");
    }
    setSession(null);
  };

  const handleFollowed = (id: string, type: string) => {
    if (session && typeof window !== "undefined") {
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
      value={{ session, setSessionState, removeSession, handleFollowed }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuthProvider = () => useContext(AuthContext);
