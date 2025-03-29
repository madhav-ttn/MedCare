import express, { Request, Response } from "express";
import authService from "../services/authService";

const router = express.Router();

router.post("/login", async (req: Request, res: Response): Promise<any> => {
  try {
    const { email, password } = req.body;
    if (!(email || password)) {
      return res.status(400).json({ message: "Fields can not be empty" });
    }
    const result = await authService.login(email, password, "admin");
    if (!result.success) {
      return res
        .status(400)
        .json({ success: false, message: "Error in login" });
    }
    return res.status(200).json({
      success: true,
      token: result.token,
      message: "Login Successfull",
    });
  } catch (error) {
    console.log("Error in admin login controller", error);
    return res
      .status(500)
      .json({ success: false, message: "Error in logging the admin" });
  }
});

export default router;
