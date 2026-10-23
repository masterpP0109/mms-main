import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import Navbar from "@/app/components/Navbar";
import Footer from "@/app/components/Footer";
import { EnquiryLink } from "@/app/components/services/ServiceSections";
import { ExperienceCards } from "@/app/components/packages/SignatureExperiences";
import { packageExperiences, packagePath } from "@/lib/packages";
import { siteOrigin } from "@/lib/package-seo";
import s from "@/app/components/services/services.module.css";
import styles from "@/app/components/packages/packages.module.css";

const title = "Signature Packages | Weddings, Drone & Podcasts | MMS";
const description = "Explore wedding, drone and podcast production with Mosi Media Solutions. Find a starting point and discuss a tailored quotation around your vision.";
export const metadata: Metadata = {
  title, description, alternates: { canonical: "/packages" },
  openGraph: { title, description, url: "/packages", type: "website", images: [{ url: "/mms/media-prodction.jpg.jpeg", alt: "Camera and lighting in a production setting" }] },
  twitter: { card: "summary_large_image", title, description, images: ["/mms/media-prodction.jpg.jpeg"] },
};

export default function PackagesPage() {
  const data = { "@context": "https://schema.org", "@type": "CollectionPage", name: title, description,
    url: new URL("/packages", siteOrigin()).href,
    mainEntity: { "@type": "ItemList", itemListElement: packageExperiences.map((experience, index) => ({ "@type": "ListItem", position: index + 1, name: experience.title, url: new URL(packagePath(experience.slug), siteOrigin()).href })) } };
  return <div className={s.page}><Navbar /><main>
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(data).replace(/</g, "\\u003c") }} />
    <section className={`${s.section} ${styles.overviewHero}`} aria-labelledby="packages-title">
      <div><Link href="/" className={s.breadcrumb}>← Mosi Media Solutions</Link><p className={s.eyebrow}>Signature Experiences</p>
        <h1 id="packages-title">Made for Your Moment. Built Around Your Vision.</h1>
        <p>Some stories deserve to be remembered. Others deserve to be seen from a new perspective. And some deserve to be heard.</p>
        <p className="mt-4">Explore photography, film, aerial coverage and podcast production. Find your starting point, then shape the details with MMS.</p>
        <div className={s.actions}><EnquiryLink className={styles.glassButton} href="#experiences">Explore the experiences</EnquiryLink></div>
      </div>
      <figure><div className={styles.overviewVisual}>{packageExperiences.map(experience => <div key={experience.slug}><Image src={experience.image} alt={experience.imageAlt} fill sizes="(max-width:1023px) 45vw, 22vw" preload={experience.slug === "weddings"} /></div>)}</div><figcaption className={`${s.caption} ${styles.overviewCaption}`}>Illustrative images from our library. Every brief is individual.</figcaption></figure>
    </section>
    <section id="experiences" className={s.section} aria-labelledby="experiences-title">
      <div data-reveal><p className={s.eyebrow}>Three ways to tell your story</p><h2 id="experiences-title">Every Moment. Every Perspective. Every Voice.</h2><p className={s.intro}>Choose the experience that speaks to you. Explore approaches, compare options and tell us what you want your production to make possible.</p></div>
      <div className="mt-10"><ExperienceCards /></div>
    </section>
    <section className={`${s.section} ${s.split}`} aria-labelledby="mms-title">
      <div data-reveal><p className={s.eyebrow}>One team. Many ways to tell it.</p><h2 id="mms-title">Media craft, with production in mind.</h2><p>Mosi Media Solutions brings photography, video, audio and event technology together in Victoria Falls. Our conference and corporate production work sits alongside these personal and creative experiences.</p><Link href="/conference-production" className={`${styles.glassButton} mt-4`}>Explore conference production</Link></div>
      <div className={s.note}><h3>A brief before a promise.</h3><p>We begin with your priorities, location and intended use. Scope, crew, deliverables, quotation and booking terms are agreed together. A package preference helps start that conversation.</p><Link href="/projects" className={`${styles.glassButton} mt-4`}>Explore published MMS work</Link></div>
    </section>
    <section className={`${s.section} ${s.closing}`} aria-labelledby="packages-enquiry-title">
      <p className={s.eyebrow}>Let’s make a plan</p><h2 id="packages-enquiry-title">What could we create together?</h2><p>Select a category to send a package enquiry with the right context, or talk to us if your idea crosses more than one experience.</p>
      <div className={s.actions}>{packageExperiences.map(experience => <Link className={styles.glassButton} key={experience.slug} href={`${packagePath(experience.slug)}#package-enquiry`}>Enquire about {experience.title.toLowerCase()}</Link>)}</div>
      <div className={s.actions}><EnquiryLink className={styles.glassButton} href="/contact?service=Signature%20Experiences&origin=%2Fpackages#enquiry">Discuss a combined brief</EnquiryLink></div>
    </section>
  </main><Footer /></div>;
}
