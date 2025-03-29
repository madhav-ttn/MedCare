import express, { Request, Response } from "express";
import jwt from "jsonwebtoken";
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
      return res.status(400).json({ success: false, message: result.message });
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

router.get(
  "/verifyToken",
  async (req: Request, res: Response): Promise<any> => {
    try {
      const headers = req.headers;
      if (!headers || !headers.authorization) {
        return res
          .status(404)
          .json({ success: false, message: "No headers found" });
      }
      const token = headers.authorization.startsWith("Bearer")
        ? headers.authorization?.split(" ")[1]
        : null;
      if (!token) {
        return res
          .status(404)
          .json({ success: false, message: "No token found" });
      }
      const isValidToken = await jwt.verify(
        token,
        process.env.JWT_SECRET || "hellojwt"
      );
      if (!isValidToken) {
        return res
          .status(404)
          .json({ success: false, message: "Invalid token" });
      }
      const decodedValue = await jwt.decode(token);
      return res.status(200).json({ success: true, admin: decodedValue });
    } catch (error) {
      console.log("Error in verifying token", error);
      return res
        .status(500)
        .json({ success: false, message: "Internal Server Error " });
    }
  }
);

export default router;
