"use client";
import React from "react";
import styles from "./page.module.css";

// Simulated appointment data type
type Appointment = {
  id: string;
  patientName: string;
  doctorName: string;
  date: string;
  time: string;
  status: "pending" | "approved" | "declined";
};

export default function AppointmentsPage() {
  // TODO: Replace with actual data fetching
  const appointments: Appointment[] = [
    {
      id: "1",
      patientName: "Emma Watson",
      doctorName: "Dr. Smith",
      date: "2024-03-15",
      time: "10:30 AM",
      status: "pending",
    },
    // More appointments...
  ];

  const handleAppointmentAction = async (
    id: string,
    action: "approve" | "decline"
  ) => {
    // TODO: Implement appointment status update
    // 1. Update appointment status in database
    // 2. Send email notification using Nodemailer
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
        {appointments.map((appointment) => (
          <div key={appointment.id} className={styles.tableRow}>
            <div>{appointment.patientName}</div>
            <div>{appointment.doctorName}</div>
            <div>{appointment.date}</div>
            <div>{appointment.time}</div>
            <div>In Person</div>
            <div className={styles[`status-${appointment.status}`]}>
              {appointment.status}
            </div>
            <div className={styles.actionButtons}>
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
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
