import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Link from "next/link";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Work assistant with Zep",
  description: "Personal assistant that ingests Microsoft Graph data into Zep for chat and validation.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased bg-slate-100`}>
        <header className="border-b bg-white">
          <div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-4">
            <Link href="/" className="text-lg font-semibold text-slate-900">
              Ask&apos;s Work Assistant
            </Link>
            <nav className="flex items-center gap-4 text-sm text-slate-700">
              <Link href="/chat">Chat</Link>
              <Link href="/notes">Manual Note</Link>
              <Link href="/review">Review</Link>
            </nav>
          </div>
        </header>
        {children}
      </body>
    </html>
  );
}
