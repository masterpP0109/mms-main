import Image from "next/image";
import Link from "next/link";
import { packageExperiences, packagePath } from "@/lib/packages";
import styles from "./packages.module.css";

export function ExperienceCards() {
  return <div data-stagger className={styles.experiences}>{packageExperiences.map((experience, index) => <article key={experience.slug} className={styles.experienceCard}>
    <Link href={packagePath(experience.slug)} className={styles.experienceImage} aria-label={`Explore ${experience.title}`}>
      <Image src={experience.image} alt={experience.imageAlt} fill sizes="(max-width:639px) 90vw, (max-width:1023px) 45vw, 30vw" style={{ objectPosition: experience.imagePosition }} />
      <span className={styles.cardNumber} aria-hidden="true">{index === 0 ? "Remember" : index === 1 ? "Discover" : "Connect"}</span>
      <div className={styles.cardOverlay}><h3>{experience.title}</h3><p>{experience.tagline}</p><span className={styles.cardArrow} aria-hidden="true">↗</span></div>
    </Link>
    <p className={styles.cardDescription}>{experience.description}</p>
    <Link href={packagePath(experience.slug)} className={styles.lightLink}>View {experience.title.toLowerCase()} <span aria-hidden="true">→</span></Link>
  </article>)}</div>;
}

export default function SignatureExperiences() {
  return <section id="signature-experiences" aria-labelledby="signature-title" className={styles.signature}>
    <div className={styles.signatureHeading} data-reveal>
      <p className={styles.eyebrow}>Signature Experiences</p>
      <h2 id="signature-title">Every Moment. Every Perspective. Every Voice.</h2>
      <p>Some stories deserve to be remembered. Others deserve to be seen from a new perspective. And some deserve to be heard.</p>
    </div>
    <ExperienceCards />
    <div className={styles.allPackages}><Link href="/packages" className={styles.lightLink}>View All Packages <span aria-hidden="true">→</span></Link></div>
  </section>;
}
