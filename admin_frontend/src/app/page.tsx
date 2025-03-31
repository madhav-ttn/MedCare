"use client";
import Link from "next/link";
import styles from "./page.module.css";
import { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { Appointment } from "@/lib/types";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";
export default function Dashboard() {
  const [doctors, setDoctors] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const router = useRouter();

  useEffect(() => {
    const token = Cookies.get("user");
    if (!token) router.replace("/login");
  }, []);
  useEffect(() => {
    const token = Cookies.get("user");
    async function getAppointmentsandDoctors() {
      try {
        const doctorResponse = await axios.get(
          `${process.env.NEXT_PUBLIC_BASE_URL}/api/v1/doctors`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        const appointmentResponse = await axios.get(
          `${process.env.NEXT_PUBLIC_BASE_URL}/api/v1/appointments`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        if (!doctorResponse.data.success || !appointmentResponse.data.success) {
          throw new Error("Error in fetching the data");
        }
        if (doctorResponse.data.doctors) {
          setDoctors(doctorResponse.data.doctors);
        }
        if (appointmentResponse.data.appointments) {
          setAppointments(appointmentResponse.data.appointments);
        }
      } catch (error) {
        console.log("Error in getting the doctors and appointments", error);
        toast.error("Something went wrong");
      }
    }
    getAppointmentsandDoctors();
  }, []);

  const dashboardStats = {
    totalDoctors: doctors.length,
    totalAppointments: appointments.length,
    pendingAppointments: appointments.filter(
      (app: Appointment) => app.status === "pending"
    ).length,
  };

  const recentAppointments = appointments.slice(0, 3) || [];

  return (
    <div className={styles.dashboardGrid}>
      <div className={styles.statsContainer}>
        <div className={styles.statCard}>
          <div className={styles["statIconWrapper-doctors"]}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#2a6b35"
              strokeWidth="2"
            >
              <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
              <circle cx="9" cy="7" r="4" />
              <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
              <path d="M16 3.13a4 4 0 0 1 0 7.75" />
            </svg>
          </div>
          <div
            className={styles.statContent}
            onClick={() => router.push("/doctors")}
          >
            <div className={styles.statLabel}>Total Doctors</div>
            <div className={styles["statValue-doctors"]}>
              {dashboardStats.totalDoctors}
            </div>
          </div>
        </div>

        <div className={styles.statCard}>
          <div className={styles["statIconWrapper-appointments"]}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#2563eb"
              strokeWidth="2"
            >
              <rect width="18" height="18" x="3" y="4" rx="2" ry="2" />
              <line x1="16" x2="16" y1="2" y2="6" />
              <line x1="8" x2="8" y1="2" y2="6" />
              <line x1="3" x2="21" y1="10" y2="10" />
            </svg>
          </div>
          <Link href={"/appointments"} className={styles.statContent}>
            <div className={styles.statLabel}>Total Appointments</div>
            <div className={styles["statValue-appointments"]}>
              {dashboardStats.totalAppointments}
            </div>
          </Link>
        </div>

        <div className={styles.statCard}>
          <Link
            href={"/appointments"}
            className={styles["statIconWrapper-pending"]}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#d97706"
              strokeWidth="2"
            >
              <circle cx="12" cy="12" r="10" />
              <polyline points="12 6 12 12 16 14" />
            </svg>
          </Link>
          <Link href={"/appointments"} className={styles.statContent}>
            <div className={styles.statLabel}>Pending Appointments</div>
            <div className={styles["statValue-pending"]}>
              {dashboardStats.pendingAppointments}
            </div>
          </Link>
        </div>
      </div>

      <div className={styles.secondaryGrid}>
        <div className={styles.cardSection}>
          <h2 className={styles.cardTitle}>Recent Appointments</h2>
          <div className={styles.appointmentList}>
            {recentAppointments.length !== 0 ? (
              recentAppointments.map((appointment: Appointment, index) => (
                <div key={index} className={styles.appointmentItem}>
                  <div className={styles.appointmentDetails}>
                    <span className={styles.appointmentName}>
                      {appointment.patient}
                    </span>
                    <span className={styles.appointmentDoctor}>
                      {appointment.doctor}
                    </span>
                  </div>
                  <span className={styles.appointmentDate}>
                    {appointment.date}
                  </span>
                </div>
              ))
            ) : (
              <h3>No recent appointments</h3>
            )}
          </div>
        </div>

        <div className={styles.cardSection}>
          <h2 className={styles.cardTitle}>Quick Actions</h2>
          <div className={styles.quickActionsGrid}>
            <Link
              href="/doctors"
              className={styles["quickActionButton-doctors"]}
            >
              <div className={styles.quickActionIcon}>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
                  <circle cx="9" cy="7" r="4" />
                  <line x1="19" y1="8" x2="19" y2="14" />
                  <line x1="22" y1="11" x2="16" y2="11" />
                </svg>
              </div>
              Add Doctor
            </Link>
            <Link
              href="/appointments"
              className={styles["quickActionButton-appointments"]}
            >
              <div className={styles.quickActionIcon}>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <rect width="18" height="18" x="3" y="4" rx="2" ry="2" />
                  <line x1="16" x2="16" y1="2" y2="6" />
                  <line x1="8" x2="8" y1="2" y2="6" />
                  <line x1="3" x2="21" y1="10" y2="10" />
                </svg>
              </div>
              Manage Appointments
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
