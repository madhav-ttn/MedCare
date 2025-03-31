"use client";
import Link from "next/link";
import styles from "./page.module.css";
import Form from "next/form";
import Image from "next/image";
import axios from "axios";
import { toast } from "react-toastify";
import { useEffect, useRef, useState } from "react";
import Cookies from "js-cookie";
import { useRouter } from "next/navigation";

export default function Login() {
  const emailRef = useRef<HTMLInputElement | null>(null);
  const passwordRef = useRef<HTMLInputElement | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);

  const router = useRouter();

  useEffect(() => {
    if (Cookies.get("user")) {
      router.replace("/");
    }
  }, []);

  const handleReset = () => {
    if (emailRef && emailRef.current) emailRef.current.value = "";
    if (passwordRef && passwordRef.current) passwordRef.current.value = "";
  };

  const handleLogin = async () => {
    try {
      setIsLoading(true);
      const email = emailRef?.current?.value;
      const password = passwordRef?.current?.value;
      if (!email || !password) {
        toast.error("Input Fields can not be empty");
        setIsLoading(false);
        return;
      }
      if (!email?.endsWith("@gmail.com")) {
        toast.info("Enter valid email");
        return;
      }
      const res: any = await axios.post(
        `${process.env.NEXT_PUBLIC_BASE_URL}/api/v1/auth/login`,
        {
          email: email,
          password: password,
        }
      );
      const token = res.data.token as string;

      if (token.startsWith("Bearer")) {
        Cookies.set("user", token.split(" ")[1], { expires: 1 });
        toast.success("Login Successfull", {
          position: "top-right",
        });
        handleReset();
        router.push("/");
      }
      setIsLoading(false);
    } catch (error) {
      console.log("Error in login", error);
      toast.error("Invalid Credentials", {
        position: "top-right",
      });
      setIsLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.modal}>
        <p className={styles.header}>Login</p>
        <span>
          Are you a new member?
          <Link className={styles.link} href={"/signup"}>
            Sign up here.
          </Link>
        </span>
        <Form action="" className={styles.formContainer}>
          <label htmlFor="email">Email</label>
          <div>
            <Image
              src={"/email.svg"}
              alt="email"
              height={20}
              width={20}
              style={{ position: "absolute", top: "20px", left: "20px" }}
            />
            <input
              ref={emailRef}
              type="email"
              id="email"
              placeholder="abc@gmail.com"
              required
            />
          </div>
          <label htmlFor="password">Password</label>
          <div>
            <Image
              src={"/password.svg"}
              alt="password"
              height={20}
              width={20}
              style={{ position: "absolute", top: "16px", left: "20px" }}
            />
            <input
              ref={passwordRef}
              type={isPasswordVisible ? "text" : "password"}
              id="password"
              placeholder="**********"
              required
            />
            <Image
              src={
                isPasswordVisible
                  ? "/Eye.svg"
                  : "https://img.icons8.com/ios-glyphs/30/hide.png"
              }
              alt="eye"
              width={20}
              height={20}
              onClick={() => {
                setIsPasswordVisible((prev) => !prev);
              }}
              style={{
                color: "#8c8c8c",
                position: "absolute",
                top: "16px",
                right: "20px",
                cursor: "pointer",
              }}
            />
          </div>
          <button type="submit" onClick={() => handleLogin()}>
            {isLoading ? "Logging you in..." : "Log in"}
          </button>
          <button type="reset" onClick={() => handleReset()}>
            Reset
          </button>
          <p>or</p>
        </Form>
        <button
          onClick={() =>
            (window.location.href = `${process.env.NEXT_PUBLIC_BASE_URL}/api/v1/auth/google`)
          }
        >
          Login with Google
        </button>
        <p>Forgot Password?</p>
      </div>
    </div>
  );
}
