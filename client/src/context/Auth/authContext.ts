"use client";
import { jwtPayload } from "@/lib/types/types";
import { createContext } from "react";

export const authContext = createContext({
  user: null,
  handleAuth: (user: jwtPayload | null) => {},
});
