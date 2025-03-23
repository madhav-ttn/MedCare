import express,{Request,Response} from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import {checkExistingUser,addUser} from "../services/userService";
const router=express.Router();


router.post("/login",async(req:Request,res:Response):Promise<any>=>{
    try {
        const {email,password}=req.body;
        if(!(email || password)){
            return res.json({message:"Fields can not be empty"});
        }
        const response=await checkExistingUser(email);
        if(!response?.success){
            return res.status(404).json({message:"No user Found"});
        }
        const isValidPassword=await bcrypt.compare(password,response.user.password);
        if(!isValidPassword){
            return res.status(400).json({message:"Invalid Credentials"});
        }
        const jwt_payload={
            id:response?.user.id,
            email:response?.user.email,
            name:response?.user.name,
            role:response?.user.role,
        }
        const token=jwt.sign(jwt_payload,process.env.JWT_SECRET as string,{expiresIn:'1h'});
        if(!token){
            throw new Error("Unable to get jwt token");
        }
        return res.status(200).json(
            { success: true,
            token: `Bearer ${token}`,
            message:"User Login successfull",
        })        
    } catch (error) {
        console.log("Error in logging the user",error);
        return res.status(400).json({message:"Error in login"});
    }
})

router.post("/register",async(req:Request,res:Response):Promise<any>=>{
     try {
        const {name,email,password}=req.body;
        if(!(name || email || password)){
            return res.status(400).json({message:"Fields can not be empty"});
        }
        const response=await checkExistingUser(email);
        if(response?.success){
            return res.status(400).json({message:"User Already Exists"});
        }
        const salt=await bcrypt.genSalt(10);
        const hashedPassword=await bcrypt.hash(password,salt);

        const result=await addUser(name,email,hashedPassword);

        if(!result.success){
            throw  new Error("Error in logging the user"); 
        }
        return res.status(200).json(
            { 
                success: true,
                message:"User registration successfull",
            }
        )

    } catch (error) {
        console.log("Error in registering the user",error);
        return res.status(400).json({message:"Error in registration"});
    }
})

export default router;