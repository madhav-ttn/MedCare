import pool from "../config/db"
import { Slot } from "../lib/types";

const slotModel={
    createSlots:async(slots:Slot[])=>{
       try {
        const values = slots.map(slot => [
            slot.doctor_id,
            slot.date,
            slot.start_time,
            slot.end_time,
            slot.is_available || true
        ])

        const query = `
            INSERT INTO doctor_slots (doctor_id, date, start_time, end_time, is_available)
            VALUES ${values.map((_, i) => `($${i * 5 + 1}, $${i * 5 + 2}, $${i * 5 + 3}, $${i * 5 + 4}, $${i * 5 + 5})`).join(", ")}
            RETURNING *;
         `;
        const response =await pool.query(query , values.flat())
        return response.rows
       } catch (error) {
        
       }
    },
   getSlotByDoctorId:async(doctor_id:number,date:Date)=>{
      try {
        const result=await pool.query('SELECT * from doctor_slots where doctor_id=$1 and date=$2',[doctor_id,date])
        return {
            success:true,
            data:result.rows
        }
     } catch (error) {
        console.log("Error in slotsModel",error);
        return {
            success:true,
            message:"Error in fetching the slots"
        }
      }
   },
   deleteSlotById:async(slot_id:number,doctor_id:number)=>{
    try {
        const result=await pool.query('DELETE from doctor_slots where id=$1 AND doctor_id=$2',[slot_id,doctor_id])
        return {
            success:true,
            data:result.rows[0]
        }
     } catch (error) {
        console.log("Error in slotsModel",error);
        return {
            success:true,
            message:"Error in deleting the slot"
        }
      }
   }
}

export default slotModel