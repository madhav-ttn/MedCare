"use client";
import React, { useState, useEffect } from "react";
import axios from "axios";
import styles from "./page.module.css";
import SearchBar from "@/app/_components/Search";
import DoctorCard from "@/app/_components/DoctorCard";
import UpdateDoctorModal from "@/app/_components/UpdateDoctorModal";
import { Doctor } from "@/lib/types";
import { toast } from "react-toastify";
import Cookies from "js-cookie";
import { useRouter } from "next/navigation";
import CreateDoctorModal from "../_components/CreateDoctorModel";

export default function DoctorsPage() {
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [filteredDoctors, setFilteredDoctors] = useState<Doctor[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedDoctor, setSelectedDoctor] = useState<Doctor | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  const router = useRouter();
  useEffect(() => {
    const token = Cookies.get("user");
    if (!token) router.replace("/login");
  }, []);
  useEffect(() => {
    async function fetchDoctors() {
      try {
        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_BASE_URL}/api/v1/doctors`
        );
        if (response.data.success) {
          setDoctors(response.data.doctors);
          setFilteredDoctors(response.data.doctors);
        }
      } catch (error) {
        console.log("Error fetching doctors:", error);
      }
    }
    fetchDoctors();
  }, []);

  useEffect(() => {
    if (searchTerm.trim() === "") {
      setFilteredDoctors(doctors);
    } else {
      const filtered = doctors.filter(
        (doctor) =>
          doctor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          doctor.speciality.toLowerCase().includes(searchTerm.toLowerCase()) ||
          doctor.location.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredDoctors(filtered);
    }
  }, [searchTerm, doctors]);

  const handleSearch = (term: string) => {
    setSearchTerm(term);
  };

  const handleDoctorClick = (doctor: Doctor) => {
    setSelectedDoctor(doctor);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedDoctor(null);
  };
  const handleAdd = (doc: Doctor) => {
    setDoctors([...doctors, doc]);
  };
  const handleCloseCreateModal = () => {
    setIsCreateModalOpen(false);
  };

  const handleDelete = async (id: number) => {
    try {
      const response = await axios.delete(
        `${process.env.NEXT_PUBLIC_BASE_URL}/api/v1/doctors/${id}`
      );
      if (!response.data.success) {
        throw new Error("Error in deleting doctor's profile");
      }
      if (response.data.success) {
        toast.success("Doctor Deletion Successfull");
        setDoctors((prev) => prev.filter((doc) => doc.id !== id));
        handleCloseModal();
      }
    } catch (error) {
      console.log("Error in deleting the doctor", error);
      toast.error("Something went wrong");
    }
  };

  const handleUpdateDoctor = async (updatedDoctor: Doctor) => {
    try {
      const response = await axios.put(
        `${process.env.NEXT_PUBLIC_BASE_URL}/api/v1/doctors/doctorProfile/${updatedDoctor.id}`,
        updatedDoctor
      );

      if (response.data.success) {
        setDoctors((prevDoctors) =>
          prevDoctors.map((doc) =>
            doc.id === updatedDoctor.id ? updatedDoctor : doc
          )
        );
        toast.success("Profile updated");
        handleCloseModal();
      }
    } catch (error) {
      console.error("Error updating doctor:", error);
      toast.error("Something went wrong");
    }
  };

  const handleAddDoctor = () => {
    setIsCreateModalOpen(true);
  };

  return (
    <div className={styles.doctorsContainer}>
      <div className={styles.header}>
        <h1 className={styles.title}>Our Doctors</h1>
        <button className={styles.addButton} onClick={handleAddDoctor}>
          Add New Doctor
        </button>
      </div>

      <SearchBar onSearch={handleSearch} />

      <div className={styles.doctorsGrid}>
        {filteredDoctors.length > 0 ? (
          filteredDoctors.map((doctor) => (
            <DoctorCard
              key={doctor.id}
              doctor={doctor}
              onClick={() => handleDoctorClick(doctor)}
            />
          ))
        ) : (
          <div className={styles.noResults}>
            No doctors found matching your search criteria.
          </div>
        )}
      </div>

      {isModalOpen && selectedDoctor && (
        <UpdateDoctorModal
          doctor={selectedDoctor}
          onClose={handleCloseModal}
          handleDelete={handleDelete}
          onUpdate={handleUpdateDoctor}
        />
      )}
      {isCreateModalOpen && (
        <CreateDoctorModal
          handleAdd={handleAdd}
          onClose={handleCloseCreateModal}
        />
      )}
    </div>
  );
}
