import bcrypt from "bcrypt";
import authModel from "../models/authModel";
import jwt from "jsonwebtoken";
const authService = {
  register: async (name: string, email: string, password: string) => {
    try {
      const response = await authModel.findUserByEmail(email);
      if (response?.success) {
        return {
          success: false,
          message: "User already exists",
        };
      }
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);
      const result = await authModel.createUser(name, email, hashedPassword);
      if (result.success) {
        return {
          success: true,
          message: result.message,
        };
      }
    } catch (error) {
      console.error("Error in creating user", error);
      return {
        success: false,
        message: "Error in creating user",
      };
    }
  },
  login: async (email: string, password: string, role?: string) => {
    try {
      const response = await authModel.findUserByEmail(email, role);
      if (!response?.success) {
        return { success: false, message: "No user Found" };
      }
      const isValidPassword = await bcrypt.compare(
        password,
        response.user.password
      );
      if (!isValidPassword) {
        return { success: false, message: "Invalid Credentials" };
      }
      const jwt_payload = {
        id: response?.user.id,
        email: response?.user.email,
        name: response?.user.name,
        role: response?.user.role,
      };
      const token = jwt.sign(jwt_payload, process.env.JWT_SECRET as string, {
        expiresIn: "1h",
      });
      if (!token) {
        throw new Error("Unable to get jwt token");
      }
      const decodedAdminValue = jwt.decode(token);
      if (role === "admin") {
        return {
          success: true,
          token: token,
          message: "Login Successfull",
          admin: decodedAdminValue,
        };
      } else
        return {
          success: true,
          token: token,
          message: "Login Successfull",
        };
    } catch (error) {
      console.log("Error in auth service", error);
      return {
        success: false,
        message: "Error in login service",
      };
    }
  },
};
export default authService;
