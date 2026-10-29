import { pageMetadata } from "@/lib/site-metadata";
import Image from "next/image";
import Link from "next/link";
import Navbar from "@/app/components/Navbar";
import Footer from "@/app/components/Footer";
import { EnquiryLink, enquiryLink } from "@/app/components/services/ServiceSections";
import styles from "@/app/components/services/services.module.css";

const description = "Explore cold sparks, low-lying cloud effects and immersive event experiences with Mosi Media Solutions.";
export const metadata = pageMetadata("/services/special-effects", "Special Effects | MMS", description, "/mms/special-effects.jpg.jpeg", "Special effects at an event");

export default function SpecialEffectsPage() {
  return <div className={styles.page}><Navbar /><main id="main-content" tabIndex={-1}>
    <section className={styles.hero}>
      <Image src="/mms/special-effects.jpg.jpeg" alt="Special effects at an event" fill sizes="100vw" preload className={styles.heroImage} />
      <div className={styles.heroContent}>
        <Link href="/services" className={styles.breadcrumb}>← All services</Link>
        <p className={styles.eyebrow}>Special Effects · Mosi Media Solutions</p>
        <h1>Make the moment memorable.</h1>
        <p>Cold sparks, low-lying cloud effects, digital advertising billboards and immersive 360 booth experiences bring another dimension to your event.</p>
        <div className={styles.actions}><EnquiryLink href={enquiryLink("Special Effects", "/services/special-effects")}>Discuss your event effects</EnquiryLink></div>
      </div>
    </section>
    <section className={styles.section}>
      <p className={styles.eyebrow}>Planned around your venue</p><h2>The right effect for your event.</h2>
      <p className={styles.intro}>Tell us about your occasion, venue and the moments you want to highlight. We will discuss suitable effects, timing and setup with you. Availability, venue approval, safety requirements and the final scope are confirmed in your quotation.</p>
    </section>
  </main><Footer /></div>;
}
