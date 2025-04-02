import { JwtPayload } from "jsonwebtoken";
import { ReactNode } from "react";

export type Appointment = {
  id: number;
  patient: string;
  patientemail: string;
  doctor: string;
  doctor_id: number;
  slot_id: number;
  date: string;
  time: string;
  type: string;
  status: "pending" | "approved" | "declined" | "delete";
};

export interface Doctor {
  id: number;
  name: string;
  speciality: string;
  experience: number;
  photo_url: string;
  rating: number;
  location: string;
  gender: "MALE" | "FEMALE" | "OTHER";
  disease: string[];
}

export interface DoctorModalProps {
  doctor: Doctor;
  onClose: () => void;
  handleDelete: (id: number) => void;
  onUpdate: (updatedDoctor: Doctor) => void;
}

export interface CreateDoctorModalProps {
  onClose: () => void;
  handleAdd: (doctor: Doctor) => void;
}

export interface DoctorCardProps {
  doctor: Doctor;
  onClick: () => void;
}

export interface jwtPayload extends JwtPayload {
  email: string;
  id: number;
  name: string;
  role: string;
}

export interface RedirectLinkProps {
  href: string;
  children: ReactNode;
  className: string;
}
