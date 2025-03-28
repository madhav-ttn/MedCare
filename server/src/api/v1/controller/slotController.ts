import express, { Request, Response } from "express";
import slotService from "../services/slotService";
import slotModel from "../models/slotModel";
const router = express.Router();

router.get("/:id/:date", async (req: Request, res: Response): Promise<any> => {
  try {
    const { id, date } = req.params;
    const parsedId = parseInt(id);

    console.log("parsedDate", date);
    console.log("parsedId", id);

    if (parsedId == null || parsedId == undefined || isNaN(parsedId) || !date) {
      return res
        .status(404)
        .json({ success: false, message: "No such slot exist" });
    }

    const result = await slotModel.getSlotByDoctorId(parsedId, date);

    if (!result.success) {
      return res
        .status(404)
        .json({ success: false, message: "No such slot exist" });
    }
    return res.status(200).json({ success: true, data: result.data });
  } catch (error) {
    console.log("Error in getting", error);
    return res
      .status(500)
      .json({ success: false, message: "Error in getting slots" });
  }
});

router.post("/register", async (req: Request, res: Response): Promise<any> => {
  try {
    const { doctor_id, date } = req.body;
    const response = await slotService.registerSlots(doctor_id, date);
    if (!response.success) {
      return res
        .status(400)
        .json({ success: false, message: "Error in  registering slot" });
    }
    return res.status(200).json({ success: true, data: response.data });
  } catch (error) {
    console.log("Error in slot registration", error);
    return res
      .status(500)
      .json({ success: false, message: "Error in slot registraion" });
  }
});

router.delete("/", async (req: Request, res: Response): Promise<any> => {
  try {
    const { doctor_id, slot_id } = req.body;
    const response = await slotModel.deleteSlotById(doctor_id, slot_id);
    if (!response.success) {
      return res
        .status(400)
        .json({ success: false, message: "Error in  deleting slot" });
    }
    return res.status(200).json({ success: true, data: response.data });
  } catch (error) {
    console.log("Error in slot registration", error);
    return res
      .status(500)
      .json({ success: false, message: "Error in deleting slot " });
  }
});

export default router;
