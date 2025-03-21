import Link from "next/link";
import styles from "./page.module.css";
import Form from "next/form"
import Image from "next/image";
export default function Signup(){
    return(
        <div className={styles.container}>
           <div className={styles.modal}>
             <p className={styles.header}>Sign up</p>
             <span>Already a member?<Link className={styles.link} href={"/login"}>Login.</Link></span>
             <Form action="" className={styles.formContainer}>
                <label htmlFor="name">Name</label>
                <div>
                  <Image src={"/name.svg"} alt="" width={20} height={20} style={{position:"absolute",top:"18px", left:"20px"}}/>
                  <input type="text" id="name" placeholder="Enter your name" required/>
                </div>
                <label htmlFor="email">Email</label>
                <div>
                  <Image src={"/email.svg"} alt="" width={20} height={20} style={{position:"absolute",top:"18px", left:"20px"}}/>
                  <input type="email" id="email" placeholder="Enter your email address" required/>
                </div>
                <label htmlFor="password">Password</label>
                <div>
                  <Image src={"/password.svg"} alt="" width={20} height={20} style={{position:"absolute",top:"18px", left:"20px"}}/>
                  <input type="text" id="password" placeholder="**********" required/>
                  <Image src={"/eye.svg"} alt="" width={20} height={20} style={{position:"absolute",top:"18px", right:"20px"}}/>
                </div>
                <button type="submit">Submit</button>
                <button type="reset">Reset</button>
             </Form>
           </div>
        </div>
    )
}