import Image from "next/image";
import Link from "next/link";
import { EnquiryLink } from "./ServiceSections";
import styles from "./services.module.css";

export default function WeddingsFeature() {
  return <section aria-labelledby="weddings-feature-title" className={styles.feature}>
    <div data-reveal="left">
      <p className={styles.eyebrow}>For the moments that are yours</p>
      <h3 id="weddings-feature-title">Weddings &amp; Elopements</h3>
      <p>From an intimate exchange of vows to a celebration with everyone you love, make room for the moments you want to remember.</p>
      <p className="mt-4">Talk to MMS about photography and film coverage for preparation, your ceremony, couple portraits and celebration highlights. We shape the coverage around your plans, with options agreed together.</p>
      <div className={styles.actions}><EnquiryLink href="/services/weddings-elopements">Explore weddings &amp; elopements</EnquiryLink></div>
    </div>
    <figure data-reveal="right">
      <Link href="/services/weddings-elopements" className={styles.featureCard} aria-label="Discover Weddings & Elopements coverage">
        <Image src="/mms/wedding%2012.jpg" alt="A couple walking together beside Victoria Falls" fill sizes="(max-width:1023px) 90vw, 40vw" />
        <span>Your people. Your place.<br />Your story.</span>
      </Link>
      <figcaption className={styles.caption}>Wedding inspiration from our image library; shown for illustration.</figcaption>
    </figure>
  </section>;
}
