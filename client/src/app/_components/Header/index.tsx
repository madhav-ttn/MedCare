"use client";
import Image from "next/image";
import styles from "./index.module.css";
import NavLink from "../Navlink";
import RedirectLink from "../RedirectLink";
import Link from "next/link";
import { useContext, useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { authContext } from "@/context/Auth/authContext";
import { Menu, X } from "lucide-react";
import Cookies from "js-cookie";

export default function Header() {
  const router = useRouter();
  //@ts-ignore
  const { user, token, login, logout } = useContext(authContext);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const sidebarRef = useRef<HTMLDivElement>(null);

  const userData = Cookies.get("user");
  let finalUser = null;
  if (userData) {
    try {
      const decodedUserData = decodeURIComponent(userData);
      console.log("Decoded user data:", decodedUserData);

      const parsedUser = JSON.parse(decodedUserData);

      finalUser =
        typeof parsedUser === "string" ? JSON.parse(parsedUser) : parsedUser;

      console.log("Final user object:", finalUser);
      console.log("Name:", finalUser.name);
      console.log("Role:", finalUser.role);
    } catch (e) {
      console.error("Error parsing user data:", e);
    }
  } else {
    console.log("User data is not available");
  }

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

  // useEffect(() => {
  //   async function verifyTokenAndGetUser() {
  //     const token = Cookies.get("token");
  //     if (!token) {
  //       logout();
  //       router.replace("/login");
  //       return;
  //     }

  //     try {
  //       const res: {
  //         data: { token: string; success: boolean; admin: jwtPayload };
  //       } = await axios.get(
  //         `${process.env.NEXT_PUBLIC_BASE_URL}/api/v1/admin/verifyToken`,
  //         {
  //           headers: {
  //             Authorization: `Bearer ${token}`,
  //           },
  //         }
  //       );

  //       if (res.data.success) {
  //         login(res.data.token.split(" ")[1], res.data.admin);
  //       } else {
  //         console.log("logout");
  //         handleLogout();
  //       }
  //     } catch (error) {
  //       console.error("Token verification failed:", error);
  //       handleLogout();
  //     }
  //   }

  //   verifyTokenAndGetUser();
  // }, []);

  const handleLogout = () => {
    logout();
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
              label={finalUser?.name}
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
              {token ? (
                <div className={styles.sidebarButtons}>
                  <RedirectLink
                    href="/profile"
                    className="registerButton"
                    label={finalUser?.name}
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
