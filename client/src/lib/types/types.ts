import { JwtPayload } from "jsonwebtoken";

export interface SideCardProps {
  title: string;
  data: string[];
  handleFilter: (type: string, value: string) => void;
}

export interface Doctor {
  id: number;
  name: string;
  speciality: string;
  experience: number;
  photo_url?: string;
  rating?: number;
  location: string;
  gender: string;
  disease?: string[];
}

export interface Slot {
  id: number;
  doctor_id: number;
  date: Date;
  start_time: string;
  end_time: string;
  is_available: boolean;
  doctor_name: string;
  location: string;
}

export type Appointment = {
  id: string;
  patient: string;
  doctor: string;
  date: string;
  start_time: string;
  type: string;
  status: "pending" | "approved" | "declined" | "delete";
};
export interface NavLinkProps {
  href: string;
  label: string;
  handleSidebar?: () => void;
}

export interface RedirectLinkProps extends NavLinkProps {
  className: string;
}

export interface jwtPayload extends JwtPayload {
  email: string;
  id: number;
  name: string;
  role: string;
}
