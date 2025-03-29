import express from "express";
import slotRoutes from "./controller/slotController";
import appRoutes from "./controller/appointmentController";
import authRoutes from "./controller/authController";
import docRoutes from "./controller/doctorController";
import adminController from "./controller/adminController";
import uploadController from "./controller/uploadController";
import upload from "./middlewares/uploadMiddleware";
import emailController from "./controller/emailController";
const router = express.Router();

router.use("/auth", authRoutes);
router.use("/doctors", docRoutes);
router.use("/appointments", appRoutes);
router.use("/slots", slotRoutes);
router.use("/admin", adminController);
router.use("/upload", upload.single("image"), uploadController);
router.use("/email", emailController);

export default router;
