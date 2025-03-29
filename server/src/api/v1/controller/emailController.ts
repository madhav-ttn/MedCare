import express from "express";
import { sendEmail } from "../config/nodemailer";

const router = express.Router();

router.post("/sendconfirmation", async (req, res) => {
  const { email, patientName, appointmentDate, status } = req.body;

  const emailContent = `
    <h2>Appointment Confirmation</h2>
    <p>Dear ${patientName},</p>
    <p>Your appointment is ${
      status === "declined" ? "not" : ""
    } confirmed for ${appointmentDate}.</p>
    ${status === "declined" && `<p>You can try book another slot</p>`}
    <p>Thank you for choosing our service!</p>
  `;

  try {
    await sendEmail(email, "Appointment Confirmation", emailContent);
    res.json({ message: "Email sent successfully" });
  } catch (error) {
    res.status(500).json({ error: "Failed to send email" });
  }
});

export default router;
