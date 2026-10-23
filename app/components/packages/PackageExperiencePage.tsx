import Image from "next/image";
import Link from "next/link";
import Navbar from "@/app/components/Navbar";
import Footer from "@/app/components/Footer";
import { EnquiryLink, ServiceFAQs, ServiceProcess } from "@/app/components/services/ServiceSections";
import { packageEnquiryHref, type PackageExperience } from "@/lib/packages";
import PackageEnquiryForm from "./PackageEnquiryForm";
import PackageChoice from "./PackageChoice";
import s from "../services/services.module.css";
import styles from "./packages.module.css";

export default function PackageExperiencePage({ experience: e }: { experience: PackageExperience }) {
  return <div className={s.page}><Navbar /><main>
    <section className={`${s.hero} ${styles.packageHero}`} aria-labelledby="package-title">
      <Image src={e.image} alt={e.imageAlt} fill sizes="100vw" preload className={s.heroImage} style={{ objectPosition: e.imagePosition }} />
      <div className={s.heroContent}>
        <Link className={s.breadcrumb} href="/packages">← All packages</Link>
        <p className={s.eyebrow}>MMS Signature Experiences / {e.title}</p>
        <h1 id="package-title" className={styles.heroTitle}>{e.headline}</h1>
        <p>{e.intro}</p>
        <div className={s.actions}><EnquiryLink className={styles.glassButton} href="#package-options">Find your starting point</EnquiryLink><a href="#package-enquiry" className={styles.glassButton}>Tell us your vision</a></div>
        <p className={s.caption}>Illustrative imagery from our library. Your production is planned around an agreed brief.</p>
      </div>
    </section>

    <section className={s.section} aria-labelledby="value-title">
      <div data-reveal><p className={s.eyebrow}>{e.tagline}</p><h2 id="value-title">{e.valueTitle}</h2><p className={s.intro}>{e.value}</p></div>
      <div data-stagger className={`${s.grid} ${styles.threeColumns}`}>{e.benefits.map(item => <article className={s.card} key={item.title}><h3>{item.title}</h3><p>{item.text}</p></article>)}</div>
      {e.note && <aside className={`${s.note} ${styles.feasibility}`}><h3>Feasibility before flight</h3><p>{e.note}</p></aside>}
    </section>

    <section className={`${s.section} ${styles.examplesSection}`} aria-labelledby="examples-title">
      <div data-reveal><p className={s.eyebrow}>Picture the possibilities</p><h2 id="examples-title">A direction for your story.</h2><p className={s.intro}>Visual references and production ideas to start a conversation. These images do not represent confirmed package projects or inclusions.</p></div>
      <div className={s.grid}>{e.examples.map(example => <figure key={example.title} className={styles.example} data-reveal>
        <div className={styles.exampleImage}><Image src={example.image} alt={example.alt} fill sizes="(max-width:639px) 90vw, 45vw" /></div>
        <figcaption><h3>{example.title}</h3><p>{example.text}</p><span className={s.caption}>Illustrative library image</span></figcaption>
      </figure>)}</div>
    </section>

    <section id="package-options" className={s.section} aria-labelledby="options-title">
      <div data-reveal><p className={s.eyebrow}>Choose a starting point</p><h2 id="options-title">Your vision sets the scope.</h2><p className={s.intro}>Compare approaches, then tell us what fits. These are proposed directions for discussion. MMS confirms availability, inclusions, pricing and terms in a tailored quotation.</p></div>
      <div data-stagger className={`${s.grid} ${styles.threeColumns}`}>{e.options.map((option) => <article key={option.id} className={styles.optionCard}>
        <p className={s.eyebrow}>{e.title}</p><h3>{option.name}</h3><p>{option.for}</p>
        <dl className={styles.comparison}>
          <div><dt>Coverage to discuss</dt><dd>{option.coverage}</dd></div>
          <div><dt>Finished work</dt><dd>{option.finish}</dd></div>
          <div><dt>Planning focus</dt><dd>{option.planning}</dd></div>
        </dl>
        <p className={styles.quoteLabel}>Tailored quotation</p><PackageChoice category={e.slug} id={option.id} name={option.name} />
      </article>)}</div>
      <p className={styles.optionFootnote}>Unsure which fits? <Link href={packageEnquiryHref(e.slug)}>Ask us to tailor your package.</Link> No booking or specific deliverable is confirmed by selecting an option.</p>
    </section>

    <section className={`${s.section} ${s.split}`} aria-labelledby="enhancements-title">
      <div data-reveal><p className={s.eyebrow}>Make it yours</p><h2 id="enhancements-title">A little more of what matters.</h2><p>Discuss enhancements to your brief. Feasibility, scope and any additional costs are agreed in your quotation.</p></div>
      <ul className={s.list}>{e.enhancements.map(item => <li key={item}>{item}</li>)}</ul>
    </section>
    <ServiceProcess steps={e.process} />

    <section className={`${s.section} ${s.split}`} aria-labelledby="proof-title">
      <div data-reveal><p className={s.eyebrow}>Meet the production behind the story</p><h2 id="proof-title">See the work. Talk through the detail.</h2><p>MMS brings media production and event technology together in Victoria Falls. Explore the published project collection and ask for samples relevant to your brief.</p></div>
      <div className={s.note}>{e.approvedProof.length ? e.approvedProof.map(proof => <article key={proof.href}><h3>{proof.title}</h3><p>{proof.text}</p><Link href={proof.href} className={styles.glassButton}>View approved work</Link></article>) : <><h3>Want to see a production like yours?</h3><p>Ask MMS for relevant samples and permission to view or share client work. We can discuss the approach behind your preferred format.</p></>}
        <div className={s.actions}><Link className={styles.glassButton} href="/projects">Explore published MMS work</Link><a className={styles.glassButton} href="#package-enquiry">Request relevant samples</a></div>
      </div>
    </section>
    <ServiceFAQs items={e.faqs} />

    <section id="package-enquiry" className={`${s.section} ${s.split}`} aria-labelledby="enquiry-title">
      <div data-reveal><p className={s.eyebrow}>Your next chapter starts here</p><h2 id="enquiry-title">Tell us what you have in mind.</h2><p>Share your preferred date, location and priorities for {e.service.toLowerCase()}. We’ll use your enquiry to discuss a suitable scope and quotation.</p>
        <p className="mt-4">An enquiry is the start of a conversation. Availability, scope, pricing and booking terms need confirmation.</p>
        <div className={s.actions}>{e.serviceHref && <Link href={e.serviceHref} className={styles.glassButton}>Read the service guide</Link>}<Link href="/packages" className={styles.glassButton}>Compare all experiences</Link></div>
      </div>
      <PackageEnquiryForm experience={{ slug: e.slug, service: e.service, note: e.note, options: e.options.map(({ id, name }) => ({ id, name })) }} />
    </section>
  </main><Footer /></div>;
}
