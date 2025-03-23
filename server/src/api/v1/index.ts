import express from "express";
import authRoutes from "./controller/authController";
import docRoutes from "./controller/doctorController"
const router=express.Router();

router.use("/auth",authRoutes);
router.use("/doctors",docRoutes);

export default router;