"use client";

import { submitEnquiry, enquiryErrorMessage } from "@/lib/submit-enquiry";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  CheckCircle,
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  Layers,
  ListChecks,
} from "lucide-react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import FitImage from "../components/FitImage";
import {
  approachStages,
  specialisations,
  whyChooseBenefits,
} from "./conferenceData";

const primaryButton = "mms-button group";

const services = [
  "Sound and microphones",
  "Screens and projection",
  "Photography",
  "Video recording",
  "Multi-camera production",
  "Live streaming",
  "Event branding",
  "Event lighting and stage setup",
  "Highlight video",
  "Post-event content",
];

export default function ConferencesAndEventsPage() {
  const [activeStageIdx, setActiveStageIdx] = useState(0);
  const [showAllStages, setShowAllStages] = useState(false);

  const [submitted, setSubmitted] = useState(false);
  const [reference, setReference] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const currentStage = approachStages[activeStageIdx];

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (loading) return;
    setError(null);
    setLoading(true);
    const data = new FormData(e.currentTarget);
    const field = (name: string) => String(data.get(name) ?? "");
    const body = {
      organisation: field("organisation"),
      contact: field("contact"),
      email: field("email"),
      phone: field("phone"),
      eventType: field("eventType"),
      date: field("date"),
      delegates: field("delegates"),
      venue: field("venue"),
      organisationType: field("organisationType"),
      services: data.getAll("services").map(String),
      details: field("details"),
      website: field("website"),
    };
    try {
      const result = await submitEnquiry("/api/conference-enquiry", body);
      setReference(result.reference ?? `MMS-${result.submissionId}`);
      setSubmitted(true);
    } catch (err) {
      setError(enquiryErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#e4e4e4] text-[#050507] font-sans">
      <Navbar />

      {/* Hero */}
      <section className="conference-hero relative min-h-[70svh] w-full overflow-hidden flex items-center justify-center bg-black">
        <Image
          src="/mms/conference%20hero%20img.png"
          alt="Conferences and Events"
          fill
          sizes="100vw"
          className="object-cover object-center"
          style={{ opacity: 0.5 }}
          preload
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#050507] via-[#050507]/45 to-[#050507]/60" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#050507]/85 via-transparent to-transparent" />
        <div className="relative z-10 max-w-[1600px] mx-auto mms-gutter w-full pt-28 pb-16">
          <span className="text-[10px] tracking-[0.4em] text-brand-accent uppercase font-semibold block mb-4">
            Conference &amp; Corporate Events
          </span>
          <h1 className="text-4xl sm:text-5xl md:text-6xl xl:text-7xl font-semibold text-white font-heading leading-[1.05] max-w-4xl mb-4">
            Conferences and Events
          </h1>
          <p className="text-base md:text-lg text-white/90 font-medium tracking-wide max-w-2xl mb-4">
            Exceptional Events. Seamless Experiences. Unforgettable Connections.
          </p>
          <p className="text-sm md:text-base text-brand-foreground/80 font-light leading-relaxed max-w-2xl mb-8">
            At Mosi Media Solutions, we specialise in the planning, coordination,
            production and management of professional conferences, corporate
            gatherings and business events — bringing together creativity,
            technology, hospitality and professional event management.
          </p>
          <div className="flex flex-wrap gap-4">
            <a
              data-lead-cta
              href="#enquiry"
              className={`${primaryButton} px-7 py-3.5 text-[11px] uppercase tracking-[0.18em]`}
            >
              <span className="relative z-10">Request an Event Proposal</span>
              <ArrowRight className="relative z-10 ml-2 h-4 w-4" />
            </a>
            <Link
              href="/contact"
              className="inline-flex items-center gap-2 px-7 py-3.5 rounded-full border border-brand-accent/40 text-brand-foreground/90 text-[11px] uppercase tracking-[0.18em] hover:border-brand-accent hover:text-white transition-all duration-300"
            >
              Speak to Our Events Team
            </Link>
          </div>
        </div>
      </section>

      {/* Trust strip */}
      <section className="relative z-10 max-w-[1600px] mx-auto mms-gutter -mt-4">
        <div className="bg-[#efefef] rounded-3xl border border-[#050507]/12 shadow-lg p-6 md:p-8">
          <div
            data-stagger
            className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center divide-y md:divide-y-0 md:divide-x divide-[#050507]/12"
          >
            {[
              { value: "11-Stage", label: "End-to-End Delivery" },
              { value: "24hr", label: "Proposal Response" },
              { value: "Hybrid & Live", label: "Technical Production" },
              { value: "Victoria Falls", label: "Destination Knowledge" },
            ].map((item) => (
              <div
                key={item.label}
                className="flex flex-col items-center justify-center p-3 pt-5 md:p-0"
              >
                <p className="text-[10px] tracking-[0.15em] text-[#7f141f] uppercase font-bold mb-1">
                  {item.value}
                </p>
                <p className="text-xs text-[#050507] font-semibold">
                  {item.label}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Overview */}
      <section className="py-12 sm:py-16 md:py-20 max-w-[1600px] mx-auto mms-gutter">
        <div className="bg-[#efefef] rounded-3xl border border-[#050507]/12 p-6 sm:p-10 md:p-12 shadow-sm grid grid-cols-1 lg:grid-cols-[1.15fr_0.85fr] gap-8 lg:gap-12 items-center">
          <div className="space-y-4">
            <span className="text-[10px] tracking-[0.35em] text-[#7f141f] uppercase font-bold block font-heading">
              Comprehensive Event Solutions
            </span>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-semibold text-[#050507] font-heading leading-tight">
              We don&apos;t just provide event services. We bring your entire event vision to life.
            </h2>
            <p className="text-sm sm:text-base text-[#050507]/85 leading-relaxed">
              Whether you are organising an international conference, corporate
              retreat, executive meeting, product launch, business summit,
              awards ceremony, gala dinner or team-building experience, our team
              provides comprehensive event solutions tailored to your
              organisation&apos;s objectives, brand identity and budget.
            </p>
            <p className="text-sm sm:text-base text-[#050507]/85 leading-relaxed">
              From the first planning meeting to the final guest departure, we
              take care of the details so that you can focus on what matters
              most: connecting with your audience, building relationships and
              achieving your event objectives.
            </p>
          </div>
          <div className="relative aspect-[16/10] rounded-2xl overflow-hidden border border-[#050507]/10">
            <Image
              src="/mms/DSC_9244.jpg"
              alt="Conference stage and delegate seating"
              fill
              sizes="(max-width:1023px) 100vw, 40vw"
              className="object-cover object-center"
            />
          </div>
        </div>
      </section>

      {/* End-to-End 11-Stage Interactive Explorer */}
      <section
        id="approach"
        className="py-10 sm:py-16 md:py-20 max-w-[1600px] mx-auto mms-gutter"
      >
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
          <div className="max-w-2xl">
            <span className="text-[10px] tracking-[0.4em] text-[#7f141f] uppercase font-semibold block mb-3 font-heading">
              Our End-to-End Event Management Approach
            </span>
            <h2 className="text-3xl md:text-5xl font-semibold text-[#050507] font-heading mb-3">
              From First Consultation to Post-Event Delivery
            </h2>
            <p className="text-sm sm:text-base text-[#050507]/85 leading-relaxed">
              We believe that a successful event begins long before the first
              guest arrives. Explore each of our 11 structured planning and
              execution stages below.
            </p>
          </div>
          <button
            type="button"
            onClick={() => setShowAllStages((prev) => !prev)}
            className="inline-flex items-center gap-2 self-start md:self-auto px-5 py-2.5 rounded-full border border-[#7f141f]/35 bg-[#efefef] text-[#050507] text-xs font-semibold hover:border-[#7f141f] hover:bg-[#7f141f] hover:text-white transition-all duration-200 cursor-pointer"
          >
            {showAllStages ? (
              <>
                <Layers className="w-4 h-4" />
                <span>Interactive Stage View</span>
              </>
            ) : (
              <>
                <ListChecks className="w-4 h-4" />
                <span>View All 11 Stages</span>
              </>
            )}
          </button>
        </div>

        {!showAllStages ? (
          <div className="grid grid-cols-1 lg:grid-cols-[240px_1fr] gap-5 items-start">
            {/* Stage selector rail */}
            <div
              role="tablist"
              aria-label="Event management stages"
              className="flex lg:flex-col gap-1.5 overflow-x-auto lg:overflow-visible pb-2 lg:pb-0"
            >
              {approachStages.map((stage, idx) => {
                const isActive = idx === activeStageIdx;
                return (
                  <button
                    key={stage.step}
                    type="button"
                    role="tab"
                    aria-selected={isActive}
                    onClick={() => setActiveStageIdx(idx)}
                    className={`flex items-center gap-2.5 px-3 py-2 rounded-xl border text-left transition-all duration-200 shrink-0 lg:shrink cursor-pointer ${
                      isActive
                        ? "bg-[#7f141f] border-[#7f141f] text-white shadow-sm"
                        : "bg-[#efefef] border-[#050507]/12 text-[#050507] hover:border-[#7f141f]/45"
                    }`}
                  >
                    <span
                      className={`text-[11px] font-bold font-heading px-1.5 py-0.5 rounded-full shrink-0 ${
                        isActive
                          ? "bg-white/20 text-white"
                          : "bg-[#7f141f]/10 text-[#7f141f]"
                      }`}
                    >
                      {stage.step}
                    </span>
                    <span className="text-xs font-semibold whitespace-nowrap lg:whitespace-normal leading-snug">
                      {stage.shortTitle}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Active stage detail card */}
            <div
              role="tabpanel"
              className="bg-[#efefef] rounded-3xl border border-[#050507]/12 p-6 sm:p-8 lg:p-10 shadow-sm space-y-6"
            >
              <div className="grid grid-cols-1 xl:grid-cols-[0.95fr_1.15fr] gap-6 lg:gap-8 items-center border-b border-[#050507]/10 pb-6">
                <div className="space-y-3">
                  <div>
                    <span className="text-[10px] tracking-[0.3em] text-[#7f141f] uppercase font-bold block mb-1.5 font-heading">
                      Stage {currentStage.step} of {approachStages.length}
                    </span>
                    <h3 className="text-2xl sm:text-3xl font-semibold text-[#050507] font-heading leading-tight">
                      {currentStage.title}
                    </h3>
                  </div>
                  <p className="text-base sm:text-lg font-medium text-[#050507]">
                    {currentStage.lead}
                  </p>
                  {currentStage.paragraphs.map((p) => (
                    <p
                      key={p}
                      className="text-sm sm:text-base text-[#050507]/85 leading-relaxed"
                    >
                      {p}
                    </p>
                  ))}
                </div>
                <div className="relative aspect-[4/3] w-full rounded-3xl overflow-hidden border border-[#050507]/12 bg-white shadow-sm">
                  <FitImage
                    src={currentStage.image}
                    alt={currentStage.imageAlt}
                    sizes="(max-width:1279px) 100vw, 48vw"
                  />
                </div>
              </div>

              {currentStage.listIntro && (
                <p className="text-xs uppercase tracking-[0.22em] text-[#7f141f] font-bold">
                  {currentStage.listIntro}
                </p>
              )}

              <div
                className={`grid gap-6 ${
                  currentStage.groups.length > 1
                    ? "grid-cols-1 md:grid-cols-3"
                    : "grid-cols-1"
                }`}
              >
                {currentStage.groups.map((group, gIdx) => (
                  <div
                    key={group.heading ?? gIdx}
                    className={
                      currentStage.groups.length > 1
                        ? "bg-white/80 rounded-2xl border border-[#050507]/10 p-5"
                        : ""
                    }
                  >
                    {group.heading && (
                      <h4 className="text-sm font-semibold text-[#7f141f] mb-3 font-heading">
                        {group.heading}
                      </h4>
                    )}
                    <ul
                      className={`grid gap-2.5 ${
                        currentStage.groups.length === 1
                          ? "grid-cols-1 sm:grid-cols-2"
                          : "grid-cols-1"
                      }`}
                    >
                      {group.items.map((item) => (
                        <li
                          key={item}
                          className="flex items-start gap-2.5 text-sm text-[#050507]/90 leading-snug"
                        >
                          <CheckCircle className="w-4 h-4 text-[#7f141f] shrink-0 mt-0.5" />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>

              {currentStage.outro && (
                <p className="text-sm text-[#050507]/80 leading-relaxed pt-2 border-t border-[#050507]/10">
                  {currentStage.outro}
                </p>
              )}

              <div className="flex items-center justify-between pt-4 border-t border-[#050507]/10">
                <button
                  type="button"
                  disabled={activeStageIdx === 0}
                  onClick={() => setActiveStageIdx((i) => Math.max(0, i - 1))}
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full border border-[#050507]/15 text-xs font-semibold text-[#050507] hover:border-[#7f141f] hover:text-[#7f141f] disabled:opacity-35 transition-colors cursor-pointer"
                >
                  <ChevronLeft className="w-4 h-4" />
                  Previous Stage
                </button>
                <button
                  type="button"
                  disabled={activeStageIdx === approachStages.length - 1}
                  onClick={() =>
                    setActiveStageIdx((i) =>
                      Math.min(approachStages.length - 1, i + 1)
                    )
                  }
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full border border-[#7f141f]/40 text-xs font-semibold text-[#7f141f] hover:bg-[#7f141f] hover:text-white disabled:opacity-35 transition-colors cursor-pointer"
                >
                  Next Stage
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            {approachStages.map((stage) => (
              <details
                key={stage.step}
                open={stage.step === "01"}
                className="group bg-[#efefef] rounded-2xl border border-[#050507]/12 overflow-hidden"
              >
                <summary className="flex items-center justify-between gap-4 px-6 py-5 cursor-pointer list-none font-heading font-semibold text-[#050507] hover:text-[#7f141f] transition-colors">
                  <div className="flex items-center gap-3">
                    <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-[#7f141f]/10 text-[#7f141f]">
                      {stage.step}
                    </span>
                    <span className="text-base sm:text-lg">{stage.title}</span>
                  </div>
                  <ChevronRight className="w-4 h-4 shrink-0 transition-transform duration-200 group-open:rotate-90 text-[#7f141f]" />
                </summary>
                <div className="px-6 pb-6 pt-2 border-t border-[#050507]/10 space-y-4">
                  <p className="text-sm sm:text-base font-medium text-[#050507]">
                    {stage.lead}
                  </p>
                  {stage.paragraphs.map((p) => (
                    <p
                      key={p}
                      className="text-sm text-[#050507]/85 leading-relaxed"
                    >
                      {p}
                    </p>
                  ))}
                  {stage.listIntro && (
                    <p className="text-xs uppercase tracking-[0.2em] text-[#7f141f] font-bold">
                      {stage.listIntro}
                    </p>
                  )}
                  <div
                    className={`grid gap-5 ${
                      stage.groups.length > 1
                        ? "grid-cols-1 md:grid-cols-3"
                        : "grid-cols-1"
                    }`}
                  >
                    {stage.groups.map((group, gIdx) => (
                      <div key={group.heading ?? gIdx}>
                        {group.heading && (
                          <h4 className="text-sm font-semibold text-[#7f141f] mb-2.5 font-heading">
                            {group.heading}
                          </h4>
                        )}
                        <ul
                          className={`grid gap-2 ${
                            stage.groups.length === 1
                              ? "grid-cols-1 sm:grid-cols-2"
                              : "grid-cols-1"
                          }`}
                        >
                          {group.items.map((item) => (
                            <li
                              key={item}
                              className="flex items-start gap-2 text-sm text-[#050507]/90"
                            >
                              <CheckCircle className="w-4 h-4 text-[#7f141f] shrink-0 mt-0.5" />
                              <span>{item}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </div>
                  {stage.outro && (
                    <p className="text-sm text-[#050507]/80 leading-relaxed pt-2">
                      {stage.outro}
                    </p>
                  )}
                </div>
              </details>
            ))}
          </div>
        )}
      </section>

      {/* Specialisations (Dark band) */}
      <section className="relative py-20 overflow-hidden bg-black border-t border-b border-brand-accent/15">
        <div className="absolute inset-0 z-0">
          <Image
            src="/victoria_falls_banner.png"
            alt="Victoria Falls"
            fill
            sizes="100vw"
            className="object-cover object-center pointer-events-none"
            style={{ opacity: 0.25 }}
          />
          <div className="absolute inset-0 bg-black/60" />
        </div>
        <div className="relative z-10 max-w-[1600px] mx-auto mms-gutter">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="text-[10px] tracking-[0.4em] text-brand-accent uppercase font-semibold block mb-3 font-heading">
              Our Conference &amp; Corporate Event Specialisations
            </span>
            <h2 className="text-3xl md:text-5xl font-semibold text-white font-heading mb-4">
              Tailored Event Solutions
            </h2>
            <p className="text-sm md:text-base text-brand-foreground/80 font-light">
              We provide tailored event solutions for different organisational
              needs and event formats.
            </p>
          </div>
          <div
            data-stagger
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5"
          >
            {specialisations.map((spec) => (
              <div
                key={spec.title}
                className="rounded-2xl border border-white/15 bg-white/5 backdrop-blur-sm p-6 space-y-2.5 hover:border-brand-accent/50 transition-colors"
              >
                <h3 className="text-base font-semibold text-white font-heading">
                  {spec.title}
                </h3>
                <p className="text-xs sm:text-sm text-brand-foreground/80 leading-relaxed font-light">
                  {spec.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose MMS + Our Promise */}
      <section className="py-12 sm:py-20 md:py-24 max-w-[1600px] mx-auto mms-gutter space-y-16">
        <div>
          <div data-reveal className="text-center max-w-2xl mx-auto mb-12">
            <span className="text-[10px] tracking-[0.4em] text-[#7f141f] uppercase font-semibold block mb-3 font-heading">
              Why Choose Mosi Media Solutions?
            </span>
            <h2 className="text-3xl md:text-5xl font-semibold text-[#050507] font-heading mb-4">
              One Partner. Multiple Solutions. Seamless Execution.
            </h2>
            <p className="text-sm sm:text-base text-[#050507]/85 leading-relaxed">
              We understand that managing multiple event suppliers can be
              challenging. Our integrated approach brings together event
              coordination, technical production, creative design, logistics and
              media services under one service provider.
            </p>
          </div>

          <div
            data-stagger
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5"
          >
            {whyChooseBenefits.map((benefit) => (
              <div
                key={benefit.title}
                className="bg-[#efefef] rounded-2xl border border-[#050507]/12 p-6 shadow-sm space-y-2"
              >
                <CheckCircle className="w-5 h-5 text-[#7f141f]" />
                <h3 className="text-sm sm:text-base font-semibold text-[#050507] font-heading">
                  {benefit.title}
                </h3>
                <p className="text-xs sm:text-sm text-[#050507]/85 leading-relaxed">
                  {benefit.desc}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Our Promise & CTA */}
        <div className="bg-[#efefef] rounded-3xl border border-[#050507]/12 p-8 sm:p-12 shadow-sm grid grid-cols-1 lg:grid-cols-[1.2fr_0.8fr] gap-8 items-center">
          <div className="space-y-4">
            <span className="text-[10px] tracking-[0.35em] text-[#7f141f] uppercase font-bold block font-heading">
              Our Promise
            </span>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-semibold text-[#050507] font-heading">
              Your Vision. Our Expertise. An Exceptional Event.
            </h2>
            <p className="text-sm sm:text-base text-[#050507]/85 leading-relaxed">
              At Mosi Media Solutions, we believe that every event is an
              opportunity to create connections, communicate ideas and inspire
              people. Our approach combines professional event management,
              innovative technology, creative thinking and attention to detail to
              deliver events that are not only successful but memorable.
            </p>
            <p className="text-sm sm:text-base text-[#050507]/85 leading-relaxed">
              Whether you are bringing together 20 executives for a private
              board meeting or hosting hundreds of international delegates for a
              multi-day conference, we are ready to bring your vision to life.
            </p>
          </div>
          <div className="bg-white rounded-2xl border border-[#050507]/10 p-6 sm:p-8 space-y-4">
            <span className="text-[10px] tracking-[0.3em] text-[#7f141f] uppercase font-bold block font-heading">
              Let&apos;s Plan Your Next Event
            </span>
            <p className="text-sm text-[#050507]/85 leading-relaxed">
              Planning a conference, corporate gathering or business event in
              Victoria Falls or beyond? Let Mosi Media Solutions take care of
              the details while you focus on your guests, your business and your
              objectives.
            </p>
            <div className="flex flex-col sm:flex-row lg:flex-col gap-3 pt-2">
              <a
                href="#enquiry"
                className={`${primaryButton} px-6 py-3.5 text-xs uppercase tracking-[0.16em] justify-center`}
              >
                <span className="relative z-10">Request an Event Proposal</span>
                <ArrowRight className="relative z-10 ml-2 h-4 w-4" />
              </a>
              <Link
                href="/contact"
                className="inline-flex items-center justify-center px-6 py-3.5 rounded-full border border-[#7f141f]/35 text-[#050507] text-xs uppercase tracking-[0.16em] font-semibold hover:border-[#7f141f] hover:bg-[#7f141f] hover:text-white transition-all duration-300"
              >
                Speak to Our Events Team
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Enquiry Form */}
      <section
        id="enquiry"
        className="relative py-12 sm:py-20 md:py-28 overflow-hidden bg-[#e4e4e4] border-t border-[#050507]/12"
      >
        <div className="relative z-10 max-w-[1600px] mx-auto mms-gutter">
          <div data-reveal className="text-center mb-12">
            <span className="text-[10px] tracking-[0.4em] text-[#7f141f] uppercase font-semibold block mb-3 font-heading">
              Get In Touch
            </span>
            <h2 className="text-3xl md:text-4xl font-semibold text-[#050507] font-heading mb-4">
              Conference &amp; Event Enquiry
            </h2>
            <p className="text-sm text-[#050507]/85 font-normal max-w-md mx-auto">
              Fill in the form below and our production team will review your
              requirements and respond.
            </p>
          </div>

          <div
            data-reveal="scale"
            className="max-w-3xl mx-auto bg-[#efefef] rounded-3xl border border-[#050507]/12 shadow-lg p-5 sm:p-8 md:p-12"
          >
            {!submitted ? (
              <form
                aria-busy={loading}
                onSubmit={handleSubmit}
                className="grid grid-cols-1 md:grid-cols-2 gap-4"
              >
                {[
                  {
                    name: "organisation",
                    placeholder: "Organisation name",
                    required: true,
                  },
                  {
                    name: "contact",
                    placeholder: "Contact person",
                    required: true,
                  },
                  {
                    name: "email",
                    placeholder: "Email address",
                    type: "email",
                    required: true,
                  },
                  { name: "phone", placeholder: "Phone number", type: "tel" },
                  { name: "eventType", placeholder: "Type of event" },
                  { name: "date", placeholder: "Proposed event date" },
                  {
                    name: "delegates",
                    placeholder: "Expected number of delegates",
                    type: "number",
                  },
                  { name: "venue", placeholder: "Venue or location" },
                ].map((field) => (
                  <label
                    key={field.name}
                    className="block min-w-0 text-sm font-semibold text-[#7f141f]"
                  >
                    <span className="block mb-2">{field.placeholder}</span>
                    <input
                      name={field.name}
                      type={field.type || "text"}
                      min={field.type === "number" ? 1 : undefined}
                      placeholder={field.placeholder}
                      required={field.required}
                      className="w-full bg-white border border-[#050507]/20 rounded-xl px-4 py-3 text-sm font-normal text-[#050507] placeholder:text-[#050507]/45 focus:outline-none focus:border-[#7f141f] transition-colors"
                    />
                  </label>
                ))}

                <div className="md:col-span-2">
                  <label
                    htmlFor="organisation-type"
                    className="block text-sm font-semibold text-[#7f141f] mb-2"
                  >
                    Type of organisation
                  </label>
                  <select
                    id="organisation-type"
                    name="organisationType"
                    className="w-full bg-white border border-[#050507]/20 rounded-xl px-4 py-3 text-sm text-[#050507] focus:outline-none focus:border-[#7f141f] transition-colors"
                  >
                    <option value="">Type of organisation</option>
                    <option>Government</option>
                    <option>International</option>
                    <option>NGO</option>
                    <option>Corporate</option>
                  </select>
                </div>

                <div className="md:col-span-2">
                  <p className="text-[10px] uppercase tracking-widest text-[#7f141f] font-bold mb-3">
                    Required Services
                  </p>
                  <div className="grid grid-cols-1 min-[400px]:grid-cols-2 gap-2">
                    {services.map((s) => (
                      <label
                        key={s}
                        className="inline-flex items-center gap-2 p-3 bg-white border border-[#050507]/15 rounded-xl cursor-pointer hover:border-[#7f141f]/45 transition-colors"
                      >
                        <input
                          type="checkbox"
                          name="services"
                          value={s}
                          className="accent-[#981b28]"
                        />
                        <span className="text-xs text-[#050507] font-medium">
                          {s}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>

                <label
                  htmlFor="conference-details"
                  className="md:col-span-2 text-sm font-semibold text-[#7f141f]"
                >
                  Additional information or specific requirements
                </label>
                <textarea
                  id="conference-details"
                  name="details"
                  placeholder="Additional information or specific requirements"
                  rows={4}
                  className="w-full md:col-span-2 bg-white border border-[#050507]/20 rounded-xl px-4 py-3 text-sm text-[#050507] placeholder:text-[#050507]/45 focus:outline-none focus:border-[#7f141f] transition-colors resize-y"
                />

                <div className="md:col-span-2 flex flex-wrap items-center gap-4">
                  <button
                    data-lead-cta
                    type="submit"
                    disabled={loading}
                    className={`${primaryButton} px-8 py-3.5 text-xs uppercase tracking-widest disabled:opacity-50`}
                  >
                    <span className="relative z-10">
                      {loading ? "Sending…" : "Request an Event Proposal"}
                    </span>
                  </button>
                  {error && (
                    <span
                      role="alert"
                      className="text-sm font-semibold text-[#981b28]"
                    >
                      {error}
                    </span>
                  )}
                </div>
                <input
                  type="text"
                  name="website"
                  tabIndex={-1}
                  autoComplete="off"
                  className="hidden"
                  aria-hidden="true"
                />
              </form>
            ) : (
              <div className="text-center py-12">
                <CheckCircle className="w-14 h-14 text-[#7f141f] mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-[#050507] font-heading mb-2">
                  Thank you — we&apos;ll be in touch shortly.
                </h3>
                <p className="text-sm text-[#050507]/85">
                  Thank you. Your enquiry has been saved for the Mosi Media
                  Solutions team. We&apos;ll respond using your contact details.
                </p>
                <p
                  role="status"
                  className="text-sm font-semibold text-[#7f141f] break-all mt-2"
                >
                  Enquiry reference: {reference}
                </p>
              </div>
            )}
          </div>
        </div>
      </section>

      <Footer />
      <Link
        href="/conference-production#enquiry"
        className="mms-button persistent-cta fixed z-30 inline-flex items-center px-4 py-3 rounded-full font-semibold text-xs shadow-lg transition-all"
      >
        Plan Your Event
      </Link>
    </div>
  );
}
