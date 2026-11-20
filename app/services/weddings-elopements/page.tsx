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
import WeddingPackagePanels from "@/app/components/services/WeddingPackagePanels";
import WeddingStickyNav from "@/app/components/services/WeddingStickyNav";
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
        url: "/mms/mms/weddings/weddin%20and%20elopments/wedding%2012.jpg",
        alt: "A couple walking hand in hand towards Victoria Falls",
      },
    ],
  },
};

const contact = enquiryLink(
  "Weddings & Elopements",
  "/services/weddings-elopements",
);

export default function WeddingsPage() {
  return (
    <div className={`${styles.page} ${styles.wedding} ${wStyles.weddingBrochure}`}>
      <Navbar />
      <main>
        {/* 01 — Spacious Editorial Hero */}
        <section className={wStyles.heroSection} aria-labelledby="wedding-title">
          <div className={wStyles.heroContent}>
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
            <div className={wStyles.heroActions}>
              <EnquiryLink href={contact}>
                Start planning your experience
              </EnquiryLink>
            </div>
          </div>

          <figure className={wStyles.heroMedia}>
            <div className={styles.weddingPortrait}>
              <Image
                src="/mms/mms/weddings/weddin%20and%20elopments/wedding%2012.jpg"
                alt="A couple walking hand in hand towards Victoria Falls"
                fill
                sizes="(max-width:1023px) 90vw, 42vw"
                preload
              />
            </div>
            <figcaption className={styles.caption}>
              Wedding photography beside Victoria Falls by Mosi Media Solutions.
            </figcaption>
          </figure>
        </section>

        {/* Sticky Pill Navigation Ribbon */}
        <WeddingStickyNav enquiryHref={contact} />

        {/* 02 — The Full Introduction */}
        <section className={wStyles.bandBase} aria-labelledby="intro-title">
          <div className={wStyles.bandInner}>
            <div className={wStyles.introLayout}>
              <div className={wStyles.introAside}>
                <p className={styles.eyebrow}>Victoria Falls, Zimbabwe</p>
                <h2 id="intro-title" className={wStyles.introAsideTitle}>
                  Designed for couples who want something beyond the ordinary.
                </h2>
              </div>
              <div className={wStyles.introColumn}>
                <p>
                  Mosi Media Solutions presents an exclusive collection of
                  wedding, elopement and marriage proposal experiences designed
                  for couples who want something beyond the ordinary.
                </p>
                <p>
                  Set against the breathtaking landscapes of Victoria Falls and
                  its surrounding natural wonders, our experiences combine
                  romance, adventure, elegant styling and professional
                  multimedia production to create unforgettable moments.
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
            </div>
          </div>
        </section>

        {/* 1. Our exclusive wedding destinations — Spacious Editorial Rows */}
        <section
          id="destinations"
          className={wStyles.bandStone}
          aria-labelledby="destinations-title"
        >
          <div className={wStyles.bandInner}>
            <div data-reveal className={wStyles.sectionHeader}>
              <p className={styles.eyebrow}>1 · Victoria Falls &amp; Beyond</p>
              <h2 id="destinations-title">Our exclusive wedding destinations</h2>
              <p className={wStyles.sectionIntro}>
                Each destination offers a different atmosphere, allowing couples
                to choose a setting that reflects their personalities and love
                story.
              </p>
            </div>
            <div className={wStyles.destinationRows}>
              {weddingDestinations.map((dest, index) => (
                <article key={dest.name} className={wStyles.destinationRow}>
                  <div className={wStyles.destinationRowTitle}>
                    <span
                      className={wStyles.destinationNumber}
                      aria-hidden="true"
                    >
                      {String(index + 1).padStart(2, "0")}
                    </span>
                    <h3>{dest.name}</h3>
                  </div>
                  <div className={wStyles.destinationRowBody}>
                    <p>{dest.description}</p>
                    <p className={wStyles.destinationPerfectFor}>
                      <strong>Perfect for:</strong> {dest.perfectFor}
                    </p>
                  </div>
                </article>
              ))}
            </div>
            <p className={wStyles.editorialNote}>
              All locations are subject to landowner and relevant authority
              approvals, access arrangements, environmental requirements and
              availability.
            </p>
          </div>
        </section>

        {/* 2. Exclusive wedding packages */}
        <section
          id="wedding-packages"
          className={wStyles.bandBase}
          aria-labelledby="wedding-packages-title"
        >
          <div className={wStyles.bandInner}>
            <div className={wStyles.sectionSplit}>
              <div data-reveal className={wStyles.sectionSplitBody}>
                <p className={styles.eyebrow}>2 · Destination Celebrations</p>
                <h2 id="wedding-packages-title">Exclusive wedding packages</h2>
                <p className={wStyles.sectionIntro}>
                  Our wedding experiences cater to different celebrations, from
                  intimate ceremonies to luxurious destination weddings.
                </p>
              </div>
              <figure className={wStyles.sectionSplitMedia}>
                <div className={wStyles.sectionPhotoFrame}>
                  <Image
                    src="/mms/mms/weddings/weddin%20and%20elopments/untitled-7268.jpg"
                    alt="Outdoor destination wedding ceremony with bride, groom, officiant, floral arch and guests"
                    fill
                    sizes="(max-width:959px) 92vw, 44vw"
                  />
                </div>
                <figcaption className={styles.caption}>
                  Outdoor wedding ceremony captured by Mosi Media Solutions.
                </figcaption>
              </figure>
            </div>
            <WeddingPackagePanels
              sectionId="wedding"
              packages={exclusiveWeddingPackages}
            />
          </div>
        </section>

        {/* 3. Exclusive elopement packages */}
        <section
          id="elopement-packages"
          className={wStyles.bandStone}
          aria-labelledby="elopement-packages-title"
        >
          <div className={wStyles.bandInner}>
            <div className={`${wStyles.sectionSplit} ${wStyles.sectionSplitReverse}`}>
              <div data-reveal className={wStyles.sectionSplitBody}>
                <p className={styles.eyebrow}>3 · Just The Two Of You</p>
                <h2 id="elopement-packages-title">Exclusive elopement packages</h2>
                <p className={wStyles.sectionIntro}>
                  For couples who believe that getting married should be about the
                  two of them, our elopement experiences offer intimate, beautifully
                  curated celebrations. These packages are particularly suitable for
                  international visitors, honeymooners and couples looking for a
                  private wedding experience in Victoria Falls.
                </p>
              </div>
              <figure className={wStyles.sectionSplitMedia}>
                <div className={wStyles.sectionPhotoFrame}>
                  <Image
                    src="/mms/mms/weddings/weddin%20and%20elopments/untitled-7269.jpg"
                    alt="Bride and groom holding hands under white parasols during an intimate ceremony"
                    fill
                    sizes="(max-width:959px) 92vw, 44vw"
                  />
                </div>
                <figcaption className={styles.caption}>
                  Intimate ceremony moments captured by Mosi Media Solutions.
                </figcaption>
              </figure>
            </div>
            <WeddingPackagePanels
              sectionId="elopement"
              packages={exclusiveElopementPackages}
            />
          </div>
        </section>

        {/* 4. Marriage proposal packages */}
        <section
          id="proposal-packages"
          className={wStyles.bandBase}
          aria-labelledby="proposal-packages-title"
        >
          <div className={wStyles.bandInner}>
            <div className={wStyles.sectionSplit}>
              <div data-reveal className={wStyles.sectionSplitBody}>
                <p className={styles.eyebrow}>4 · Make the question unforgettable</p>
                <h2 id="proposal-packages-title">Marriage proposal packages</h2>
                <p className={wStyles.sectionIntro}>
                  A marriage proposal is one of life&apos;s most important moments.
                  Our proposal packages are designed to help you surprise your
                  partner with a beautifully planned, romantic and memorable
                  experience. From a private riverside arrangement to an elaborate
                  surprise proposal, we take care of the details while you focus on
                  asking the most important question.
                </p>
              </div>
              <figure className={wStyles.sectionSplitMedia}>
                <div className={`${wStyles.sectionPhotoFrame} ${wStyles.sectionPhotoPortrait}`}>
                  <Image
                    src="/mms/mms/weddings/weddin%20and%20elopments/IMG_3424.jpg"
                    alt="Couple walking barefoot hand in hand beside the Zambezi River"
                    fill
                    sizes="(max-width:959px) 92vw, 38vw"
                  />
                </div>
                <figcaption className={styles.caption}>
                  Romantic riverside portrait along the Zambezi by Mosi Media Solutions.
                </figcaption>
              </figure>
            </div>
            <WeddingPackagePanels
              sectionId="proposal"
              packages={marriageProposalPackages}
            />
          </div>
        </section>

        {/* 5. Exclusive add-ons and personalised experiences — Service Directory */}
        <section
          id="add-ons"
          className={wStyles.bandStone}
          aria-labelledby="addons-title"
        >
          <div className={wStyles.bandInner}>
            <div data-reveal className={wStyles.sectionHeader}>
              <p className={styles.eyebrow}>5 · Tailored Touches</p>
              <h2 id="addons-title">
                Exclusive add-ons and personalised experiences
              </h2>
              <p className={wStyles.sectionIntro}>
                Couples can customise any wedding, elopement or proposal package
                with additional services to create an even more extraordinary
                celebration.
              </p>
            </div>
            <div className={wStyles.directoryGrid}>
              {featuredWeddingAddons.map((addon) => (
                <div key={addon.title} className={wStyles.directoryItem}>
                  <h3>{addon.title}</h3>
                  <p>{addon.description}</p>
                </div>
              ))}
            </div>
            <div className={wStyles.additionalDirectory}>
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
          </div>
        </section>

        {/* 6. Our signature experience — Numbered 3-Stage Timeline */}
        <section
          id="signature-journey"
          className={wStyles.bandBase}
          aria-labelledby="signature-title"
        >
          <div className={wStyles.bandInner}>
            <div data-reveal className={wStyles.sectionHeader}>
              <p className={styles.eyebrow}>6 · Complete Love Story</p>
              <h2 id="signature-title">
                Our signature experience: From the proposal to the wedding
              </h2>
              <p className={wStyles.sectionIntro}>
                For couples who want to make their entire love story
                extraordinary, Mosi Media Solutions offers a customised journey
                that combines three memorable experiences.
              </p>
            </div>
            <ol className={wStyles.journeyTimeline}>
              {signatureJourneyStages.map((item) => (
                <li key={item.stage} className={wStyles.journeyStep}>
                  <span className={wStyles.journeyStage}>{item.stage}</span>
                  <h3>{item.title}</h3>
                  <p>{item.description}</p>
                </li>
              ))}
            </ol>
            <p className={wStyles.editorialNote}>
              Couples can book each experience separately or request a combined
              proposal-to-wedding package.
            </p>
          </div>
        </section>

        {/* 7. Important package information — Organised Editorial Conditions */}
        <section
          id="package-information"
          className={wStyles.bandStone}
          aria-labelledby="package-info-title"
        >
          <div className={wStyles.bandInner}>
            <div className={wStyles.conditionsLayout}>
              <div data-reveal className={wStyles.conditionsHeader}>
                <p className={styles.eyebrow}>7 · Transparency &amp; Conditions</p>
                <h2 id="package-info-title">Important package information</h2>
                <p className={wStyles.sectionIntro}>
                  To maintain transparency for both local and international
                  clients, the following conditions accompany all packages.
                </p>
              </div>
              <ul className={wStyles.conditionsList}>
                {importantPackageInformation.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        {/* 8. Website booking and enquiry section */}
        <section
          id="enquiry"
          className={wStyles.bandBase}
          aria-labelledby="closing-title"
        >
          <div className={wStyles.closingInner}>
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

              <div className={wStyles.closingActions}>
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
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
