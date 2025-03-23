import express from "express";
import authRoutes from "./controller/authController";
import passport from "./services/passportService";
const router=express.Router();

router.use("/auth",authRoutes);

export default router;