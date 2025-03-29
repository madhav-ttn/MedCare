import express from "express";
import bcrypt from "bcrypt";
import pool from "./api/v1/config/db";

const router = express.Router();

async function seedAdmin({
  name,
  email,
  password,
}: {
  name: string;
  email: string;
  password: string;
}) {
  try {
    const response = await pool.query("SELECT * FROM users where email=$1", [
      email,
    ]);
    if (response.rowCount != 0) {
      console.log("Admin already exists with same email");
      return;
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    await pool.query(
      `INSERT INTO users(name,email,password,role) values($1,$2,$3,$4)`,
      [name, email, hashedPassword, "admin"]
    );
    console.log("Admin seeded successfully");
  } catch (error) {
    console.log("Error in seeding the admin", error);
  }
}

seedAdmin({
  name: "Madhav Setia",
  email: "madhav.workstation@gmail.com",
  password: "helloMadhav",
});
export default router;
