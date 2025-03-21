import type { Metadata } from "next";
import Header from "@/app/_components/Header";
import Footer from "@/app/_components/Footer";
import { Montserrat } from 'next/font/google';
import "./globals.css";
import Providers from "./providers";
import { getSession } from "../lib/auth";


const montserrat = Montserrat({
  variable: "--font-montserrat",
  weight: ['300', '400', '500', '700'],
  subsets: ['latin'],
  display:'swap',
  fallback: ['Arial', 'sans-serif'],
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
  const session = await getSession()
  return (
    <html lang="en">
      <body className={montserrat.className}>
        <Providers session={session}>
          <Header/>
            {children}
          <Footer/>
        </Providers>
      </body>
    </html>
  );
}
