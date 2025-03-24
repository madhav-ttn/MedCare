"use client";
import Link from "next/link";
import styles from "./page.module.css";
import Form from "next/form";
import Image from "next/image";
import axios from "axios";
import { toast } from 'react-toastify';
import { useRef } from "react";
import Cookies from "js-cookie";

export default function Login(){
  const emailRef=useRef<HTMLInputElement | null>(null);
  const passwordRef=useRef<HTMLInputElement | null>(null);

  
  const handleLogin=async()=>{
       try {
          const email=emailRef?.current?.value;
          const password=passwordRef?.current?.value;
          if(!email || !password){
            console.log("Empty Inputs");
            return;
          }
          console.log(`${process.env.NEXT_PUBLIC_BASE_URL}/api/v1/auth/login`);
          const res=await axios.post(`${process.env.NEXT_PUBLIC_BASE_URL}/api/v1/auth/login`,{
            email:email,
            password:password
          })
          const userDetails=res.data;
          if(userDetails){
              Cookies.set("user",JSON.stringify(userDetails),{expires:1});
              toast.success("Login Successfull",{
                position:"top-right"
              })
              if(emailRef && emailRef.current)emailRef.current.value="";
              if(passwordRef && passwordRef.current)passwordRef.current.value="";
          }
       } catch (error) {
           console.log("Error in login",error);
       }
  }
  
  return(
        <div className={styles.container}>
           <div className={styles.modal}>
             <p className={styles.header}>Login</p>
             <span>Are you a new member?<Link className={styles.link} href={"/signup"}>Sign up here.</Link></span>
             <Form action="" className={styles.formContainer}>
                <label htmlFor="email">Email</label>
                <div>
                  <Image src={"/email.svg"}  alt="email" height={20} width={20} style={{position:"absolute",top:"20px", left:"20px" }}/>
                  <input ref={emailRef} type="email" id="email" placeholder="abc@gmail.com" required/>
                </div>
                <label htmlFor="password">Password</label>
                <div>
                  <Image src={"/password.svg"} alt="password" height={20} width={20} style={{position:"absolute",top:"16px", left:"20px" }}/>
                  <input ref={passwordRef} type="text" id="password" placeholder="**********" required/>
                  <Image src={"/Eye.svg"} alt="eye" width={20} height={20} style={{position:"absolute",top:"16px", right:"20px", cursor:"pointer" }}/>
                </div>
                <button type="submit" onClick={()=>handleLogin()}>Login</button>
                <button type="reset">Reset</button>
                <p>Forgot Password?</p>
             </Form>
           </div>
        </div>
    )
}