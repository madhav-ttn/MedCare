import Image from "next/image"
import Link from "next/link"
import styles from "./index.module.css"
import {MenuRounded} from "@mui/icons-material";
export default function Header(){
    return(
        <header className={styles.container}>
            <div className={styles.subcontainer}>
                <div className={styles.titleContainer}>
                    <Image src="/logo.svg" alt="medcare-logo" width={36} height={36}/>
                    <p className={styles.title}>MedCare</p>
                </div>
                <nav className={styles.navlinks}>
                    <Link href={"/"}>Home</Link>
                    <Link href={"/appointments"}>Appointments</Link>
                    <Link href={"/blogs"}>Health Blog</Link>
                    <Link href={"/reviews"}>Reviews</Link>
                </nav>
            </div>
            <div className={styles.buttonContainer}>
                <Link className={styles.buttons} href={"/login"}>Login</Link>
                <Link className={styles.buttons} href={"/signup"}>Register</Link>
            </div>
        </header>
    )
}