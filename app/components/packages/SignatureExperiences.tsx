import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { homePackageExperiences, packagePath, type PackageExperience } from "@/lib/packages";
import styles from "./packages.module.css";

const packageCta = (slug: PackageExperience["slug"], label: string) => {
  const href = packagePath(slug);
  return (
    <Link
      href={href}
      className="mms-button inline-flex w-full min-h-[46px] items-center justify-center gap-2 px-4 py-2.5 text-[11px] uppercase tracking-[0.08em] whitespace-nowrap"
    >
      {label}
      <ArrowRight aria-hidden="true" size={16} />
    </Link>
  );
};

export function ExperienceCards({
  variant = "dark",
  items = homePackageExperiences,
}: {
  variant?: "dark" | "light";
  items?: PackageExperience[];
} = {}) {
  return (
    <div data-stagger className={styles.experiences}>
      {items.map((experience, index) => {
        const displayTitle = experience.homeTitle ?? experience.title;
        const displayDesc = experience.homeDescription ?? experience.description;
        const displayCta = experience.homeCta ?? `Explore ${displayTitle}`;
        const cardLabel = experience.homeLabel ?? `0${index + 1} / ${displayTitle}`;

        return (
          <article key={experience.slug} className={`${styles.experienceCard} flex flex-col h-full min-w-0`}>
            <Link
              href={packagePath(experience.slug)}
              className={styles.experienceImage}
              aria-label={`View ${displayTitle.toLowerCase()}`}
            >
              <Image
                src={experience.image}
                alt={experience.imageAlt}
                fill
                sizes="(max-width:639px) 90vw, (max-width:1023px) 45vw, 30vw"
                style={{ objectPosition: experience.imagePosition }}
              />
              <span className={styles.cardNumber} aria-hidden="true">
                {cardLabel}
              </span>
              <div className={styles.cardOverlay}>
                <h3>{displayTitle}</h3>
                <p>{experience.tagline}</p>
                <span className={styles.cardArrow} aria-hidden="true">
                  ↗
                </span>
              </div>
            </Link>
            <p className={variant === "light" ? `${styles.cardDescription} ${styles.cardDescriptionLight}` : styles.cardDescription}>
              {displayDesc}
            </p>
            <div className="mt-auto pt-6 flex w-full">{packageCta(experience.slug, displayCta)}</div>
          </article>
        );
      })}
    </div>
  );
}

export default function SignatureExperiences({ variant = "dark" }: { variant?: "dark" | "light" } = {}) {
  const content = (
    <>
      <div className={styles.signatureHeading} data-reveal>
        <p className={styles.eyebrow}>Professional Service Packages</p>
        <h2 id="signature-title">Creating Experiences. Capturing Moments. Delivering Excellence.</h2>
        <p>
          Choose a starting point for your conference, wedding, social celebration or video production, then explore full inclusions on our packages page.
        </p>
      </div>
      <ExperienceCards variant={variant} />
      <div className={styles.allPackages}>
        <Link href="/packages" className={styles.lightLink}>
          View All Packages <span aria-hidden="true">→</span>
        </Link>
      </div>
    </>
  );

  if (variant === "light") {
    return (
      <section id="signature-experiences" aria-labelledby="signature-title" className={styles.signatureLightBand}>
        <div className={styles.signature}>{content}</div>
      </section>
    );
  }

  return (
    <section id="signature-experiences" aria-labelledby="signature-title" className={styles.signature}>
      {content}
    </section>
  );
}
