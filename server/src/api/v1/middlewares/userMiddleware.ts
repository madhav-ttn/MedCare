import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";

export default async function validateUser(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<any> {
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
      return res.status(404).json({ success: false, message: "Invalid token" });
    }
    const decodedValue = await jwt.decode(token);
    //@ts-ignore
    req.user = decodedValue;
    next();
  } catch (error) {
    console.log("Error in verifying token", error);
    return res
      .status(500)
      .json({ success: false, message: "Internal Server Error " });
  }
}
