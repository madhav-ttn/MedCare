import express, { Request, Response } from "express";
import authService from "../services/authService";
const router = express.Router();

router.post("/login", async (req: Request, res: Response): Promise<any> => {
  try {
    const { email, password } = req.body;
    if (!(email || password)) {
      return res.json({ message: "Fields can not be empty" });
    }
    const response = await authService.login(email, password);
    if (!response.success) {
      return res
        .status(400)
        .json({ success: false, message: response.message });
    }
    return res.status(200).json({
      success: true,
      token: `Bearer ${response.token}`,
      message: "User Login successfull",
    });
  } catch (error) {
    console.log("Error in logging the user", error);
    return res.status(400).json({ message: "Error in login" });
  }
});

router.post("/register", async (req: Request, res: Response): Promise<any> => {
  try {
    const { name, email, password } = req.body;
    if (!(name || email || password)) {
      return res.status(400).json({ message: "Fields can not be empty" });
    }
    const response = await authService.register(name, email, password);
    if (!response) throw new Error("Invalid response from authService");
    if (!response.success) {
      return res.status(400).json({ message: response.message });
    }
    return res.status(200).json({
      success: true,
      message: response.message,
    });
  } catch (error) {
    console.log("Error in registering the user", error);
    return res.status(400).json({ message: "Error in registration" });
  }
});

export default router;
