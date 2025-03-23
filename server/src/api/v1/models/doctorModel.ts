import pool from "../config/db";
import { Doctor } from "../lib/types";

const doctorModel={
    createOne:async(doctor:Doctor)=>{
         try {
            const {name,speciality,experience,photo_url,rating,location,gender,disease}=doctor;
            const res=await pool.query("INSERT INTO doctors(name,speciality,experience,photo_url,rating,location,gender,disease) values($1,$2,$3,$4,$5,$6,$7,$8) returning *",[name,speciality,experience,photo_url,rating,location,gender,JSON.stringify(disease)]);
            return {
                success:true,
                data:res.rows[0]
            }
         } catch (error) {
            console.log("Error in doctorModel",error);
            return {
                success:false,
                message:"Error in creating doctor"
            }
         }
    },
    getAllDoctors:async()=>{
         try {
            const result=await pool.query("SELECT * from doctors",[]);
            return {
                success:true,
                data:result.rows
            }
         } catch (error) {
            console.log("Error in getAll doctors",error);
            return {
                success:false,
                message:"Error in fetching doctors"
            }
         }
    },
    getDoctorById:async(id:number)=>{
        try {
           const result=await pool.query("SELECT * from doctors where id=$1",[id]);
           return {
                success:true,
                data:result.rows[0]
           }
        } catch (error) {
            console.log("Error in fetching this doctor",error);
            return {
                success:false,
                message:"Error in fetching doctor's profile"
            }
        }
   },
   updateDoctor:async(id:number,updatedValues:Partial<Doctor>)=>{
    try {
        console.log(updatedValues);
        const fields = Object.keys(updatedValues).map((key, index) => `${key} = $${index + 2}`).join(", ");
        const values = Object.values(updatedValues);    
        const result = await pool.query(`UPDATE doctors SET ${fields} WHERE id = $1 RETURNING *`, [id, ...values]);
        return {
            success:true,
            data:result.rows[0]
        }
    } catch (error) {
        console.log("Error in fetching this doctor",error);
        return {
            success:false,
            message:"Error in updating doctor's profile"
        }
    }
}
}

export default doctorModel;