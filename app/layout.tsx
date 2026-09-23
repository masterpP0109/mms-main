import type { Metadata, Viewport } from "next";
import { Poppins, Inter } from "next/font/google";
import "./globals.css";
import MotionProvider from "./components/MotionProvider";
import ScrollEffects from "./components/ScrollEffects";

const poppins = Poppins({
  variable: "--font-poppins",
  display: "swap",
  subsets: ["latin"],
  weight: ["500", "600", "700"],
});

const inter = Inter({
  variable: "--font-body",
  display: "swap",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
});

export const viewport: Viewport = { width: "device-width", initialScale: 1, viewportFit: "cover" };

export const metadata: Metadata = {
  title: "MMS | Conference & Seminar Production Victoria Falls",
  description: "Mosi Media Solutions provides professional conference, seminar and event production for ministries, government agencies, international organisations and professional institutions.",
  keywords: ["conference production Victoria Falls", "seminar production Zimbabwe", "event audiovisual services", "conference live streaming"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className="h-full antialiased dark"
    >
      <body className={`${poppins.variable} ${inter.variable} min-h-full flex flex-col bg-[#050507] text-[#f3f4f6]`}>
        <MotionProvider>
          <ScrollEffects />
          {children}
        </MotionProvider>
      </body>
    </html>
  );
}

