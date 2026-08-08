import type { Metadata } from "next";
import { Rajdhani, Inter, JetBrains_Mono } from "next/font/google";
import { NavBar } from "@/components/layout/NavBar";
import "./globals.css";

const display = Rajdhani({
  subsets: ["latin"],
  weight: ["500", "600", "700"],
  variable: "--font-display-raw",
});

const body = Inter({
  subsets: ["latin"],
  variable: "--font-body-raw",
});

const mono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono-raw",
});

export const metadata: Metadata = {
  title: "F1 Strategy Simulator",
  description: "Simulate a Formula 1 race strategy: circuit, driver, weather, tyres and pit stops.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${display.variable} ${body.variable} ${mono.variable}`}>
      <body>
        <NavBar />
        <main className="mx-auto max-w-5xl px-6 py-10">{children}</main>
      </body>
    </html>
  );
}