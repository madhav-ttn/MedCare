"use client";
import { ReactNode, useState } from "react";
import { authContext } from "./authContext";
import { jwtPayload } from "@/lib/types";

export default function UserProvider({ children }: { children: ReactNode }) {
  const [admin, setAdmin] = useState<jwtPayload | null>(null);

  const handleAuth = (userData: jwtPayload | null) => {
    setAdmin(userData);
  };

  return (
    //@ts-ignore
    <authContext.Provider value={{ admin, handleAuth }}>
      {children}
    </authContext.Provider>
  );
}
