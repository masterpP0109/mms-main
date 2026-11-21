import Image from "next/image";
import Link from "next/link";
import Navbar from "@/app/components/Navbar";
import Footer from "@/app/components/Footer";
import { EnquiryLink, ServiceFAQs, ServiceProcess } from "@/app/components/services/ServiceSections";
import {
  importantPackageInformation,
  packageEnquiryHref,
  type PackageExperience,
} from "@/lib/packages";
import PackageEnquiryForm from "./PackageEnquiryForm";
import PackageChoice from "./PackageChoice";
import s from "../services/services.module.css";
import styles from "./packages.module.css";

export default function PackageExperiencePage({ experience: e }: { experience: PackageExperience }) {
  return (
    <div className={s.page}>
      <Navbar />
      <main id="main-content" tabIndex={-1}>
        <section className={`${s.hero} ${styles.packageHero}`} aria-labelledby="package-title">
          <Image
            src={e.image}
            alt={e.imageAlt}
            fill
            sizes="100vw"
            preload
            className={s.heroImage}
            style={{ objectPosition: e.imagePosition }}
          />
          <div className={s.heroContent}>
            <Link className={s.breadcrumb} href="/packages">
              ← All packages
            </Link>
            <p className={s.eyebrow}>MMS Professional Service Packages / {e.title}</p>
            <h1 id="package-title" className={styles.heroTitle}>
              {e.headline}
            </h1>
            <p>{e.intro}</p>
            <div className={s.actions}>
              <EnquiryLink className={styles.glassButton} href="#package-options">
                Find your starting point
              </EnquiryLink>
              <a href="#package-enquiry" className={styles.glassButton}>
                Tell us your vision
              </a>
            </div>
            <p className={s.caption}>
              Illustrative imagery from our library. Your production is planned around an agreed brief.
            </p>
          </div>
        </section>

        <section className={`${s.section} ${styles.tightSection}`} aria-labelledby="value-title">
          <div data-reveal>
            <p className={s.eyebrow}>{e.tagline}</p>
            <h2 id="value-title">{e.valueTitle}</h2>
            <p className={s.intro}>{e.value}</p>
          </div>
          <div data-stagger className={`${s.grid} ${styles.threeColumns}`}>
            {e.benefits.map(item => (
              <article className={s.card} key={item.title}>
                <h3>{item.title}</h3>
                <p>{item.text}</p>
              </article>
            ))}
          </div>
          {e.note && (
            <aside className={`${s.note} ${styles.feasibility}`}>
              <h3>Feasibility before flight</h3>
              <p>{e.note}</p>
            </aside>
          )}
        </section>

        <section className={`${s.section} ${styles.tightSection} ${styles.examplesSection}`} aria-labelledby="examples-title">
          <div data-reveal>
            <p className={s.eyebrow}>Picture the possibilities</p>
            <h2 id="examples-title">A direction for your story.</h2>
            <p className={s.intro}>
              Visual references and production ideas to start a conversation. These images do not represent confirmed package projects or inclusions.
            </p>
          </div>
          <div className={s.grid}>
            {e.examples.map(example => (
              <figure key={example.title} className={styles.example} data-reveal>
                <div className={styles.exampleImage}>
                  <Image src={example.image} alt={example.alt} fill sizes="(max-width:639px) 90vw, 45vw" />
                </div>
                <figcaption>
                  <h3>{example.title}</h3>
                  <p>{example.text}</p>
                  <span className={s.caption}>Illustrative library image</span>
                </figcaption>
              </figure>
            ))}
          </div>
        </section>

        <section id="package-options" className={`${s.section} ${styles.tightSection}`} aria-labelledby="options-title">
          <span id="wedding-packages" className="block -mt-28 pt-28" aria-hidden="true" />
          <div data-reveal>
            <p className={s.eyebrow}>Choose a starting point</p>
            <h2 id="options-title">{e.title}</h2>
            <p className={s.intro}>
              {e.designedFor ||
                "Compare approaches, then tell us what fits. These are proposed directions for discussion. MMS confirms availability, inclusions, pricing and terms in a tailored quotation."}
            </p>
          </div>

          <div data-stagger className={`${s.grid} ${styles.threeColumns}`}>
            {e.options.map((option, index) => (
              <article key={option.id} className={styles.optionCard}>
                <div className={styles.cardTop}>
                  <p className={s.eyebrow}>
                    Package {index + 1} / {e.homeTitle ?? e.title}
                  </p>
                  <h3>{option.name}</h3>
                  {(option.tierLabel || option.location) && (
                    <p className={styles.packageDestName}>{option.tierLabel || option.location}</p>
                  )}
                  <p className={styles.cardIdeal}>{option.for}</p>
                </div>

                {option.inclusions?.length ? (
                  <>
                    <p className={styles.inclusionHeading}>Services included</p>
                    <ul className={styles.inclusionList}>
                      {option.inclusions.map(item => (
                        <li key={item}>{item}</li>
                      ))}
                    </ul>
                  </>
                ) : (
                  (option.coverage || option.finish || option.planning) && (
                    <dl className={styles.comparison}>
                      {option.coverage && (
                        <div>
                          <dt>Coverage to discuss</dt>
                          <dd>{option.coverage}</dd>
                        </div>
                      )}
                      {option.finish && (
                        <div>
                          <dt>Finished work</dt>
                          <dd>{option.finish}</dd>
                        </div>
                      )}
                      {option.planning && (
                        <div>
                          <dt>Planning focus</dt>
                          <dd>{option.planning}</dd>
                        </div>
                      )}
                    </dl>
                  )
                )}

                {option.suitableFor?.length ? (
                  <div className={styles.suitableBox}>
                    <p className={styles.inclusionHeading}>Suitable for</p>
                    <div className={styles.suitableTags}>
                      {option.suitableFor.map(useCase => (
                        <span key={useCase} className={styles.suitableTag}>
                          {useCase}
                        </span>
                      ))}
                    </div>
                  </div>
                ) : null}

                <div className={styles.cardFooter}>
                  <p className={styles.quoteLabel}>Tailored quotation · Price on request</p>
                  <PackageChoice category={e.slug} id={option.id} name={option.name} />
                </div>
              </article>
            ))}
          </div>

          {e.optionalAddOns?.length ? (
            <div className={styles.addOnsPanel} data-reveal>
              <div className={styles.addOnsHeader}>
                <h3>Optional Add-ons</h3>
                <span>Available with any {e.homeTitle ?? e.title}</span>
              </div>
              <ul className={styles.addOnsGrid}>
                {e.optionalAddOns.map(addon => (
                  <li key={addon}>{addon}</li>
                ))}
              </ul>
            </div>
          ) : null}

          <p className={styles.optionFootnote}>
            Unsure which fits?{" "}
            <Link href={packageEnquiryHref(e.slug)}>Ask us to tailor your package.</Link> All prices are available on request and confirmed in a detailed quotation following consultation.
          </p>
        </section>

        <section className={`${s.section} ${s.split}`} aria-labelledby="enhancements-title">
          <div data-reveal>
            <p className={s.eyebrow}>Make it yours</p>
            <h2 id="enhancements-title">Customisable around your brief.</h2>
            <p>
              All packages are customisable according to your event requirements, budget, venue and number of attendees. Discuss add-ons and specialised services with our team.
            </p>
          </div>
          <ul className={s.list}>
            {e.enhancements.map(item => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </section>

        <ServiceProcess steps={e.process} />

        <section className={`${s.section} ${s.split}`} aria-labelledby="proof-title">
          <div data-reveal>
            <p className={s.eyebrow}>Important package information</p>
            <h2 id="proof-title">Clear terms before production begins.</h2>
            <p>
              Mosi Media Solutions brings media production and event technology together in Victoria Falls, Zimbabwe. Explore our published work or review our package guidelines.
            </p>
            <div className={s.actions}>
              <Link className={styles.glassButton} href="/gallery">
                Explore published MMS work
              </Link>
              <Link className={styles.glassButton} href="/packages#package-info">
                Full package terms
              </Link>
            </div>
          </div>
          <div className={s.note}>
            <h3>Quotation &amp; logistical notes</h3>
            <ul className={s.list}>
              {importantPackageInformation.slice(0, 5).map(item => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </div>
        </section>

        <ServiceFAQs items={e.faqs} />

        <section id="package-enquiry" className={`${s.section} ${s.split}`} aria-labelledby="enquiry-title">
          <span id="wedding-enquiry" className="block -mt-28 pt-28" aria-hidden="true" />
          <div data-reveal>
            <p className={s.eyebrow}>Your next chapter starts here</p>
            <h2 id="enquiry-title">Tell us what you have in mind.</h2>
            <p>
              Share your preferred date, location and priorities for {e.service.toLowerCase()}. We’ll use your enquiry to discuss a suitable scope and detailed quotation.
            </p>
            <p className="mt-4">
              An enquiry is the start of a conversation. Availability, scope, pricing and booking terms need confirmation.
            </p>
            <div className={s.actions}>
              {e.serviceHref && (
                <Link href={e.serviceHref} className={styles.glassButton}>
                  Read the service guide
                </Link>
              )}
              <Link href="/packages" className={styles.glassButton}>
                View all packages
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
