import dotenv from "dotenv";
import express from "express";
import apiRoutes from "./api/index";
import cors from "cors";
import pool from "./api/v1/config/db";
import passport from "passport";
const app = express();
dotenv.config();

app.use(passport.initialize());
app.use(
  cors({
    origin: "*",
  })
);
app.use(express.json());
app.use("/api", apiRoutes);

const port = process.env.PORT || 8001;
app.listen(port, async () => {
  try {
    await pool.connect();
    console.log(`Server is running at port ${port}`);
  } catch (error) {
    console.log("Error connecting to database:", error);
  }
});
