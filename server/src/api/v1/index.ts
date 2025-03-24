import express from "express";
import slotRoutes from "./controller/slotController";
import appRoutes from "./controller/appointmentController";
import authRoutes from "./controller/authController";
import docRoutes from "./controller/doctorController"
const router=express.Router();

router.use("/auth",authRoutes);
router.use("/doctors",docRoutes);
router.use("/appointments",appRoutes);
router.use("/slots",slotRoutes);

export default router;