"use client";
import { ReactNode, useState } from "react";
import { appointmentContext } from "./appContext";

export default function AppointmentProvider({
  children,
}: {
  children: ReactNode;
}) {
  const [appointments, setAppoinments] = useState([]);

  const appointmentSetter = (appData: any) => {
    setAppoinments(appData);
  };

  return (
    <appointmentContext.Provider value={{ appointments, appointmentSetter }}>
      {children}
    </appointmentContext.Provider>
  );
}
