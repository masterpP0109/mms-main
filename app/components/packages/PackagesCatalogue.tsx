"use client";

import React, { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { ArrowRight, Check, ChevronDown, Columns3, X } from "lucide-react";
import { useModalFocus } from "@/app/components/useModalFocus";
import {
  additionalSpecialisedServices,
  homePackageExperiences,
  importantPackageInformation,
  packageEnquiryHref,
  packageExperiences,
  packagePath,
  type PackageExperience,
  type PackageOption,
} from "@/lib/packages";
import styles from "./packages.module.css";

const navSections = [
  { id: "conference-packages", label: "Corporate" },
  { id: "social-event-packages", label: "Celebrations" },
  { id: "video-production-packages", label: "Video Production" },
  { id: "other-services", label: "Other Services" },
  { id: "package-info", label: "Package Info" },
] as const;

const sectionAnchorBySlug: Record<string, string> = {
  conferences: "conference-packages",
  weddings: "social-event-packages",
  "video-production": "video-production-packages",
};

export default function PackagesCatalogue() {
  const [activeSection, setActiveSection] = useState<string>("conference-packages");
  const [expandedCompare, setExpandedCompare] = useState<Record<string, boolean>>({});
  const [detailTarget, setDetailTarget] = useState<{
    category: PackageExperience;
    option: PackageOption;
  } | null>(null);
  const modalRef = useRef<HTMLDivElement>(null);

  useModalFocus(detailTarget !== null, modalRef, () => setDetailTarget(null));

  useEffect(() => {
    const ids = navSections.map(item => item.id);
    const elements = ids
      .map(id => document.getElementById(id))
      .filter((el): el is HTMLElement => Boolean(el));

    if (!elements.length || typeof IntersectionObserver === "undefined") return;

    const observer = new IntersectionObserver(
      entries => {
        const visible = entries
          .filter(entry => entry.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        if (visible[0]?.target.id) {
          setActiveSection(visible[0].target.id);
        }
      },
      { rootMargin: "-25% 0px -60% 0px", threshold: 0 },
    );

    elements.forEach(el => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  const toggleCompare = (slug: string) => {
    setExpandedCompare(prev => ({ ...prev, [slug]: !prev[slug] }));
  };

  return (
    <>
      {/* Sticky Category Navigation Bar */}
      <nav aria-label="Package categories" className={styles.stickyNav}>
        <div className={styles.stickyNavInner}>
          {navSections.map(section => {
            const isActive = activeSection === section.id;
            return (
              <a
                key={section.id}
                href={`#${section.id}`}
                onClick={() => setActiveSection(section.id)}
                aria-current={isActive ? "true" : undefined}
                className={`${styles.navPill} ${isActive ? styles.navPillActive : ""}`}
              >
                {section.label}
              </a>
            );
          })}
          <div className={styles.navAction}>
            <Link
              href="/contact?service=Professional%20Service%20Packages&origin=%2Fpackages#enquiry"
              className={styles.primaryCta}
              style={{ minHeight: "40px", padding: "0.45rem 1rem", fontSize: "0.78rem" }}
            >
              Custom Quote
              <ArrowRight size={14} aria-hidden="true" />
            </Link>
          </div>
        </div>
      </nav>

      {/* Core Package Categories */}
      {homePackageExperiences.map((category, categoryIndex) => {
        const anchorId = sectionAnchorBySlug[category.slug];
        const isCompareOpen = Boolean(expandedCompare[category.slug]);
        const compareTableId = `${category.slug}-comparison`;

        return (
          <section
            key={category.slug}
            id={anchorId}
            className={`${styles.catalogueSection} ${categoryIndex > 0 ? styles.categoryBand : ""}`}
            aria-labelledby={`${category.slug}-heading`}
          >
            <div className={styles.sectionHeaderRow}>
              <div>
                <p className={styles.eyebrow}>
                  0{categoryIndex + 1} / {category.homeTitle ?? category.title}
                </p>
                <h2 id={`${category.slug}-heading`} className={styles.sectionTitle}>
                  {category.title}
                </h2>
                <p className={styles.sectionIntro}>{category.designedFor || category.description}</p>
              </div>
              <div className={styles.sectionActions}>
                <button
                  type="button"
                  aria-expanded={isCompareOpen}
                  aria-controls={compareTableId}
                  onClick={() => toggleCompare(category.slug)}
                  className={styles.compareToggle}
                >
                  <Columns3 size={16} aria-hidden="true" />
                  <span>{isCompareOpen ? "Hide comparison" : "Compare packages"}</span>
                </button>
                <Link href={packagePath(category.slug)} className={styles.navPill}>
                  Category details →
                </Link>
              </div>
            </div>

            {/* Level 1: Three Consistently Sized Cards */}
            <div className={styles.threeColumns}>
              {category.options.map(option => {
                const isFeatured = option.badge === "STANDARD";
                const highlights = option.highlights ?? option.inclusions?.slice(0, 5) ?? [];

                return (
                  <article
                    key={option.id}
                    className={`${styles.packageCard} ${isFeatured ? styles.packageCardFeatured : ""}`}
                  >
                    <div className={styles.tierHeader}>
                      <span
                        className={`${styles.tierBadge} ${
                          option.badge !== "BASIC" ? styles.tierBadgeAccent : ""
                        }`}
                      >
                        {option.badge ?? "PACKAGE"}
                      </span>
                      {option.tierLabel && (
                        <span className={styles.tierSubtitle}>{option.tierLabel}</span>
                      )}
                    </div>

                    <h3 className={styles.packageCardTitle}>{option.name}</h3>
                    <p className={styles.packageIdeal}>{option.for}</p>

                    <div className={styles.highlightsDivider}>
                      <p className={styles.highlightsLabel}>Key highlights</p>
                      <ul className={styles.highlightsList}>
                        {highlights.map(item => (
                          <li key={item}>
                            <Check size={15} className={styles.highlightIcon} aria-hidden="true" />
                            <span>{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className={styles.cardFooter}>
                      <p className={styles.priceApproach}>Custom quote · Price on request</p>
                      <Link
                        href={packageEnquiryHref(category.slug, option.id)}
                        className={styles.primaryCta}
                      >
                        <span>Request package</span>
                        <ArrowRight size={15} aria-hidden="true" />
                      </Link>
                      <button
                        type="button"
                        onClick={() => setDetailTarget({ category, option })}
                        className={styles.secondaryBtn}
                        aria-haspopup="dialog"
                      >
                        View all inclusions
                      </button>
                    </div>
                  </article>
                );
              })}
            </div>

            {/* Expandable Side-by-Side Comparison Table */}
            {isCompareOpen && (
              <div id={compareTableId} className={styles.compareWrap} role="region" aria-label={`${category.title} comparison`}>
                <table className={styles.compareTable}>
                  <thead>
                    <tr>
                      <th scope="col">Feature</th>
                      {category.options.map(option => (
                        <th key={option.id} scope="col">
                          {option.name}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <th scope="row">Best for</th>
                      {category.options.map(option => (
                        <td key={option.id}>{option.comparison?.scale ?? option.for}</td>
                      ))}
                    </tr>
                    <tr>
                      <th scope="row">Sound &amp; AV</th>
                      {category.options.map(option => (
                        <td key={option.id}>{option.comparison?.audioAv ?? option.coverage}</td>
                      ))}
                    </tr>
                    <tr>
                      <th scope="row">Visuals &amp; output</th>
                      {category.options.map(option => (
                        <td key={option.id}>{option.comparison?.visuals ?? option.finish}</td>
                      ))}
                    </tr>
                    <tr>
                      <th scope="row">Special features</th>
                      {category.options.map(option => (
                        <td key={option.id}>{option.comparison?.effects ?? "—"}</td>
                      ))}
                    </tr>
                    <tr>
                      <th scope="row">Crew &amp; support</th>
                      {category.options.map(option => (
                        <td key={option.id}>{option.comparison?.support ?? option.planning}</td>
                      ))}
                    </tr>
                  </tbody>
                </table>
              </div>
            )}

            {/* Expandable Optional Add-ons (prominent maroon emphasis; expands when clicked) */}
            {category.optionalAddOns?.length ? (
              <details className={styles.addOnsBar}>
                <summary>
                  <span className={styles.addOnsSummaryLeft}>
                    <span className={styles.addOnsBadge}>+ {category.optionalAddOns.length} Add-ons</span>
                    <span>Optional add-ons available — customise your package</span>
                  </span>
                  <span className={styles.addOnsTogglePill}>
                    <span>View add-ons</span>
                    <ChevronDown size={16} aria-hidden="true" />
                  </span>
                </summary>
                <div className={styles.addOnsBody}>
                  <ul className={styles.addOnsGrid}>
                    {category.optionalAddOns.map(addon => (
                      <li key={addon}>
                        <span>+ {addon}</span>
                        <Link
                          href={`/contact?service=${encodeURIComponent(`${category.service} — Add-on: ${addon}`)}&origin=%2Fpackages#enquiry`}
                          className={styles.addOnsItemBtn}
                        >
                          Add to quote →
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              </details>
            ) : null}
          </section>
        );
      })}

      {/* Additional Specialised Services + Standalone Production */}
      <section
        id="other-services"
        className={`${styles.catalogueSection} ${styles.categoryBand}`}
        aria-labelledby="specialised-title"
      >
        <div id="specialised-services">
          <p className={styles.eyebrow}>Additional Services</p>
          <h2 id="specialised-title" className={styles.sectionTitle}>
            Individual Services You Can Add to Any Package
          </h2>
          <p className={styles.sectionIntro}>
            Mosi Media Solutions also offers individual services that clients can incorporate into any package.
          </p>
        </div>

        <div className={styles.specialisedGrid}>
          {additionalSpecialisedServices.map(row => (
            <article key={row.category} className={styles.specialisedCard}>
              <div>
                <h3 className={styles.specialisedCategory}>{row.category}</h3>
                <p className={styles.specialisedServices}>{row.services}</p>
              </div>
            </article>
          ))}
          <article className={`${styles.specialisedCard} ${styles.specialisedCardAccent}`}>
            <div>
              <h3 className={styles.specialisedCategory}>Custom Combination</h3>
              <p className={styles.specialisedServices}>
                Combine individual audio, display, effects or marketing services into one tailored quote.
              </p>
            </div>
            <Link
              href="/contact?service=Specialised%20Services&origin=%2Fpackages#enquiry"
              className={`${styles.secondaryBtn} mt-4`}
            >
              Request custom mix →
            </Link>
          </article>
        </div>

        <div style={{ marginTop: "2.75rem" }}>
          <p className={styles.eyebrow}>Standalone Production</p>
          <h3 className={styles.sectionTitle} style={{ fontSize: "clamp(1.35rem, 2.2vw, 1.75rem)" }}>
            Drone &amp; Podcast Packages
          </h3>
          <div className={styles.secondaryGrid}>
            {packageExperiences
              .filter(item => item.slug === "drone" || item.slug === "podcasts")
              .map(item => (
                <article key={item.slug} className={styles.secondaryCard}>
                  <div>
                    <p className={styles.eyebrow}>{item.service}</p>
                    <h3>{item.title}</h3>
                    <p>{item.tagline}</p>
                  </div>
                  <Link href={packagePath(item.slug)} className={styles.secondaryBtn} style={{ width: "fit-content" }}>
                    Explore {item.title} →
                  </Link>
                </article>
              ))}
          </div>
        </div>
      </section>

      {/* Planning & Quotations */}
      <section
        id="package-info"
        className={`${styles.catalogueSection} ${styles.categoryBand}`}
        aria-labelledby="package-info-title"
      >
        <div>
          <p className={styles.eyebrow}>Planning &amp; Quotations</p>
          <h2 id="package-info-title" className={styles.sectionTitle}>
            Customisation, Logistics &amp; Important Terms
          </h2>
          <p className={styles.sectionIntro}>
            All packages are customisable and priced on request following consultation. Key conditions are summarised below.
          </p>
        </div>

        <div className={styles.conditionsGrid}>
          <article className={styles.conditionCard}>
            <h3>Customisable Scope &amp; Crew</h3>
            <p>
              Packages adapt to your requirements, budget, venue and attendee count, with equipment and crew scaled to match.
            </p>
          </article>
          <article className={styles.conditionCard}>
            <h3>Victoria Falls &amp; Travel Logistics</h3>
            <p>
              Accommodation, transport, meals and logistics for events outside Victoria Falls are quoted separately where applicable.
            </p>
          </article>
          <article className={styles.conditionCard}>
            <h3>Drone Permissions &amp; Weather</h3>
            <p>
              Aerial filming is subject to applicable aviation regulations, operational permissions, weather and site conditions.
            </p>
          </article>
        </div>

        <details className={styles.notesDisclosure}>
          <summary>
            <span>Read all 7 quotation &amp; logistical guidelines</span>
            <ChevronDown size={18} aria-hidden="true" />
          </summary>
          <ol className={styles.notesList}>
            {importantPackageInformation.map((item, idx) => (
              <li key={item}>
                <span className={styles.infoNumber} aria-hidden="true">
                  0{idx + 1}
                </span>
                <span>{item}</span>
              </li>
            ))}
          </ol>
        </details>
      </section>

      {/* Single Strong Final CTA */}
      <section className={styles.finalCta} aria-labelledby="packages-enquiry-title">
        <p className={styles.eyebrow}>Mosi Media Solutions · Victoria Falls, Zimbabwe</p>
        <h2 id="packages-enquiry-title">Your Complete Multimedia &amp; Event Technology Partner.</h2>
        <p>
          Professionalism | Creativity | Innovation | Reliability. Tell us what you’re planning and we’ll prepare a detailed quotation tailored to your brief.
        </p>
        <Link
          className={styles.primaryCta}
          style={{ minHeight: "48px", padding: "0.75rem 1.75rem" }}
          href="/contact?service=Professional%20Service%20Packages&origin=%2Fpackages#enquiry"
        >
          <span>Request a Custom Quote</span>
          <ArrowRight size={16} aria-hidden="true" />
        </Link>
      </section>

      {/* Accessible Level-2 Package Inclusions Modal */}
      {detailTarget && (
        <div
          className={styles.modalBackdrop}
          role="presentation"
          onClick={() => setDetailTarget(null)}
        >
          <div
            ref={modalRef}
            className={styles.modalPanel}
            role="dialog"
            aria-modal="true"
            aria-labelledby="package-detail-title"
            onClick={event => event.stopPropagation()}
          >
            <div className={styles.modalHeader}>
              <div>
                <div className={styles.tierHeader} style={{ justifyContent: "flex-start", gap: ".65rem" }}>
                  <span
                    className={`${styles.tierBadge} ${
                      detailTarget.option.badge !== "BASIC" ? styles.tierBadgeAccent : ""
                    }`}
                  >
                    {detailTarget.option.badge ?? "PACKAGE"}
                  </span>
                  <span className={styles.tierSubtitle}>{detailTarget.category.title}</span>
                </div>
                <h3 id="package-detail-title" className={styles.packageCardTitle} style={{ marginBottom: ".25rem" }}>
                  {detailTarget.option.name}
                </h3>
                {detailTarget.option.tierLabel && (
                  <p className={styles.tierSubtitle} style={{ margin: 0 }}>
                    {detailTarget.option.tierLabel} — {detailTarget.option.for}
                  </p>
                )}
              </div>
              <button
                type="button"
                className={styles.modalClose}
                onClick={() => setDetailTarget(null)}
                aria-label="Close package details"
              >
                <X size={18} aria-hidden="true" />
              </button>
            </div>

            {detailTarget.option.inclusions?.length ? (
              <div className={styles.modalSection}>
                <h4>Services included ({detailTarget.option.inclusions.length})</h4>
                <ul className={styles.modalList}>
                  {detailTarget.option.inclusions.map(item => (
                    <li key={item}>
                      <Check size={15} className={styles.highlightIcon} aria-hidden="true" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ) : null}

            {detailTarget.option.suitableFor?.length ? (
              <div className={styles.modalSection}>
                <h4>Suitable for</h4>
                <div className={styles.suitableTags}>
                  {detailTarget.option.suitableFor.map(useCase => (
                    <span key={useCase} className={styles.suitableTag}>
                      {useCase}
                    </span>
                  ))}
                </div>
              </div>
            ) : null}

            {detailTarget.category.optionalAddOns?.length ? (
              <div className={styles.modalSection}>
                <h4>Optional add-ons available</h4>
                <ul className={styles.addOnsGrid}>
                  {detailTarget.category.optionalAddOns.map(addon => (
                    <li key={addon}>{addon}</li>
                  ))}
                </ul>
              </div>
            ) : null}

            <div className={styles.modalFooter}>
              <p className={styles.priceApproach}>
                All prices available on request · Customisable to your event
              </p>
              <Link
                href={packageEnquiryHref(detailTarget.category.slug, detailTarget.option.id)}
                className={styles.primaryCta}
              >
                <span>Request {detailTarget.option.name}</span>
                <ArrowRight size={15} aria-hidden="true" />
              </Link>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
