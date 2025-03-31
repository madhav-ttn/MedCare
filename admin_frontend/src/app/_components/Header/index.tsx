"use client";
import Image from "next/image";
import Link from "next/link";
import styles from "./index.module.css";
import Cookies from "js-cookie";
import { useRouter } from "next/navigation";
import { useContext, useEffect } from "react";
import { LogOutIcon } from "lucide-react";
import axios from "axios";
import { authContext } from "@/context/Auth/authContext";

export default function Header() {
  const { admin, handleAuth } = useContext(authContext);
  const router = useRouter();

  useEffect(() => {
    async function verifyTokenAndGetUser() {
      const token = Cookies.get("user");
      if (!token) {
        handleAuth(null);
        router.replace("/login");
        return;
      }

      try {
        const res = await axios.get(
          `${process.env.NEXT_PUBLIC_BASE_URL}/api/v1/admin/verifyToken`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (res.data.success) {
          handleAuth(res.data.admin);
        } else {
          handleAuth(null);
          Cookies.remove("user");
        }
      } catch (error) {
        console.error("Token verification failed:", error);
        Cookies.remove("user");
        handleAuth(null);
        router.replace("/login");
      }
    }

    verifyTokenAndGetUser();
  }, [handleAuth]);

  const handleLogout = () => {
    handleAuth(null);
    Cookies.remove("user");
    router.refresh();
    router.push("/login");
  };

  return (
    <header className={styles.container}>
      <div className={styles.subcontainer}>
        <div className={styles.titleContainer} onClick={() => router.push("/")}>
          <Image src="/logo.svg" alt="medcare-logo" width={36} height={36} />
          <p className={styles.title}>MedCare</p>
        </div>
      </div>
      <div className={styles.buttonContainer}>
        <Link className={styles.buttons} href={admin ? "/" : "/login"}>
          {admin ? `Hi, ${admin.name as string} ` : `Login`}
          {admin && <LogOutIcon onClick={() => handleLogout()} />}
        </Link>
      </div>
    </header>
  );
}
