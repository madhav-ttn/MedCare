import { QueryResultRow } from "pg";
export interface Doctor {
  id?: number;
  name: string;
  speciality: string;
  experience: number;
  photo_url?: string;
  rating?: number;
  location: string;
  gender: "male" | "female" | "other";
  disease?: string[];
}

export interface Appointment extends QueryResultRow {
  id?: number;
  doctor_id: number;
  patient_id: number;
  doctor_slot_id: number;
  appointment_date: Date;
  type: "virtual" | "in_person";
  status: "pending" | "approved" | "declined" | "completed";
}

export interface Slot {
  id?: number;
  doctor_id: number;
  date: Date;
  start_time: string;
  end_time: string;
  is_available: boolean;
}

export interface QueryResult<T> {
  success: boolean;
  data?: T | T[];
  message?: string;
}

export interface AppointmentResult extends QueryResult<Appointment> {
  data?: Appointment[];
}

export interface AppointmentWithDetails extends Appointment {
  patient?: string;
  doctor?: string;
  date?: string;
  start_time?: string;
  end_time?: string;
  is_available?: boolean;
}

export interface AppointmentWithDetailsResult
  extends QueryResult<AppointmentWithDetails> {
  data?: AppointmentWithDetails[];
}
