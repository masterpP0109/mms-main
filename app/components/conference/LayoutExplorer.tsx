"use client";

import React, { useState } from "react";
import { ArrowRight, CheckCircle } from "lucide-react";
import FitImage from "@/app/components/FitImage";
import { CONFERENCE_LAYOUTS } from "@/lib/conference-solutions";

function LayoutDiagramSvg({ id }: { id: string }) {
  if (id === "theatre") {
    return (
      <svg viewBox="0 0 240 130" className="w-full h-32 text-[#050507]" aria-hidden="true">
        <rect x="70" y="10" width="100" height="14" rx="3" fill="#981b28" />
        <rect x="45" y="38" width="60" height="10" rx="2" fill="currentColor" opacity="0.22" />
        <rect x="135" y="38" width="60" height="10" rx="2" fill="currentColor" opacity="0.22" />
        <rect x="45" y="58" width="60" height="10" rx="2" fill="currentColor" opacity="0.22" />
        <rect x="135" y="58" width="60" height="10" rx="2" fill="currentColor" opacity="0.22" />
        <rect x="45" y="78" width="60" height="10" rx="2" fill="currentColor" opacity="0.22" />
        <rect x="135" y="78" width="60" height="10" rx="2" fill="currentColor" opacity="0.22" />
        <rect x="45" y="98" width="60" height="10" rx="2" fill="currentColor" opacity="0.22" />
        <rect x="135" y="98" width="60" height="10" rx="2" fill="currentColor" opacity="0.22" />
      </svg>
    );
  }
  if (id === "classroom") {
    return (
      <svg viewBox="0 0 240 130" className="w-full h-32 text-[#050507]" aria-hidden="true">
        <rect x="70" y="10" width="100" height="14" rx="3" fill="#981b28" />
        <rect x="35" y="38" width="75" height="14" rx="2" fill="currentColor" opacity="0.25" />
        <rect x="130" y="38" width="75" height="14" rx="2" fill="currentColor" opacity="0.25" />
        <rect x="35" y="66" width="75" height="14" rx="2" fill="currentColor" opacity="0.25" />
        <rect x="130" y="66" width="75" height="14" rx="2" fill="currentColor" opacity="0.25" />
        <rect x="35" y="94" width="75" height="14" rx="2" fill="currentColor" opacity="0.25" />
        <rect x="130" y="94" width="75" height="14" rx="2" fill="currentColor" opacity="0.25" />
      </svg>
    );
  }
  if (id === "boardroom") {
    return (
      <svg viewBox="0 0 240 130" className="w-full h-32 text-[#050507]" aria-hidden="true">
        <rect x="70" y="10" width="100" height="10" rx="2" fill="#981b28" />
        <rect x="60" y="42" width="120" height="46" rx="8" fill="currentColor" opacity="0.22" />
        {[72, 102, 132, 162].map((cx) => (
          <React.Fragment key={cx}>
            <circle cx={cx} cy="34" r="5" fill="#981b28" opacity="0.7" />
            <circle cx={cx} cy="96" r="5" fill="#981b28" opacity="0.7" />
          </React.Fragment>
        ))}
        <circle cx="50" cy="65" r="5" fill="#981b28" opacity="0.7" />
        <circle cx="190" cy="65" r="5" fill="#981b28" opacity="0.7" />
      </svg>
    );
  }
  if (id === "u-shape") {
    return (
      <svg viewBox="0 0 240 130" className="w-full h-32 text-[#050507]" aria-hidden="true">
        <rect x="75" y="10" width="90" height="12" rx="3" fill="#981b28" />
        <rect x="55" y="34" width="18" height="68" rx="3" fill="currentColor" opacity="0.25" />
        <rect x="167" y="34" width="18" height="68" rx="3" fill="currentColor" opacity="0.25" />
        <rect x="55" y="88" width="130" height="18" rx="3" fill="currentColor" opacity="0.25" />
      </svg>
    );
  }
  return (
    <svg viewBox="0 0 240 130" className="w-full h-32 text-[#050507]" aria-hidden="true">
      <rect x="75" y="10" width="90" height="12" rx="3" fill="#981b28" />
      <circle cx="65" cy="54" r="18" fill="currentColor" opacity="0.22" />
      <circle cx="120" cy="54" r="18" fill="currentColor" opacity="0.22" />
      <circle cx="175" cy="54" r="18" fill="currentColor" opacity="0.22" />
      <circle cx="92" cy="96" r="18" fill="currentColor" opacity="0.22" />
      <circle cx="148" cy="96" r="18" fill="currentColor" opacity="0.22" />
    </svg>
  );
}

export default function LayoutExplorer({
  onSelectLayout,
}: {
  onSelectLayout?: (layoutName: string) => void;
}) {
  const [activeId, setActiveId] = useState(CONFERENCE_LAYOUTS[0].id);
  const active = CONFERENCE_LAYOUTS.find((l) => l.id === activeId) ?? CONFERENCE_LAYOUTS[0];

  return (
    <section className="py-16 md:py-24 max-w-[1600px] mx-auto mms-gutter">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
        <div className="space-y-2 max-w-2xl">
          <span className="text-[11px] tracking-[0.35em] text-[#7f141f] uppercase font-semibold block font-heading">
            Room Arrangements
          </span>
          <h2 className="text-3xl md:text-4xl font-semibold text-[#050507] font-heading">
            Explore event layouts
          </h2>
          <p className="text-sm sm:text-base text-[#050507]/80">
            See how different room arrangements support presentations, workshops and formal dining.
          </p>
        </div>
        <div className="flex flex-wrap gap-2" role="group" aria-label="Select conference room layout">
          {CONFERENCE_LAYOUTS.map((layout) => (
            <button
              key={layout.id}
              type="button"
              onClick={() => setActiveId(layout.id)}
              aria-pressed={activeId === layout.id}
              className={`px-4 py-2.5 rounded-full text-xs font-semibold transition-colors ${
                activeId === layout.id
                  ? "bg-[#981b28] text-white"
                  : "bg-[#efefef] text-[#050507] border border-[#050507]/12 hover:border-[#981b28]"
              }`}
            >
              {layout.name}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center bg-[#efefef] rounded-3xl border border-[#050507]/12 p-6 sm:p-8 lg:p-10">
        <div className="lg:col-span-5 space-y-5">
          <div className="rounded-2xl bg-white border border-[#050507]/10 p-4">
            <LayoutDiagramSvg id={active.id} />
          </div>
          <div className="space-y-2">
            <h3 className="text-2xl font-semibold text-[#050507] font-heading">{active.name} layout</h3>
            <p className="text-sm sm:text-base text-[#050507]/85 leading-relaxed">{active.shortDescription}</p>
          </div>
          <div className="space-y-2">
            <p className="text-xs uppercase tracking-[0.2em] text-[#7f141f] font-semibold">
              Typical technology requirements
            </p>
            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {active.typicalTechnology.map((tech) => (
                <li key={tech} className="flex items-center gap-2 text-xs sm:text-sm text-[#050507]">
                  <CheckCircle className="w-4 h-4 text-[#7f141f] shrink-0" aria-hidden="true" />
                  <span>{tech}</span>
                </li>
              ))}
            </ul>
          </div>
          <div className="flex flex-wrap items-center gap-3 pt-1">
            {onSelectLayout && (
              <a
                href="#enquiry"
                onClick={() => onSelectLayout(active.name)}
                className="mms-button inline-flex items-center gap-2 px-6 py-3 text-xs uppercase tracking-[0.16em] font-semibold"
              >
                Use {active.name} in my enquiry
                <ArrowRight className="w-4 h-4" aria-hidden="true" />
              </a>
            )}
          </div>
          <p className="text-xs text-[#050507]/65">
            Illustrative arrangement, not a venue-specific capacity or approved floor plan.
          </p>
        </div>

        <div className="lg:col-span-7 space-y-4">
          <div className="relative aspect-[16/10] w-full overflow-hidden rounded-2xl border border-[#050507]/12 bg-[#dcdcdc]">
            <FitImage
              src={active.image}
              alt={active.imageAlt}
              sizes="(max-width:1023px) 100vw, 55vw"
            />
          </div>
          <div className="flex flex-wrap gap-2">
            {active.suitableFor.map((tag) => (
              <span
                key={tag}
                className="rounded-full bg-white border border-[#050507]/12 px-3.5 py-1 text-xs font-medium text-[#050507]"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
