import express,{Request,Response} from "express";
import doctorModel from "../models/doctorModel";
const router=express.Router();


router.get("/",async(req:Request,res:Response):Promise<any>=>{
    try {
        const result=await doctorModel.getAllDoctors();
        if(!result.success){
            res.status(400).json({success:false,message:result.message});
        }
        return res.status(200).json({success:true,doctors:result.data});    
    } catch (error) {
        console.log("Error in getting all doctors",error);
        return res.status(500).json({message:"Error in getting doctors"});
    }
})

router.get("/:id",async(req:Request,res:Response):Promise<any>=>{
     try {
        const {id}=req.params;
        const parsedId=parseInt(id);
        if(parsedId==null || parsedId== undefined || isNaN(parsedId)){
            return res.status(404).json({success:false,message:"No such doctor exist"});
        }
        const result=await doctorModel.getDoctorById(parsedId);
        if(!result.success){
            return res.status(400).json({success:false,message:result.message});
        }
        return res.status(200).json({success:true,data:result.data});
    } catch (error) {
        console.log("Error in fetching the doctor",error);
        return res.status(500).json({message:"Error in fetching"});
    }
})

router.post("/",async(req:Request,res:Response):Promise<any>=>{
    try {
        const {name,speciality,experience,photo_url,rating,location,gender,disease}=req.body;
        const result=await doctorModel.createOne({name,speciality,experience,photo_url,rating,location,gender,disease});
        if(!result.success){
            return res.status(400).json({success:false,message:result.message});
        }
        return res.status(200).json({success:true,data:result.data});
    } catch (error) {
        console.log("Error in creating the doctor",error);
        return res.status(500).json({message:"Error in creating doctor"}); 
    }
});

router.put("/:id",async(req:Request,res:Response):Promise<any>=>{
    try {
        const {id}=req.params;
        const parsedId=parseInt(id);
        if(parsedId==null || parsedId== undefined || isNaN(parsedId)){
            return res.status(404).json({success:false,message:"No such doctor exist"});
        }
        const result=await doctorModel.updateDoctor(parsedId,req.body);
        if(!result.success){
            return res.status(400).json({success:false,message:result.message});
        }
        return res.status(200).json({success:true,data:result.data});
    } catch (error) {
        console.log("Error in updating the doctor",error);
        return res.status(500).json({message:"Error in updating doctor"}); 
    }
});
export default router;