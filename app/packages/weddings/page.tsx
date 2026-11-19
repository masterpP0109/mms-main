import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getPackageExperience } from "@/lib/packages";
import { packageStructuredData } from "@/lib/package-seo";
import WeddingPackagePage from "@/app/components/packages/WeddingPackagePage";

const experience = getPackageExperience("weddings");

const title = "Wedding & Social Event Packages | Victoria Falls | MMS";
const description =
  "Explore Wedding, Birthday & Social Event Packages from Mosi Media Solutions — sound, DJ, lighting, photography, film, LED displays and special effects in Victoria Falls.";

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: "/packages/weddings" },
  keywords: [
    "Victoria Falls wedding photography",
    "Victoria Falls wedding videography",
    "destination wedding photographer Victoria Falls",
    "wedding cinematography Zimbabwe",
    "Victoria Falls drone wedding filming",
    "Mosi Media Solutions weddings",
  ],
  openGraph: {
    title,
    description,
    url: "/packages/weddings",
    type: "website",
    images: [
      {
        url: "/mms/wedding%2012.jpg",
        alt: "A couple walking hand in hand beside Victoria Falls",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title,
    description,
    images: ["/mms/wedding%2012.jpg"],
  },
};

export default function WeddingsPackagePage() {
  if (!experience) notFound();
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(packageStructuredData(experience)).replace(
            /</g,
            "\\u003c",
          ),
        }}
      />
      <WeddingPackagePage experience={experience} />
    </>
  );
}
