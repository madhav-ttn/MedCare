import pool from "../config/db";

const authModel = {
  findUserByEmail: async (email: string, role?: string) => {
    try {
      let query = `SELECT * from users where email = $1`;
      if (role !== undefined || role !== null || role !== "") {
        query += ` AND role=$2`;
      }
      const result = await pool.query(query, [email, role]);

      if (!result.rowCount) {
        return {
          success: false,
          message: "User does not exist",
        };
      }
      return {
        success: true,
        user: result.rows[0],
      };
    } catch (error) {
      console.log("Error in checking existing user", error);
    }
  },
  createUser: async (
    name: string,
    email: string,
    password: string,
    role?: string
  ) => {
    try {
      await pool.query(
        "INSERT INTO users(name,email,password,role) values($1,$2,$3,$4)",
        [name, email, password, role || "patient"]
      );
      return {
        success: true,
        message: "User registered successfully",
      };
    } catch (error) {
      console.log("Error in adding the user", error);
      return {
        success: false,
        message: "Error in registeration of user",
      };
    }
  },
};
export default authModel;
