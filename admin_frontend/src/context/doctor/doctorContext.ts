"use client";
import { createContext } from "react";

export const doctorContext = createContext({
  doctors: [],
  doctorSetter: (docData: any) => {},
});
