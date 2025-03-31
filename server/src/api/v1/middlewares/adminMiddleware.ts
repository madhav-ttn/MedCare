import { NextFunction, Request, Response } from "express";

export default function validateAdmin(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    //@ts-ignore
    if (!req.user || req.user.role !== "admin") {
      return res.status(401).json({ message: "Unauthorized access" });
    }
    next();
  } catch (error) {
    console.log("Error in validating admin middleware", error);
  }
}
