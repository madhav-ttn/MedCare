"use client";
import { ReactNode, useState } from "react";
import { authContext } from "./authContext";
import { jwtPayload } from "@/lib/types/types";

export default function UserProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<jwtPayload | null>(null);

  const handleAuth = (userData: jwtPayload | null) => {
    setUser(userData);
  };

  return (
    //@ts-ignore
    <authContext.Provider value={{ user, handleAuth }}>
      {children}
    </authContext.Provider>
  );
}
