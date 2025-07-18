import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Navbar from "@/app/components/Navbar";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Recipe Comic Generator",
  description:
    "For a text input of a recipe, this app generates a vibrant comic which guides the reader on how to make the recipe.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <main className="min-h-screen flex flex-col">
          {/* Background */}
          <div className="absolute inset-0 bg-[url('/app_bg.png')] bg-cover bg-center opacity-70 -z-10" />

          {/* Navbar as a client component */}
          <Navbar />

          {/* Page Content */}
          <div className="flex flex-col flex-grow">{children}</div>
        </main>
      </body>
    </html>
  );
}
