"use client";
import { createContext } from "react";

export const appointmentContext = createContext({
  appointments: [],
  appointmentSetter: (appData: any) => {},
});
