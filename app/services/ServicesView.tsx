"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Globe,
  MessageSquare,
  Video,
  Camera,
  Megaphone,
  ArrowRight,
  Sparkles,
} from "lucide-react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import type { ServiceCardData } from "@/lib/content-types";
import FitImage from "../components/FitImage";
import {
  CATEGORY_PRESENTATIONS,
  TECHNOLOGY_FILTER_CATEGORIES,
  getEquipmentForCategory,
  type FilterCategory,
} from "@/lib/technology-catalog";

const primaryButton = "mms-button group";

const addOns = [
  {
    icon: Camera,
    label: "Drone Cinematography",
    img: "/services%20images/Drone%20Services.jpg",
    desc: "Discuss aerial photography and video for events, venues and promotional stories, subject to location, weather and permissions.",
  },
  {
    icon: Sparkles,
    label: "Cold Sparks",
    img: "/mms/LCG SPITFIRE Cold Spark Machine Package (2x Spitfire w_ Case & Granules).jpg",
    desc: "Cold spark pyrotechnic effects for grand entrances, finales and photo moments without open flame.",
  },
  {
    icon: Globe,
    label: "360° Booth",
    img: "/mms/WhatsApp%20Image%202026-01-12%20at%204.20.30%20PM.jpeg",
    desc: "Interactive 360-degree photo and video booths for guest engagement and shareable content.",
  },
  {
    icon: MessageSquare,
    label: "Podcast Production",
    img: "/mms/IMG_9198.jpeg",
    desc: "On-location podcast capture with multi-track audio and professional editing.",
  },
  {
    icon: Megaphone,
    label: "Social Media Packages",
    img: "/mms/DSC_2505.jpg",
    desc: "Edited reels, clips and graphics delivered for immediate post-event publishing.",
  },
  {
    icon: Video,
    label: "Low-lying cloud machine",
    img: "/mms/DSC_3908.jpg",
    desc: "Low-lying cloud effects that drift across the floor for dramatic entrances, first dances and memorable event moments.",
  },
];

export default function ServicesView({ catalog }: { catalog: ServiceCardData[] }) {
  const [activeFilter, setActiveFilter] = useState<FilterCategory>("All Services");

  const filteredCatalog = catalog.filter((service) => {
    if (activeFilter === "All Services") return true;
    const presentation = CATEGORY_PRESENTATIONS[service.slug];
    return presentation ? presentation.filterCategories.includes(activeFilter) : false;
  });

  return (
    <div className="min-h-screen bg-[#e4e4e4] text-[#050507] font-sans">
      <Navbar />

      {/* Compact Hero */}
      <section className="relative min-h-[46vh] flex items-end overflow-hidden bg-black pt-28 pb-12">
        <div className="absolute inset-0 z-0">
          <Image
            src="/mms/DSC_7204.jpg"
            alt="MMS Services and Event Technology"
            fill
            sizes="100vw"
            className="object-cover object-center"
            style={{ opacity: 0.5 }}
            preload
          />
        </div>
        <div className="absolute inset-0 bg-gradient-to-t from-[#050507] via-[#050507]/60 to-[#050507]/25 z-10" />
        <div className="relative z-20 max-w-[1400px] mx-auto mms-gutter w-full">
          <div className="max-w-2xl space-y-4">
            <span className="text-xs sm:text-sm tracking-[0.35em] text-brand-accent uppercase font-bold block font-heading">
              Services &amp; Technology
            </span>
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-semibold text-white font-heading leading-tight">
              Powering exceptional events.
            </h1>
            <p className="text-base md:text-lg text-brand-foreground/80 font-light leading-relaxed">
              Discover the technology behind seamless conferences, immersive experiences and memorable productions.
            </p>
            <div className="flex flex-wrap items-center gap-3 pt-2">
              <Link
                href="/contact"
                className={`${primaryButton} px-7 py-3 text-xs uppercase tracking-[0.16em]`}
              >
                <span className="relative z-10">Talk to Our Team</span>
                <ArrowRight className="relative z-10 ml-2 h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Level 1: Image-Led Technology & Service Catalogue */}
      <section id="technology-catalogue" className="py-14 md:py-20 max-w-[1400px] mx-auto mms-gutter">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
          <div className="max-w-xl space-y-2">
            <span className="text-xs uppercase tracking-[0.3em] text-[#7f141f] font-semibold block">
              Our Capabilities
            </span>
            <h2 className="text-3xl md:text-4xl font-semibold text-[#050507] font-heading">
              The right technology for every event.
            </h2>
          </div>
          <div className="flex flex-col sm:flex-row sm:items-center gap-4">
            <p className="text-sm text-[#050507]/75 max-w-md">
              Select a category to explore equipment photographs, plain-language explanations and real-world applications.
            </p>
            <Link
              href="/contact"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full border border-[#7f141f] text-xs uppercase tracking-[0.16em] font-semibold text-[#7f141f] hover:bg-[#7f141f] hover:text-white transition-colors shrink-0 self-start sm:self-auto"
            >
              Talk to Our Team
              <ArrowRight className="w-3.5 h-3.5" aria-hidden="true" />
            </Link>
          </div>
        </div>

        {/* Category Filter */}
        <div
          className="flex flex-wrap gap-2 mb-10"
          role="group"
          aria-label="Filter technology categories"
        >
          {TECHNOLOGY_FILTER_CATEGORIES.map((category) => {
            const isSelected = activeFilter === category;
            return (
              <button
                key={category}
                type="button"
                onClick={() => setActiveFilter(category)}
                aria-pressed={isSelected}
                className={`px-4 py-2.5 rounded-full text-xs font-semibold transition-colors ${
                  isSelected
                    ? "bg-[#981b28] text-white"
                    : "bg-[#efefef] text-[#050507] border border-[#050507]/12 hover:border-[#981b28]"
                }`}
              >
                {category}
              </button>
            );
          })}
        </div>

        {/* 3-Column Image-Led Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCatalog.map((service) => {
            const presentation = CATEGORY_PRESENTATIONS[service.slug];
            const displayTitle = presentation?.displayTitle ?? service.title;
            const equipmentCount = getEquipmentForCategory(service.slug).length;

            return (
              <Link
                key={service.slug}
                href={`/services/${service.slug}`}
                className="group flex flex-col rounded-2xl overflow-hidden bg-[#efefef] border border-[#050507]/10 hover:border-[#7f141f]/50 transition-all duration-300"
              >
                <div className="relative aspect-[16/10] w-full overflow-hidden bg-[#dcdcdc]">
                  <FitImage
                    src={service.image}
                    alt={service.heroAlt || displayTitle}
                    sizes="(max-width:767px) 100vw, (max-width:1023px) 50vw, 33vw"
                    className="transition-transform duration-500 group-hover:scale-105"
                  />
                </div>
                <div className="p-6 flex flex-col flex-1 justify-between gap-4">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between gap-2 text-xs uppercase tracking-[0.2em] text-[#7f141f] font-semibold">
                      <span>{service.tag}</span>
                      {equipmentCount > 0 && (
                        <span className="text-[#050507]/60 normal-case tracking-normal font-medium">
                          {equipmentCount} {equipmentCount === 1 ? "system" : "systems"}
                        </span>
                      )}
                    </div>
                    <h3 className="text-xl font-semibold text-[#050507] font-heading group-hover:text-[#7f141f] transition-colors">
                      {displayTitle}
                    </h3>
                  </div>
                  <span className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.16em] font-semibold text-[#7f141f] pt-2">
                    Explore technology
                    <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" aria-hidden="true" />
                  </span>
                </div>
              </Link>
            );
          })}
        </div>
      </section>

      {/* Add-Ons — Supplementary Services & Experiences */}
      <section className="py-16 bg-[#e4e4e4] border-t border-[#050507]/12">
        <div className="max-w-[1400px] mx-auto mms-gutter">
          <div className="text-center mb-12">
            <span className="text-sm tracking-[0.35em] text-[#7f141f] uppercase font-semibold block mb-2 font-heading">
              Optional Add-Ons
            </span>
            <h2 className="text-3xl md:text-4xl font-semibold text-[#050507] font-heading">
              Enhance Your Production
            </h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {addOns.map((addon) => (
              <div
                key={addon.label}
                className="bg-[#efefef] rounded-2xl border border-[#050507]/12 overflow-hidden hover:border-[#7f141f]/40 transition-all duration-300 group"
              >
                {addon.label === "Drone Cinematography" ? (
                  <Link href="/services/drone" className="block rounded-2xl" aria-label="Explore Drone Services">
                    <div className="relative h-44 overflow-hidden bg-[#dcdcdc]">
                      <FitImage src={addon.img} alt="Illustrative image of a drone" sizes="(max-width:639px) 100vw, 33vw" />
                    </div>
                    <div className="p-5">
                      <h3 className="text-lg font-semibold text-[#050507] mb-1.5">{addon.label}</h3>
                      <p className="text-sm text-[#050507]/80 leading-relaxed">{addon.desc}</p>
                      <span className="inline-flex items-center gap-2 mt-4 text-[#7f141f] font-semibold text-sm">
                        Explore Drone Services <ArrowRight size={16} aria-hidden="true" />
                      </span>
                    </div>
                  </Link>
                ) : (
                  <>
                    <div className="relative h-44 overflow-hidden bg-[#dcdcdc]">
                      <FitImage
                        src={addon.img}
                        alt={addon.label}
                        sizes="(max-width:639px) 100vw, (max-width:1023px) 50vw, 33vw"
                        className="transition-transform duration-500 group-hover:scale-105"
                      />
                    </div>
                    <div className="p-5">
                      <div className="flex items-center gap-2 mb-1.5">
                        <addon.icon className="w-4 h-4 text-[#7f141f]" aria-hidden="true" />
                        <h3 className="text-lg font-semibold text-[#050507]">{addon.label}</h3>
                      </div>
                      <p className="text-sm text-[#050507]/80 leading-relaxed font-normal">{addon.desc}</p>
                    </div>
                  </>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="relative py-20 overflow-hidden">
        <div className="absolute inset-0 z-0">
          <Image
            src="/mms/Zambia-Zimbabwe-Victoria-Falls-Impressive-View-1.jpg"
            alt=""
            fill
            sizes="100vw"
            className="object-cover object-center opacity-35"
          />
          <div className="absolute inset-0 bg-[#050507]/75" />
        </div>
        <div className="relative z-10 max-w-[700px] mx-auto px-6 text-center space-y-5">
          <span className="text-sm tracking-[0.35em] text-brand-accent uppercase font-semibold block font-heading">
            Tailored Guidance
          </span>
          <h2 className="text-3xl md:text-4xl font-semibold text-white font-heading">
            Not sure what you need? Talk to our production team.
          </h2>
          <p className="text-base text-brand-foreground/75 font-light leading-relaxed">
            Tell us about your event, venue and audience — we will recommend the right equipment and send a tailored proposal.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
            <Link data-lead-cta href="/contact" className={`${primaryButton} px-8 py-3.5 text-xs uppercase tracking-[0.18em]`}>
              <span className="relative z-10">Talk to Our Team</span>
              <ArrowRight className="relative z-10 ml-2 h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
