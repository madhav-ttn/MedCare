"use client";
import Link from "next/link";
import { useTransition } from "react";
import PageLoader from "../PageLoader";
import { RedirectLinkProps } from "@/lib/types";

export default function RedirectLink({
  href,
  children,
  className,
}: RedirectLinkProps) {
  const [isPending, startTransition] = useTransition();
  return (
    <>
      {isPending && <PageLoader />}
      <Link
        href={href}
        className={className}
        onClick={(e) => {
          startTransition(() => {});
        }}
      >
        {children}
      </Link>
    </>
  );
}
