import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import Navbar from "@/app/components/Navbar";
import Footer from "@/app/components/Footer";
import { EnquiryLink } from "@/app/components/services/ServiceSections";
import PackagesCatalogue from "@/app/components/packages/PackagesCatalogue";
import { packageExperiences, packagePath } from "@/lib/packages";
import { siteOrigin } from "@/lib/package-seo";
import s from "@/app/components/services/services.module.css";
import styles from "@/app/components/packages/packages.module.css";

const title = "Professional Service Packages | Conferences, Weddings & Video | MMS";
const description =
  "Explore Conference & Corporate Event Packages, Weddings and Social Events Packages, Video Production Packages and specialised AV services from Mosi Media Solutions.";

export const metadata: Metadata = {
  title,
  description,
  keywords: [
    "conference packages Zimbabwe",
    "corporate event packages Victoria Falls",
    "wedding packages Victoria Falls",
    "video production packages Zimbabwe",
    "drone packages Victoria Falls",
  ],
  alternates: { canonical: "/packages" },
  openGraph: {
    title,
    description,
    url: "/packages",
    type: "website",
    images: [
      {
        url: "/mms/packages/Behind%20the%20Scenes_%20Conference%20Production%20(1).png",
        alt: "Behind the scenes conference production setup by Mosi Media Solutions",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title,
    description,
    images: ["/mms/packages/Behind%20the%20Scenes_%20Conference%20Production%20(1).png"],
  },
};

export default function PackagesPage() {
  const data = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: title,
    description,
    url: new URL("/packages", siteOrigin()).href,
    mainEntity: {
      "@type": "ItemList",
      itemListElement: packageExperiences.map((experience, index) => ({
        "@type": "ListItem",
        position: index + 1,
        name: experience.title,
        url: new URL(packagePath(experience.slug), siteOrigin()).href,
      })),
    },
  };

  return (
    <div className={s.page}>
      <Navbar />
      <main id="main-content" tabIndex={-1}>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(data).replace(/</g, "\\u003c") }}
        />

        {/* Background Hero matching About / Services / Projects */}
        <section className={`${s.hero} ${styles.packageHero}`} aria-labelledby="packages-title">
          <Image
            src="/mms/packages/Behind%20the%20Scenes_%20Conference%20Production%20(1).png"
            alt="Behind the scenes conference production setup by Mosi Media Solutions"
            fill
            sizes="100vw"
            preload
            className={s.heroImage}
          />
          <div className={s.heroContent}>
            <Link href="/" className={s.breadcrumb}>
              ← Mosi Media Solutions
            </Link>
            <p className={s.eyebrow}>Professional Service Packages</p>
            <h1 id="packages-title" className={styles.heroTitleCompact}>
              Creating Experiences. Capturing Moments. Delivering Excellence.
            </h1>
            <p className={styles.heroLead}>
              Discover the right production solution for your event, celebration, brand or project — compare tiers at a glance and explore full inclusions on demand.
            </p>
            <div className={s.actions}>
              <EnquiryLink className={styles.glassButton} href="#conference-packages">
                Explore Packages
              </EnquiryLink>
              <Link
                className={styles.glassButton}
                href="/contact?service=Professional%20Service%20Packages&origin=%2Fpackages#enquiry"
              >
                Request a Custom Quote
              </Link>
            </div>
          </div>
        </section>

        <PackagesCatalogue />
      </main>
      <Footer />
    </div>
  );
}
