import pool from "../config/db";
import { Doctor } from "../lib/types";

const doctorModel = {
  createOne: async (doctor: Doctor) => {
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
      } = doctor;
      const res = await pool.query(
        "INSERT INTO doctors(name,speciality,experience,photo_url,rating,location,gender,disease) values($1,$2,$3,$4,$5,$6,$7,$8) returning *",
        [
          name,
          speciality,
          experience,
          photo_url,
          rating,
          location,
          gender,
          JSON.stringify(disease),
        ]
      );
      return {
        success: true,
        data: res.rows[0],
      };
    } catch (error) {
      console.log("Error in doctorModel", error);
      return {
        success: false,
        message: "Error in creating doctor",
      };
    }
  },
  getTopDoctors: async (currentPage: number) => {
    try {
      console.log("currPage", currentPage);
      const result = await pool.query(
        `SELECT *, COUNT(*) OVER() AS total_records 
        FROM doctors 
        WHERE rating > 4 
        OFFSET $1 LIMIT $2`,
        [6 * (currentPage - 1), 6]
      );
      return {
        success: true,
        data: result.rows,
      };
    } catch (error) {
      console.log("Error in fetching this doctor", error);
      return {
        success: false,

        message: "Error in fetching doctor's profile",
      };
    }
  },
  getDoctorsByUserQuery: async (doctorQuery: string) => {
    try {
      // if (!doctorQuery) {
      //   const result = await doctorModel.getTopDoctors();
      //   return {
      //     success: true,
      //     data: result.data,
      //   };
      // }

      const result = await pool.query(
        `SELECT * FROM doctors WHERE name ILIKE $1 OR disease @> $2::jsonb`,
        [`%${doctorQuery}%`, JSON.stringify([doctorQuery])]
      );

      return {
        success: true,
        data: result.rows,
      };
    } catch (error) {
      console.error("Error fetching doctor:", error);
      return {
        success: false,
        message: "Error fetching doctor's profile",
      };
    }
  },
  getAllDoctors: async () => {
    try {
      const result = await pool.query("SELECT * from doctors", []);
      return {
        success: true,
        data: result.rows,
      };
    } catch (error) {
      console.log("Error in getAll doctors", error);
      return {
        success: false,
        message: "Error in fetching doctors",
      };
    }
  },
  getDoctorById: async (id: number) => {
    try {
      const result = await pool.query("SELECT * from doctors where id=$1", [
        id,
      ]);
      return {
        success: true,
        data: result.rows[0],
      };
    } catch (error) {
      console.log("Error in fetching this doctor", error);
      return {
        success: false,
        message: "Error in fetching doctor's profile",
      };
    }
  },
  getFilteredDoctors: async (doctorDetails: {
    rating: number | undefined;
    experience: number[] | undefined;
    gender: string | undefined;
    searchQuery: string | undefined;
    parsedCurrentPage: number | undefined;
  }) => {
    try {
      let query =
        "SELECT *,COUNT(*) OVER() AS total_records FROM doctors WHERE 1=1";
      const values: any[] = [];
      let valueIndex = 1;

      if (doctorDetails.rating !== undefined) {
        query += ` AND rating = $${valueIndex}`;
        values.push(doctorDetails.rating);
        valueIndex++;
      }

      if (doctorDetails.experience && doctorDetails.experience.length > 0) {
        if (doctorDetails.experience.length == 1) {
          query += ` AND experience >= $${valueIndex}`;
          values.push(doctorDetails.experience[0]);
          valueIndex++;
        } else if (doctorDetails.experience.length == 2) {
          query += ` AND experience BETWEEN $${valueIndex} AND $${
            valueIndex + 1
          }`;
          values.push(doctorDetails.experience[0]);
          values.push(doctorDetails.experience[1]);
          valueIndex += 2;
        }
      }

      if (doctorDetails.gender && doctorDetails.gender !== "Show All") {
        query += ` AND gender = $${valueIndex}`;
        values.push(doctorDetails.gender);
        valueIndex++;
      }
      console.log(doctorDetails.searchQuery);

      if (doctorDetails.searchQuery) {
        const searchTerm = doctorDetails.searchQuery.toLowerCase();

        query += ` AND (
          LOWER(name) LIKE $${valueIndex} 
          OR LOWER(speciality) LIKE $${valueIndex} 
          OR EXISTS (
            SELECT *
            FROM jsonb_array_elements(disease) AS disease 
            WHERE LOWER(disease::text) LIKE $${valueIndex}
          )
        )`;

        // Use % wildcards for partial matching
        values.push(`%${searchTerm}%`);
        valueIndex++;
      }

      if (doctorDetails.parsedCurrentPage) {
        query += ` limit 6 offset $${valueIndex}`;
        values.push(6 * (doctorDetails.parsedCurrentPage - 1));
        valueIndex++;
      }
      const result = await pool.query(query, values);

      return {
        success: true,
        data: result.rows,
      };
    } catch (error) {
      console.log("Error in fetching filtered doctor", error);
      return {
        success: false,
        message: "Error in fetching filtered doctor's profile",
      };
    }
  },

  updateDoctor: async (id: number, updatedValues: Partial<Doctor>) => {
    try {
      console.log(updatedValues);
      const fields = Object.keys(updatedValues)
        .map((key, index) => `${key} = $${index + 2}`)
        .join(", ");
      const values = Object.values(updatedValues);
      const result = await pool.query(
        `UPDATE doctors SET ${fields} WHERE id = $1 RETURNING *`,
        [id, ...values]
      );
      return {
        success: true,
        data: result.rows[0],
      };
    } catch (error) {
      console.log("Error in fetching this doctor", error);
      return {
        success: false,
        message: "Error in updating doctor's profile",
      };
    }
  },
};

export default doctorModel;
