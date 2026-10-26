import Image from "next/image";
import Link from "next/link";
import Navbar from "@/app/components/Navbar";
import Footer from "@/app/components/Footer";
import { EnquiryLink } from "@/app/components/services/ServiceSections";
import { type PackageExperience } from "@/lib/packages";
import PackageEnquiryForm from "./PackageEnquiryForm";
import PackageChoice from "./PackageChoice";
import { weddingPackages } from "@/lib/wedding-packages";
import s from "../services/services.module.css";
import styles from "./packages.module.css";
import w from "./wedding.module.css";

// ─── Static data ────────────────────────────────────────────────────────────

const services = [
  {
    icon: "📷",
    title: "Wedding Photography",
    text: "Beautifully composed photographs capturing the emotions, details and unforgettable moments of your celebration.",
  },
  {
    icon: "🎬",
    title: "Cinematic Wedding Films",
    text: "From the exchange of vows to the final dance, we transform your special day into a film you can treasure for years.",
  },
  {
    icon: "🚁",
    title: "Aerial Wedding Cinematography",
    text: "Where permitted, breathtaking perspectives that reveal the beauty of your celebration and its extraordinary surroundings.",
  },
];

const processSteps = [
  {
    step: "01",
    title: "Tell Us Your Story",
    text: "Share your wedding date, location, vision and the moments you want remembered.",
  },
  {
    step: "02",
    title: "Shape Your Coverage",
    text: "We help you select the photography and film coverage that fits your celebration.",
  },
  {
    step: "03",
    title: "Celebrate Your Day",
    text: "Our production team captures your important moments with care and creativity.",
  },
  {
    step: "04",
    title: "Relive the Memories",
    text: "Receive your professionally produced wedding memories according to the agreed package and delivery timeline.",
  },
];

const galleryImages = [
  { src: "/mms/wedding 12.jpg",   alt: "Couple walking hand in hand beside Victoria Falls" },
  { src: "/mms/AllanLinda-31.jpg", alt: "Allan & Linda wedding celebration" },
  { src: "/mms/DSC_1257.jpg",     alt: "First dance at a Victoria Falls wedding reception" },
  { src: "/mms/DSC_1258.jpg",     alt: "Exchange of vows at a Victoria Falls ceremony" },
  { src: "/mms/DSC_0477.jpg",     alt: "Bride and groom portrait" },
  { src: "/mms/DSC_1825.jpg",     alt: "Sunset wedding portraits near Victoria Falls" },
];

// ─── Component ───────────────────────────────────────────────────────────────

export default function WeddingPackagePage({
  experience: e,
}: {
  experience: PackageExperience;
}) {
  return (
    <div className={s.page}>
      <Navbar />
      <main>

        {/* ── Section 1: Hero ─────────────────────────────────────────────── */}
        <section
          className={w.hero}
          aria-labelledby="wedding-hero-title"
        >
          <Image
            src="/mms/wedding 12.jpg"
            alt="A couple walking hand in hand toward Victoria Falls on their wedding day"
            fill
            sizes="100vw"
            preload
            className={w.heroImage}
            style={{ objectPosition: "center 45%" }}
          />
          <div className={w.heroOverlay} aria-hidden="true" />
          <div className={w.heroContent}>
            <Link className={s.breadcrumb} href="/packages">
              ← All packages
            </Link>
            <p className={`${s.eyebrow} ${w.heroEyebrow}`}>Wedding Photography &amp; Cinematography</p>
            <h1 id="wedding-hero-title" className={w.heroTitle}>
              Your Forever Begins<br />in Victoria Falls.
            </h1>
            <p className={w.heroSub}>Extraordinary Places. Unforgettable Love Stories.</p>
            <p className={w.heroDesc}>
              Imagine saying &ldquo;I do&rdquo; beside the mighty Zambezi, surrounded by the timeless elegance of
              Victoria Falls, or beneath an endless African sunset. Wherever your love story takes you, we capture
              every meaningful moment through beautiful photography, cinematic films and breathtaking aerial perspectives.
            </p>
            <div className={s.actions}>
              <EnquiryLink href="#wedding-packages">Explore Wedding Packages</EnquiryLink>
              <a href="#wedding-enquiry" className={s.textLink}>Plan Your Wedding Coverage</a>
            </div>
            <p className={s.caption} style={{ marginTop: "2rem" }}>
              Illustrative imagery from our library. Your production is planned around an agreed brief.
            </p>
          </div>
        </section>

        {/* ── Section 2: Packages ──────────────────────────────────────────── */}
        <section id="wedding-packages" className={`${s.section} ${w.packagesSection}`} aria-labelledby="packages-title">
          <span id="package-options" className={w.anchor} aria-hidden="true" />
          <div data-reveal className={w.packagesIntro}>
            <p className={s.eyebrow}>Wedding Packages</p>
            <h2 id="packages-title">Beautiful Places. Extraordinary Beginnings.</h2>
            <p className={s.intro}>
              Every love story deserves a setting as unforgettable as the moment itself. From historic gardens
              to dramatic gorge views and peaceful riverside sunsets, Victoria Falls offers remarkable places to
              begin your next chapter. These are location-inspired photography and film coverage options, not
              venue-inclusive wedding bookings.
            </p>
          </div>
          <div data-stagger className={`${s.grid} ${w.packagesGrid}`}>
            {weddingPackages.map((loc, index) => (
              <article key={loc.id} className={`${styles.optionCard} ${w.packageCard}`}>
                <p className={s.eyebrow}>Package {String(index + 1).padStart(2, "0")}</p>
                <h3>{loc.name}</h3>
                <p className={styles.packageDestName}>{loc.location}</p>
                <p className={styles.packageTagline}>{loc.description}</p>
                <p className={styles.quoteLabel}>Coverage to discuss</p>
                <PackageChoice category="weddings" id={loc.id} name={loc.name} />
              </article>
            ))}
          </div>
          <p className={`${s.caption} ${w.packagesFooter}`}>
            Venue hire, access, permissions, deliverables and prices must be confirmed separately. These are
            location-inspired photography and film coverage options, not venue-inclusive wedding bookings.
          </p>
        </section>

        {/* ── Section 3: Services ──────────────────────────────────────────── */}
        <section className={`${w.servicesSection}`} aria-labelledby="services-title">
          <div className={`${s.section} ${w.servicesInner}`}>
            <div data-reveal className={w.sectionIntro}>
              <p className={s.eyebrow}>Every Moment Tells Your Story</p>
              <h2 id="services-title">Not Just Photographs. The Story of Your Day.</h2>
              <p className={s.intro}>
                The anticipation before the ceremony. The emotion in your vows. The laughter, happy tears and
                quiet moments you never want to forget. We bring these memories together through thoughtful
                photography and beautiful cinematic storytelling.
              </p>
            </div>
            <div data-stagger className={w.servicesGrid}>
              {services.map((svc) => (
                <article key={svc.title} className={w.serviceCard}>
                  <span className={w.serviceIcon} aria-hidden="true">{svc.icon}</span>
                  <h3 className={w.serviceTitle}>{svc.title}</h3>
                  <p className={w.serviceText}>{svc.text}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* Wedding gallery */}
        <section className={`${w.gallerySection}`} aria-labelledby="gallery-title">
          <div className={s.section}>
            <div data-reveal className={w.sectionIntro}>
              <p className={s.eyebrow}>Every Angle. Every Emotion. Every Memory.</p>
              <h2 id="gallery-title">The Beauty of Every Perspective.</h2>
              <p className={s.intro}>
                Your wedding deserves more than a collection of beautiful pictures. Through carefully composed
                photography, cinematic storytelling and aerial perspectives where permitted, we capture the
                atmosphere, emotion and beauty that make your day uniquely yours.
              </p>
            </div>
            <div data-stagger className={w.galleryGrid} aria-label="Wedding photography samples from our library">
              {galleryImages.map((img, i) => (
                <figure
                  key={img.src}
                  className={`${w.galleryItem} ${i === 0 || i === 3 ? w.galleryItemTall : ""}`}
                >
                  <div className={w.galleryImageWrap}>
                    <Image
                      src={img.src}
                      alt={img.alt}
                      fill
                      sizes="(max-width:639px) 90vw, (max-width:1023px) 45vw, 33vw"
                      className={w.galleryImage}
                    />
                  </div>
                  {i === 0 && (
                    <figcaption className={s.caption}>
                      Illustrative images from our library. Shown for visual direction only.
                    </figcaption>
                  )}
                </figure>
              ))}
            </div>
            <div className={w.galleryCta}>
              <Link href="/gallery?cat=Wedding" className={s.textLink}>
                Browse the wedding gallery <span aria-hidden="true">→</span>
              </Link>
            </div>
          </div>
        </section>

        {/* ── Section 6: Process ───────────────────────────────────────────── */}
        <section className={`${s.section} ${w.processSection}`} aria-labelledby="process-title">
          <div data-reveal className={w.sectionIntro}>
            <p className={s.eyebrow}>From Your First Conversation to Your Forever Memories</p>
            <h2 id="process-title">How We Capture Your Story.</h2>
          </div>
          <ol data-stagger className={w.processSteps}>
            {processSteps.map((step) => (
              <li key={step.step} className={w.processStep}>
                <span className={w.processNumber} aria-hidden="true">{step.step}</span>
                <h3 className={w.processTitle}>{step.title}</h3>
                <p className={w.processText}>{step.text}</p>
              </li>
            ))}
          </ol>
        </section>

        {/* ── Section 7: FAQs ──────────────────────────────────────────────── */}
        <section className={`${s.section} ${s.faqLayout}`} aria-labelledby="faq-wedding-title">
          <div data-reveal>
            <p className={s.eyebrow}>A little clarity</p>
            <h2 id="faq-wedding-title">Before you enquire</h2>
          </div>
          <div className={s.faqs}>
            {e.faqs.map((item) => (
              <details key={item.question}>
                <summary>{item.question}</summary>
                <p>{item.answer}</p>
              </details>
            ))}
          </div>
        </section>

        {/* ── Section 7: Enquiry ───────────────────────────────────────────── */}
        <section
          id="package-enquiry"
          className={`${s.section} ${s.split} ${w.enquirySection}`}
          aria-labelledby="enquiry-title"
        >
          <div data-reveal>
            <span id="wedding-enquiry" className={w.anchor} aria-hidden="true" />
            <p className={s.eyebrow}>Your next chapter starts here</p>
            <h2 id="enquiry-title">Your Love Story Deserves to Be Remembered Beautifully.</h2>
            <p>
              Planning your wedding in Victoria Falls? Tell us about your dream celebration, and let&rsquo;s create
              memories you&rsquo;ll treasure for a lifetime.
            </p>
            <p className="mt-4">
              An enquiry is the start of a conversation. Availability, scope, pricing and booking terms need
              confirmation.
            </p>
            <p className="mt-4" style={{ fontSize: ".85rem", color: "#9ca3af", lineHeight: 1.7 }}>
              Venue arrangements and applicable filming permissions are confirmed separately. MMS will discuss access,
              feasibility and any permissions relevant to your chosen setting.
            </p>
            <div className={s.actions}>
              {e.serviceHref && (
                <Link href={e.serviceHref} className={s.textLink}>
                  Read the wedding service guide
                </Link>
              )}
              <Link href="/packages" className={s.textLink}>
                Compare all packages
              </Link>
            </div>
          </div>
          <PackageEnquiryForm
            experience={{
              slug: e.slug,
              service: e.service,
              note: e.note,
              options: e.options.map(({ id, name, location }) => ({ id, name, location })),
            }}
          />
        </section>

      </main>
      <Footer />
    </div>
  );
}
