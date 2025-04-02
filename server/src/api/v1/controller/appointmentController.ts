import express, { Request, Response } from "express";
import appointmentModel from "../models/appointmentModel";
import { emailService } from "../services/emailService";
import validateUser from "../middlewares/userMiddleware";
import validateAdmin from "../middlewares/adminMiddleware";
const router = express.Router();

router.get("/", async (req: Request, res: Response): Promise<any> => {
  try {
    const result = await appointmentModel.getAllAppointments();
    if (!result.success) {
      return res.status(400).json({ success: false, message: result.message });
    }
    return res.status(200).json({ success: true, appointments: result.data });
  } catch (error) {
    console.log("Error in appointment controller", error);
    return res.status(500).json({
      success: false,
      message: "Error in fetching the appointments",
    });
  }
});
router.get(
  "/patient/:patient_id",
  validateUser,
  async (req: Request, res: Response): Promise<any> => {
    try {
      const { patient_id } = req.params;
      const parsedId = parseInt(patient_id);
      if (parsedId === null || parsedId === undefined || isNaN(parsedId)) {
        return res.status(404).json({
          success: false,
          message: "No such appointments exist for this patient",
        });
      }
      const result = await appointmentModel.getAppointmentsByPatient(parsedId);
      if (!result.success) {
        res.status(400).json({ success: false, message: result.message });
      }
      return res.status(200).json({ success: true, appointments: result.data });
    } catch (error) {
      console.log("Error in appointment controller", error);
      return res.status(500).json({
        success: false,
        message: "Error in fetching the appointments",
      });
    }
  }
);
router.get(
  "/doctor/:doctor_id",
  validateUser,
  //@ts-ignore
  validateAdmin,
  async (req: Request, res: Response): Promise<any> => {
    try {
      const { doctor_id } = req.params;
      const parsedId = parseInt(doctor_id);
      if (parsedId === null || parsedId === undefined || isNaN(parsedId)) {
        return res.status(404).json({
          success: false,
          message: "No such appointments exist for this doctor",
        });
      }
      const result = await appointmentModel.getAppointmentsByDoctor(parsedId);
      if (!result.success) {
        return res
          .status(400)
          .json({ success: false, message: result.message });
      }
      return res.status(200).json({ success: true, appointments: result.data });
    } catch (error) {
      console.log("Error in appointment controller", error);
      return res.status(500).json({
        success: false,
        message: "Error in fetching the appointments",
      });
    }
  }
);
router.post(
  "/",
  validateUser,
  async (req: Request, res: Response): Promise<any> => {
    try {
      const {
        doctor_id,
        patient_id,
        doctor_slot_id,
        appointment_date,
        type,
        status,
      } = req.body;
      if (
        !(doctor_id || patient_id || doctor_slot_id || appointment_date || type)
      ) {
        return res
          .status(400)
          .json({ success: false, message: "Fields can not be empty" });
      }
      const response = await appointmentModel.bookAppointment({
        doctor_id,
        patient_id,
        doctor_slot_id,
        appointment_date,
        type,
        status,
      });
      if (!response.success) {
        return res
          .status(400)
          .json({ success: false, message: response.message });
      }
      return res.status(200).json({ success: true, data: response.data });
    } catch (error) {
      console.log("Error in appointment controller", error);
      return res
        .status(500)
        .json({ success: false, message: "Error in booking the appointment" });
    }
  }
);
router.put(
  "/:appointment_id",
  validateUser,
  //@ts-ignore
  validateAdmin,
  async (req: Request, res: Response): Promise<any> => {
    try {
      const { appointment_id } = req.params;
      const {
        status,
        patientEmail,
        patientName,
        appointmentDate,
        doctor_id,
        slot_id,
      } = req.body;
      const parsedAppointmentId = parseInt(appointment_id);
      const parsedDoctorId = parseInt(doctor_id);
      const parsedSlotId = parseInt(slot_id);
      if (
        (parsedAppointmentId == null ||
          parsedAppointmentId == undefined ||
          isNaN(parsedAppointmentId)) &&
        (parsedDoctorId == null ||
          parsedDoctorId == undefined ||
          isNaN(parsedDoctorId)) &&
        (parsedSlotId == null ||
          parsedSlotId == undefined ||
          isNaN(parsedSlotId))
      ) {
        return res
          .status(404)
          .json({ success: false, message: "No such appointment exist" });
      }
      const response = await appointmentModel.updateAppointment(
        parsedAppointmentId,
        parsedDoctorId,
        parsedSlotId,
        status
      );
      if (!response.success) {
        return res.status(400).json({
          success: false,
          message: "Error in updating your appointment",
        });
      }
      if (!(patientEmail || patientName || appointmentDate || status)) {
        throw new Error("Email inputs are empty");
      }
      console.log(patientEmail, patientName, appointmentDate, status);
      await emailService(patientEmail, patientName, appointmentDate, status);
      return res
        .status(200)
        .json({ success: true, updatedValue: response.data });
    } catch (error) {
      console.log("Error in updating appointment controller", error);
      return res
        .status(500)
        .json({ success: false, message: "Error in updating the appointment" });
    }
  }
);
router.delete(
  "/:id/:slot_id",
  //@ts-ignore
  async (req: Request, res: Response): Promise<any> => {
    try {
      const { id, slot_id } = req.params;
      const parsedId = parseInt(id);
      const parsedSlotId = parseInt(slot_id);
      if (parsedId == null || parsedId == undefined || isNaN(parsedId)) {
        return res
          .status(404)
          .json({ success: false, message: "No such appointment exist" });
      }
      if (
        parsedSlotId == null ||
        parsedSlotId == undefined ||
        isNaN(parsedSlotId)
      ) {
        return res
          .status(404)
          .json({ success: false, message: "No such slot exist" });
      }
      const result = await appointmentModel.deleteAppointment(
        parsedId,
        parsedSlotId
      );
      if (!result.success) {
        return res
          .status(400)
          .json({ success: false, message: result.message });
      }
      return res.status(200).json({ success: true, message: result.data });
    } catch (error) {
      console.log("Error in appointment controller", error);
      return res
        .status(500)
        .json({ success: false, message: "Error in deleting the appointment" });
    }
  }
);
export default router;
