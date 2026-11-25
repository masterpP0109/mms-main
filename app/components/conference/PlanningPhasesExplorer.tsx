"use client";

import React, { useState } from "react";
import { CheckCircle, ChevronDown, ListChecks } from "lucide-react";
import FitImage from "@/app/components/FitImage";
import { approachStages } from "@/app/conference-production/conferenceData";
import { PLANNING_PHASES, getStagesForPhase } from "@/lib/conference-solutions";

export default function PlanningPhasesExplorer() {
  const [activePhaseId, setActivePhaseId] = useState(PLANNING_PHASES[0].id);
  const [expandedStep, setExpandedStep] = useState<string | null>("01");
  const [showFullProcess, setShowFullProcess] = useState(false);

  const activePhase = PLANNING_PHASES.find((p) => p.id === activePhaseId) ?? PLANNING_PHASES[0];
  const phaseStages = getStagesForPhase(activePhase);

  return (
    <section className="py-16 md:py-24 bg-[#efefef] border-y border-[#050507]/12">
      <div className="max-w-[1600px] mx-auto mms-gutter space-y-10">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div className="space-y-2 max-w-2xl">
            <span className="text-[11px] tracking-[0.35em] text-[#7f141f] uppercase font-semibold block font-heading">
              Our Event Management Process
            </span>
            <h2 className="text-3xl md:text-4xl font-semibold text-[#050507] font-heading">
              From your first idea to final delivery
            </h2>
            <p className="text-sm sm:text-base text-[#050507]/80">
              Select a phase to explore how we coordinate every stage — or view all 11 stages together.
            </p>
          </div>
          <button
            type="button"
            onClick={() => setShowFullProcess((prev) => !prev)}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full border border-[#7f141f]/35 text-xs uppercase tracking-[0.16em] font-semibold text-[#7f141f] hover:bg-[#7f141f] hover:text-white transition-colors self-start md:self-auto"
          >
            <ListChecks className="w-4 h-4" aria-hidden="true" />
            {showFullProcess ? "Show Phase View" : "View Full 11-Stage Process"}
          </button>
        </div>

        {!showFullProcess ? (
          <>
            {/* 4-Phase Segmented Navigation */}
            <div
              className="grid grid-cols-2 lg:grid-cols-4 gap-3"
              role="tablist"
              aria-label="Event management phases"
            >
              {PLANNING_PHASES.map((phase) => {
                const isSelected = activePhaseId === phase.id;
                return (
                  <button
                    key={phase.id}
                    type="button"
                    role="tab"
                    aria-selected={isSelected}
                    onClick={() => {
                      setActivePhaseId(phase.id);
                      setExpandedStep(phase.stageSteps[0] ?? null);
                    }}
                    className={`text-left rounded-2xl p-4 sm:p-5 border transition-colors ${
                      isSelected
                        ? "bg-[#981b28] text-white border-[#981b28]"
                        : "bg-white text-[#050507] border-[#050507]/12 hover:border-[#981b28]"
                    }`}
                  >
                    <span
                      className={`text-[11px] uppercase tracking-[0.2em] font-bold block mb-1 ${
                        isSelected ? "text-white/80" : "text-[#7f141f]"
                      }`}
                    >
                      {phase.phaseNumber}
                    </span>
                    <p className="text-base sm:text-lg font-semibold font-heading">{phase.name}</p>
                    <p className={`text-xs mt-1 ${isSelected ? "text-white/85" : "text-[#050507]/70"}`}>
                      {phase.stageSteps.length} {phase.stageSteps.length === 1 ? "stage" : "stages"}
                    </p>
                  </button>
                );
              })}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start bg-white rounded-3xl border border-[#050507]/12 p-6 sm:p-8">
              <div className="lg:col-span-5 space-y-4">
                <div className="relative aspect-[16/10] overflow-hidden rounded-2xl bg-[#dcdcdc] border border-[#050507]/10">
                  <FitImage
                    src={activePhase.coverImage}
                    alt={activePhase.coverAlt}
                    sizes="(max-width:1023px) 100vw, 40vw"
                  />
                </div>
                <div>
                  <span className="text-xs uppercase tracking-[0.22em] text-[#7f141f] font-semibold">
                    {activePhase.phaseNumber} — {activePhase.name}
                  </span>
                  <p className="text-base text-[#050507]/85 mt-2 leading-relaxed">{activePhase.summary}</p>
                </div>
              </div>

              <div className="lg:col-span-7 space-y-3">
                {phaseStages.map((stage) => {
                  const isExpanded = expandedStep === stage.step;
                  return (
                    <div
                      key={stage.step}
                      className="rounded-2xl border border-[#050507]/12 bg-[#efefef] overflow-hidden"
                    >
                      <button
                        type="button"
                        onClick={() => setExpandedStep(isExpanded ? null : stage.step)}
                        aria-expanded={isExpanded}
                        className="w-full flex items-center justify-between gap-4 p-4 sm:p-5 text-left hover:bg-black/[0.02] transition-colors"
                      >
                        <div className="flex items-center gap-3 min-w-0">
                          <span className="text-xs font-bold tracking-widest text-[#7f141f] shrink-0">
                            {stage.step}
                          </span>
                          <span className="text-base sm:text-lg font-semibold text-[#050507] font-heading truncate">
                            {stage.shortTitle}
                          </span>
                        </div>
                        <ChevronDown
                          className={`w-4 h-4 text-[#050507] shrink-0 transition-transform duration-200 ${
                            isExpanded ? "rotate-180" : ""
                          }`}
                          aria-hidden="true"
                        />
                      </button>
                      {isExpanded && (
                        <div className="px-4 sm:px-5 pb-5 pt-2 border-t border-[#050507]/10 space-y-3 bg-white">
                          <p className="text-sm font-semibold text-[#050507]">{stage.title}</p>
                          <p className="text-sm text-[#050507]/80 leading-relaxed">{stage.lead}</p>
                          {stage.groups.map((grp, gIdx) => (
                            <div key={gIdx} className="space-y-2 pt-1">
                              {grp.heading && (
                                <p className="text-xs uppercase tracking-wider text-[#7f141f] font-semibold">
                                  {grp.heading}
                                </p>
                              )}
                              <ul className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
                                {grp.items.map((item) => (
                                  <li key={item} className="flex items-start gap-2 text-xs text-[#050507]/85">
                                    <CheckCircle className="w-3.5 h-3.5 text-[#7f141f] shrink-0 mt-0.5" aria-hidden="true" />
                                    <span>{item}</span>
                                  </li>
                                ))}
                              </ul>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {approachStages.map((stage) => (
              <div
                key={stage.step}
                className="rounded-2xl bg-white border border-[#050507]/12 p-5 sm:p-6 space-y-3"
              >
                <div className="flex items-center gap-3">
                  <span className="text-xs font-bold tracking-widest text-[#7f141f] bg-[#efefef] px-2.5 py-1 rounded-full">
                    Stage {stage.step}
                  </span>
                  <h3 className="text-base sm:text-lg font-semibold text-[#050507] font-heading">
                    {stage.title}
                  </h3>
                </div>
                <p className="text-sm text-[#050507]/80">{stage.lead}</p>
                <ul className="space-y-1">
                  {stage.groups.flatMap((g) => g.items).slice(0, 5).map((item) => (
                    <li key={item} className="flex items-start gap-2 text-xs text-[#050507]/80">
                      <CheckCircle className="w-3.5 h-3.5 text-[#7f141f] shrink-0 mt-0.5" aria-hidden="true" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
