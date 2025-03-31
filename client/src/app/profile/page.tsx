"use client";
import React, { useContext, useEffect, useState } from "react";
import styles from "./page.module.css";
import axios from "axios";
import { toast } from "react-toastify";
import { Appointment } from "@/lib/types/types";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";
import { authContext } from "@/context/Auth/authContext";
import Loader from "../_components/Loader";
export default function AppointmentsPage() {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { user } = useContext(authContext);
  const router = useRouter();
  const token = Cookies.get("user");
  useEffect(() => {
    if (!token) router.replace("/login");
  }, []);
  useEffect(() => {
    async function getData() {
      try {
        setIsLoading(true);
        const appointmentResponse: any = await axios.get(
          //@ts-ignore
          `${process.env.NEXT_PUBLIC_BASE_URL}/api/v1/appointments/patient/${user?.id}`,
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
