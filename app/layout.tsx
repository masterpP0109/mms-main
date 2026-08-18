import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "MMS | Conference & Seminar Production Victoria Falls",
  description: "Mosi Media Solutions provides professional conference, seminar and institutional event production for ministries, government agencies, international organisations and professional institutions.",
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
      <body className="min-h-full flex flex-col bg-[#050507] text-[#f3f4f6]">
        {children}
      </body>
    </html>
  );
}

