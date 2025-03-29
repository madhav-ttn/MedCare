import { sendEmail } from "../config/nodemailer";

export const emailService = async (
  email: string,
  patientName: string,
  appointmentDate: string,
  status: "declined" | "approved"
) => {
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
    return {
      success: true,
      message: "Email Sent Successfully",
    };
  } catch (error) {
    console.log("Error in sending the mail");
    return { success: false, error: "Failed to send email" };
  }
};
