"use client";
import Image from "next/image";
import styles from "./index.module.css";
import NavLink from "../Navlink";
import RedirectLink from "../RedirectLink";
import Link from "next/link";
import { useContext, useEffect, useState, useRef } from "react";
import Cookies from "js-cookie";
import axios from "axios";
import { useRouter } from "next/navigation";
import { authContext } from "@/context/Auth/authContext";
import { Menu, X } from "lucide-react";

export default function Header() {
  const router = useRouter();
  const { user, handleAuth } = useContext(authContext);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const sidebarRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        sidebarRef.current &&
        !sidebarRef.current.contains(event.target as Node)
      ) {
        setIsSidebarOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [sidebarRef]);

  useEffect(() => {
    function handleResize() {
      if (window.innerWidth > 768) {
        setIsSidebarOpen(false);
      }
    }

    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  useEffect(() => {
    async function verifyTokenAndGetUser() {
      const token = Cookies.get("user");
      if (!token) {
        handleAuth(null);
        // router.replace("/login");
        return;
      }
      try {
        const res: any = await axios.get(
          `${process.env.NEXT_PUBLIC_BASE_URL}/api/v1/admin/verifyToken`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        console.log(res.data);
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
  }, []);

  const handleLogout = () => {
    Cookies.remove("user");
    handleAuth(null);
    router.push("/login");
    setIsSidebarOpen(false);
  };

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const handleSidebar = () => {
    setIsSidebarOpen(false);
  };

  return (
    <header className={styles.container}>
      <div className={styles.subcontainer}>
        <Link href="/" className={styles.titleContainer}>
          <Image src="/logo.svg" alt="medcare-logo" width={36} height={36} />
          <p className={styles.title}>MedCare</p>
        </Link>

        <nav className={styles.desktopNav}>
          <NavLink href={"/"} label="Home" />
          <NavLink href={"/appointments"} label="Appointments" />
          <NavLink href={"/blogs"} label="Health Blog" />
          <NavLink href={"/reviews"} label="Reviews" />
        </nav>
      </div>

      <div className={styles.desktopAuth}>
        {user ? (
          <div className={styles.buttonContainer}>
            <RedirectLink
              href="/profile"
              className="registerButton"
              label={`${user.name}`}
            />
            <button
              className={styles.logoutButton}
              onClick={() => handleLogout()}
            >
              Logout
            </button>
          </div>
        ) : (
          <div className={styles.buttonContainer}>
            <RedirectLink href="/login" className="loginButton" label="Login" />
            <RedirectLink
              href="/signup"
              className="registerButton"
              label="Register"
            />
          </div>
        )}
      </div>

      <button
        className={styles.hamburgerButton}
        onClick={toggleSidebar}
        aria-label="Menu"
      >
        <Menu size={24} />
      </button>

      {isSidebarOpen && (
        <div className={styles.overlay} onClick={() => setIsSidebarOpen(false)}>
          <div
            ref={sidebarRef}
            className={styles.sidebar}
            onClick={(e) => e.stopPropagation()}
          >
            <div className={styles.sidebarHeader}>
              <Link
                href="/"
                className={styles.titleContainer}
                onClick={handleSidebar}
              >
                <Image
                  src="/logo.svg"
                  alt="medcare-logo"
                  width={36}
                  height={36}
                />
                <p className={styles.title}>MedCare</p>
              </Link>
              <button
                className={styles.closeButton}
                onClick={handleSidebar}
                aria-label="Close menu"
              >
                <X size={24} />
              </button>
            </div>

            <nav className={styles.sidebarNav}>
              <NavLink href={"/"} label="Home" handleSidebar={handleSidebar} />
              <NavLink
                href={"/appointments"}
                label="Appointments"
                handleSidebar={handleSidebar}
              />
              <NavLink
                href={"/blogs"}
                label="Health Blog"
                handleSidebar={handleSidebar}
              />
              <NavLink
                href={"/reviews"}
                label="Reviews"
                handleSidebar={handleSidebar}
              />
            </nav>

            <div className={styles.sidebarAuth}>
              {user ? (
                <div className={styles.sidebarButtons}>
                  <RedirectLink
                    href="/profile"
                    className="registerButton"
                    label={`${user.name}`}
                  />
                  <button
                    className={styles.logoutButton}
                    onClick={() => handleLogout()}
                  >
                    Logout
                  </button>
                </div>
              ) : (
                <div className={styles.sidebarButtons}>
                  <RedirectLink
                    href="/login"
                    className="loginButton"
                    label="Login"
                  />
                  <RedirectLink
                    href="/signup"
                    className="registerButton"
                    label="Register"
                  />
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
