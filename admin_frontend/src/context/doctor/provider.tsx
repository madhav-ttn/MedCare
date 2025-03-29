"use client";
import { ReactNode, useState } from "react";
import { doctorContext } from "./doctorContext";

export default function DoctorProvider({ children }: { children: ReactNode }) {
  const [doctors, setDoctors] = useState([]);

  const doctorSetter = (docData: any) => {
    setDoctors(docData);
  };
  return (
    <doctorContext.Provider value={{ doctors, doctorSetter }}>
      {children}
    </doctorContext.Provider>
  );
}
