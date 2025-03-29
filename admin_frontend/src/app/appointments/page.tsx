"use client";
import React, { useEffect, useState } from "react";
import styles from "./page.module.css";
import axios from "axios";
import { toast } from "react-toastify";
import { Appointment } from "@/lib/types";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";
export default function AppointmentsPage() {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const router = useRouter();
  useEffect(() => {
    const token = Cookies.get("user");
    if (!token) router.replace("/login");
  }, []);
  useEffect(() => {
    async function getData() {
      try {
        const appointmentResponse = await axios.get(
          `${process.env.NEXT_PUBLIC_BASE_URL}/api/v1/appointments`
        );
        if (appointmentResponse.data.success) {
          setAppointments(appointmentResponse.data.appointments);
        }
      } catch (error) {
        console.log("Error in getting appointments", error);
        toast.error("Something went wrong");
      }
    }
    getData();
  }, []);
  const handleAppointmentAction = async (
    id: string,
    action: "approve" | "decline" | "delete"
  ) => {
    try {
      if (action === "delete") {
        const response = await axios.delete(
          `${process.env.NEXT_PUBLIC_BASE_URL}/api/v1/appointments/${id}`
        );
        if (response.data.success) {
          setAppointments((prevAppointments) =>
            prevAppointments.filter(
              (appointment: Appointment) => appointment.id !== id
            )
          );

          toast.success("Appointment deleted successfully");
        }
      } else {
        const response = await axios.put(
          `${process.env.NEXT_PUBLIC_BASE_URL}/api/v1/appointments/${id}`,
          {
            status: action === "approve" ? "approved" : "declined",
          }
        );

        if (response.data.success) {
          setAppointments((prevAppointments) =>
            prevAppointments.map((appointment: Appointment) =>
              appointment.id === id
                ? {
                    ...appointment,
                    status: action === "approve" ? "approved" : "declined",
                  }
                : appointment
            )
          );

          toast.success(
            `Appointment ${
              action === "approve" ? "approved" : "declined"
            } successfully`
          );
        }
      }
    } catch (error) {
      console.error(`Error ${action}ing appointment:`, error);
      toast.error(`Failed to ${action} appointment. Please try again.`);
    }
  };

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
          <div>Actions</div>
        </div>
        {appointments.map((appointment: Appointment) => (
          <div key={appointment.id} className={styles.tableRow}>
            <div>{appointment.patient}</div>
            <div>{appointment.doctor}</div>
            <div>{appointment.date.split("T")[0]}</div>
            <div>
              {appointment.time.slice(0, 5)}{" "}
              {parseInt(appointment.time.slice(0, 2)) >= 12 ? "PM" : "AM"}
            </div>
            <div>{appointment.type}</div>
            <div className={styles[`status-${appointment.status}`]}>
              {appointment.status}
            </div>
            <div className={styles.actionButtons}>
              {appointment.status ? (
                <button
                  onClick={() =>
                    handleAppointmentAction(appointment.id, "delete")
                  }
                  className={styles.declineButton}
                >
                  Delete
                </button>
              ) : (
                <>
                  <button
                    onClick={() =>
                      handleAppointmentAction(appointment.id, "approve")
                    }
                    className={styles.approveButton}
                  >
                    Approve
                  </button>
                  <button
                    onClick={() =>
                      handleAppointmentAction(appointment.id, "decline")
                    }
                    className={styles.declineButton}
                  >
                    Decline
                  </button>
                </>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
