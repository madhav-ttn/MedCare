"use client";
import { createContext } from "react";
import { jwtPayload } from "@/lib/types";

interface AuthContextType {
  admin: jwtPayload | null;
  handleAuth: (userData: jwtPayload | null) => void;
}

export const authContext = createContext<AuthContextType>({
  admin: null,
  handleAuth: () => {},
});
