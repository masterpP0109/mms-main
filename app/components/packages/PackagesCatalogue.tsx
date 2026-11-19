"use client";

import React, { Suspense, useRef, useState, type FormEvent } from "react";
import Image from "next/image";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import {
  ArrowRight,
  Check,
  CheckCircle2,
  ChevronDown,
  Columns3,
  MessageCircle,
  Sparkles,
  X,
} from "lucide-react";
import { useModalFocus } from "@/app/components/useModalFocus";
import { captureCampaign } from "@/lib/campaign-attribution";
import { trackPackageAction, trackPackageEvent } from "@/lib/package-analytics";
import {
  additionalSpecialisedServices,
  homePackageExperiences,
  importantPackageInformation,
  packageExperiences,
  packagePath,
  type HomePackageCategory,
  type PackageExperience,
  type PackageOption,
} from "@/lib/packages";
import { BUILDER_WHATSAPP_NUMBER } from "@/lib/project-brief";
import { enquiryErrorMessage, submitEnquiry } from "@/lib/submit-enquiry";
import styles from "./packages.module.css";

type ActiveCategoryFilter = HomePackageCategory | "all";

const categoryTabs: { id: HomePackageCategory; label: string; shortLabel: string }[] = [
  { id: "conferences", label: "Conference & Corporate", shortLabel: "Corporate" },
  { id: "weddings", label: "Wedding & Social Events", shortLabel: "Celebrations" },
  { id: "video-production", label: "Video Production", shortLabel: "Video Production" },
];

const whatsappHref = (topic: string) =>
  `https://wa.me/${BUILDER_WHATSAPP_NUMBER}?text=${encodeURIComponent(
    `Hello Mosi Media Solutions, I'd like to discuss ${topic}.`,
  )}`;

function resolveInitialCategory(param: string | null): ActiveCategoryFilter {
  if (param === "conferences" || param === "weddings" || param === "video-production" || param === "all") {
    return param;
  }
  return "conferences";
}

function PackagesCatalogueInner() {
  const searchParams = useSearchParams();
  const [userCategory, setUserCategory] = useState<ActiveCategoryFilter | null>(null);
  const activeCategory = userCategory ?? resolveInitialCategory(searchParams.get("category"));
  const [expandedCompare, setExpandedCompare] = useState<Record<string, boolean>>({});
  const [detailTarget, setDetailTarget] = useState<{
    category: PackageExperience;
    option: PackageOption;
  } | null>(null);
  const [quoteTarget, setQuoteTarget] = useState<{
    category: PackageExperience;
    packageId: string;
    packageName: string;
    customTopic?: string;
  } | null>(null);

  // Direct Contextual Quote Form state
  const [quotePackageId, setQuotePackageId] = useState("tailored");
  const [quoteDate, setQuoteDate] = useState("");
  const [quoteVenue, setQuoteVenue] = useState("");
  const [quoteGuests, setQuoteGuests] = useState("");
  const [quoteName, setQuoteName] = useState("");
  const [quoteEmail, setQuoteEmail] = useState("");
  const [quotePhone, setQuotePhone] = useState("");
  const [quoteNotes, setQuoteNotes] = useState("");
  const [quoteLoading, setQuoteLoading] = useState(false);
  const [quoteError, setQuoteError] = useState<string | null>(null);
  const [quoteReference, setQuoteReference] = useState<string | null>(null);

  const detailModalRef = useRef<HTMLDivElement>(null);
  const quoteModalRef = useRef<HTMLDivElement>(null);

  useModalFocus(detailTarget !== null, detailModalRef, () => setDetailTarget(null));
  useModalFocus(quoteTarget !== null, quoteModalRef, () => setQuoteTarget(null));

  const selectCategory = (next: ActiveCategoryFilter) => {
    setUserCategory(next);
    trackPackageAction("package_category_view", next);
    document.getElementById("catalogue")?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const toggleCompare = (category: PackageExperience) => {
    setExpandedCompare(prev => {
      const next = !prev[category.slug];
      if (next) trackPackageAction("package_compare", category.slug);
      return { ...prev, [category.slug]: next };
    });
  };

  const openDetailsModal = (category: PackageExperience, option: PackageOption) => {
    trackPackageAction("package_inclusions_open", category.slug, option.id);
    setDetailTarget({ category, option });
  };

  const openQuoteModal = (
    category: PackageExperience,
    packageId: string,
    customTopic?: string,
  ) => {
    const matched = category.options.find(opt => opt.id === packageId);
    const pkgName = matched?.name ?? "Tailored Recommendation";
    setDetailTarget(null);
    setQuoteTarget({ category, packageId, packageName: pkgName, customTopic });
    setQuotePackageId(matched ? matched.id : "tailored");
    setQuoteError(null);
    setQuoteReference(null);
    if (customTopic) {
      setQuoteNotes(prev => (prev ? prev : `Interested in: ${customTopic}`));
    }
    trackPackageAction("package_quote_open", category.slug, matched ? matched.id : "tailored");
    trackPackageEvent("package_select", category.slug, matched ? matched.id : "tailored");
  };

  async function handleQuoteSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!quoteTarget || quoteLoading || quoteReference) return;

    setQuoteLoading(true);
    setQuoteError(null);

    const activeOption = quoteTarget.category.options.find(opt => opt.id === quotePackageId);
    const selectedLabel = activeOption?.name ?? "Help me choose the right package";
    const summaryParts = [
      `Quote enquiry for ${selectedLabel} (${quoteTarget.category.title})`,
      quoteTarget.customTopic ? `Requested topic: ${quoteTarget.customTopic}` : "",
      quoteGuests.trim() ? `Guests / attendees: ${quoteGuests.trim()}` : "",
      quoteVenue.trim() ? `Venue / location: ${quoteVenue.trim()}` : "",
      quoteNotes.trim() ? `Notes: ${quoteNotes.trim()}` : "",
    ].filter(Boolean);

    try {
      const result = await submitEnquiry("/api/leads", {
        kind: "package",
        category: quoteTarget.category.slug,
        packageId: activeOption ? activeOption.id : "tailored",
        name: quoteName,
        email: quoteEmail,
        phone: quotePhone || undefined,
        date: quoteDate || undefined,
        location: quoteVenue.trim() || undefined,
        details: summaryParts.join("\n"),
        website: "",
        attribution: captureCampaign(),
      });
      const ref = result.reference || `MMS-${result.submissionId}`;
      setQuoteReference(ref);
      trackPackageEvent("generate_lead", quoteTarget.category.slug, activeOption ? activeOption.id : "tailored");
    } catch (cause) {
      setQuoteError(enquiryErrorMessage(cause));
    } finally {
      setQuoteLoading(false);
    }
  }

  const visibleCategories =
    activeCategory === "all"
      ? homePackageExperiences
      : homePackageExperiences.filter(item => item.slug === activeCategory);

  const primaryFocusedCategory =
    activeCategory === "all"
      ? homePackageExperiences[0]
      : homePackageExperiences.find(item => item.slug === activeCategory) ?? homePackageExperiences[0];

  return (
    <>
      {/* Sticky Category Switcher & Navigation Bar */}
      <nav aria-label="Package categories" className={styles.stickyNav}>
        <div className={styles.stickyNavInner}>
          {categoryTabs.map(tab => {
            const isActive = activeCategory === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                aria-pressed={isActive}
                onClick={() => selectCategory(tab.id)}
                className={`${styles.navPill} ${isActive ? styles.navPillActive : ""}`}
              >
                {tab.shortLabel}
              </button>
            );
          })}
          <button
            type="button"
            aria-pressed={activeCategory === "all"}
            onClick={() => selectCategory("all")}
            className={`${styles.navPill} ${activeCategory === "all" ? styles.navPillActive : ""}`}
          >
            All Categories (9)
          </button>
          <a className={styles.navPill} href="#other-services">
            Other Services
          </a>
          <a className={styles.navPill} href="#package-info">
            Package Info
          </a>
          <div className={styles.navAction}>
            <button
              type="button"
              onClick={() => openQuoteModal(primaryFocusedCategory, "tailored")}
              className={styles.primaryCta}
              style={{ minHeight: "40px", padding: "0.45rem 1rem", fontSize: "0.78rem", cursor: "pointer" }}
            >
              <span>Discuss Your Project</span>
              <ArrowRight size={14} aria-hidden="true" />
            </button>
          </div>
        </div>
      </nav>

      {/* Main Package Decision Area */}
      <div id="catalogue" className={styles.catalogueSection}>
        {/* Visible "Not Sure? Talk to Our Team" Guidance Above Cards */}
        <div className={styles.unsureBanner}>
          <div className={styles.unsureText}>
            <p className={styles.unsureTitle}>Not sure which package or tier fits your event?</p>
            <p className={styles.unsureDesc}>
              Tell us your date, venue and audience — our team will recommend the right setup without guesswork.
            </p>
          </div>
          <div className={styles.unsureActions}>
            <button
              type="button"
              onClick={() => openQuoteModal(primaryFocusedCategory, "tailored")}
              className={styles.secondaryBtn}
              style={{ width: "auto" }}
            >
              <Sparkles size={15} aria-hidden="true" />
              <span>Not Sure? Talk to Our Team</span>
            </button>
            <a
              href={whatsappHref("Mosi Media Solutions packages")}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => trackPackageAction("package_whatsapp_click", primaryFocusedCategory.slug)}
              className={styles.whatsappBtn}
            >
              <MessageCircle size={15} aria-hidden="true" />
              <span>Chat on WhatsApp</span>
            </a>
          </div>
        </div>

        {/* Active Category (or All 3 Categories) */}
        {visibleCategories.map((category, categoryIndex) => {
          const isCompareOpen = Boolean(expandedCompare[category.slug]);
          const compareTableId = `${category.slug}-comparison`;

          return (
            <section
              key={category.slug}
              id={
                category.slug === "conferences"
                  ? "conference-packages"
                  : category.slug === "weddings"
                    ? "social-event-packages"
                    : "video-production-packages"
              }
              className={categoryIndex > 0 ? `${styles.categoryBand} pt-10 mt-10` : ""}
              aria-labelledby={`${category.slug}-heading`}
            >
              <div className={styles.sectionHeaderRow}>
                <div>
                  <p className={styles.eyebrow}>{category.homeTitle ?? category.title}</p>
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
                    onClick={() => toggleCompare(category)}
                    className={styles.compareToggle}
                  >
                    <Columns3 size={16} aria-hidden="true" />
                    <span>{isCompareOpen ? "Hide comparison" : "Compare packages"}</span>
                  </button>
                  <Link href={packagePath(category.slug)} className={styles.navPill}>
                    Full Package Details →
                  </Link>
                </div>
              </div>

              {/* Level 1: Three Consistently Sized Package Cards */}
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
                      {option.outcome && <p className={styles.outcomeLine}>{option.outcome}</p>}
                      <p className={styles.packageIdeal}>{option.for}</p>
                      {option.crewSummary && (
                        <div className={styles.crewBadge}>{option.crewSummary}</div>
                      )}

                      <div className={styles.highlightsDivider}>
                        <p className={styles.highlightsLabel}>Core inclusions</p>
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
                        <p className={styles.priceApproach}>Custom quote · Tailored to your event</p>
                        <button
                          type="button"
                          onClick={() => openQuoteModal(category, option.id)}
                          className={styles.primaryCta}
                          style={{ width: "100%", border: 0, cursor: "pointer" }}
                        >
                          <span>Request a Quote</span>
                          <ArrowRight size={15} aria-hidden="true" />
                        </button>
                        <button
                          type="button"
                          onClick={() => openDetailsModal(category, option)}
                          className={styles.secondaryBtn}
                          aria-haspopup="dialog"
                        >
                          See What&apos;s Included
                        </button>
                      </div>
                    </article>
                  );
                })}
              </div>

              {/* Expandable Side-by-Side Comparison Table */}
              {isCompareOpen && (
                <div
                  id={compareTableId}
                  className={styles.compareWrap}
                  role="region"
                  aria-label={`${category.title} comparison`}
                >
                  <table className={styles.compareTable}>
                    <thead>
                      <tr>
                        <th scope="col">Comparison</th>
                        {category.options.map(option => (
                          <th key={option.id} scope="col">
                            {option.name} ({option.badge})
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
                        <th scope="row">Audio &amp; AV</th>
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
                        <th scope="row">Special / conditional features</th>
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
                      <tr>
                        <th scope="row">Next step</th>
                        {category.options.map(option => (
                          <td key={option.id}>
                            <button
                              type="button"
                              onClick={() => openQuoteModal(category, option.id)}
                              className={styles.secondaryBtn}
                              style={{ width: "auto", minHeight: "38px", padding: "0.35rem 0.9rem" }}
                            >
                              Request a Quote →
                            </button>
                          </td>
                        ))}
                      </tr>
                    </tbody>
                  </table>
                </div>
              )}

              {/* Collapsed Optional Add-ons (prominent maroon emphasis; expands when clicked) */}
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
                          <button
                            type="button"
                            className={styles.addOnsItemBtn}
                            onClick={() => openQuoteModal(category, "tailored", `Add-on: ${addon}`)}
                          >
                            Add to quote →
                          </button>
                        </li>
                      ))}
                    </ul>
                  </div>
                </details>
              ) : null}

              {/* Genuine MMS Work Evidence for this Category */}
              {category.featuredWork?.length ? (
                <div className={styles.workStrip}>
                  <div className={styles.workHeader}>
                    <h3>Real MMS Productions in This Category</h3>
                    <Link href="/projects" className={styles.workLink}>
                      View all completed projects →
                    </Link>
                  </div>
                  <div className={styles.workGrid}>
                    {category.featuredWork.map(project => (
                      <article key={project.title} className={styles.workCard}>
                        <div className={styles.workThumb}>
                          <Image
                            src={project.image}
                            alt={project.title}
                            fill
                            sizes="(max-width:639px) 95vw, 220px"
                          />
                        </div>
                        <div className={styles.workBody}>
                          <p className={styles.workMeta}>{project.category}</p>
                          <h4 className={styles.workTitle}>{project.title}</h4>
                          <p className={styles.workDesc}>{project.desc}</p>
                          <div className={styles.workTags}>
                            {project.tags.map(tag => (
                              <span key={tag} className={styles.workTag}>
                                {tag}
                              </span>
                            ))}
                          </div>
                        </div>
                      </article>
                    ))}
                  </div>
                </div>
              ) : null}

              {/* In-category Unsure Fallback */}
              <div className={`${styles.unsureBanner} ${styles.unsureBannerInline}`}>
                <div className={styles.unsureText}>
                  <p className={styles.unsureTitle}>
                    Need help deciding within {category.homeTitle ?? category.title}?
                  </p>
                  <p className={styles.unsureDesc}>
                    Share your rough plans and we&apos;ll recommend the right crew, equipment and deliverables.
                  </p>
                </div>
                <div className={styles.unsureActions}>
                  <button
                    type="button"
                    onClick={() => openQuoteModal(category, "tailored")}
                    className={styles.primaryCta}
                    style={{ border: 0, cursor: "pointer" }}
                  >
                    <span>Get Advice &amp; Quote</span>
                    <ArrowRight size={15} aria-hidden="true" />
                  </button>
                  <a
                    href={whatsappHref(category.title)}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() => trackPackageAction("package_whatsapp_click", category.slug)}
                    className={styles.whatsappBtn}
                  >
                    <MessageCircle size={15} aria-hidden="true" />
                    <span>WhatsApp</span>
                  </a>
                </div>
              </div>
            </section>
          );
        })}
      </div>

      {/* Additional Specialised Services + Standalone Production */}
      <section
        id="other-services"
        className={`${styles.catalogueSection} ${styles.categoryBand}`}
        aria-labelledby="specialised-title"
      >
        <div id="specialised-services">
          <p className={styles.eyebrow}>Additional Specialised Services</p>
          <h2 id="specialised-title" className={styles.sectionTitle}>
            Incorporate Individual Services Into Any Package
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
                Mix any audio, visual, staging, special effects or marketing service into one tailored quote.
              </p>
            </div>
            <button
              type="button"
              onClick={() =>
                openQuoteModal(
                  primaryFocusedCategory,
                  "tailored",
                  "Custom combination of specialised services",
                )
              }
              className={`${styles.secondaryBtn} mt-4`}
            >
              Build a Custom Solution →
            </button>
          </article>
        </div>

        <div style={{ marginTop: "2.5rem" }}>
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
        <div className="flex flex-wrap items-center justify-center gap-3">
          <button
            type="button"
            onClick={() => openQuoteModal(primaryFocusedCategory, "tailored")}
            className={styles.primaryCta}
            style={{ minHeight: "48px", padding: "0.75rem 1.75rem", border: 0, cursor: "pointer" }}
          >
            <span>Discuss Your Project</span>
            <ArrowRight size={16} aria-hidden="true" />
          </button>
          <a
            href={whatsappHref("a tailored production quote")}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => trackPackageAction("package_whatsapp_click", primaryFocusedCategory.slug)}
            className={styles.whatsappBtn}
            style={{ minHeight: "48px", padding: "0.75rem 1.4rem" }}
          >
            <MessageCircle size={16} aria-hidden="true" />
            <span>Chat on WhatsApp</span>
          </a>
        </div>
      </section>

      {/* Level-2 Accessible Inclusions Modal ("See What's Included") */}
      {detailTarget && (
        <div
          className={styles.modalBackdrop}
          role="presentation"
          onClick={() => setDetailTarget(null)}
        >
          <div
            ref={detailModalRef}
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
              <Link href={packagePath(detailTarget.category.slug)} className={styles.workLink}>
                Full Package Details →
              </Link>
              <button
                type="button"
                onClick={() => openQuoteModal(detailTarget.category, detailTarget.option.id)}
                className={styles.primaryCta}
                style={{ border: 0, cursor: "pointer" }}
              >
                <span>Request a Quote for {detailTarget.option.name}</span>
                <ArrowRight size={15} aria-hidden="true" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* P0 Direct Contextual Quote Modal ("Request a Quote") */}
      {quoteTarget && (
        <div
          className={styles.modalBackdrop}
          role="presentation"
          onClick={() => setQuoteTarget(null)}
        >
          <div
            ref={quoteModalRef}
            className={styles.modalPanel}
            role="dialog"
            aria-modal="true"
            aria-labelledby="quote-modal-title"
            onClick={event => event.stopPropagation()}
          >
            <div className={styles.modalHeader}>
              <div>
                <span className={styles.quoteContextChip}>{quoteTarget.category.title}</span>
                <h3 id="quote-modal-title" className={styles.packageCardTitle} style={{ marginBottom: ".2rem" }}>
                  Request a Tailored Quote
                </h3>
                <p className={styles.tierSubtitle} style={{ margin: 0 }}>
                  Your selected package details are included automatically — no lengthy form required.
                </p>
              </div>
              <button
                type="button"
                className={styles.modalClose}
                onClick={() => setQuoteTarget(null)}
                aria-label="Close quote form"
              >
                <X size={18} aria-hidden="true" />
              </button>
            </div>

            {quoteReference ? (
              <div className={styles.quoteSuccess} role="status">
                <div className="flex items-center gap-2 text-[#166534]">
                  <CheckCircle2 size={22} aria-hidden="true" />
                  <h4>Your quote request has been saved</h4>
                </div>
                <p>
                  Thank you, <strong>{quoteName}</strong>. Our team will review your{" "}
                  <strong>
                    {quoteTarget.category.options.find(opt => opt.id === quotePackageId)?.name ??
                      "tailored package"}
                  </strong>{" "}
                  request and follow up with availability and a detailed quotation.
                </p>
                <p>
                  Enquiry reference: <strong>{quoteReference}</strong>
                </p>
                <div className="flex flex-wrap items-center gap-3 pt-2">
                  <a
                    href={whatsappHref(
                      `${quoteTarget.category.title} (${quoteReference})`,
                    )}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={styles.whatsappBtn}
                  >
                    <MessageCircle size={15} aria-hidden="true" />
                    <span>Message us on WhatsApp</span>
                  </a>
                  <button
                    type="button"
                    onClick={() => setQuoteTarget(null)}
                    className={styles.secondaryBtn}
                    style={{ width: "auto" }}
                  >
                    Back to packages
                  </button>
                </div>
              </div>
            ) : (
              <form className={styles.quoteForm} onSubmit={handleQuoteSubmit} aria-busy={quoteLoading}>
                <label className={styles.quoteField}>
                  <span>Selected package</span>
                  <select
                    name="packageId"
                    value={quotePackageId}
                    onChange={event => {
                      setQuotePackageId(event.target.value);
                      trackPackageEvent("package_select", quoteTarget.category.slug, event.target.value);
                    }}
                  >
                    <option value="tailored">Not sure — help me choose the right package</option>
                    {quoteTarget.category.options.map(option => (
                      <option key={option.id} value={option.id}>
                        {option.name} ({option.tierLabel})
                      </option>
                    ))}
                  </select>
                </label>

                <div className={styles.quoteFormGrid}>
                  <label className={styles.quoteField}>
                    <span>Event / project date (optional)</span>
                    <input
                      type="date"
                      name="date"
                      value={quoteDate}
                      onChange={event => setQuoteDate(event.target.value)}
                    />
                  </label>
                  <label className={styles.quoteField}>
                    <span>Guests / attendees (optional)</span>
                    <input
                      type="text"
                      name="guests"
                      maxLength={80}
                      placeholder="e.g. 120 delegates"
                      value={quoteGuests}
                      onChange={event => setQuoteGuests(event.target.value)}
                    />
                  </label>
                </div>

                <label className={styles.quoteField}>
                  <span>Venue or location (optional)</span>
                  <input
                    type="text"
                    name="location"
                    maxLength={200}
                    placeholder="e.g. Victoria Falls, Harare, or venue name"
                    value={quoteVenue}
                    onChange={event => setQuoteVenue(event.target.value)}
                  />
                </label>

                <div className={styles.quoteFormGrid}>
                  <label className={styles.quoteField}>
                    <span>Your name</span>
                    <input
                      type="text"
                      name="name"
                      autoComplete="name"
                      required
                      maxLength={120}
                      value={quoteName}
                      onChange={event => setQuoteName(event.target.value)}
                    />
                  </label>
                  <label className={styles.quoteField}>
                    <span>Email address</span>
                    <input
                      type="email"
                      name="email"
                      autoComplete="email"
                      required
                      maxLength={254}
                      value={quoteEmail}
                      onChange={event => setQuoteEmail(event.target.value)}
                    />
                  </label>
                </div>

                <label className={styles.quoteField}>
                  <span>Phone / WhatsApp (optional)</span>
                  <input
                    type="tel"
                    name="phone"
                    autoComplete="tel"
                    maxLength={32}
                    pattern={String.raw`\+?[0-9 \(\)\-]{7,32}`}
                    placeholder="+263 ..."
                    value={quotePhone}
                    onChange={event => setQuotePhone(event.target.value)}
                  />
                </label>

                <label className={styles.quoteField}>
                  <span>Anything else we should know? (optional)</span>
                  <textarea
                    name="details"
                    rows={3}
                    maxLength={4000}
                    placeholder="Optional add-ons, streaming needs, or questions..."
                    value={quoteNotes}
                    onChange={event => setQuoteNotes(event.target.value)}
                  />
                </label>

                {quoteError && (
                  <p role="alert" className={styles.quoteError}>
                    {quoteError}
                  </p>
                )}

                <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
                  <p className={styles.quoteHelp}>
                    Submitting requests a consultation &amp; quote — it does not lock in a booking.
                  </p>
                  <button
                    type="submit"
                    disabled={quoteLoading}
                    className={styles.primaryCta}
                    style={{ border: 0, cursor: "pointer", padding: "0.7rem 1.5rem" }}
                  >
                    <span>{quoteLoading ? "Sending request…" : "Send Quote Request"}</span>
                    <ArrowRight size={15} aria-hidden="true" />
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </>
  );
}

export default function PackagesCatalogue() {
  return (
    <Suspense fallback={null}>
      <PackagesCatalogueInner />
    </Suspense>
  );
}
