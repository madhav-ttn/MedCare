import Link from "next/link";
import styles from "./page.module.css";
import Form from "next/form"
import Image from "next/image";
export default function Login(){
    return(
        <div className={styles.container}>
           <div className={styles.modal}>
             <p className={styles.header}>Login</p>
             <span>Are you a new member?<Link className={styles.link} href={"/signup"}>Sign up here.</Link></span>
             <Form action="" className={styles.formContainer}>
                <label htmlFor="email">Email</label>
                <div>
                  <Image src={"/email.svg"}  alt="email" height={20} width={20} style={{position:"absolute",top:"20px", left:"20px" }}/>
                  <input type="email" id="email" placeholder="abc@gmail.com" required/>
                </div>
                <label htmlFor="password">Password</label>
                <div>
                  <Image src={"/password.svg"} alt="password" height={20} width={20} style={{position:"absolute",top:"16px", left:"20px" }}/>
                  <input type="text" id="password" placeholder="**********" required/>
                  <Image src={"/Eye.svg"} alt="eye" width={20} height={20} style={{position:"absolute",top:"16px", right:"20px", cursor:"pointer" }}/>
                </div>
                <button type="submit">Login</button>
                <button type="reset">Reset</button>
                <p>Forgot Password?</p>
             </Form>
           </div>
        </div>
    )
}