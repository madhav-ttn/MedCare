"use client";
import React, { useEffect, useState } from "react";
import styles from "./page.module.css";
import axios from "axios";
import { toast } from "react-toastify";
import { Appointment } from "@/lib/types/types";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";
import Loader from "../_components/Loader";
export default function AppointmentsPage() {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const token = Cookies.get("token");
  useEffect(() => {
    if (!token) router.replace("/login");
  }, []);
  const userData = Cookies.get("user");
  let finalUser: any = null;
  if (userData) {
    try {
      const decodedUserData = decodeURIComponent(userData);
      console.log("Decoded user data:", decodedUserData);

      const parsedUser = JSON.parse(decodedUserData);

      finalUser =
        typeof parsedUser === "string" ? JSON.parse(parsedUser) : parsedUser;

      console.log("Final user object:", finalUser);
      console.log("Name:", finalUser.name);
      console.log("Role:", finalUser.role);
    } catch (e) {
      console.error("Error parsing user data:", e);
    }
  } else {
    console.log("User data is not available");
  }
  useEffect(() => {
    async function getData() {
      try {
        setIsLoading(true);
        const appointmentResponse: any = await axios.get(
          //@ts-ignore
          `${process.env.NEXT_PUBLIC_BASE_URL}/api/v1/appointments/patient/${finalUser?.id}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        if (appointmentResponse.data.success) {
          setAppointments(appointmentResponse.data.appointments);
        }
        setIsLoading(false);
      } catch (error) {
        console.log("Error in getting appointments", error);
        setIsLoading(false);
        toast.error("Something went wrong");
      }
    }
    getData();
  }, []);

  if (isLoading) {
    <div>
      <Loader />
    </div>;
  }

  return (
    <div className={styles.appointmentsContainer}>
      <h1 className={styles.pageTitle}>Appointment Requests</h1>
      <div className={styles.appointmentTable}>
        <div className={styles.tableHeader}>
          <div>Patient</div>
          <div>Doctor</div>
          <div>Date</div>
          <div>Time</div>
          <div>Type</div>
          <div>Status</div>
        </div>
        {appointments.map((appointment: Appointment) => (
          <div key={appointment.id} className={styles.tableRow}>
            <div>{appointment.patient}</div>
            <div>{appointment.doctor}</div>
            <div>{appointment.date.split("T")[0]}</div>
            <div>
              {parseInt(appointment.start_time.slice(0, 2)) >= 12 ? "PM" : "AM"}
            </div>
            <div>{appointment.type}</div>
            <div className={styles[`status-${appointment.status}`]}>
              {appointment.status}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
