"use client";
import Link from "next/link";
import styles from "./page.module.css";
import Form from "next/form";
import Image from "next/image";
import axios from "axios";
import { toast } from "react-toastify";
import { useContext, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import ReqLoader from "../_components/ReqLoader";
import Cookies from "js-cookie";
import { authContext } from "@/context/Auth/authContext";

export default function Login() {
  const emailRef = useRef<HTMLInputElement | null>(null);
  const passwordRef = useRef<HTMLInputElement | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  //@ts-ignore
  const { login, user, token } = useContext(authContext);
  const router = useRouter();

  const handleReset = () => {
    if (emailRef && emailRef.current) emailRef.current.value = "";
    if (passwordRef && passwordRef.current) passwordRef.current.value = "";
  };

  useEffect(() => {
    const token = Cookies.get("token");
    if (token) {
      router.replace("/");
    }
  }, []);

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
      if (!email?.endsWith("@gmail.com") && !email?.endsWith("@tothenew.com")) {
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
        login(token.split(" ")[1], JSON.stringify(res.data.user));
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
            {isLoading ? (
              <div
                style={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <span>Logging</span>
                <ReqLoader />
              </div>
            ) : (
              "Log in"
            )}
          </button>

          <button type="reset" onClick={() => handleReset()}>
            Reset
          </button>
          <p>or</p>
        </Form>
        <button
          className={styles.googleButton}
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
