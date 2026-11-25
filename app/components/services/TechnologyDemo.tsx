"use client";

import React, { useState } from "react";
import { Mic, Headphones, Radio, Users, Monitor, Sparkles, Sliders } from "lucide-react";
import type { DemonstrationType } from "@/lib/technology-catalog";

const PODIUM_PRESETS = [
  {
    id: "conference",
    label: "Conference",
    eventTitle: "REGIONAL INFRASTRUCTURE SUMMIT",
    speaker: "Keynote: Minister of Transport",
    sponsor: "Victoria Falls Convention Centre",
    accent: "#981b28",
  },
  {
    id: "corporate",
    label: "Corporate",
    eventTitle: "ANNUAL LEADERSHIP FORUM",
    speaker: "Chief Executive Address",
    sponsor: "2026 Strategy & Growth Briefing",
    accent: "#1e3a5f",
  },
  {
    id: "awards",
    label: "Awards",
    eventTitle: "EXCELLENCE AWARDS GALA",
    speaker: "Presenter: Lifetime Achievement",
    sponsor: "Live Stage Presentation",
    accent: "#7a5c1e",
  },
] as const;

const LIGHTING_PRESETS = [
  { id: "blue", label: "Blue", hex: "#2563eb", mood: "Focused plenary & keynote clarity" },
  { id: "red", label: "Red", hex: "#981b28", mood: "Bold brand reveal & MMS signature tone" },
  { id: "gold", label: "Gold", hex: "#d97706", mood: "Warm gala dinner & awards prestige" },
  { id: "purple", label: "Purple", hex: "#7c3aed", mood: "Evening entertainment & reception energy" },
  { id: "white", label: "White", hex: "#f8fafc", mood: "Crisp daylight-balanced speaker lighting" },
] as const;

const LED_PRESETS = [
  {
    id: "slides",
    label: "Keynote Slides",
    headline: "16:9 Wide Presentation",
    detail: "High-contrast charts and speaker slides remain readable even in brightly lit halls.",
  },
  {
    id: "pip",
    label: "Live Camera + Slides",
    headline: "Split-Screen Keynote View",
    detail: "Pair live stage camera feeds alongside presentation slides or remote speakers.",
  },
  {
    id: "sponsors",
    label: "Sponsor Branding",
    headline: "Full-Stage Brand Backdrop",
    detail: "Rotate partner logos, welcome messages and session schedules between talks.",
  },
  {
    id: "outdoor",
    label: "Outdoor Daylight",
    headline: "High-Brightness Open Air",
    detail: "Keep announcements, live scores and event visuals sharp in direct daylight.",
  },
] as const;

const INTERPRETATION_STEPS = [
  {
    id: "speaker",
    step: "01",
    title: "Speaker",
    icon: Mic,
    summary: "A presenter speaks into a conference microphone at the podium or table.",
  },
  {
    id: "interpreter",
    step: "02",
    title: "Interpreter",
    icon: Users,
    summary: "Interpreters inside a sound-isolated booth hear the floor feed and translate live.",
  },
  {
    id: "transmission",
    step: "03",
    title: "Audio Transmission",
    icon: Radio,
    summary: "Each language channel is transmitted cleanly across the venue without interference.",
  },
  {
    id: "delegate",
    step: "04",
    title: "Delegate",
    icon: Headphones,
    summary: "Delegates select their preferred language on a wireless receiver and headset.",
  },
] as const;

const INTERACTIVE_PRESETS = [
  {
    id: "agenda",
    label: "Event Agenda",
    heading: "Today's Programme",
    items: ["09:00 Opening Plenary — Main Hall", "11:15 Panel: Regional Trade", "14:00 Breakout Workshops"],
  },
  {
    id: "wayfinding",
    label: "Venue Wayfinding",
    heading: "Interactive Room Guide",
    items: ["Main Plenary — Ground Floor", "Press & Media Lounge — East Wing", "Exhibition Hall — Courtyard"],
  },
  {
    id: "polling",
    label: "Live Q&A & Polls",
    heading: "Audience Participation",
    items: ["Delegates submit questions directly", "Live poll results displayed on screen", "Moderated feedback in real time"],
  },
] as const;

export default function TechnologyDemo({ type }: { type: DemonstrationType }) {
  const [podiumId, setPodiumId] = useState<string>(PODIUM_PRESETS[0].id);
  const [lightId, setLightId] = useState<string>(LIGHTING_PRESETS[0].id);
  const [ledId, setLedId] = useState<string>(LED_PRESETS[0].id);
  const [interpIdx, setInterpIdx] = useState<number>(0);
  const [touchId, setTouchId] = useState<string>(INTERACTIVE_PRESETS[0].id);

  if (type === "podium-branding") {
    const active = PODIUM_PRESETS.find((p) => p.id === podiumId) ?? PODIUM_PRESETS[0];
    return (
      <div className="rounded-3xl border border-[#050507]/12 bg-[#efefef] p-6 sm:p-8 space-y-5">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-xs uppercase tracking-[0.25em] text-[#7f141f] font-semibold">Interactive Podium Preview</p>
            <h3 className="text-xl sm:text-2xl font-semibold text-[#050507] mt-1">See how your branding adapts on stage</h3>
          </div>
          <div className="flex flex-wrap gap-2" role="group" aria-label="Select event type">
            {PODIUM_PRESETS.map((preset) => (
              <button
                key={preset.id}
                type="button"
                onClick={() => setPodiumId(preset.id)}
                aria-pressed={podiumId === preset.id}
                className={`px-4 py-2 rounded-full text-xs font-semibold transition-colors ${
                  podiumId === preset.id
                    ? "bg-[#981b28] text-white"
                    : "bg-white text-[#050507] border border-[#050507]/15 hover:border-[#981b28]"
                }`}
              >
                {preset.label}
              </button>
            ))}
          </div>
        </div>

        <div className="rounded-2xl bg-[#0b0b0f] p-6 sm:p-10 flex flex-col items-center justify-center text-center border border-[#050507]/15">
          <div
            className="w-full max-w-md rounded-xl p-6 sm:p-8 text-white shadow-xl border border-white/15 transition-colors duration-300"
            style={{ background: `linear-gradient(145deg, ${active.accent} 0%, #0b0b0f 100%)` }}
          >
            <span className="text-[11px] uppercase tracking-[0.28em] text-white/75 block mb-2">Front Podium Display</span>
            <p className="text-lg sm:text-xl font-semibold tracking-wide">{active.eventTitle}</p>
            <p className="text-sm text-white/90 mt-2">{active.speaker}</p>
            <p className="text-xs text-white/70 mt-4 pt-3 border-t border-white/15">{active.sponsor}</p>
          </div>
        </div>
        <p className="text-xs text-[#050507]/70">
          Illustrative interactive concept — select an event type to preview how front-facing podium graphics update between sessions.
        </p>
      </div>
    );
  }

  if (type === "lighting-atmosphere") {
    const active = LIGHTING_PRESETS.find((l) => l.id === lightId) ?? LIGHTING_PRESETS[0];
    return (
      <div className="rounded-3xl border border-[#050507]/12 bg-[#efefef] p-6 sm:p-8 space-y-5">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-xs uppercase tracking-[0.25em] text-[#7f141f] font-semibold">Interactive Stage Lighting Preview</p>
            <h3 className="text-xl sm:text-2xl font-semibold text-[#050507] mt-1">Preview stage colour &amp; atmosphere</h3>
          </div>
          <div className="flex flex-wrap gap-2" role="group" aria-label="Select lighting colour">
            {LIGHTING_PRESETS.map((preset) => (
              <button
                key={preset.id}
                type="button"
                onClick={() => setLightId(preset.id)}
                aria-pressed={lightId === preset.id}
                className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-semibold transition-colors ${
                  lightId === preset.id
                    ? "bg-[#050507] text-white"
                    : "bg-white text-[#050507] border border-[#050507]/15 hover:border-[#050507]"
                }`}
              >
                <span className="w-3 h-3 rounded-full border border-black/20" style={{ backgroundColor: preset.hex }} aria-hidden="true" />
                {preset.label}
              </button>
            ))}
          </div>
        </div>

        <div
          className="relative overflow-hidden rounded-2xl bg-[#050507] p-8 sm:p-12 text-center text-white border border-[#050507]/15 transition-colors duration-300"
          style={{
            background: `radial-gradient(circle at 50% 15%, ${active.hex}66 0%, #050507 72%)`,
          }}
        >
          <Sparkles className="w-7 h-7 mx-auto mb-3 text-white/90" aria-hidden="true" />
          <p className="text-lg sm:text-xl font-semibold">{active.label} Stage Atmosphere</p>
          <p className="text-sm text-white/80 mt-1">{active.mood}</p>
        </div>
        <p className="text-xs text-[#050507]/70">
          Illustrative preview — actual fixture beams, washes and dimming cues are programmed live to match your venue.
        </p>
      </div>
    );
  }

  if (type === "led-applications") {
    const active = LED_PRESETS.find((p) => p.id === ledId) ?? LED_PRESETS[0];
    return (
      <div className="rounded-3xl border border-[#050507]/12 bg-[#efefef] p-6 sm:p-8 space-y-5">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-xs uppercase tracking-[0.25em] text-[#7f141f] font-semibold">Interactive LED Screen Preview</p>
            <h3 className="text-xl sm:text-2xl font-semibold text-[#050507] mt-1">Explore what your LED wall can display</h3>
          </div>
          <div className="flex flex-wrap gap-2" role="group" aria-label="Select LED display mode">
            {LED_PRESETS.map((preset) => (
              <button
                key={preset.id}
                type="button"
                onClick={() => setLedId(preset.id)}
                aria-pressed={ledId === preset.id}
                className={`px-4 py-2 rounded-full text-xs font-semibold transition-colors ${
                  ledId === preset.id
                    ? "bg-[#981b28] text-white"
                    : "bg-white text-[#050507] border border-[#050507]/15 hover:border-[#981b28]"
                }`}
              >
                {preset.label}
              </button>
            ))}
          </div>
        </div>

        <div className="rounded-2xl bg-[#0b0b0f] p-8 sm:p-10 text-white border border-[#050507]/15 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
          <div className="space-y-2 max-w-xl">
            <span className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.22em] text-[#fda4af]">
              <Monitor className="w-4 h-4" aria-hidden="true" />
              {active.label}
            </span>
            <p className="text-xl sm:text-2xl font-semibold">{active.headline}</p>
            <p className="text-sm text-white/80 leading-relaxed">{active.detail}</p>
          </div>
          <div className="w-full sm:w-44 aspect-video rounded-lg border border-white/20 bg-gradient-to-br from-[#981b28]/40 to-black flex items-center justify-center text-xs uppercase tracking-widest text-white/80">
            16:9 / Custom
          </div>
        </div>
        <p className="text-xs text-[#050507]/70">
          Illustrative display preview — final screen dimensions and input layouts are tailored to your venue sightlines.
        </p>
      </div>
    );
  }

  if (type === "interactive-display") {
    const active = INTERACTIVE_PRESETS.find((p) => p.id === touchId) ?? INTERACTIVE_PRESETS[0];
    return (
      <div className="rounded-3xl border border-[#050507]/12 bg-[#efefef] p-6 sm:p-8 space-y-5">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-xs uppercase tracking-[0.25em] text-[#7f141f] font-semibold">Interactive Touch Simulation</p>
            <h3 className="text-xl sm:text-2xl font-semibold text-[#050507] mt-1">Tap to preview attendee experiences</h3>
          </div>
          <div className="flex flex-wrap gap-2" role="group" aria-label="Select touchscreen mode">
            {INTERACTIVE_PRESETS.map((preset) => (
              <button
                key={preset.id}
                type="button"
                onClick={() => setTouchId(preset.id)}
                aria-pressed={touchId === preset.id}
                className={`px-4 py-2 rounded-full text-xs font-semibold transition-colors ${
                  touchId === preset.id
                    ? "bg-[#981b28] text-white"
                    : "bg-white text-[#050507] border border-[#050507]/15 hover:border-[#981b28]"
                }`}
              >
                {preset.label}
              </button>
            ))}
          </div>
        </div>

        <div className="rounded-2xl bg-white p-6 sm:p-8 border border-[#050507]/12 space-y-4">
          <div className="flex items-center gap-2 text-[#7f141f] text-xs font-semibold uppercase tracking-[0.2em]">
            <Sliders className="w-4 h-4" aria-hidden="true" />
            {active.heading}
          </div>
          <ul className="grid sm:grid-cols-3 gap-3">
            {active.items.map((item) => (
              <li key={item} className="rounded-xl bg-[#efefef] p-4 text-sm font-medium text-[#050507] border border-[#050507]/10">
                {item}
              </li>
            ))}
          </ul>
        </div>
        <p className="text-xs text-[#050507]/70">
          Illustrative touch simulation — interactive content is customised for your event schedule, maps or live polling platform.
        </p>
      </div>
    );
  }

  // interpretation-flow
  const activeStep = INTERPRETATION_STEPS[interpIdx] ?? INTERPRETATION_STEPS[0];
  return (
    <div className="rounded-3xl border border-[#050507]/12 bg-[#efefef] p-6 sm:p-8 space-y-6">
      <div>
        <p className="text-xs uppercase tracking-[0.25em] text-[#7f141f] font-semibold">How Simultaneous Interpretation Works</p>
        <h3 className="text-xl sm:text-2xl font-semibold text-[#050507] mt-1">One event. Multiple languages. A shared experience.</h3>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3" role="tablist" aria-label="Interpretation audio flow">
        {INTERPRETATION_STEPS.map((item, idx) => {
          const Icon = item.icon;
          const isSelected = interpIdx === idx;
          return (
            <button
              key={item.id}
              type="button"
              role="tab"
              aria-selected={isSelected}
              onClick={() => setInterpIdx(idx)}
              className={`text-left rounded-2xl p-4 border transition-colors ${
                isSelected
                  ? "bg-[#981b28] text-white border-[#981b28]"
                  : "bg-white text-[#050507] border-[#050507]/12 hover:border-[#981b28]/50"
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <span className={`text-xs font-bold tracking-widest ${isSelected ? "text-white/80" : "text-[#7f141f]"}`}>
                  STEP {item.step}
                </span>
                <Icon className="w-4 h-4" aria-hidden="true" />
              </div>
              <p className="font-semibold text-base">{item.title}</p>
            </button>
          );
        })}
      </div>

      <div className="rounded-2xl bg-white p-5 border border-[#050507]/10">
        <p className="text-sm sm:text-base text-[#050507] font-medium">
          <span className="text-[#7f141f] font-semibold">Step {activeStep.step} — {activeStep.title}:</span>{" "}
          {activeStep.summary}
        </p>
      </div>
    </div>
  );
}
