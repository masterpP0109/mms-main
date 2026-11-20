import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowLeft,
  ArrowRight,
  Check,
  MapPin,
  MessageCircle,
  Sparkles,
} from "lucide-react";
import Navbar from "@/app/components/Navbar";
import Footer from "@/app/components/Footer";
import { EnquiryLink, enquiryLink } from "@/app/components/services/ServiceSections";
import styles from "@/app/components/services/services.module.css";
import wStyles from "@/app/components/services/weddings.module.css";
import {
  additionalWeddingServices,
  exclusiveElopementPackages,
  exclusiveWeddingPackages,
  featuredWeddingAddons,
  importantPackageInformation,
  marriageProposalPackages,
  signatureJourneyStages,
  weddingDestinations,
  type WeddingElopementPackage,
} from "@/lib/weddings-elopements";

const title =
  "Exclusive Wedding, Elopement & Proposal Packages | Victoria Falls | MMS";
const description =
  "Mosi Media Solutions presents exclusive wedding, elopement and marriage proposal experiences in Victoria Falls, Zimbabwe — combining romance, destination styling, photography, film and event production.";

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: "/services/weddings-elopements" },
  openGraph: {
    title,
    description,
    url: "/services/weddings-elopements",
    images: [
      {
        url: "/mms/wedding%2012.jpg",
        alt: "A couple walking hand in hand towards Victoria Falls",
      },
    ],
  },
};

const contact = enquiryLink(
  "Weddings & Elopements",
  "/services/weddings-elopements",
);

const packageEnquiryHref = (packageName: string) =>
  `/contact?${new URLSearchParams({
    service: "Weddings & Elopements",
    origin: "/services/weddings-elopements",
    package: packageName,
  }).toString()}#enquiry`;

function PackageCard({ pkg }: { pkg: WeddingElopementPackage }) {
  return (
    <article
      className={`${wStyles.packageCard} ${
        pkg.badge ? wStyles.packageCardFeatured : ""
      }`}
    >
      <div className={wStyles.packageHeader}>
        <div className={wStyles.packageMeta}>
          <span className={wStyles.packageNumber}>Package {pkg.number}</span>
          {pkg.badge ? (
            <span className={wStyles.packageBadge}>{pkg.badge}</span>
          ) : null}
        </div>
        <h3 className={wStyles.packageTitle}>{pkg.name}</h3>
      </div>

      <div className={wStyles.packagePricing}>
        <div className={wStyles.packagePrice}>{pkg.price}</div>
        <div className={wStyles.packagePriceNote}>{pkg.priceNote}</div>
      </div>

      <p className={wStyles.packageDescription}>{pkg.description}</p>

      <div>
        <h4 className={wStyles.packageSubheading}>Package inclusions</h4>
        <ul className={wStyles.inclusionsList}>
          {pkg.inclusions.map((item) => (
            <li key={item}>
              <Check
                size={15}
                className={wStyles.inclusionIcon}
                aria-hidden="true"
              />
              <span>{item}</span>
            </li>
          ))}
        </ul>
      </div>

      <div className={wStyles.packageFooter}>
        <p className={wStyles.recommendedLocations}>
          <strong>Recommended locations:</strong> {pkg.recommendedLocations}
        </p>
        <Link
          href={packageEnquiryHref(pkg.name)}
          className={wStyles.packageCta}
        >
          <span>Enquire about {pkg.name}</span>
          <ArrowRight size={16} aria-hidden="true" />
        </Link>
      </div>
    </article>
  );
}

export default function WeddingsPage() {
  return (
    <div className={`${styles.page} ${styles.wedding}`}>
      <Navbar />
      <main>
        {/* Hero */}
        <section className={styles.weddingHero} aria-labelledby="wedding-title">
          <div>
            <Link className={styles.breadcrumb} href="/services">
              <ArrowLeft size={16} aria-hidden="true" />
              All services
            </Link>
            <p className={styles.eyebrow}>
              Mosi Media Solutions | Victoria Falls, Zimbabwe
            </p>
            <h1 id="wedding-title">
              Exclusive Wedding, Elopement &amp; Proposal Packages
            </h1>
            <p className={wStyles.heroLead}>
              Where extraordinary love stories meet extraordinary destinations.
            </p>
            <div className={wStyles.heroCopy}>
              <p>
                Mosi Media Solutions presents an exclusive collection of
                wedding, elopement and marriage proposal experiences designed for
                couples who want something beyond the ordinary.
              </p>
              <p>
                Set against the breathtaking landscapes of Victoria Falls and
                its surrounding natural wonders, our experiences combine
                romance, adventure, elegant styling and professional multimedia
                production to create unforgettable moments.
              </p>
              <p>
                Whether you are planning an intimate destination wedding, a
                private elopement, a surprise marriage proposal or a romantic
                celebration with family and friends, we help bring your vision
                to life.
              </p>
              <p>
                Our packages are designed for international visitors,
                destination wedding couples, Zimbabwean residents and local
                travellers looking to celebrate love in a unique and memorable
                way.
              </p>
            </div>
            <div className={styles.actions}>
              <EnquiryLink href={contact}>
                Start planning your experience
              </EnquiryLink>
              <a className={styles.textLink} href="#wedding-packages">
                Wedding packages
              </a>
              <a className={styles.textLink} href="#elopement-packages">
                Elopement packages
              </a>
              <a className={styles.textLink} href="#proposal-packages">
                Proposal packages
              </a>
            </div>
          </div>

          <figure>
            <div className={styles.weddingPortrait}>
              <Image
                src="/mms/wedding%2012.jpg"
                alt="A couple walking hand in hand towards Victoria Falls"
                fill
                sizes="(max-width:1023px) 90vw, 45vw"
                preload
              />
            </div>
            <figcaption className={styles.caption}>
              Wedding inspiration from our image library; shown for
              illustration.
            </figcaption>
          </figure>
        </section>

        {/* 1. Our exclusive wedding destinations */}
        <section
          id="destinations"
          className={`${styles.section} ${wStyles.sectionDivider}`}
          aria-labelledby="destinations-title"
        >
          <div data-reveal>
            <p className={styles.eyebrow}>1 · Victoria Falls &amp; Beyond</p>
            <h2 id="destinations-title">Our exclusive wedding destinations</h2>
            <p className={styles.intro}>
              Each destination offers a different atmosphere, allowing couples
              to choose a setting that reflects their personalities and love
              story.
            </p>
          </div>
          <div data-stagger className={wStyles.destinationGrid}>
            {weddingDestinations.map((dest) => (
              <article key={dest.name} className={wStyles.destinationCard}>
                <h3>{dest.name}</h3>
                <p>{dest.description}</p>
                <p className={wStyles.destinationPerfectFor}>
                  <strong>Perfect for:</strong> {dest.perfectFor}
                </p>
              </article>
            ))}
          </div>
          <p className={wStyles.sectionNote}>
            All locations are subject to landowner and relevant authority
            approvals, access arrangements, environmental requirements and
            availability.
          </p>
        </section>

        {/* 2. Exclusive wedding packages */}
        <section
          id="wedding-packages"
          className={`${styles.section} ${wStyles.sectionDivider}`}
          aria-labelledby="wedding-packages-title"
        >
          <div data-reveal>
            <p className={styles.eyebrow}>2 · Destination Celebrations</p>
            <h2 id="wedding-packages-title">Exclusive wedding packages</h2>
            <p className={styles.intro}>
              Our wedding experiences cater to different celebrations, from
              intimate ceremonies to luxurious destination weddings.
            </p>
          </div>
          <div data-stagger className={wStyles.packagesGrid}>
            {exclusiveWeddingPackages.map((pkg) => (
              <PackageCard key={pkg.number} pkg={pkg} />
            ))}
          </div>
        </section>

        {/* 3. Exclusive elopement packages */}
        <section
          id="elopement-packages"
          className={`${styles.section} ${wStyles.sectionDivider}`}
          aria-labelledby="elopement-packages-title"
        >
          <div data-reveal>
            <p className={styles.eyebrow}>3 · Just The Two Of You</p>
            <h2 id="elopement-packages-title">Exclusive elopement packages</h2>
            <p className={styles.intro}>
              For couples who believe that getting married should be about the
              two of them, our elopement experiences offer intimate, beautifully
              curated celebrations. These packages are particularly suitable for
              international visitors, honeymooners and couples looking for a
              private wedding experience in Victoria Falls.
            </p>
          </div>
          <div data-stagger className={wStyles.packagesGridTwo}>
            {exclusiveElopementPackages.map((pkg) => (
              <PackageCard key={pkg.number} pkg={pkg} />
            ))}
          </div>
        </section>

        {/* 4. Marriage proposal packages */}
        <section
          id="proposal-packages"
          className={`${styles.section} ${wStyles.sectionDivider}`}
          aria-labelledby="proposal-packages-title"
        >
          <div data-reveal>
            <p className={styles.eyebrow}>4 · Make the question unforgettable</p>
            <h2 id="proposal-packages-title">Marriage proposal packages</h2>
            <p className={styles.intro}>
              A marriage proposal is one of life&apos;s most important moments.
              Our proposal packages are designed to help you surprise your
              partner with a beautifully planned, romantic and memorable
              experience. From a private riverside arrangement to an elaborate
              surprise proposal, we take care of the details while you focus on
              asking the most important question.
            </p>
          </div>
          <div data-stagger className={wStyles.packagesGrid}>
            {marriageProposalPackages.map((pkg) => (
              <PackageCard key={pkg.number} pkg={pkg} />
            ))}
          </div>
        </section>

        {/* 5. Exclusive add-ons and personalised experiences */}
        <section
          id="add-ons"
          className={`${styles.section} ${wStyles.sectionDivider}`}
          aria-labelledby="addons-title"
        >
          <div data-reveal>
            <p className={styles.eyebrow}>5 · Tailored Touches</p>
            <h2 id="addons-title">
              Exclusive add-ons and personalised experiences
            </h2>
            <p className={styles.intro}>
              Couples can customise any wedding, elopement or proposal package
              with additional services to create an even more extraordinary
              celebration.
            </p>
          </div>
          <div data-stagger className={wStyles.addonsGrid}>
            {featuredWeddingAddons.map((addon) => (
              <article key={addon.title} className={wStyles.addonCard}>
                <h3>{addon.title}</h3>
                <p>{addon.description}</p>
              </article>
            ))}
          </div>
          <div className={wStyles.additionalBox}>
            <h3>Additional services can include</h3>
            <ul className={wStyles.additionalList}>
              {additionalWeddingServices.map((service) => (
                <li key={service}>
                  <Check
                    size={16}
                    className={wStyles.inclusionIcon}
                    aria-hidden="true"
                  />
                  <span>{service}</span>
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* 6. Our signature experience: From the proposal to the wedding */}
        <section
          id="signature-journey"
          className={`${styles.section} ${wStyles.sectionDivider}`}
          aria-labelledby="signature-title"
        >
          <div data-reveal>
            <p className={styles.eyebrow}>6 · Complete Love Story</p>
            <h2 id="signature-title">
              Our signature experience: From the proposal to the wedding
            </h2>
            <p className={styles.intro}>
              For couples who want to make their entire love story
              extraordinary, Mosi Media Solutions offers a customised journey
              that combines three memorable experiences.
            </p>
          </div>
          <div data-stagger className={wStyles.journeyGrid}>
            {signatureJourneyStages.map((item) => (
              <article key={item.stage} className={wStyles.journeyCard}>
                <span className={wStyles.journeyStage}>{item.stage}</span>
                <h3>{item.title}</h3>
                <p>{item.description}</p>
              </article>
            ))}
          </div>
          <p className={wStyles.sectionNote}>
            Couples can book each experience separately or request a combined
            proposal-to-wedding package.
          </p>
        </section>

        {/* 7. Important package information */}
        <section
          id="package-information"
          className={`${styles.section} ${wStyles.sectionDivider}`}
          aria-labelledby="package-info-title"
        >
          <div data-reveal>
            <p className={styles.eyebrow}>7 · Transparency &amp; Conditions</p>
            <h2 id="package-info-title">Important package information</h2>
            <p className={styles.intro}>
              To maintain transparency for both local and international clients,
              the following conditions accompany all packages.
            </p>
          </div>
          <div className={wStyles.infoBox}>
            <ul className={wStyles.infoList}>
              {importantPackageInformation.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </div>
        </section>

        {/* 8. Website booking and enquiry section */}
        <section
          id="enquiry"
          className={`${styles.section} ${styles.closing}`}
          aria-labelledby="closing-title"
        >
          <div data-reveal>
            <p className={styles.eyebrow}>8 · Start planning your experience</p>
            <h2 id="closing-title">
              Your Love Story Deserves an Extraordinary Setting.
            </h2>
            <p>
              Whether you are planning a destination wedding, dreaming of an
              intimate elopement or preparing to ask the most important question
              of your life, let us create an experience worth remembering.
            </p>
            <p className={wStyles.bookingTagline}>
              Celebrate love. Experience Victoria Falls. Create memories that
              last forever.
            </p>

            <div className={styles.actions}>
              <EnquiryLink href={contact}>
                Start planning your experience
              </EnquiryLink>
              <Link className={styles.textLink} href="/packages/weddings">
                Explore social event &amp; reception packages
                <ArrowRight aria-hidden="true" size={16} />
              </Link>
            </div>

            <div className={wStyles.bookingMeta}>
              <p>
                Contact Mosi Media Solutions for package details, personalised
                quotations and destination arrangements.
              </p>
              <div className={wStyles.bookingMetaRow}>
                <span className={wStyles.bookingMetaLabel}>
                  <MessageCircle size={16} aria-hidden="true" />
                  WhatsApp:
                </span>
                <a
                  href="https://wa.me/263775728397"
                  target="_blank"
                  rel="noopener noreferrer"
                  className={wStyles.bookingMetaLink}
                >
                  +263 77 572 8397
                </a>
              </div>
              <div className={wStyles.bookingMetaRow}>
                <span className={wStyles.bookingMetaLabel}>
                  <MapPin size={16} aria-hidden="true" />
                  Location:
                </span>
                <span>Victoria Falls, Zimbabwe</span>
              </div>
              <div className={wStyles.bookingMetaRow}>
                <span className={wStyles.bookingMetaLabel}>
                  <Sparkles size={16} aria-hidden="true" />
                  Services:
                </span>
                <span>
                  Weddings | Elopements | Proposals | Photography | Videography
                  | Event Experiences
                </span>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
