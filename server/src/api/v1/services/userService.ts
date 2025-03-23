import pool from "../config/db";

export const checkExistingUser=async(email:string)=>{
    try {
        const result=await pool.query('SELECT * from users where email = $1',[email]);
        if(!result.rowCount){
            return {
                success:false,
                message:"User does not exist"
            }
        }
        return {
            success:true,
            user:result.rows[0]
        }
    } catch (error) {
        console.log("Error in checking existing user",error);
    }
}

export const addUser=async(name:string,email:string,password:string,role?:string)=>{
    try {
        await pool.query('INSERT INTO users(name,email,password,role) values($1,$2,$3,$4)',[name,email,password, role || "patient"]);
        return{
            success:true,
            message:"User registered successfully"
        }
    } catch (error) {
        console.log("Error in adding the user",error);
        return{
            success:false,
            message:"Error in registeration of user"
        }
    }
}