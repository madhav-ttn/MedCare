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
      const result = await pool.query(
        "SELECT ap.appointment_date as appointmentDate,ap.id as id,ap.status as status,us.email as patientEmail,us.name as Patient,doc.id as doctor_id, doc.name as Doctor,ds.id as slot_id, ds.date as Date,ds.start_time as Time,ap.type as Type from appointments as ap JOIN users as us on ap.patient_id = us.id JOIN doctors as doc on ap.doctor_id=doc.id JOIN doctor_slots as ds on ap.doctor_slot_id=ds.id"
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
        "SELECT users.name as patient , doc.name as doctor,appointments.*,doctor_slots.* from appointments INNER JOIN users on appointments.patient_id=users.id INNER JOIN doctor_slots on appointments.doctor_slot_id=doctor_slots.id JOIN doctors as doc on doc.id =appointments.doctor_id where appointments.patient_id=$1",
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
    parsedDoctorId: number,
    parsedSlotId: number,
    status: "pending" | "declined" | "approved" | "completed"
  ) => {
    try {
      const result = await pool.query(
        "Update appointments set status=$2 where id=$1 returning *",
        [id, status]
      );
      await pool.query(
        "Update doctor_slots set is_available=false where doctor_id=$1 and id=$2",
        [parsedDoctorId, parsedSlotId]
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
  deleteAppointment: async (id: number, slot_id: number) => {
    try {
      const result = await pool.query(
        "DELETE from appointments where id=$1 returning *",
        [id]
      );
      await pool.query(
        "Update doctor_slots set is_available = true where id=$1",
        [slot_id]
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
