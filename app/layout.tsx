import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

export const dynamic = 'force-dynamic';
export const fetchCache = 'force-no-store';

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Open Lovable",
  description: "Re-imagine any website in seconds with AI-powered website builder.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        {children}
      </body>
    </html>
  );
}
