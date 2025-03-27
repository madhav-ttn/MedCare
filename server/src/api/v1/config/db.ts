import dotenv from "dotenv";
dotenv.config();
import pkg from "pg";
const { Pool } = pkg;
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  connectionTimeoutMillis: 1000000000,
});

pool.on("connect", () => {
  console.log("Connected to PostgreSQL database");
});

export default pool;
