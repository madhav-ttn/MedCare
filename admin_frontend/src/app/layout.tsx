import type { Metadata } from "next";
import Footer from "@/app/_components/Footer";
import { Montserrat } from "next/font/google";
import { ToastContainer } from "react-toastify";
import AppointmentProvider from "@/context/appointment/provider";
import DoctorProvider from "@/context/doctor/provider";
import "./globals.css";
import Header from "./_components/Header";

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
        <DoctorProvider>
          <AppointmentProvider>
            <Header />
            {children}
            <Footer />
            <ToastContainer />
          </AppointmentProvider>
        </DoctorProvider>
      </body>
    </html>
  );
}
