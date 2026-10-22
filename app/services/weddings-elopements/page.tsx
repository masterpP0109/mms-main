import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import Navbar from "@/app/components/Navbar";
import Footer from "@/app/components/Footer";
import { EnquiryLink, enquiryLink, ServiceClosing, ServiceFAQs, ServiceProcess } from "@/app/components/services/ServiceSections";
import styles from "@/app/components/services/services.module.css";

const title = "Weddings & Elopements | Photography & Film | MMS";
const description = "Discuss wedding and intimate elopement photography and film with Mosi Media Solutions. Explore coverage options, planning and enquiries for your celebration.";
export const metadata: Metadata = { title, description, alternates: { canonical: "/services/weddings-elopements" }, openGraph: { title, description, url: "/services/weddings-elopements", images: [{ url: "/mms/wedding%2012.jpg", alt: "A couple walking beside Victoria Falls" }] } };
const contact = enquiryLink("Weddings & Elopements", "/services/weddings-elopements");

export default function WeddingsPage() {
  return <div className={`${styles.page} ${styles.wedding}`}><Navbar /><main>
    <section className={styles.weddingHero} aria-labelledby="wedding-title">
      <div>
        <Link className={styles.breadcrumb} href="/services"><ArrowLeft size={16} aria-hidden="true" />All services</Link>
        <p className={styles.eyebrow}>Weddings &amp; Elopements</p>
        <h1 id="wedding-title">A day that feels like you.<br />A story to hold close.</h1>
        <p>Quiet promises. Familiar faces. The feeling of being together. Talk to Mosi Media Solutions about photography and film that make space for the moments that matter to you.</p>
        <div className={styles.actions}><EnquiryLink href={contact}>Tell us about your day</EnquiryLink><Link className={styles.textLink} href="/packages/weddings">Explore wedding packages</Link><a className={styles.textLink} href="#coverage">Explore coverage options</a></div>
      </div>
      <figure><div className={styles.weddingPortrait}><Image src="/mms/wedding%2012.jpg" alt="A couple walking hand in hand towards Victoria Falls" fill sizes="(max-width:1023px) 90vw, 45vw" preload /></div><figcaption className={styles.caption}>Wedding inspiration from our image library; shown for illustration.</figcaption></figure>
    </section>

    <section className={styles.section} aria-labelledby="celebration-title">
      <div data-reveal><p className={styles.eyebrow}>However you choose to celebrate</p><h2 id="celebration-title">Your story sets the scale.</h2><p className={styles.intro}>Photography and film help you return to the people, places and moments that made the day yours. Tell us what matters most, and discuss coverage with MMS that suits your plans.</p></div>
      <div data-stagger className={styles.grid}>
        <article className={styles.card}><p className={styles.eyebrow}>Together with your people</p><h3>Weddings</h3><p>For celebrations shared with family and friends, discuss coverage around the rhythm of your day: preparation, the ceremony, portraits and the gathering afterwards. Share your traditions, key people and schedule so priorities can be planned with care.</p></article>
        <article className={styles.card}><p className={styles.eyebrow}>A little more intimate</p><h3>Elopements</h3><p>For a ceremony with just the two of you or a small circle, discuss a focused approach around your vows, couple portraits and the setting you have chosen. Location access, travel time and a flexible plan for the light and weather help shape what is possible.</p></article>
      </div>
    </section>

    <section id="coverage" className={styles.section} aria-labelledby="coverage-title">
      <div data-reveal><p className={styles.eyebrow}>Make room for what matters</p><h2 id="coverage-title">Coverage options to talk through</h2><p className={styles.intro}>These are possibilities to discuss, rather than fixed packages. Photography, film, coverage time and finished deliverables are confirmed in your agreed brief and quotation.</p></div>
      <div data-stagger className={styles.grid}>{[
        ["Preparation & personal details", "The anticipation, the finishing touches and time with the people closest to you. Discuss which preparations and locations you want included."],
        ["The ceremony", "Your arrival, the exchange of vows and the people sharing the moment. Confirm venue rules, timing, filming positions and any audio requirements in advance."],
        ["Couple portraits", "A little time together, with portraits shaped around your setting and the available light. Discuss your comfort in front of the camera and how much time to allow."],
        ["Celebration highlights", "Greetings, speeches, a first dance or the energy of the gathering. Choose the moments you want prioritised and discuss how they might become photographs or an edited film."],
      ].map(([heading, text]) => <article key={heading} className={styles.card}><h3>{heading}</h3><p>{text}</p></article>)}</div>
    </section>

    <ServiceProcess steps={[
      { title: "Say hello", text: "Share your date, location, celebration size and whether you are considering photography, film or both." },
      { title: "Talk through your day", text: "Discuss the atmosphere, people and moments you want to remember, along with venue and travel details." },
      { title: "Agree & book", text: "Review availability, the proposed scope, quotation and booking terms. Confirm your booking with MMS." },
      { title: "Plan & celebrate", text: "Agree the timeline and priority moments before the day, including access arrangements and a weather plan." },
      { title: "Edit & deliver", text: "Your agreed selections and edits are prepared. File formats, revisions and delivery timing are confirmed for your booking." },
    ]} />

    <section className={`${styles.section} ${styles.split}`} aria-labelledby="details-title">
      <div data-reveal><p className={styles.eyebrow}>Thoughtful planning</p><h2 id="details-title">A few details help us begin.</h2><p>Tell us about your date, ceremony and celebration locations, approximate guest count and the coverage you are considering. If your plans are still taking shape, share what you know so far.</p><p className="mt-4">Your quotation depends on coverage time, locations and travel, photography or film requirements, editing and the finished work you would like. Availability and booking terms need confirmation with MMS.</p></div>
      <aside className={styles.note}><h3>Thinking about an aerial view?</h3><p>Aerial footage may be worth discussing if the setting is part of your story. It requires a separate feasibility review and is subject to location, weather and applicable permissions.</p><Link href="/services/drone" className={`${styles.textLink} mt-4`}>Explore Drone Services</Link></aside>
    </section>

    <ServiceFAQs items={[
      { question: "Can we enquire about a small elopement?", answer: "Yes. Share your location, date and the moments you want covered, even if it is just the two of you. Coverage, access and availability can then be discussed for your plans." },
      { question: "Can we discuss both photography and film?", answer: "Yes. Tell MMS whether you are considering photographs, a film or both. The team will discuss the scope and what can be arranged for your date before confirming a quotation." },
      { question: "Do we need to choose a package?", answer: "The options here are a starting point for a conversation. Agree the coverage time, priority moments, deliverables and booking terms with MMS; nothing is automatically included by this page." },
      { question: "How far ahead should we enquire?", answer: "Enquire once you have a preferred date or a shortlist. Availability must be checked, and a date is only secured according to the booking terms agreed with MMS." },
      { question: "What if our location or the weather changes?", answer: "Discuss an alternative portrait location and any venue access restrictions during planning. Changes to date, location or coverage are subject to availability and your agreed booking terms." },
      { question: "When will we receive our photographs or film?", answer: "Delivery timing, image selections, film length, formats, revisions and sharing permissions are agreed for each booking. Share any important deadlines when you enquire." },
    ]} />
    <ServiceClosing title="Tell us what your day could be." text="An intimate ceremony or a room full of your favourite people. Share your plans and we can begin with a conversation." href={contact} label="Enquire about your wedding or elopement" relatedHref="/services" relatedLabel="Explore all MMS services" />
  </main><Footer /></div>;
}
