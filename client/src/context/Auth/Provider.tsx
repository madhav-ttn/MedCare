"use client";
import { ReactNode, useEffect, useState } from "react";
import { authContext } from "./authContext";
import { jwtPayload } from "@/lib/types/types";
import Cookies from "js-cookie";

export default function UserProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<jwtPayload | null>(null);
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    const token = Cookies.get("token");
    const userData = Cookies.get("user");
    if (token && userData) {
      setToken(token);
      setUser(JSON.parse(userData as string));
    } else {
      setToken(null);
      setUser(null);
    }
  }, []);

  const login = (token: string, userData: jwtPayload) => {
    setToken(token);
    setUser(userData);
    Cookies.set("token", token);
    Cookies.set("user", JSON.stringify(userData));
  };
  const logout = () => {
    setUser(null);
    setToken(null);
    Cookies.remove("token");
    Cookies.remove("user");
  };
  return (
    <authContext.Provider value={{ user, token, logout, login }}>
      {children}
    </authContext.Provider>
  );
}
