import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, ArrowRight, Compass, ShieldCheck } from "lucide-react";
import Navbar from "@/app/components/Navbar";
import Footer from "@/app/components/Footer";
import DroneServiceCards, { type DroneServiceItem } from "@/app/components/services/DroneServiceCards";
import { EnquiryLink, enquiryLink, ServiceClosing, ServiceFAQs, ServiceProcess } from "@/app/components/services/ServiceSections";
import styles from "@/app/components/services/services.module.css";

const title = "Drone Services | Aerial Photography, Videography & Drone Solutions | MMS";
const description =
  "Mosi Media Solutions provides professional drone services specialising in aerial photography, videography, visual documentation and commercial aerial operations in accordance with CAAZ regulations.";

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: "/services/drone" },
  openGraph: {
    title,
    description,
    url: "/services/drone",
    images: [{ url: "/victoria_falls_banner.png", alt: "Panoramic aerial view of Victoria Falls" }],
  },
};

const contact = enquiryLink("Drone Services", "/services/drone");

/**
 * Drone page media slots.
 * To add new drone photography, place image files in `public/mms/` (for example `public/mms/drone/...`)
 * and update the `src`, `alt`, and `caption` fields below.
 */
const DRONE_MEDIA = {
  hero: {
    src: "/mms/drone/landscape-photography-15.webp",
    alt: "Expansive aerial panorama across open landscape and waterways",
  },
  overview: {
    src: "/mms/drone/landscape-photography-8.webp",
    alt: "Aerial landscape framing over river and wilderness",
    caption: "Aerial perspectives and commercial operations from our library.",
  },
  servicesShowcase: [
    {
      src: "/mms/drone/68dcd1b8454602a81a36b50c_4-Powerlines-Inspection-3d-option-180-kb-1024x682.jpeg",
      alt: "Aerial survey and industrial infrastructure inspection",
      caption: "Infrastructure & industrial inspection perspective",
    },
    {
      src: "/mms/drone/future-farming-agriculture-drone.avif",
      alt: "Agricultural drone operation and survey across fields",
      caption: "Agricultural & environmental land survey",
    },
    {
      src: "/mms/drone/Untitled-design-3-scaled.webp",
      alt: "Professional aerial drone photography and filming operations",
      caption: "Landscape & destination storytelling",
    },
  ],
  operations: {
    src: "/mms/drone/landscape-photography-15.webp",
    alt: "Expansive aerial panorama across open landscape and waterways",
    caption: "Certified flight operations and on-site mission planning.",
  },
} as const;

const clientSectors = [
  "Corporate Clients",
  "Tourism Operators",
  "Hospitality Establishments",
  "Construction Companies",
  "Real Estate Developers",
  "Agricultural Projects",
  "Event Organisers",
] as const;

const droneServicesList: readonly DroneServiceItem[] = [
  {
    title: "Aerial Photography & Videography",
    detail:
      "High-resolution aerial stills and stabilised video sequences crafted for corporate profiles, editorial campaigns and brand storytelling.",
  },
  {
    title: "Cinematic Drone Filming",
    detail:
      "Smooth tracking shots, dramatic landscape reveals and dynamic aerial movement designed to integrate seamlessly with ground cameras.",
  },
  {
    title: "Corporate & Event Aerial Coverage",
    detail:
      "Establishing venue perspectives and outdoor event atmosphere captured around pre-approved flight corridors and safety zones.",
  },
  {
    title: "Tourism & Hospitality Aerial Marketing",
    detail:
      "Showcase lodges, resorts, wildlife corridors and destination settings to help guests picture the experience before they arrive.",
  },
  {
    title: "Real Estate & Property Aerial Photography",
    detail:
      "Highlight architectural scale, plot boundaries, outdoor amenities and surrounding access routes with clear overhead framing.",
  },
  {
    title: "Construction & Infrastructure Monitoring",
    detail:
      "Consistent aerial progress visuals and elevated site overviews supporting project reporting, milestones and stakeholder updates.",
  },
  {
    title: "Agricultural & Environmental Documentation",
    detail:
      "Broad terrain, land-use, water and conservation imagery supporting environmental assessments and agricultural operations.",
  },
  {
    title: "Aerial Mapping & Photogrammetry",
    detail:
      "Structured aerial capture workflows planned around your brief for site overviews, terrain models and visual mapping outputs.",
  },
  {
    title: "Building & Roof Visual Inspections",
    detail:
      "Targeted close-range visual documentation of roofs, facades and elevated structures without scaffolding or operational disruption.",
  },
  {
    title: "Aerial Promotional & Commercial Productions",
    detail:
      "Campaign-ready aerial visuals tailored for commercials, brand launches, broadcast packages and social media cutdowns.",
  },
  {
    title: "Drone-Based Visual Surveillance",
    detail:
      "Authorised aerial visual observation for large estates, perimeters and planned operational oversight within regulatory limits.",
  },
  {
    title: "Aerial Documentary Production",
    detail:
      "Narrative-led aerial cinematography capturing scale, geography and environmental context for long-form documentary work.",
  },
];

export default function DronePage() {
  return (
    <div className={`${styles.page} ${styles.dronePage}`}>
      <Navbar />
      <main id="main-content" tabIndex={-1}>
        {/* Hero */}
        <section className={styles.hero} aria-labelledby="drone-title">
          <Image
            src={DRONE_MEDIA.hero.src}
            alt={DRONE_MEDIA.hero.alt}
            fill
            sizes="100vw"
            preload
            className={styles.heroImage}
          />
          <div className={styles.heroContent}>
            <Link className={styles.breadcrumb} href="/services">
              <ArrowLeft size={16} aria-hidden="true" />
              All services
            </Link>
            <p className={styles.eyebrow}>Drone Services &amp; Aerial Operations · Mosi Media Solutions</p>
            <h1 id="drone-title">Capturing Perspectives<br />Beyond Boundaries.</h1>
            <p>
              Professional Aerial Photography, Videography &amp; Drone Solutions for corporate clients, tourism,
              real estate, construction, agriculture and live events.
            </p>
            <div className={styles.actions}>
              <EnquiryLink href={contact}>Discuss your aerial shoot</EnquiryLink>
              <Link href="/packages/drone" className={styles.textLink}>Explore drone services</Link>
              <a href="#drone-services-list" className={styles.textLink}>Explore our drone services</a>
            </div>
            <p className={styles.caption}>
              Illustrative aerial imagery from our library. All flights operate under applicable Civil Aviation Authority of Zimbabwe (CAAZ) approvals.
            </p>
          </div>
        </section>

        {/* Split 1: Text on left, Image on right, balanced sector strip across both */}
        <section id="aerial-options" className={`${styles.section} ${styles.split} ${styles.splitCentered}`} aria-labelledby="aerial-overview-title">
          <div data-reveal="left">
            <p className={styles.eyebrow}>Drone Services &amp; Aerial Operations</p>
            <h2 id="aerial-overview-title">Professional Aerial Photography, Videography &amp; Drone Solutions</h2>
            <p className={styles.intro}>
              Mosi Media Solutions provides professional drone services specialising in aerial photography, videography,
              visual documentation and commercial aerial operations.
            </p>
            <p className="mt-4">
              Using advanced drone technology and professional aerial production equipment, we capture exceptional
              perspectives for corporate clients, tourism operators, hospitality establishments, construction companies,
              real estate developers, agricultural projects and event organisers.
            </p>
            <p className="mt-4">
              Our services combine creative aerial storytelling with reliable technical execution, delivering high-quality
              aerial content for marketing, documentation, inspection and promotional purposes.
            </p>
          </div>

          <figure data-reveal="right" className={styles.mediaFigure}>
            <div className={styles.mediaFrame}>
              <Image
                src={DRONE_MEDIA.overview.src}
                alt={DRONE_MEDIA.overview.alt}
                fill
                sizes="(max-width:1023px) 100vw, 45vw"
              />
            </div>
            <figcaption className={styles.caption}>{DRONE_MEDIA.overview.caption}</figcaption>
          </figure>

          <div className={styles.sectorStrip} aria-label="Industries and clients served">
            {clientSectors.map((sector) => (
              <span key={sector} className={styles.sectorTag}>{sector}</span>
            ))}
          </div>
        </section>

        {/* Split 2: Images on left (desktop), Hover-detail service cards on right */}
        <section
          id="drone-services-list"
          className={`${styles.section} ${styles.split} ${styles.splitMediaFirst} ${styles.splitCentered}`}
          aria-labelledby="services-include-title"
        >
          <div data-reveal="right">
            <p className={styles.eyebrow}>Capabilities &amp; Applications</p>
            <h2 id="services-include-title">Our Drone Services Include</h2>
            <p className={styles.intro}>
              Hover over or select any service below to view full details on how we plan and deliver each aerial operation.
            </p>
            <DroneServiceCards items={droneServicesList} />
            <div className={styles.actions}>
              <EnquiryLink href={contact}>Request aerial coverage</EnquiryLink>
              <Link href="/packages/drone" className={styles.textLink}>
                Explore drone services
                <ArrowRight size={16} aria-hidden="true" />
              </Link>
            </div>
          </div>

          <div data-reveal="left" className={styles.mediaColumnFirst}>
            <div className={styles.mediaGrid}>
              {DRONE_MEDIA.servicesShowcase.map((item, index) => (
                <figure
                  key={item.alt}
                  className={`${styles.mediaFigure} ${index === 0 ? styles.mediaGridSpan : ""}`}
                >
                  <div className={`${styles.mediaFrame} ${index === 0 ? styles.mediaFrameWide : ""}`}>
                    <Image
                      src={item.src}
                      alt={item.alt}
                      fill
                      sizes={index === 0 ? "(max-width:1023px) 100vw, 45vw" : "(max-width:639px) 100vw, 22vw"}
                    />
                  </div>
                  <figcaption className={styles.caption}>{item.caption}</figcaption>
                </figure>
              ))}
            </div>
          </div>
        </section>

        {/* Split 3: CAAZ Compliance text + image on top, equal-size matching cards below */}
        <section id="caaz-compliance" className={`${styles.section} ${styles.split} ${styles.splitCentered}`} aria-labelledby="compliance-title">
          <div data-reveal="left">
            <p className={styles.eyebrow}>Aviation Safety &amp; Regulation</p>
            <h2 id="compliance-title">Licenced &amp; Authorised Drone Operations</h2>
            <p className={styles.intro}>
              Mosi Media Solutions is committed to operating within the aviation safety and regulatory framework
              established by the Civil Aviation Authority of Zimbabwe (CAAZ).
            </p>
            <p className="mt-4">
              Our drone operations are undertaken in accordance with applicable aviation regulations, licensing
              requirements, aircraft registration requirements and operational approval procedures.
            </p>
            <p className="mt-4">
              We prioritise aviation safety, professional conduct, responsible drone operations and compliance with all
              applicable regulatory requirements.
            </p>
          </div>

          <figure data-reveal="right" className={styles.mediaFigure}>
            <div className={styles.mediaFrame}>
              <Image
                src={DRONE_MEDIA.operations.src}
                alt={DRONE_MEDIA.operations.alt}
                fill
                sizes="(max-width:1023px) 100vw, 45vw"
              />
            </div>
            <figcaption className={styles.caption}>{DRONE_MEDIA.operations.caption}</figcaption>
          </figure>

          <div className={styles.compliancePair}>
            <div className={styles.complianceCard}>
              <div className={styles.complianceHeader}>
                <span className={styles.complianceIcon} aria-hidden="true">
                  <ShieldCheck size={22} />
                </span>
                <h3>Civil Aviation Authority of Zimbabwe (CAAZ)</h3>
              </div>
              <ul className={styles.list}>
                <li>Operations conducted within the CAAZ aviation safety and regulatory framework.</li>
                <li>Adherence to pilot licensing, aircraft registration and operational approval procedures.</li>
                <li>Pre-flight site feasibility, airspace checks, weather planning and risk assessment on every brief.</li>
              </ul>
            </div>

            <aside className={styles.complianceCard}>
              <div className={styles.complianceHeader}>
                <span className={styles.complianceIcon} aria-hidden="true">
                  <Compass size={22} />
                </span>
                <h3>Feasibility comes first</h3>
              </div>
              <ul className={styles.list}>
                <li>Flight feasibility depends on the exact location, weather, safe operating conditions and applicable permissions.</li>
                <li>Venue or landowner access alone does not establish permission to fly in regulated airspace.</li>
                <li>Every brief and site is reviewed in advance, with weather contingencies agreed before confirmation.</li>
              </ul>
            </aside>
          </div>
        </section>

        <ServiceProcess
          steps={[
            { title: "Enquiry", text: "Tell us the location, preferred date, purpose and kind of aerial coverage you have in mind." },
            { title: "Brief & location review", text: "Review priority shots, access, surroundings and applicable CAAZ permission requirements with MMS." },
            { title: "Planning", text: "Agree the feasible scope, schedule, quotation and a plan for weather or location changes." },
            { title: "Shoot", text: "Capture the agreed brief when conditions and permissions allow. Aviation safety guides every flight." },
            { title: "Editing & delivery", text: "Complete the agreed selection and editing. Confirm file formats, revisions and delivery timing for your project." },
          ]}
        />

        <section className={`${styles.section} ${styles.split}`} aria-labelledby="quote-title">
          <div data-reveal>
            <p className={styles.eyebrow}>A quote shaped by the brief</p>
            <h2 id="quote-title">What affects your quotation?</h2>
            <p>
              The scope of an aerial shoot can vary considerably. Share these details so MMS can discuss a quotation
              that reflects the work involved.
            </p>
            <div className={styles.actions}>
              <EnquiryLink href={contact}>Request a drone quotation</EnquiryLink>
            </div>
          </div>
          <ul className={styles.list}>
            <li><strong>Location:</strong> travel, access, number of sites and the planning or regulatory approval arrangements required.</li>
            <li><strong>Coverage time:</strong> the shoot window, schedule, priority shots and any coordination with an event or production team.</li>
            <li><strong>Editing requirements:</strong> still-image selection, footage editing, mapping deliverables, number and length of finished pieces, and revisions.</li>
            <li><strong>Intended use:</strong> publication platforms, commercial marketing, inspection documentation and usage rights to be agreed.</li>
          </ul>
        </section>

        <ServiceFAQs
          items={[
            {
              question: "Are your drone operations licenced and CAAZ compliant?",
              answer:
                "Yes. Mosi Media Solutions operates within the aviation safety and regulatory framework established by the Civil Aviation Authority of Zimbabwe (CAAZ), adhering to applicable aviation regulations, licensing requirements, aircraft registration and operational approval procedures.",
            },
            {
              question: "Can you fly at my chosen location?",
              answer:
                "Send the exact location and preferred date for review. Airspace, local restrictions, venue access, weather and applicable permissions can affect whether a shoot is feasible. A flight is confirmed only after the relevant checks and arrangements.",
            },
            {
              question: "Can aerial coverage be part of a larger production?",
              answer:
                "Yes. Discuss aerial sequences alongside photography, videography or an event film. The brief, location and schedule will determine what can be coordinated; aerial footage is not automatically included in other services.",
            },
            {
              question: "What happens if the weather changes?",
              answer:
                "Weather may require changes, postponement or cancellation of the aerial portion. Ask MMS to agree a contingency and the relevant booking terms before the shoot.",
            },
            {
              question: "What files will I receive, and when?",
              answer:
                "Image selection, edited films, inspection visuals, mapping outputs, resolution, formats, revisions and delivery dates should be agreed in your quotation. Share your requirements and deadline at enquiry stage.",
            },
          ]}
        />

        <ServiceClosing
          title="Mosi Media Solutions – Capturing Perspectives Beyond Boundaries."
          text="Send your location, dates and intended use. We will review feasibility and discuss a safe, compliant and creative approach to your aerial coverage."
          href={contact}
          label="Enquire about Drone Services"
          relatedHref="/services/weddings-elopements"
          relatedLabel="Explore Weddings & Elopements"
        />
      </main>
      <Footer />
    </div>
  );
}
