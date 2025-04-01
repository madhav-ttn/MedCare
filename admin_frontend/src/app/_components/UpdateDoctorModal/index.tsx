"use client";
import React, { useState } from "react";
import styles from "./index.module.css";
import { Doctor, DoctorModalProps } from "@/lib/types";
import Loader from "../Loader";

export default function UpdateDoctorModal({
  doctor,
  handleDelete,
  onClose,
  onUpdate,
}: DoctorModalProps) {
  const [formData, setFormData] = useState<Doctor>(doctor);
  const [diseasesInput, setDiseasesInput] = useState<string[]>(doctor.disease);
  const [isUpdating, setIsUpdating] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsUpdating(true);
    try {
      await onUpdate(formData);
    } catch (error) {
      console.error("Error updating doctor profile:", error);
    } finally {
      setIsUpdating(false);
    }
  };

  const handleDeleteClick = async () => {
    if (
      window.confirm("Are you sure you want to delete this doctor profile?")
    ) {
      setIsDeleting(true);
      try {
        await handleDelete(doctor.id);
      } catch (error) {
        console.error("Error deleting doctor profile:", error);
        setIsDeleting(false);
      }
    }
  };

  const handleOverlayClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget && !isUpdating && !isDeleting) {
      onClose();
    }
  };

  return (
    <div className={styles.modalOverlay} onClick={handleOverlayClick}>
      <div className={styles.modalContent}>
        <div className={styles.modalHeader}>
          <h2 className={styles.modalTitle}>Update Doctor Profile</h2>
          <button
            className={styles.closeButton}
            onClick={onClose}
            disabled={isUpdating || isDeleting}
          >
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
              disabled={isUpdating || isDeleting}
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
              disabled={isUpdating || isDeleting}
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
                disabled={isUpdating || isDeleting}
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
                disabled={isUpdating || isDeleting}
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
              disabled={isUpdating || isDeleting}
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
              disabled={isUpdating || isDeleting}
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
              disabled={isUpdating || isDeleting}
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
              disabled={isUpdating || isDeleting}
            />
          </div>

          <div className={styles.buttonGroup}>
            <button
              type="button"
              className={styles.deleteButton}
              onClick={handleDeleteClick}
              disabled={isUpdating || isDeleting}
            >
              {isDeleting ? (
                <div className={styles.buttonWithLoader}>
                  <Loader />
                  <span>Deleting...</span>
                </div>
              ) : (
                "Delete Profile"
              )}
            </button>

            <button
              type="button"
              className={styles.cancelButton}
              onClick={onClose}
              disabled={isUpdating || isDeleting}
            >
              Cancel
            </button>

            <button
              type="submit"
              className={styles.updateButton}
              disabled={isUpdating || isDeleting}
            >
              {isUpdating ? (
                <div className={styles.buttonWithLoader}>
                  <Loader />
                  <span>Updating...</span>
                </div>
              ) : (
                "Update Profile"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
