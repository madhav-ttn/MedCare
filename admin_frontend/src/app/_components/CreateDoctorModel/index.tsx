"use client";
import React, { useState } from "react";
import styles from "./index.module.css";
import axios from "axios";
import { toast } from "react-toastify";
import { CreateDoctorModalProps, Doctor } from "@/lib/types";
import Cookies from "js-cookie";
import PageLoader from "../Loader";
import Loader from "../Loader";

export default function CreateDoctorModal({
  handleAdd,
  onClose,
}: CreateDoctorModalProps) {
  const [isLoading, setisLoading] = useState(false);
  const [isDocCreating, setIsDocCreating] = useState(false);
  const [imageUrl, setImageUrl] = useState<string>("");
  const token = Cookies.get("user");

  const handleCreateDoctor = async (formData: FormData) => {
    try {
      setIsDocCreating(true);
      const treatments = formData.get("treatments")?.toString().split(",");
      const doctor_details = {
        name: formData.get("name"),
        email: formData.get("email"),
        speciality: formData.get("speciality"),
        rating: formData.get("rating"),
        experience: formData.get("experience"),
        disease: treatments,
        photo_url: imageUrl,
        location: formData.get("location"),
        gender: formData.get("gender"),
      };
      const res: { data: { data: Doctor; success: boolean } } =
        await axios.post(
          `${process.env.NEXT_PUBLIC_BASE_URL}/api/v1/doctors`,
          {
            doctor_details: doctor_details,
          },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
      if (!res.data.success) {
        throw new Error("Error in creating doctor");
      }
      toast.success("Doctor Added Successfully");
      handleAdd(res.data.data);
      onClose && onClose();
    } catch (error) {
      console.log("Error in creating a doctor", error);
      toast.error("Something went wrong");
    } finally {
      setIsDocCreating(false);
    }
  };

  const uploadImage = async (event: React.ChangeEvent<HTMLInputElement>) => {
    try {
      setisLoading(true);
      if (!event.target.files || event.target.files.length === 0) {
        toast.error("No file selected");
        return;
      }
      const file = event.target.files[0];
      const formData = new FormData();
      formData.append("image", file);
      const result = await axios.post(
        `${process.env.NEXT_PUBLIC_BASE_URL}/api/v1/upload`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (!result.data.success) {
        throw new Error("Error in uploading the file");
      }
      setImageUrl(result.data.url);
      toast.success("Image Uploaded Successfully");
    } catch (error) {
      toast.error("Error in uploading the image");
      console.log("Error in uploading the image", error);
    } finally {
      setisLoading(false);
    }
  };

  return (
    <div className={styles.createDoctorParentContainer}>
      <div className={styles.createDoctorContainer}>
        <div className={styles.modalHeader}>
          <h2 className={styles.pageTitle}>Add new Doctor</h2>
          <button
            onClick={onClose}
            className={styles.closeButton}
            disabled={isDocCreating}
          >
            &times;
          </button>
        </div>
        {isDocCreating ? (
          <div className={styles.loadingContainer}>
            <PageLoader />
            <p className={styles.loadingText}>Creating doctor profile...</p>
          </div>
        ) : (
          <form action={handleCreateDoctor} className={styles.doctorForm}>
            <div className={styles.formGrid}>
              <div className={styles.formGroup}>
                <label htmlFor="name" className={styles.label}>
                  Full Name
                </label>
                <input
                  type="text"
                  name="name"
                  required
                  className={styles.input}
                  placeholder="Dr. John Doe"
                />
              </div>
              <div className={styles.formGroup}>
                <label htmlFor="email" className={styles.label}>
                  Email
                </label>
                <input
                  type="email"
                  name="email"
                  required
                  className={styles.input}
                  placeholder="doctor@medcare.com"
                />
              </div>
              <div className={styles.formGroup}>
                <label htmlFor="specialty" className={styles.label}>
                  Specialty
                </label>
                <input
                  type="text"
                  name="speciality"
                  required
                  className={styles.input}
                  placeholder="Cardiologist"
                />
              </div>
              <div className={styles.formGroup}>
                <label htmlFor="rating" className={styles.label}>
                  Ratings(out of 5)
                </label>
                <input
                  type="number"
                  name="rating"
                  required
                  max={5}
                  className={styles.input}
                  placeholder="5"
                />
              </div>
              <div className={styles.formGroup}>
                <label htmlFor="experience" className={styles.label}>
                  Experience in years
                </label>
                <input
                  type="number"
                  name="experience"
                  required
                  className={styles.input}
                  placeholder="10"
                />
              </div>
              <div className={styles.formGroup}>
                <label htmlFor="treatments" className={styles.label}>
                  Treatments
                </label>
                <input
                  type="text"
                  name="treatments"
                  required
                  className={styles.input}
                  placeholder="diabetes,thyroid"
                />
              </div>
              <div className={styles.formGroup}>
                <label htmlFor="location" className={styles.label}>
                  Location
                </label>
                <input
                  type="text"
                  name="location"
                  required
                  className={styles.input}
                  placeholder="New York, USA"
                />
              </div>
              <div className={styles.formGroup}>
                <label htmlFor="gender" className={styles.label}>
                  Gender
                </label>
                <select className={styles.input} name="gender" id="">
                  <option value="MALE">MALE</option>
                  <option value="FEMALE">FEMALE</option>
                </select>
              </div>
              <div className={styles.formGroup}>
                <label htmlFor="profileImage" className={styles.label}>
                  Profile Image
                </label>
                <div className={styles.fileInputContainer}>
                  <input
                    onChange={uploadImage}
                    type="file"
                    accept="image/*"
                    name="profileImage"
                    required
                    className={styles.input}
                    disabled={isLoading}
                  />
                  {isLoading && (
                    <div className={styles.uploadingIndicator}>
                      <Loader />
                      <span>Uploading...</span>
                    </div>
                  )}
                  {imageUrl && !isLoading && (
                    <div className={styles.uploadSuccess}>✓ Uploaded</div>
                  )}
                </div>
              </div>
            </div>
            <div className={styles.formActions}>
              <button
                disabled={isLoading || isDocCreating}
                type="submit"
                className={styles.submitButton}
              >
                {isDocCreating ? (
                  <>
                    <Loader />
                    <span>Creating...</span>
                  </>
                ) : (
                  "Create Doctor Profile"
                )}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
