"use client";

import { useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Cookies from "js-cookie";

export default function SuccessComponent() {
  const searchParams = useSearchParams();
  useEffect(() => {
    const token = searchParams.get("token");
    if (!token) {
      return;
    }
    Cookies.set("user", token);
  }, []);
  return (
    <Suspense fallback={<p>Loading...</p>}>
      <h1>Successfull</h1>
    </Suspense>
  );
}
