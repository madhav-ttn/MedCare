"use client";
import { jwtPayload } from "@/lib/types";
import { createContext } from "react";

export const authContext = createContext({
  admin: null,
  handleAuth: (admin: jwtPayload | null) => {},
});
