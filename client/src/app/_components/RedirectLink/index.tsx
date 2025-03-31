"use client";
import Link from "next/link";
import { useTransition } from "react";
import Loader from "../Loader";
// import "../../global.css";
import { RedirectLinkProps } from "@/lib/types/types";

export default function RedirectLink({
  href,
  label,
  className,
}: RedirectLinkProps) {
  const [isPending, startTransition] = useTransition();
  console.log(className);
  return (
    <>
      {isPending && <Loader />}
      <Link
        href={href}
        className={className}
        onClick={(e) => {
          startTransition(() => {});
        }}
      >
        {label}
      </Link>
    </>
  );
}
