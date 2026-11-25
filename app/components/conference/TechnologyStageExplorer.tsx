"use client";

import React, { useState } from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import FitImage from "@/app/components/FitImage";
import { STAGE_HOTSPOTS } from "@/lib/conference-solutions";
import { getEquipmentItem } from "@/lib/technology-catalog";

export default function TechnologyStageExplorer() {
  const [activeId, setActiveId] = useState(STAGE_HOTSPOTS[0].id);
  const active = STAGE_HOTSPOTS.find((h) => h.id === activeId) ?? STAGE_HOTSPOTS[0];
  const linkedEquipment = active.equipmentRefs
    .map((ref) => getEquipmentItem(ref.categorySlug, ref.equipmentSlug))
    .filter((item): item is NonNullable<typeof item> => Boolean(item));

  return (
    <section className="py-16 md:py-24 bg-[#efefef] border-y border-[#050507]/12">
      <div className="max-w-[1600px] mx-auto mms-gutter space-y-8">
        <div className="max-w-2xl space-y-2">
          <span className="text-[11px] tracking-[0.35em] text-[#7f141f] uppercase font-semibold block font-heading">
            Integrated Production
          </span>
          <h2 className="text-3xl md:text-4xl font-semibold text-[#050507] font-heading">
            Discover the technology behind your event
          </h2>
          <p className="text-sm sm:text-base text-[#050507]/80">
            Select a stage element below to see its role and explore verified equipment in our catalogue.
          </p>
        </div>

        {/* Accessible Hotspot Selector */}
        <div
          className="flex flex-wrap gap-2"
          role="tablist"
          aria-label="Conference stage technology explorer"
        >
          {STAGE_HOTSPOTS.map((spot) => {
            const isSelected = activeId === spot.id;
            return (
              <button
                key={spot.id}
                type="button"
                role="tab"
                aria-selected={isSelected}
                onClick={() => setActiveId(spot.id)}
                className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-full text-xs font-semibold transition-colors ${
                  isSelected
                    ? "bg-[#981b28] text-white"
                    : "bg-white text-[#050507] border border-[#050507]/12 hover:border-[#981b28]"
                }`}
              >
                <span
                  className={`w-5 h-5 rounded-full text-[11px] inline-flex items-center justify-center font-bold ${
                    isSelected ? "bg-white text-[#981b28]" : "bg-[#efefef] text-[#7f141f]"
                  }`}
                >
                  {spot.number}
                </span>
                {spot.label}
              </button>
            );
          })}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center bg-white rounded-3xl border border-[#050507]/12 p-6 sm:p-8">
          <div className="lg:col-span-6 relative aspect-[16/10] overflow-hidden rounded-2xl bg-[#dcdcdc] border border-[#050507]/10">
            <FitImage
              src={active.image}
              alt={active.label}
              sizes="(max-width:1023px) 100vw, 48vw"
            />
          </div>

          <div className="lg:col-span-6 space-y-5">
            <div className="space-y-2">
              <span className="text-xs uppercase tracking-[0.22em] text-[#7f141f] font-semibold">
                {active.categoryName}
              </span>
              <h3 className="text-2xl sm:text-3xl font-semibold text-[#050507] font-heading">
                {active.label}
              </h3>
              <p className="text-sm sm:text-base text-[#050507]/85 leading-relaxed">{active.role}</p>
            </div>

            {linkedEquipment.length > 0 && (
              <div className="space-y-2.5">
                <p className="text-xs uppercase tracking-[0.2em] text-[#050507]/65 font-semibold">
                  Verified Equipment in Catalogue
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {linkedEquipment.map((eq) => (
                    <Link
                      key={eq.id}
                      href={`/services/${eq.parentCategorySlug}/${eq.slug}`}
                      className="flex items-center justify-between gap-3 rounded-xl bg-[#efefef] border border-[#050507]/12 px-4 py-3 text-xs font-semibold text-[#050507] hover:border-[#7f141f] hover:text-[#7f141f] transition-colors"
                    >
                      <span className="truncate">{eq.name}</span>
                      <ArrowRight className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />
                    </Link>
                  ))}
                </div>
              </div>
            )}

            <div className="pt-1">
              <Link
                href={`/services/${active.categorySlug}`}
                className="mms-button inline-flex items-center gap-2 px-6 py-3 text-xs uppercase tracking-[0.16em] font-semibold"
              >
                Explore {active.categoryName}
                <ArrowRight className="w-4 h-4" aria-hidden="true" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
