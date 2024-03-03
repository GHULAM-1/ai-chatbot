import Head from "next/head"; // Import the Head component

import "regenerator-runtime/runtime";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import "./style.css";
import Nav from "@/components/nav";

const inter = Inter({ subsets: ["latin"] });
export const metadata: Metadata = {
  title: "Talking2AI",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="de" suppressHydrationWarning>
      <body
        className={`${inter.className} bg-[#13252B] flex  justify-start items-center flex-col`}
      >
        <Nav></Nav>

        <div className=" w-full max-w-[768px] ">{children}</div>
      </body>
    </html>
  );
}
