"use client";
import React, { useState } from "react";
import styles from "./index.module.css";
import { Doctor, DoctorModalProps } from "@/lib/types";

export default function UpdateDoctorModal({
  doctor,
  handleDelete,
  onClose,
  onUpdate,
}: DoctorModalProps) {
  const [formData, setFormData] = useState<Doctor>(doctor);
  const [diseasesInput, setDiseasesInput] = useState<string[]>(doctor.disease);
  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value } = e.target;

    if (name === "diseases") {
      setDiseasesInput(value.split(","));

      setFormData({
        ...formData,
        disease: value.split(","),
      });
    } else if (name === "experience" || name === "rating") {
      setFormData({
        ...formData,
        [name]: parseInt(value, 10),
      });
    } else {
      setFormData({
        ...formData,
        [name]: value,
      });
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdate(formData);
  };

  const handleOverlayClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div className={styles.modalOverlay} onClick={handleOverlayClick}>
      <div className={styles.modalContent}>
        <div className={styles.modalHeader}>
          <h2 className={styles.modalTitle}>Update Doctor Profile</h2>
          <button className={styles.closeButton} onClick={onClose}>
            &times;
          </button>
        </div>
        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.formGroup}>
            <label htmlFor="name" className={styles.label}>
              Full Name
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className={styles.input}
              required
            />
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="speciality" className={styles.label}>
              Specialty
            </label>
            <input
              type="text"
              id="speciality"
              name="speciality"
              value={formData.speciality}
              onChange={handleChange}
              className={styles.input}
              required
            />
          </div>

          <div className={styles.formRow}>
            <div className={styles.formGroup}>
              <label htmlFor="experience" className={styles.label}>
                Experience (years)
              </label>
              <input
                type="number"
                id="experience"
                name="experience"
                value={formData.experience}
                onChange={handleChange}
                className={styles.input}
                min="0"
                required
              />
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="rating" className={styles.label}>
                Rating (out of 5)
              </label>
              <input
                type="number"
                id="rating"
                name="rating"
                value={formData.rating}
                onChange={handleChange}
                className={styles.input}
                min="0"
                max="5"
                step="0.1"
                required
              />
            </div>
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="location" className={styles.label}>
              Location
            </label>
            <input
              type="text"
              id="location"
              name="location"
              value={formData.location}
              onChange={handleChange}
              className={styles.input}
              required
            />
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="gender" className={styles.label}>
              Gender
            </label>
            <select
              id="gender"
              name="gender"
              value={formData.gender}
              onChange={handleChange}
              className={styles.select}
              required
            >
              <option value="MALE">Male</option>
              <option value="FEMALE">Female</option>
              <option value="OTHER">Other</option>
            </select>
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="photo_url" className={styles.label}>
              Photo URL
            </label>
            <input
              type="text"
              id="photo_url"
              name="photo_url"
              value={formData.photo_url || ""}
              onChange={handleChange}
              className={styles.input}
              placeholder="https://example.com/doctor-image.jpg"
            />
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="diseases" className={styles.label}>
              Treatments (comma separated)
            </label>
            <input
              type="text"
              id="diseases"
              name="diseases"
              value={diseasesInput}
              onChange={handleChange}
              className={styles.input}
              placeholder="diabetes, thyroid, hypertension"
            />
          </div>

          <div className={styles.buttonGroup}>
            <button
              type="button"
              className={styles.deleteButton}
              onClick={() => handleDelete(doctor.id)}
            >
              Delete Profile
            </button>
            <button
              type="button"
              className={styles.cancelButton}
              onClick={onClose}
            >
              Cancel
            </button>
            <button type="submit" className={styles.updateButton}>
              Update Profile
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
