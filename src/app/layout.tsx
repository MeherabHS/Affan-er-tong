import type { Metadata } from "next";
import BrowserDeterrents from "@/components/security/browser-deterrents";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "Affan er Tong",
    template: "%s | Affan er Tong",
  },
  description:
    "Affan er Tong is a Bangladesh-based debate-learning community making debate education accessible through peer-to-peer learning sessions, case breakdowns, and open adda discussions.",
  keywords: [
    "Debate",
    "Affan er Tong",
    "Bangladesh Debate",
    "Debate Education",
    "Tong Adda",
    "Parliamentary Debate",
  ],
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any" },
      { url: "/icon.png", type: "image/png", sizes: "512x512" },
      { url: "/affan-tong-icon-v2.png", type: "image/png" },
    ],
    apple: [
      { url: "/apple-icon.png", sizes: "180x180", type: "image/png" },
    ],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth">
      <body className="antialiased min-h-screen">
        <BrowserDeterrents />
        {children}
      </body>
    </html>
  );
}
