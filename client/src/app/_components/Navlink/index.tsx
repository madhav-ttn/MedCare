"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTransition } from "react";
import Loader from "../Loader";
import styles from "./index.module.css";
import { NavLinkProps } from "@/lib/types/types";

const NavLink = ({ href, label, handleSidebar }: NavLinkProps) => {
  const [isPending, startTransition] = useTransition();
  const pathname = usePathname();

  return (
    <>
      {isPending && <Loader />}
      <Link
        href={href}
        className={`${styles.navLink} ${
          pathname === href ? styles.active : ""
        }`}
        onClick={(e) => {
          startTransition(() => {});
          if (handleSidebar) handleSidebar();
        }}
      >
        {label}
      </Link>
    </>
  );
};

export default NavLink;
