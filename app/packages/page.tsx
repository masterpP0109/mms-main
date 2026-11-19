import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, MessageCircle } from "lucide-react";
import Navbar from "@/app/components/Navbar";
import Footer from "@/app/components/Footer";
import { packageExperiences, packagePath } from "@/lib/packages";
import { siteOrigin } from "@/lib/package-seo";
import { BUILDER_WHATSAPP_NUMBER } from "@/lib/project-brief";
import { contentSlug, services as standaloneCatalogue } from "@/lib/services";
import s from "@/app/components/services/services.module.css";
import styles from "@/app/components/packages/packages.module.css";

const title = "Services & Packages | Conferences, Weddings, Video, Drone & Podcasts | MMS";
const description =
  "Explore all Mosi Media Solutions service and package categories — conferences, weddings and social events, video production, drone services, podcasts and standalone AV solutions.";

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

const individualServiceCards = [
  ...standaloneCatalogue.map(item => ({
    title: item.title,
    tag: item.tag,
    desc: item.desc,
    image: item.image,
    href: `/services/${contentSlug(item.title)}`,
  })),
  {
    title: "Special Effects",
    tag: "Event Enhancements",
    desc: "Cold sparks, low-lying cloud effects, digital advertising displays and immersive 360 booth experiences.",
    image: "/mms/special-effects.jpg.jpeg",
    href: "/services/special-effects",
  },
];

const whatsappUrl = `https://wa.me/${BUILDER_WHATSAPP_NUMBER}?text=${encodeURIComponent(
  "Hello Mosi Media Solutions, I explored your services and packages and would like to discuss a project.",
)}`;

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
        name: experience.hubTitle ?? experience.title,
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

        {/* 1. Compact Background Hero */}
        <section className={`${s.hero} ${styles.packageHero} ${styles.hubHero}`} aria-labelledby="packages-title">
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
            <p className={s.eyebrow}>Services &amp; Packages</p>
            <h1 id="packages-title" className={styles.heroTitleCompact}>
              Explore Our Services &amp; Packages
            </h1>
            <p className={styles.heroLead}>
              From conferences and celebrations to professional media production, explore what we offer and find the right solution for your project.
            </p>
            <div className={s.actions}>
              <a className={styles.glassButton} href="#package-categories">
                <span>Explore Services</span>
                <ArrowRight size={16} aria-hidden="true" />
              </a>
            </div>
          </div>
        </section>

        {/* 2. All Five Package Categories Immediately */}
        <section id="package-categories" className={styles.hubSection} aria-labelledby="categories-title">
          <div className={styles.hubHeader}>
            <p className={styles.eyebrow}>Package Categories</p>
            <h2 id="categories-title">Find What You Need</h2>
            <p>
              Select a category below to explore available package tiers, inclusions, optional add-ons and quotation details.
            </p>
          </div>

          <div className={styles.hubGrid}>
            {packageExperiences.map((experience, index) => (
              <Link
                key={experience.slug}
                href={packagePath(experience.slug)}
                className={styles.hubCard}
              >
                <div className={styles.hubCardImage}>
                  <Image
                    src={experience.image}
                    alt={experience.imageAlt}
                    fill
                    sizes="(max-width:639px) 95vw, (max-width:1023px) 46vw, 31vw"
                    style={{ objectPosition: experience.imagePosition }}
                  />
                </div>
                <div className={styles.hubCardBody}>
                  <p className={styles.hubCardMeta}>0{index + 1} · {experience.service}</p>
                  <h3 className={styles.hubCardTitle}>{experience.hubTitle ?? experience.title}</h3>
                  <p className={styles.hubCardText}>{experience.hubSummary ?? experience.tagline}</p>
                  <span className={styles.hubCardAction}>
                    <span>View Packages</span>
                    <ArrowRight size={15} aria-hidden="true" />
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* 3. Individual Standalone Services */}
        <section id="individual-services" className={styles.hubSection} aria-labelledby="individual-services-title">
          <div className={styles.hubHeader}>
            <p className={styles.eyebrow}>Standalone Solutions</p>
            <h2 id="individual-services-title">Explore Individual Services</h2>
            <p>
              Looking for specific equipment, technical production or creative coverage on its own? Browse our standalone services.
            </p>
          </div>

          <div className={styles.hubGrid}>
            {individualServiceCards.map(service => (
              <Link
                key={service.href}
                href={service.href}
                className={styles.hubCard}
              >
                <div className={styles.hubCardImage}>
                  <Image
                    src={service.image}
                    alt={service.title}
                    fill
                    sizes="(max-width:639px) 95vw, (max-width:1023px) 46vw, 31vw"
                  />
                </div>
                <div className={styles.hubCardBody}>
                  <p className={styles.hubCardMeta}>{service.tag}</p>
                  <h3 className={styles.hubCardTitle}>{service.title}</h3>
                  <p className={styles.hubCardText}>{service.desc}</p>
                  <span className={styles.hubCardAction}>
                    <span>Explore Service</span>
                    <ArrowRight size={15} aria-hidden="true" />
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* 4. Bottom Contact Section (after service & package discovery) */}
        <section id="packages-contact" className={styles.hubContactSection} aria-labelledby="packages-contact-title">
          <div className={styles.hubContactCard}>
            <p className={styles.eyebrow}>Mosi Media Solutions · Victoria Falls, Zimbabwe</p>
            <h2 id="packages-contact-title">Let&apos;s Bring Your Project to Life</h2>
            <p>
              Explored our services? Tell us what you have in mind, and our team will help you find the right solution.
            </p>
            <div className={styles.hubContactActions}>
              <Link
                href="/contact?service=Professional%20Service%20Packages&origin=%2Fpackages#enquiry"
                className={styles.primaryCta}
                style={{ minHeight: "48px", padding: "0.75rem 1.75rem" }}
              >
                <span>Request a Quote</span>
                <ArrowRight size={16} aria-hidden="true" />
              </Link>
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className={styles.whatsappBtn}
                style={{ minHeight: "48px", padding: "0.75rem 1.45rem" }}
              >
                <MessageCircle size={16} aria-hidden="true" />
                <span>Chat on WhatsApp</span>
              </a>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
