import dotenv from "dotenv";
dotenv.config();
import { Pool } from "pg";

const poolConfig = {
  connectionString: process.env.DATABASE_URL as string,
};

const pool = new Pool(poolConfig);

pool.query("select now()", (err, res) => {
  if (err) {
    console.log(process.env.DATABASE_URL);
    console.log(err);
  } else {
    console.log("connected with database", res.rows[0]);
  }
});
export default pool;
