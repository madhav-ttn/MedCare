import pool from "../config/db";
import { Appointment } from "../lib/types";
const appointmentModel = {
  bookAppointment: async (appointmentDetails: Appointment) => {
    try {
      const {
        doctor_id,
        patient_id,
        doctor_slot_id,
        appointment_date,
        type,
        status,
      } = appointmentDetails;
      const result = await pool.query(
        "INSERT INTO appointments(doctor_id,patient_id,doctor_slot_id,appointment_date,type, status) VALUES($1,$2,$3,$4,$5,$6) returning *",
        [doctor_id, patient_id, doctor_slot_id, appointment_date, type, status]
      );
      return {
        success: true,
        data: result.rows[0],
      };
    } catch (error) {
      console.log("Error", error);
      return {
        success: false,
        message: "Booking Appointment Query Failed",
      };
    }
  },
  getAllAppointments: async () => {
    try {
      const result = await pool.query("SELECT * from appointments");
      return {
        success: true,
        data: result.rows,
      };
    } catch (error) {
      console.log("Error in Getting Appointments ", error);
      return {
        success: false,
        message: "Getting Appointments Query Failed",
      };
    }
  },
  getAppointmentsByDoctor: async (doctor_id: number) => {
    try {
      const result = await pool.query(
        "SELECT * from appointments INNER JOIN users on appointments.patient_id=users.id INNER JOIN doctor_slots on appointments.doctor_slot_id=doctor_slots.id where appointments.doctor_id=$1",
        [doctor_id]
      );
      return {
        success: true,
        data: result.rows,
      };
    } catch (error) {
      console.log("Error in Getting Appointments ", error);
      return {
        success: false,
        message: "Getting Appointments Query Failed",
      };
    }
  },
  getAppointmentsByPatient: async (patient_id: number) => {
    try {
      const result = await pool.query(
        "SELECT * from appointments INNER JOIN users on appointments.patient_id=users.id INNER JOIN doctor_slots on appointments.doctor_slot_id=doctor_slots.id where appointments.patient_id=$1",
        [patient_id]
      );
      return {
        success: true,
        data: result.rows,
      };
    } catch (error) {
      return {
        success: false,
        message: "Booking Appointment Query Failed",
      };
    }
  },
  updateAppointment: async (
    id: number,
    status: "pending" | "declined" | "approved" | "completed"
  ) => {
    try {
      const result = await pool.query(
        "Update appointments set status=$2 where id=$1 returning *",
        [id, status]
      );
      return {
        success: true,
        data: result.rows[0],
      };
    } catch (error) {
      return {
        success: false,
        message: "Booking Appointment Query Failed",
      };
    }
  },
  deleteAppointment: async (id: number) => {
    try {
      const result = await pool.query(
        "DELETE from appointments where id=$1 returning *",
        [id]
      );
      return {
        success: true,
        data: result.rows[0],
      };
    } catch (error) {
      return {
        success: false,
        message: "Booking Appointment Query Failed",
      };
    }
  },
};

export default appointmentModel;
