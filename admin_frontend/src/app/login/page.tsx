"use client";
import React, { FormEvent, useContext } from "react";
import styles from "./page.module.css";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";
import axios from "axios";
import { authContext } from "@/context/Auth/authContext";

export default function AdminLogin() {
  const router = useRouter();

  const { handleAuth } = useContext(authContext);
  const handleLogin = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);
    try {
      const res = await axios.post(
        `${process.env.NEXT_PUBLIC_BASE_URL}/api/v1/admin/login`,
        {
          email: formData.get("email"),
          password: formData.get("password"),
        }
      );
      if (!res.data.success) {
        throw new Error("Error in logging the admin");
      }
      toast.success("Welcome Back");
      Cookies.set("user", res.data.token);
      handleAuth(res.data.admin);
      router.push("/");
    } catch (e) {
      console.log("Error in logging the admin", e);
      toast.error("Something went wrong");
    }
  };

  return (
    <div className={styles.loginContainer}>
      <div className={styles.loginBox}>
        <div className={styles.logoContainer}>
          <img src="/logo.svg" alt="MedCare Logo" className={styles.logo} />
          <h1>MedCare</h1>
        </div>
        <form onSubmit={handleLogin} className={styles.loginForm}>
          <div className={styles.formGroup}>
            <label htmlFor="email" className={styles.label}>
              Email
            </label>
            <input
              type="email"
              name="email"
              required
              className={styles.input}
              placeholder="Enter your email"
            />
          </div>
          <div className={styles.formGroup}>
            <label htmlFor="password" className={styles.label}>
              Password
            </label>
            <input
              type="password"
              name="password"
              required
              className={styles.input}
              placeholder="Enter your password"
            />
          </div>
          <button type="submit" className={styles.loginButton}>
            Login
          </button>
        </form>
      </div>
    </div>
  );
}
