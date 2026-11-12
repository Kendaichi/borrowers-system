import type { Metadata } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import { SCHOOL } from "@/lib/config";
import "./globals.css";

const jakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

export const metadata: Metadata = {
  title: `${SCHOOL.title} — ${SCHOOL.name}`,
  description: "School property borrowing system for the Office of the Property Custodian.",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={jakarta.variable}>
      <body className="min-h-screen antialiased">{children}</body>
    </html>
  );
}
