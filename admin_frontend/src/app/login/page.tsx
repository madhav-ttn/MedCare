import React from "react";
import styles from "./page.module.css";
import { redirect } from "next/navigation";

export default function AdminLogin() {
  const handleLogin = async (formData: FormData) => {
    "use server";
    const email = formData.get("email");
    const password = formData.get("password");

    if (email === "admin@medcare.com" && password === "adminpassword") {
      redirect("/dashboard");
    } else {
      return { error: "Invalid credentials" };
    }
  };

  return (
    <div className={styles.loginContainer}>
      <div className={styles.loginBox}>
        <div className={styles.logoContainer}>
          <img src="/logo.svg" alt="MedCare Logo" className={styles.logo} />
          <h1>MedCare</h1>
        </div>
        <form className={styles.loginForm}>
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
