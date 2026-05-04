import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "HSK Study Companion",
  description: "HSK 6 self-study workspace with teacher-style explanations"
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen">{children}</body>
    </html>
  );
}
