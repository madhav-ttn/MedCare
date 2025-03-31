import type { Metadata } from "next";
import Header from "@/app/_components/Header";
import Footer from "@/app/_components/Footer";
import { Montserrat } from "next/font/google";
import "./globals.css";
import UserProvider from "@/context/Auth/Provider";
import { ToastContainer } from "react-toastify";

const montserrat = Montserrat({
  variable: "--font-montserrat",
  weight: ["300", "400", "500", "700"],
  subsets: ["latin"],
  display: "swap",
  fallback: ["Arial", "sans-serif"],
});

export const metadata: Metadata = {
  title: "MedCare",
  description: "Health in Your Hands",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={montserrat.className}>
        <UserProvider>
          <Header />
          {children}
          <ToastContainer />
          <Footer />
        </UserProvider>
      </body>
    </html>
  );
}
