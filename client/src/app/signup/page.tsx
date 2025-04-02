"use client";
import Link from "next/link";
import styles from "./page.module.css";
import Form from "next/form";
import Image from "next/image";
import axios from "axios";
import { useEffect, useRef, useState } from "react";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";

export default function Signup() {
  const nameRef = useRef<HTMLInputElement | null>(null);
  const emailRef = useRef<HTMLInputElement | null>(null);
  const passwordRef = useRef<HTMLInputElement | null>(null);

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);

  const router = useRouter();

  useEffect(() => {
    if (Cookies.get("token")) {
      router.replace("/");
    }
  }, []);

  const handleReset = () => {
    if (nameRef && nameRef.current) nameRef.current.value = "";
    if (emailRef && emailRef.current) emailRef.current.value = "";
    if (passwordRef && passwordRef.current) passwordRef.current.value = "";
  };

  const handleSignUp = async (e: any) => {
    try {
      e.preventDefault();
      setIsLoading(true);
      const name = nameRef?.current?.value;
      const email = emailRef?.current?.value;
      const password = passwordRef?.current?.value;
      if (!name || !email || !password) {
        toast.error("Input Fields can not be empty");
        setIsLoading(false);
        return;
      }
      if (!email?.endsWith("@gmail.com")) {
        toast.info("Enter valid email");
        return;
      }
      const res: { data: { success: boolean; message: string } } =
        await axios.post(
          `${process.env.NEXT_PUBLIC_BASE_URL}/api/v1/auth/register`,
          {
            name: name,
            email: email,
            password: password,
          }
        );
      const userDetails = res.data;
      if (userDetails.success) {
        handleReset();
        toast.success(userDetails.message);
        router.push("/login");
      }
      setIsLoading(false);
    } catch (error) {
      console.log("Error in signup", error);
      toast.error("Something went wrong", {
        position: "top-right",
      });
      setIsLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.modal}>
        <p className={styles.header}>Sign up</p>
        <span>
          Already a member?
          <Link className={styles.link} href={"/login"}>
            Login.
          </Link>
        </span>
        <Form
          action=""
          onSubmit={handleSignUp}
          className={styles.formContainer}
        >
          <label htmlFor="name">Name</label>
          <div>
            <Image
              src={"/name.svg"}
              alt=""
              width={20}
              height={20}
              style={{ position: "absolute", top: "18px", left: "20px" }}
            />
            <input
              type="text"
              id="name"
              placeholder="Enter your name"
              required
              ref={nameRef}
            />
          </div>
          <label htmlFor="email">Email</label>
          <div>
            <Image
              src={"/email.svg"}
              alt=""
              width={20}
              height={20}
              style={{ position: "absolute", top: "18px", left: "20px" }}
            />
            <input
              type="email"
              id="email"
              placeholder="Enter your email address"
              required
              ref={emailRef}
            />
          </div>
          <label htmlFor="password">Password</label>
          <div>
            <Image
              src={"/password.svg"}
              alt=""
              width={20}
              height={20}
              style={{ position: "absolute", top: "18px", left: "20px" }}
            />
            <input
              type={isPasswordVisible ? "text" : "password"}
              id="password"
              placeholder="**********"
              required
              ref={passwordRef}
            />
            <Image
              src={
                isPasswordVisible
                  ? "/eye.svg"
                  : "https://img.icons8.com/ios-glyphs/30/hide.png"
              }
              onClick={() => setIsPasswordVisible((prev) => !prev)}
              alt=""
              width={20}
              height={20}
              style={{
                position: "absolute",
                top: "18px",
                right: "20px",
                cursor: "pointer",
              }}
            />
          </div>
          <button type="submit">
            {isLoading ? "Signing you up ..." : "Submit"}
          </button>
          <button type="reset">Reset</button>
        </Form>
      </div>
    </div>
  );
}
