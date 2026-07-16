import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "MMS | Cinematic Wedding, Event & Brand Productions",
  description: "MMS creates premium cinematic wedding films, event productions and branded content that turn visitors into leads and sales. We help clients convert attention into bookings with polished creative experiences.",
  keywords: ["luxury wedding films", "corporate event production", "brand storytelling", "lead generation video", "MMS cinematic experiences"],
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

