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

const title = "Professional Event & Media Production Packages | MMS";
const description =
  "From conferences and celebrations to cinematic video production, explore Mosi Media Solutions packages and request a tailored quote directly.";

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: "/packages" },
  openGraph: {
    title,
    description,
    url: "/packages",
    type: "website",
    images: [
      {
        url: "/mms/conference%20hero%20img.png",
        alt: "Conference stage and media production setup by Mosi Media Solutions",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title,
    description,
    images: ["/mms/conference%20hero%20img.png"],
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
            src="/mms/conference%20hero%20img.png"
            alt="Event staging, LED displays and multimedia production by Mosi Media Solutions"
            fill
            sizes="100vw"
            preload
            className={s.heroImage}
          />
          <div className={s.heroContent}>
            <Link href="/" className={s.breadcrumb}>
              ← Mosi Media Solutions
            </Link>
            <p className={s.eyebrow}>Creating Experiences · Capturing Moments · Delivering Excellence</p>
            <h1 id="packages-title" className={styles.heroTitleCompact}>
              Professional Event &amp; Media Production Packages
            </h1>
            <p className={styles.heroLead}>
              From conferences and celebrations to cinematic video production, explore our solutions and let us tailor the right package for your project.
            </p>
            <div className={s.actions}>
              <EnquiryLink className={styles.glassButton} href="#catalogue">
                Browse Packages
              </EnquiryLink>
              <Link
                className={styles.glassButton}
                href="/contact?service=Professional%20Service%20Packages&origin=%2Fpackages#enquiry"
              >
                Discuss Your Project
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
