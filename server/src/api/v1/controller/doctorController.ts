import express, { Request, Response } from "express";
import doctorModel from "../models/doctorModel";
import { doctorService } from "../services/doctorService";
import validateUser from "../middlewares/userMiddleware";
import validateAdmin from "../middlewares/adminMiddleware";

const router = express.Router();

router.get(
  "/",
  validateUser,
  async (req: Request, res: Response): Promise<any> => {
    try {
      const response = await doctorModel.getAllDoctors();
      if (!response.success) {
        return res
          .status(400)
          .json({ success: false, message: response.message });
      }

      return res.status(200).json({ success: true, doctors: response.data });
    } catch (error) {
      console.log("Error in filtering doctors", error);
      return res
        .status(500)
        .json({ success: false, message: "Error in getting filtered doctors" });
    }
  }
);
router.get(
  "/filter/:currentPage",
  validateUser,
  async (req: Request, res: Response): Promise<any> => {
    try {
      const { currentPage } = req.params;
      let parsedCurrentPage = parseInt(currentPage);
      if (
        parsedCurrentPage === undefined ||
        parsedCurrentPage === null ||
        isNaN(parsedCurrentPage)
      ) {
        parsedCurrentPage = 1;
      }
      const rating = req.query.rating as string;
      const experience = req.query.experience as string;
      const gender = req.query.gender as string;
      const searchQuery = req.query.searchQuery as string;
      console.log("rating", rating);
      console.log("Search Query", searchQuery);
      const response = await doctorService.getFilteredDoctors(
        rating,
        experience,
        gender,
        searchQuery,
        parsedCurrentPage
      );

      if (!response.success) {
        return res
          .status(400)
          .json({ success: false, message: response.message });
      }

      return res.status(200).json({ success: true, doctors: response.data });
    } catch (error) {
      console.log("Error in filtering doctors", error);
      return res
        .status(500)
        .json({ success: false, message: "Error in getting filtered doctors" });
    }
  }
);
router.get(
  "/:currentPage",
  async (req: Request, res: Response): Promise<any> => {
    try {
      const { currentPage } = req.params;
      let parsedCurrentPage = parseInt(currentPage);
      if (
        parsedCurrentPage === undefined ||
        parsedCurrentPage === null ||
        isNaN(parsedCurrentPage)
      ) {
        parsedCurrentPage = 1;
      }
      const result = await doctorModel.getTopDoctors(parsedCurrentPage);
      if (!result.success) {
        return res
          .status(400)
          .json({ success: false, message: result.message });
      }
      return res.status(200).json({ success: true, doctors: result.data });
    } catch (error) {
      console.log("Error in getting all doctors", error);
      return res.status(500).json({ message: "Error in getting doctors" });
    }
  }
);

router.get(
  "/doctorProfile/:id",
  validateUser,
  async (req: Request, res: Response): Promise<any> => {
    try {
      const { id } = req.params;
      const parsedId = parseInt(id);
      if (parsedId == null || parsedId == undefined || isNaN(parsedId)) {
        return res
          .status(404)
          .json({ success: false, message: "No such doctor exist" });
      }
      const result = await doctorModel.getDoctorById(parsedId);
      if (!result.success) {
        return res
          .status(400)
          .json({ success: false, message: result.message });
      }
      return res.status(200).json({ success: true, doctor: result.data });
    } catch (error) {
      console.log("Error in fetching the doctor", error);
      return res.status(500).json({ message: "Error in fetching" });
    }
  }
);

router.post(
  "/",
  validateUser,
  //@ts-ignore
  validateAdmin,
  async (req: Request, res: Response): Promise<any> => {
    try {
      const {
        name,
        speciality,
        experience,
        photo_url,
        rating,
        location,
        gender,
        disease,
      } = req.body.doctor_details;
      const result = await doctorModel.createOne({
        name,
        speciality,
        experience,
        photo_url,
        rating,
        location,
        gender,
        disease,
      });
      if (!result.success) {
        return res
          .status(400)
          .json({ success: false, message: result.message });
      }
      return res.status(200).json({ success: true, data: result.data });
    } catch (error) {
      console.log("Error in creating the doctor", error);
      return res.status(500).json({ message: "Error in creating doctor" });
    }
  }
);

router.post(
  "/search",
  validateUser,
  async (req: Request, res: Response): Promise<any> => {
    try {
      const { doctorQuery } = req.body;
      const searchedDoctors = await doctorService.searchDoctors(doctorQuery);
      // if (!searchedDoctors.success || doctorQuery === "") {
      //   const topDoctors = await doctorService.getTopDoctors();
      //   return res.status(200).json({ success: true, doctors: topDoctors.data });
      // }
      return res
        .status(200)
        .json({ success: true, doctors: searchedDoctors.data });
    } catch (error) {
      console.log("Error in searching  doctors", error);
      return res.status(500).json({ message: "Error in searching  doctors" });
    }
  }
);

router.put(
  "/doctorProfile/:id",
  validateUser,
  async (req: Request, res: Response): Promise<any> => {
    try {
      const { id } = req.params;
      const parsedId = parseInt(id);
      if (parsedId == null || parsedId == undefined || isNaN(parsedId)) {
        return res
          .status(404)
          .json({ success: false, message: "No such doctor exist" });
      }
      const result = await doctorModel.updateDoctor(parsedId, req.body);
      if (!result.success) {
        return res
          .status(400)
          .json({ success: false, message: result.message });
      }
      return res.status(200).json({ success: true, data: result.data });
    } catch (error) {
      console.log("Error in updating the doctor", error);
      return res.status(500).json({ message: "Error in updating doctor" });
    }
  }
);

router.delete(
  "/:id",
  validateUser,
  //@ts-ignore
  validateAdmin,
  async (req: Request, res: Response): Promise<any> => {
    try {
      const { id } = req.params;
      const parsedId = parseInt(id);
      if (parsedId == null || parsedId == undefined || isNaN(parsedId)) {
        return res
          .status(404)
          .json({ success: false, message: "No  doctor found" });
      }
      const result = await doctorModel.deleteOne(parsedId);
      if (!result.success) {
        return res
          .status(400)
          .json({ success: false, message: result.message });
      }
      return res.status(200).json({ success: true, message: result.message });
    } catch (error) {
      console.log("Error in deleting the doctor", error);
      return res
        .status(500)
        .json({ success: false, message: "Internal Server Error" });
    }
  }
);
export default router;
