"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, CheckCircle } from "lucide-react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import FitImage from "../components/FitImage";
import WeddingsFeature from "../components/services/WeddingsFeature";
import LayoutExplorer from "../components/conference/LayoutExplorer";
import TechnologyStageExplorer from "../components/conference/TechnologyStageExplorer";
import PlanningPhasesExplorer from "../components/conference/PlanningPhasesExplorer";
import ConferenceEnquiryPlanner from "../components/conference/ConferenceEnquiryPlanner";
import { whyChooseBenefits } from "./conferenceData";
import {
  CONFERENCE_SETUPS,
  CONFERENCE_SOLUTIONS,
  DESTINATION_EXPERIENCES,
} from "@/lib/conference-solutions";

const primaryButton = "mms-button group";

export default function ConferencesAndEventsPage() {
  const [plannerEventType, setPlannerEventType] = useState("");
  const [plannerLayout, setPlannerLayout] = useState("");
  const [plannerServices, setPlannerServices] = useState<string[]>([]);

  return (
    <div className="min-h-screen bg-[#e4e4e4] text-[#050507] font-sans">
      <Navbar />

      {/* 1. Hero */}
      <section className="conference-hero relative min-h-[62svh] w-full overflow-hidden flex items-end bg-black pt-28 pb-14">
        <Image
          src="/mms/conference%20hero%20img.png"
          alt="Conferences and Corporate Events — Mosi Media Solutions"
          fill
          sizes="100vw"
          className="object-cover object-center"
          style={{ opacity: 0.5 }}
          preload
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#050507] via-[#050507]/55 to-[#050507]/45" />
        <div className="relative z-10 max-w-[1600px] mx-auto mms-gutter w-full">
          <span className="text-[11px] tracking-[0.35em] text-brand-accent uppercase font-semibold block mb-3">
            Conferences &amp; Corporate Events · Victoria Falls &amp; Southern Africa
          </span>
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-semibold text-white font-heading leading-[1.08] max-w-3xl mb-4">
            Your event. From concept to completion.
          </h1>
          <p className="text-base md:text-lg text-brand-foreground/85 font-light leading-relaxed max-w-2xl mb-6">
            Event planning, technology and production. One coordinated team.
          </p>
          <div className="flex flex-wrap gap-3 mb-8">
            <a
              data-lead-cta
              href="#enquiry"
              className={`${primaryButton} px-7 py-3 text-xs uppercase tracking-[0.16em]`}
            >
              <span className="relative z-10">Plan Your Event</span>
              <ArrowRight className="relative z-10 ml-2 h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
            </a>
            <a
              href="#solutions"
              className="inline-flex items-center px-7 py-3 rounded-full border border-white/25 text-white text-xs uppercase tracking-[0.16em] font-semibold hover:bg-white/10 transition-colors"
            >
              Explore Our Solutions
            </a>
          </div>
          <div className="flex flex-wrap gap-x-6 gap-y-2 text-xs text-white/85">
            {["End-to-end management", "Integrated technology", "Victoria Falls destination knowledge", "Hybrid event capabilities"].map((item) => (
              <span key={item} className="inline-flex items-center gap-1.5">
                <CheckCircle className="w-3.5 h-3.5 text-brand-accent" aria-hidden="true" />
                {item}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* 2. What are you planning? (8 Clickable Event Solution Pages) */}
      <section id="solutions" className="py-16 md:py-24 max-w-[1600px] mx-auto mms-gutter">
        <div className="max-w-2xl mb-10 space-y-2">
          <span className="text-[11px] tracking-[0.35em] text-[#7f141f] uppercase font-semibold block font-heading">
            Event Solutions
          </span>
          <h2 className="text-3xl md:text-4xl font-semibold text-[#050507] font-heading">
            What are you planning?
          </h2>
          <p className="text-sm sm:text-base text-[#050507]/80">
            Explore solutions designed around your event — from international summits to executive meetings and gala dinners.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {CONFERENCE_SOLUTIONS.map((sol) => (
            <Link
              key={sol.id}
              href={`/conference-production/${sol.slug}`}
              className="group flex flex-col rounded-2xl overflow-hidden bg-[#efefef] border border-[#050507]/10 hover:border-[#7f141f]/50 transition-all duration-300"
            >
              <div className="relative aspect-[16/10] w-full overflow-hidden bg-[#dcdcdc]">
                <FitImage
                  src={sol.coverImage}
                  alt={sol.coverAlt}
                  sizes="(max-width:639px) 100vw, (max-width:1023px) 50vw, 25vw"
                  className="transition-transform duration-500 group-hover:scale-105"
                />
              </div>
              <div className="p-5 flex flex-col flex-1 justify-between gap-3">
                <div className="space-y-1.5">
                  <h3 className="text-lg font-semibold text-[#050507] font-heading group-hover:text-[#7f141f] transition-colors">
                    {sol.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-[#050507]/80 leading-relaxed">{sol.tagline}</p>
                </div>
                <span className="inline-flex items-center gap-1.5 text-xs uppercase tracking-[0.15em] font-semibold text-[#7f141f] pt-1">
                  Explore solutions
                  <ArrowRight className="w-3.5 h-3.5 transition-transform duration-300 group-hover:translate-x-1" aria-hidden="true" />
                </span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* 3. Visual Room Layout Explorer */}
      <LayoutExplorer onSelectLayout={(layoutName) => setPlannerLayout(layoutName)} />

      {/* 4. Interactive Conference Technology Explorer */}
      <TechnologyStageExplorer />

      {/* 5. Explore Event Setups (Suggested Production Configurations) */}
      <section className="py-16 md:py-24 max-w-[1600px] mx-auto mms-gutter">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-10">
          <div className="space-y-2 max-w-2xl">
            <span className="text-[11px] tracking-[0.35em] text-[#7f141f] uppercase font-semibold block font-heading">
              Production Configurations
            </span>
            <h2 className="text-3xl md:text-4xl font-semibold text-[#050507] font-heading">
              Explore event setups
            </h2>
            <p className="text-sm sm:text-base text-[#050507]/80">
              Suggested technical setups you can customise for your venue — or explore our fixed{" "}
              <Link href="/packages/conferences" className="text-[#7f141f] font-semibold underline">
                conference packages
              </Link>
              .
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
          {CONFERENCE_SETUPS.map((setup) => (
            <div
              key={setup.id}
              className="flex flex-col rounded-2xl overflow-hidden bg-[#efefef] border border-[#050507]/12"
            >
              <div className="relative aspect-[16/10] w-full bg-[#dcdcdc]">
                <FitImage
                  src={setup.image}
                  alt={setup.imageAlt}
                  sizes="(max-width:767px) 100vw, (max-width:1023px) 50vw, 25vw"
                />
              </div>
              <div className="p-5 flex flex-col flex-1 justify-between gap-4">
                <div className="space-y-2">
                  <span className="text-[11px] uppercase tracking-[0.18em] text-[#7f141f] font-semibold block">
                    Suggested Configuration
                  </span>
                  <h3 className="text-lg font-semibold text-[#050507] font-heading">{setup.name}</h3>
                  <p className="text-xs text-[#050507]/75">{setup.audience}</p>
                  <p className="text-xs sm:text-sm text-[#050507]/85 leading-relaxed">{setup.summary}</p>
                  <ul className="pt-2 space-y-1 border-t border-[#050507]/10">
                    {setup.components.map((c) => (
                      <li key={c} className="text-xs text-[#050507]/80 flex items-center gap-1.5">
                        <CheckCircle className="w-3.5 h-3.5 text-[#7f141f] shrink-0" aria-hidden="true" />
                        <span>{c}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <a
                  href="#enquiry"
                  onClick={() => {
                    setPlannerEventType(setup.eventTypeLabel);
                    setPlannerServices(setup.prefillServices);
                  }}
                  className="inline-flex items-center justify-center gap-2 rounded-full border border-[#7f141f] px-4 py-2.5 text-xs uppercase tracking-[0.14em] font-semibold text-[#7f141f] hover:bg-[#7f141f] hover:text-white transition-colors"
                >
                  Select &amp; Customise
                  <ArrowRight className="w-3.5 h-3.5" aria-hidden="true" />
                </a>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 6. 4-Phase Event Management Process (retaining all 11 stages) */}
      <PlanningPhasesExplorer />

      {/* 7. Destination Management — Beyond the Conference Room */}
      <section className="py-16 md:py-24 max-w-[1600px] mx-auto mms-gutter">
        <div className="max-w-2xl mb-10 space-y-2">
          <span className="text-[11px] tracking-[0.35em] text-[#7f141f] uppercase font-semibold block font-heading">
            Destination Management
          </span>
          <h2 className="text-3xl md:text-4xl font-semibold text-[#050507] font-heading">
            Beyond the conference room
          </h2>
          <p className="text-sm sm:text-base text-[#050507]/80">
            Make Victoria Falls part of your event experience. Where third-party hospitality or tourism partners are involved, MMS coordinates arrangements on your behalf.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {DESTINATION_EXPERIENCES.map((item) => (
            <div
              key={item.title}
              className="rounded-2xl overflow-hidden bg-[#efefef] border border-[#050507]/12 flex flex-col"
            >
              <div className="relative aspect-[16/10] w-full bg-[#dcdcdc]">
                <FitImage
                  src={item.image}
                  alt={item.alt}
                  sizes="(max-width:639px) 100vw, (max-width:1023px) 50vw, 25vw"
                />
              </div>
              <div className="p-5 space-y-1.5">
                <h3 className="text-lg font-semibold text-[#050507] font-heading">{item.title}</h3>
                <p className="text-xs sm:text-sm text-[#050507]/80 leading-relaxed">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 8. Why Choose MMS */}
      <section className="py-16 bg-[#efefef] border-t border-[#050507]/12">
        <div className="max-w-[1600px] mx-auto mms-gutter space-y-10">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div className="max-w-2xl space-y-2">
              <span className="text-[11px] tracking-[0.35em] text-[#7f141f] uppercase font-semibold block font-heading">
                Why Choose Mosi Media Solutions?
              </span>
              <h2 className="text-3xl md:text-4xl font-semibold text-[#050507] font-heading">
                One Partner. Multiple Solutions. Seamless Execution.
              </h2>
            </div>
            <div className="flex flex-wrap gap-3">
              <Link
                href="/packages/conferences"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full border border-[#7f141f] text-xs uppercase tracking-[0.15em] font-semibold text-[#7f141f] hover:bg-[#7f141f] hover:text-white transition-colors"
              >
                Conference Packages
                <ArrowRight className="w-3.5 h-3.5" aria-hidden="true" />
              </Link>
              <Link
                href="/services"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full border border-[#050507]/20 text-xs uppercase tracking-[0.15em] font-semibold text-[#050507] hover:border-[#7f141f] hover:text-[#7f141f] transition-colors"
              >
                Equipment Catalogue
                <ArrowRight className="w-3.5 h-3.5" aria-hidden="true" />
              </Link>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {whyChooseBenefits.slice(0, 4).map((benefit) => (
              <div
                key={benefit.title}
                className="bg-white rounded-2xl border border-[#050507]/12 p-5 space-y-2"
              >
                <CheckCircle className="w-5 h-5 text-[#7f141f]" aria-hidden="true" />
                <h3 className="text-base font-semibold text-[#050507] font-heading">{benefit.title}</h3>
                <p className="text-xs sm:text-sm text-[#050507]/80 leading-relaxed">{benefit.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Weddings & Elopements Feature */}
      <div className="max-w-[1600px] mx-auto mms-gutter py-16">
        <WeddingsFeature />
      </div>

      {/* 9. Interactive Event Planning & Quick Enquiry */}
      <section
        id="enquiry"
        className="relative py-16 md:py-24 overflow-hidden bg-[#e4e4e4] border-t border-[#050507]/12"
      >
        <div className="relative z-10 max-w-[1600px] mx-auto mms-gutter">
          <div className="text-center mb-10 space-y-2">
            <span className="text-[11px] tracking-[0.35em] text-[#7f141f] uppercase font-semibold block font-heading">
              Let&apos;s Plan Your Event
            </span>
            <h2 className="text-3xl md:text-4xl font-semibold text-[#050507] font-heading">
              Request a Tailored Event Proposal
            </h2>
            <p className="text-sm text-[#050507]/80 max-w-lg mx-auto">
              Use the guided planner to share your event type, room layout and technical requirements — or switch to Quick Enquiry.
            </p>
          </div>

          <ConferenceEnquiryPlanner
            key={`${plannerEventType}|${plannerLayout}|${plannerServices.join(",")}`}
            initialEventType={plannerEventType}
            initialLayout={plannerLayout}
            initialServices={plannerServices}
          />
        </div>
      </section>

      <Footer />
    </div>
  );
}
