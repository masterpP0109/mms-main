import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import Navbar from "@/app/components/Navbar";
import Footer from "@/app/components/Footer";
import { EnquiryLink, enquiryLink, ServiceClosing, ServiceFAQs, ServiceProcess } from "@/app/components/services/ServiceSections";
import styles from "@/app/components/services/services.module.css";

const title = "Drone Services | Aerial Photography & Videography | MMS";
const description = "Explore drone photography and videography with Mosi Media Solutions for events, tourism, property and promotional storytelling. Discuss your location and brief.";
export const metadata: Metadata = { title, description, alternates: { canonical: "/services/drone" }, openGraph: { title, description, url: "/services/drone", images: [{ url: "/victoria_falls_banner.png", alt: "Panoramic view of Victoria Falls" }] } };
const contact = enquiryLink("Drone Services", "/services/drone");

export default function DronePage() {
  return <div className={styles.page}><Navbar /><main>
    <section className={styles.hero} aria-labelledby="drone-title">
      <Image src="/victoria_falls_banner.png" alt="An expansive view across Victoria Falls and the surrounding landscape" fill sizes="100vw" preload className={styles.heroImage} />
      <div className={styles.heroContent}>
        <Link className={styles.breadcrumb} href="/services"><ArrowLeft size={16} aria-hidden="true" />All services</Link>
        <p className={styles.eyebrow}>Drone Services · Mosi Media Solutions</p>
        <h1 id="drone-title">A wider perspective.<br />A fuller story.</h1>
        <p>Aerial photography and videography bring scale, setting and movement to your story. Start with a location and an idea; we&apos;ll discuss what is possible.</p>
        <div className={styles.actions}><EnquiryLink href={contact}>Discuss your aerial shoot</EnquiryLink><Link href="/packages/drone" className={styles.textLink}>Explore drone packages</Link><a href="#aerial-options" className={styles.textLink}>Explore the possibilities</a></div>
        <p className={styles.caption}>Illustrative landscape imagery from our image library. Flight feasibility depends on location, weather and applicable permissions.</p>
      </div>
    </section>

    <section id="aerial-options" className={styles.section} aria-labelledby="aerial-title">
      <div data-reveal><p className={styles.eyebrow}>The view beyond eye level</p><h2 id="aerial-title">Give your audience a sense of place.</h2>
        <p className={styles.intro}>Drone photography uses an airborne camera to capture still images from above. Drone videography adds moving aerial sequences, revealing a venue&apos;s surroundings or connecting a subject to the wider landscape. Used thoughtfully alongside ground-level coverage, it can help viewers understand a place before they arrive.</p></div>
      <div data-stagger className={styles.grid}>{[
        ["Events & venue context", "Explore establishing views of a venue and its surroundings to introduce an event film. Any aerial coverage around people needs a location and safety review; flights above guests are not assumed."],
        ["Tourism & hospitality", "Show how a lodge, hotel or destination sits within its landscape. Discuss views that could support your website, destination story or hospitality campaign, subject to access and flight feasibility."],
        ["Property showcases", "Help viewers understand a property's setting, outdoor areas and relationship to nearby features. Discuss the views you need for your showcase; mapping, surveys and measurements require separate confirmation."],
        ["Promotional films & location coverage", "Consider aerial establishing shots, landscape sequences or transitions for a brand film, location introduction or social campaign. Share the intended platforms so capture and editing can be planned around their use."],
      ].map(([heading, text]) => <article key={heading} className={styles.card}><h3>{heading}</h3><p>{text}</p></article>)}</div>
    </section>

    <section className={`${styles.section} ${styles.split}`} aria-labelledby="planning-title">
      <div data-reveal><p className={styles.eyebrow}>Before the shoot</p><h2 id="planning-title">A good aerial shoot starts on the ground.</h2><ul className={styles.list}>
        <li>Share the exact location, preferred dates, access arrangements and a contact for the venue or landowner.</li>
        <li>Describe your subject, priority shots, event schedule and whether people, wildlife or nearby activity may affect the plan.</li>
        <li>Explain where the images or film will appear, the audience, formats and any deadline you are working towards.</li>
        <li>Allow time for the location review, permission requirements and a weather-dependent alternative plan.</li>
      </ul></div>
      <aside className={styles.note}><h3>Feasibility comes first</h3><p>Flight feasibility depends on the location, weather, safe operating conditions and applicable permissions. Venue access alone does not establish permission to fly. The brief and location need review before aerial coverage can be confirmed.</p><p className="mt-4">If conditions prevent a flight, discuss rescheduling or alternative coverage with MMS. Any arrangements should be agreed for your shoot.</p></aside>
    </section>

    <ServiceProcess steps={[
      { title: "Enquiry", text: "Tell us the location, preferred date, purpose and kind of aerial coverage you have in mind." },
      { title: "Brief & location review", text: "Review priority shots, access, surroundings and applicable permission requirements with MMS." },
      { title: "Planning", text: "Agree the feasible scope, schedule, quotation and a plan for weather or location changes." },
      { title: "Shoot", text: "Capture the agreed brief when conditions and permissions allow. Safety and feasibility guide the day." },
      { title: "Editing & delivery", text: "Complete the agreed selection and editing. Confirm file formats, revisions and delivery timing for your project." },
    ]} />

    <section className={`${styles.section} ${styles.split}`} aria-labelledby="quote-title">
      <div data-reveal><p className={styles.eyebrow}>A quote shaped by the brief</p><h2 id="quote-title">What affects your quotation?</h2><p>The scope of an aerial shoot can vary considerably. Share these details so MMS can discuss a quotation that reflects the work involved.</p><div className={styles.actions}><EnquiryLink href={contact}>Request a drone quotation</EnquiryLink></div></div>
      <ul className={styles.list}>
        <li><strong>Location:</strong> travel, access, number of sites and the planning or permission arrangements required.</li>
        <li><strong>Coverage time:</strong> the shoot window, schedule, priority shots and any coordination with an event or other production team.</li>
        <li><strong>Editing requirements:</strong> still-image selection, footage editing, number and length of finished pieces, versions and revisions.</li>
        <li><strong>Intended use:</strong> publication platforms, audience, commercial use and any usage rights that need to be agreed.</li>
      </ul>
    </section>

    <ServiceFAQs items={[
      { question: "Can you fly at my chosen location?", answer: "Send the exact location and preferred date for review. Airspace, local restrictions, venue access, weather and applicable permissions can affect whether a shoot is feasible. A flight is confirmed only after the relevant checks and arrangements." },
      { question: "Can aerial coverage be part of a larger production?", answer: "Discuss aerial sequences alongside photography, videography or an event film. The brief, location and schedule will determine what can be coordinated; aerial footage is not automatically included in other services." },
      { question: "What happens if the weather changes?", answer: "Weather may require changes, postponement or cancellation of the aerial portion. Ask MMS to agree a contingency and the relevant booking terms before the shoot." },
      { question: "What files will I receive, and when?", answer: "Image selection, edited films, footage access, resolution, formats, revisions and delivery dates should be agreed in your quotation. Share your publication requirements and deadline at enquiry stage." },
      { question: "Can footage be used in advertising?", answer: "Tell MMS about your intended use, including advertising, social platforms or use by third parties. Usage rights, permissions and any licensing terms need to be agreed for your project." },
    ]} />
    <ServiceClosing title="Where could a new perspective take your story?" text="Send your location, dates and intended use. We can review your ideas and discuss a practical approach to aerial coverage." href={contact} label="Enquire about Drone Services" relatedHref="/services/weddings-elopements" relatedLabel="Explore Weddings & Elopements" />
  </main><Footer /></div>;
}
