import type { Metadata } from "next";
import { Inclusive_Sans, Fraunces } from "next/font/google";
import Sidebar from "@/components/Sidebar";
import QueryProvider from "@/providers/QueryProvider";
import "./globals.css";

const inclusiveSans = Inclusive_Sans({
  variable: "--font-sans",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

const frauncesSerif = Fraunces({
  variable: "--font-serif",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800", "900"],
});

export const metadata: Metadata = {
  title: "ACME Salary Management System",
  description: "Web-based salary management application built for ACME Corp, inspired by Incubyte design system",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${inclusiveSans.variable} ${frauncesSerif.variable} dark`}
      style={{ colorScheme: "dark" }}
    >
      <body className="bg-[#060A1E] text-[#F1F1F2] antialiased min-h-screen flex">
        <QueryProvider>
          <Sidebar />
          <main className="flex-1 pl-64 min-h-screen bg-[#060A1E]">
            {children}
          </main>
        </QueryProvider>
      </body>
    </html>
  );
}
