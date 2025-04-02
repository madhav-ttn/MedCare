"use client";
import { jwtPayload } from "@/lib/types/types";
import { createContext } from "react";

interface AuthInterface {
  user: jwtPayload | null;
  token: string | null;
  login: (token: string, userData: jwtPayload) => void;
  logout: () => void;
}

export const authContext = createContext<AuthInterface | undefined>(undefined);
