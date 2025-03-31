"use client";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import styles from "./page.module.css";
import { useRouter } from "next/navigation";
import { usePathname } from "next/navigation";
import {
  MapPin,
  Star,
  Stethoscope,
  Clock,
  Award,
  Briefcase,
  Heart,
  Users,
} from "lucide-react";
import { Doctor } from "@/lib/types/types";
import Loader from "@/app/_components/Loader";
import Cookies from "js-cookie";
import axios from "axios";

export default function DoctorProfile() {
  const router = useRouter();
  const [doctor, setDoctor] = useState<Doctor>();
  const path = usePathname();
  const token = Cookies.get("user");

  useEffect(() => {
    async function getDoctorData() {
      try {
        const id = path.split("/").pop();
        const res: { data: { success: boolean; doctor: Doctor } } =
          await axios.get(
            `${process.env.NEXT_PUBLIC_BASE_URL}/api/v1/doctors/doctorProfile/${id}`,
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );
        if (!res.data.success) {
          throw new Error("Error in getting doctor's Profile");
        }
        setDoctor(res.data.doctor);
      } catch (error) {
        console.log("Error in getting doctor's profile", error);
      }
    }
    getDoctorData();
  }, []);

  if (!doctor) {
    return (
      <div className={styles.onloadingDiv}>
        <Loader />
      </div>
    );
  }
  return (
    <div className={styles.pageContainer}>
      <div className={styles.profileLayout}>
        <div className={styles.profileSidebar}>
          <div className={styles.profileImageContainer}>
            <Image
              src={"/Doctor.svg"}
              alt={doctor.name}
              layout="fill"
              objectFit="cover"
              className={styles.profileImage}
            />
          </div>

          <div className={styles.profileBasicInfo}>
            <h1 className={styles.doctorName}>{doctor.name}</h1>
            <div className={styles.profileSubtitle}>
              <Stethoscope className={styles.subtitleIcon} />
              <span>{doctor.speciality}</span>
            </div>

            <div className={styles.profileStats}>
              <div className={styles.statItem}>
                <Star className={styles.statIcon} />
                <span>Rating: {doctor.rating}/5</span>
              </div>
              <div className={styles.statItem}>
                <Briefcase className={styles.statIcon} />
                <span>{doctor.experience} Years Experience</span>
              </div>
              <div className={styles.statItem}>
                <MapPin className={styles.statIcon} />
                <span>{doctor.location}</span>
              </div>
            </div>

            <button
              className={styles.appointmentButton}
              onClick={() => {
                router.push(`/appointments/${doctor.id}/schedule`);
              }}
            >
              Book Appointment
            </button>
          </div>
        </div>

        <div className={styles.profileContent}>
          <section className={styles.infoSection}>
            <h2 className={styles.sectionTitle}>Professional Overview</h2>
            <div className={styles.infoGrid}>
              <div className={styles.infoCard}>
                <Award className={styles.cardIcon} />
                <div>
                  <h3>Clinical Experience</h3>
                  <p>{doctor.experience} Years of dedicated medical practice</p>
                </div>
              </div>

              <div className={styles.infoCard}>
                <Users className={styles.cardIcon} />
                <div>
                  <h3>Gender Specialization</h3>
                  <p>{doctor.gender} Healthcare Professional</p>
                </div>
              </div>
            </div>
          </section>

          <section className={styles.infoSection}>
            <h2 className={styles.sectionTitle}>Areas of Expertise</h2>
            <div className={styles.expertiseTags}>
              {doctor &&
                doctor.disease &&
                doctor.disease.map((condition, index) => (
                  <span key={index} className={styles.expertiseBadge}>
                    <Heart className={styles.badgeIcon} />
                    {condition}
                  </span>
                ))}
            </div>
          </section>

          <section className={styles.infoSection}>
            <h2 className={styles.sectionTitle}>Consultation Information</h2>
            <div className={styles.consultationDetails}>
              <div className={styles.consultationCard}>
                <Clock className={styles.cardIcon} />
                <div>
                  <h3>Consultation Hours</h3>
                  <p>Monday - Friday: 9 AM to 5 PM</p>
                  <p>Saturday: 10 AM to 2 PM</p>
                </div>
              </div>

              <div className={styles.consultationCard}>
                <Stethoscope className={styles.cardIcon} />
                <div>
                  <h3>Consultation Modes</h3>
                  <p>In-Clinic Consultation</p>
                  <p>Video Consultation</p>
                </div>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
