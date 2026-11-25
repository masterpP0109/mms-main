import type { Metadata, Viewport } from "next";
import { Poppins, Inter } from "next/font/google";
import Script from "next/script";
import "./globals.css";
import MotionProvider from "./components/MotionProvider";
import ScrollEffects from "./components/ScrollEffects";
import CampaignCapture from "./components/packages/CampaignCapture";

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
  metadataBase: new URL(process.env.SITE_URL || "https://www.mosimediasolutions.com"),
  alternates: { canonical: "/" },
  openGraph: { type: "website", siteName: "Mosi Media Solutions", images: [{ url: "/victoria_falls_banner.png", alt: "Victoria Falls, Zimbabwe — Mosi Media Solutions" }] },
  title: "Conference & Event Management Victoria Falls | Mosi Media Solutions",
  description: "Mosi Media Solutions (MMS) — end-to-end conference organisers, corporate event management, audiovisual production, LED screen hire, simultaneous interpretation equipment and livestreaming in Victoria Falls, Zimbabwe and Southern Africa.",
  keywords: [
    "conference organisers Victoria Falls",
    "event management company Victoria Falls",
    "conference planning services Zimbabwe",
    "corporate event management Zimbabwe",
    "conference production Victoria Falls",
    "conference audiovisual services Zimbabwe",
    "corporate event planners Victoria Falls",
    "conference equipment hire Victoria Falls",
    "professional conference organiser Zimbabwe",
    "conference live streaming Zimbabwe",
    "corporate retreats Victoria Falls",
    "hybrid conference production Zimbabwe",
    "international conference organisers Zimbabwe",
    "LED screen hire Victoria Falls",
    "simultaneous interpretation equipment Zimbabwe",
    "digital podiums Zimbabwe",
    "drone cinematography Victoria Falls",
    "wedding photography Victoria Falls",
  ],
};

const organizationStructuredData = {
  "@context": "https://schema.org",
  "@type": "ProfessionalService",
  name: "Mosi Media Solutions",
  alternateName: "MMS",
  url: "https://www.mosimediasolutions.com",
  description: "End-to-end conference organisers, corporate event management, audiovisual production, LED screen hire, simultaneous interpretation and media production partner in Victoria Falls, Zimbabwe.",
  address: {
    "@type": "PostalAddress",
    addressLocality: "Victoria Falls",
    addressCountry: "ZW",
  },
  areaServed: [
    { "@type": "City", name: "Victoria Falls" },
    { "@type": "City", name: "Harare" },
    { "@type": "City", name: "Bulawayo" },
    { "@type": "Country", name: "Zimbabwe" },
    { "@type": "Country", name: "South Africa" },
    { "@type": "Country", name: "Botswana" },
    { "@type": "Country", name: "Zambia" },
  ],
  serviceType: [
    "Conference Management",
    "Corporate Event Planning",
    "Audiovisual Production",
    "LED Screen Rental",
    "Simultaneous Interpretation Equipment",
    "Live Streaming Production",
    "Drone Photography & Videography",
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      data-scroll-behavior="smooth"
      className="h-full antialiased dark"
    >
      <body className={`${poppins.variable} ${inter.variable} min-h-full flex flex-col bg-[#050507] text-[#f3f4f6]`}>
        <Script
          src="https://www.googletagmanager.com/gtm.js?id=GTM-TG8CP52H"
          strategy="afterInteractive"
        />
        <Script id="google-tag-manager-init" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
          `}
        </Script>
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationStructuredData).replace(/</g, "\\u003c") }} />
        <MotionProvider>
          <ScrollEffects />
          <CampaignCapture />
          {children}
        </MotionProvider>
      </body>
    </html>
  );
}

