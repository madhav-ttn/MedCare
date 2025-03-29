import React from "react";
import Image from "next/image";
import styles from "./index.module.css";
import { DoctorCardProps } from "@/lib/types";

export default function DoctorCard({ doctor, onClick }: DoctorCardProps) {
  const ratingGenerator = (rating: number) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <span
          key={i}
          className={i <= rating ? styles.starFilled : styles.starEmpty}
        >
          ★
        </span>
      );
    }
    return stars;
  };
  return (
    <div className={styles.card} onClick={onClick}>
      <div className={styles.imageContainer}>
        {doctor.photo_url ? (
          <Image
            src={doctor.photo_url}
            alt={doctor.name}
            width={100}
            height={100}
            className={styles.doctorImage}
          />
        ) : (
          <div className={styles.imagePlaceholder}>{doctor.name.charAt(0)}</div>
        )}
      </div>
      <div className={styles.content}>
        <h2 className={styles.name}>{doctor.name}</h2>
        <p className={styles.specialty}>{doctor.speciality}</p>
        <div className={styles.rating}>
          {ratingGenerator(doctor.rating)}
          <span className={styles.ratingText}>({doctor.rating}/5)</span>
        </div>
        <div className={styles.details}>
          <div className={styles.detailItem}>
            <span className={styles.detailLabel}>Experience:</span>
            <span>{doctor.experience} years</span>
          </div>
          <div className={styles.detailItem}>
            <span className={styles.detailLabel}>Location:</span>
            <span>{doctor.location}</span>
          </div>
        </div>
        <div className={styles.editButton}>Edit Profile</div>
      </div>
    </div>
  );
}
