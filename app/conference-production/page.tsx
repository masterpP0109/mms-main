"use client";

import { submitEnquiry, enquiryErrorMessage } from "@/lib/submit-enquiry";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Users, Video, Camera, Play, PenTool, Monitor, Globe, Sparkles,
  ChevronRight, CheckCircle, ArrowRight
} from "lucide-react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

const primaryButton = "mms-button group";

const capabilities = [
  { icon: Play, title: "Audiovisual Production", desc: "Professional sound, microphones, PA systems and projection equipment for any venue size." },
  { icon: Camera, title: "Photography & Documentation", desc: "Comprehensive event photography and documentation ready for reports and archives." },
  { icon: Video, title: "Multi-Camera Video", desc: "Multi-camera setups with professional editing and highlight reels delivered post-event." },
  { icon: Monitor, title: "Live Streaming", desc: "Hybrid and fully virtual conference streaming to national and international audiences." },
  { icon: PenTool, title: "Event Branding", desc: "Stage design, branded backdrops, digital slides and signage aligned to your identity." },
  { icon: Sparkles, title: "Event Lighting & Stage Setup", desc: "Professional stage setups and corporate lighting design customized for conferences, award ceremonies and high-level summits." },
  { icon: Globe, title: "Interpretation Systems", desc: "Simultaneous interpretation booth setup and management for multilingual events." },
  { icon: Users, title: "Staffing & Coordination", desc: "Fully coordinated production crew — one point of contact for the entire event." },
];

const eventTypes = [
  "Conferences and conventions", "Seminars and workshops",
  "Ministerial and government meetings", "Stakeholder engagement sessions",
  "Training and capacity-building programmes", "Annual general meetings",
  "Professional association events", "Public health and development forums",
  "Hybrid and virtual conferences", "Press briefings and institutional launches",
];

const clients = [
  "Government ministries and departments", "Government agencies and public institutions",
  "United Nations and international development organisations", "Health organisations and development programmes",
  "NGOs and humanitarian organisations", "Professional institutes and associations",
];

const process = [
  { step: "01", title: "Consultation", desc: "We discuss your objectives, venue, programme and technical requirements in detail." },
  { step: "02", title: "Production Planning", desc: "A complete technical and staffing plan tailored to your event is prepared and shared." },
  { step: "03", title: "Pre-Event Preparation", desc: "Equipment testing, schedule alignment and briefing of all production staff." },
  { step: "04", title: "Event Delivery", desc: "Professional on-site management and full coverage on the day — seamlessly." },
  { step: "05", title: "Post-Event Delivery", desc: "Edited video, photography and content packages delivered for reports and archives." },
];

const services = ["Sound and microphones", "Screens and projection", "Photography", "Video recording", "Multi-camera production", "Live streaming", "Event branding", "Event lighting and stage setup", "Highlight video", "Post-event content"];

export default function ConferenceProduction() {
  const [submitted, setSubmitted] = useState(false);
  const [reference, setReference] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (loading) return;
    setError(null);
    setLoading(true);
    const data = new FormData(e.currentTarget);
    const field = (name: string) => String(data.get(name) ?? "");
    const body = { organisation: field("organisation"), contact: field("contact"), email: field("email"), phone: field("phone"), eventType: field("eventType"), date: field("date"), delegates: field("delegates"), venue: field("venue"), organisationType: field("organisationType"), services: data.getAll("services").map(String), details: field("details"), website: field("website") };
    try {
      const result = await submitEnquiry("/api/conference-enquiry", body);
      setReference(result.reference ?? `MMS-${result.submissionId}`);
      setSubmitted(true);
    } catch (error) {
      setError(enquiryErrorMessage(error));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#050507] text-brand-foreground font-sans">
      <Navbar />

      {/* Hero */}
      <section className="conference-hero relative min-h-[70svh] w-full overflow-hidden flex items-center justify-center">
        <Image
          src="/mms/conference%20hero%20img.png"
          alt="Conference production"
          fill sizes="100vw"
          className="object-cover object-center"
          style={{ opacity: 0.5 }}
          preload
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#050507] via-[#050507]/40 to-[#050507]/55" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#050507]/80 via-transparent to-transparent" />
        <div className="relative z-10 max-w-[1600px] mx-auto mms-gutter w-full pt-28 pb-16">
          <span className="text-[10px] tracking-[0.4em] text-brand-accent uppercase font-semibold block mb-4">Conference & Seminar Production</span>
          <h1 className="text-4xl sm:text-5xl md:text-6xl xl:text-7xl font-semibold text-white font-heading leading-[1.05] max-w-3xl mb-6">
            Production you can depend on.
          </h1>
          <p className="text-sm md:text-base text-brand-foreground/80 font-light leading-relaxed max-w-xl mb-8">
            MMS delivers coordinated media and technical production for conferences, seminars, workshops and institutional events in Victoria Falls and beyond.
          </p>
          <div className="flex flex-wrap gap-4">
            <a data-lead-cta href="#enquiry" className={`${primaryButton} px-7 py-3.5 text-[11px] uppercase tracking-[0.18em]`}>
              <span className="relative z-10">Request a Proposal</span>
              <ArrowRight className="relative z-10 ml-2 h-4 w-4" />
            </a>
            <a href="#capabilities" className="inline-flex items-center gap-2 px-7 py-3.5 rounded-full border border-brand-accent/40 text-brand-foreground/80 text-[11px] uppercase tracking-[0.18em] hover:border-brand-accent hover:text-white transition-all duration-300">
              Our Capabilities
            </a>
          </div>
        </div>
      </section>

      {/* Trust strip */}
      <section className="relative z-10 max-w-[1600px] mx-auto mms-gutter -mt-4">
        <div className="glass-panel rounded-3xl border border-brand-accent/20 p-6 md:p-8">
          <div data-stagger className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center divide-y md:divide-y-0 md:divide-x divide-brand-accent/15">
            {[
              { label: "Response Time", value: "24hr" },
              { label: "Licensed & Insured", value: "Drone Certified" },
              { label: "Hybrid Events", value: "Supported" },
              { label: "Venue Knowledge", value: "Victoria Falls" },
            ].map((item) => (
              <div key={item.label} className="flex flex-col items-center justify-center p-3 pt-5 md:p-0">
                <p className="text-[9px] tracking-[0.15em] text-brand-accent uppercase font-semibold mb-1">{item.value}</p>
                <p className="text-xs text-white font-medium">{item.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Capabilities */}
      <section id="capabilities" className="py-12 sm:py-20 md:py-28 max-w-[1600px] mx-auto mms-gutter">
        <div data-reveal className="text-center mb-14">
          <span className="text-[10px] tracking-[0.4em] text-brand-accent uppercase font-semibold block mb-3 font-heading">What We Provide</span>
          <h2 className="text-3xl md:text-5xl font-semibold text-white font-heading mb-4">Production Capabilities</h2>
          <p className="text-sm text-brand-foreground/70 font-light max-w-xl mx-auto">
            Everything your event needs, coordinated by one team.
          </p>
        </div>
        <div data-stagger className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {capabilities.map((cap) => (
            <div key={cap.title} data-lift className="glass-panel rounded-2xl border border-brand-accent/15 p-6 hover:border-brand-accent/40 transition-all duration-300 group">
              <div className="w-10 h-10 rounded-full bg-brand-accent/10 flex items-center justify-center mb-4 group-hover:bg-brand-accent/20 transition-colors duration-300">
                <cap.icon className="w-5 h-5 text-brand-accent" />
              </div>
              <h3 className="text-sm font-medium text-white mb-2">{cap.title}</h3>
              <p className="text-xs text-brand-foreground/60 leading-relaxed font-light">{cap.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Event types + Who we serve */}
      <section className="relative py-20 overflow-hidden bg-black border-t border-b border-brand-accent/15">
        <div className="absolute inset-0 z-0">
          <Image src="/victoria_falls_banner.png" alt="Victoria Falls" fill sizes="100vw" className="object-cover object-center pointer-events-none" style={{ opacity: 0.25 }} />
          <div className="absolute inset-0 bg-black/50" />
        </div>
        <div className="relative z-10 max-w-[1600px] mx-auto mms-gutter">
          <div data-stagger className="grid grid-cols-1 lg:grid-cols-2 gap-16">
            <div>
              <span className="text-[10px] tracking-[0.4em] text-brand-accent uppercase font-semibold block mb-3 font-heading">Event Types</span>
              <h2 className="text-3xl md:text-4xl font-semibold text-white font-heading mb-8">Events We Support</h2>
              <ul className="space-y-3">
                {eventTypes.map((t) => (
                  <li key={t} className="flex items-center gap-3 text-sm text-brand-foreground/80">
                    <CheckCircle className="w-4 h-4 text-brand-accent shrink-0" />
                    {t}
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <span className="text-[10px] tracking-[0.4em] text-brand-accent uppercase font-semibold block mb-3 font-heading">Clients</span>
              <h2 className="text-3xl md:text-4xl font-semibold text-white font-heading mb-8">Who We Serve</h2>
              <ul className="space-y-3">
                {clients.map((c) => (
                  <li key={c} className="flex items-center gap-3 text-sm text-brand-foreground/80">
                    <ChevronRight className="w-4 h-4 text-brand-accent shrink-0" />
                    {c}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Process */}
      <section className="py-12 sm:py-20 md:py-28 max-w-[1600px] mx-auto mms-gutter">
        <div data-reveal className="text-center mb-14">
          <span className="text-[10px] tracking-[0.4em] text-brand-accent uppercase font-semibold block mb-3 font-heading">How We Work</span>
          <h2 className="text-3xl md:text-5xl font-semibold text-white font-heading mb-4">Our Production Process</h2>
        </div>
        <div data-stagger className="process-timeline relative grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-5 gap-8 xl:gap-4">
          <div className="absolute top-10 left-[10%] right-[10%] h-px bg-gradient-to-r from-transparent via-brand-accent/30 to-transparent hidden xl:block" />
          {process.map((item) => (
            <div key={item.step} className="relative z-10 flex flex-col items-center text-center px-4">
              <div className="w-14 h-14 rounded-full bg-[#050507] border border-brand-accent/30 flex items-center justify-center mb-5 shadow-xl">
                <span className="text-sm font-semibold text-brand-accent font-heading">{item.step}</span>
              </div>
              <h3 className="text-base font-medium text-white mb-2">{item.title}</h3>
              <p className="text-xs text-brand-foreground/65 leading-relaxed font-light">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Enquiry Form */}
      <section id="enquiry" className="relative py-12 sm:py-20 md:py-28 overflow-hidden bg-black border-t border-brand-accent/15">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-[#1a1510]/60 via-[#050507] to-[#050507] z-0" />
        <div className="relative z-10 max-w-[1600px] mx-auto mms-gutter">
          <div data-reveal className="text-center mb-12">
          <span className="text-[10px] tracking-[0.4em] text-brand-accent uppercase font-semibold block mb-3 font-heading">Get In Touch</span>
          <h2 className="text-3xl md:text-4xl font-semibold text-white font-heading mb-4">Conference Enquiry</h2>
            <p className="text-sm text-brand-foreground/70 font-light max-w-md mx-auto">Fill in the form below and our production team will review your requirements and respond.</p>
          </div>

          <div data-reveal="scale" className="max-w-3xl mx-auto glass-panel rounded-3xl border border-brand-accent/20 p-5 sm:p-8 md:p-12">
            {!submitted ? (
              <form aria-busy={loading} onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  { name: "organisation", placeholder: "Organisation name", required: true },
                  { name: "contact", placeholder: "Contact person", required: true },
                  { name: "email", placeholder: "Email address", type: "email", required: true },
                  { name: "phone", placeholder: "Phone number", type: "tel" },
                  { name: "eventType", placeholder: "Type of event" },
                  { name: "date", placeholder: "Proposed event date" },
                  { name: "delegates", placeholder: "Expected number of delegates", type: "number" },
                  { name: "venue", placeholder: "Venue or location" },
                ].map((field) => (
                  <label key={field.name} className="block min-w-0 text-sm text-brand-accent">
                    <span className="block mb-2">{field.placeholder}</span>
                  <input
                    name={field.name}
                    type={field.type || "text"}
                    min={field.type === "number" ? 1 : undefined}
                    placeholder={field.placeholder}
                    required={field.required}
                    className="w-full bg-[#050507]/70 border border-brand-accent/20 rounded-xl px-4 py-3 text-sm text-white placeholder:text-brand-foreground/30 focus:outline-none focus:border-brand-accent/50 transition-colors"
                  />
                  </label>
                ))}

                <div className="md:col-span-2">
                  <label htmlFor="organisation-type" className="block text-sm text-brand-accent mb-2">Type of organisation</label>
                  <select id="organisation-type" name="organisationType" className="w-full bg-[#050507]/70 border border-brand-accent/20 rounded-xl px-4 py-3 text-sm text-brand-foreground/60 focus:outline-none focus:border-brand-accent/50 transition-colors">
                    <option value="">Type of organisation</option>
                    <option>Government</option>
                    <option>International</option>
                    <option>NGO</option>
                    <option>Corporate</option>
                  </select>
                </div>

                <div className="md:col-span-2">
                  <p className="text-[10px] uppercase tracking-widest text-brand-accent font-semibold mb-3">Required Services</p>
                  <div className="grid grid-cols-1 min-[400px]:grid-cols-2 gap-2">
                    {services.map((s) => (
                      <label key={s} className="inline-flex items-center gap-2 p-3 bg-[#050507]/50 border border-brand-accent/10 rounded-xl cursor-pointer hover:border-brand-accent/30 transition-colors">
                        <input type="checkbox" name="services" value={s} className="accent-brand-accent" />
                        <span className="text-xs text-brand-foreground/80">{s}</span>
                      </label>
                    ))}
                  </div>
                </div>

                <label htmlFor="conference-details" className="md:col-span-2 text-sm text-brand-accent">Additional information or specific requirements</label>
                <textarea
                  id="conference-details"
                  name="details"
                  placeholder="Additional information or specific requirements"
                  rows={4}
                  className="w-full md:col-span-2 bg-[#050507]/70 border border-brand-accent/20 rounded-xl px-4 py-3 text-sm text-white placeholder:text-brand-foreground/30 focus:outline-none focus:border-brand-accent/50 transition-colors resize-y"
                />

                <div className="md:col-span-2 flex flex-wrap items-center gap-4">
                  <button data-lead-cta type="submit" disabled={loading} className={`${primaryButton} px-8 py-3.5 text-xs uppercase tracking-widest disabled:opacity-50`}>
                    <span className="relative z-10">{loading ? "Sending…" : "Request a Conference Proposal"}</span>
                  </button>
                  {error && <span role="alert" className="text-sm text-red-400">{error}</span>}
                </div>
                <input type="text" name="website" tabIndex={-1} autoComplete="off" className="hidden" aria-hidden="true" />
              </form>
            ) : (
              <div className="text-center py-12">
                <CheckCircle className="w-14 h-14 text-brand-accent mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-white font-heading mb-2">Thank you — we&apos;ll be in touch shortly.</h3>
                <p className="text-sm text-brand-foreground/60">Thank you. Your enquiry has been saved for the Mosi Media Solutions team. We&apos;ll respond using your contact details.</p>
                <p role="status" className="text-sm text-brand-accent break-all">Enquiry reference: {reference}</p>
              </div>
            )}
          </div>
        </div>
      </section>

      <Footer />
      <Link href="/conference-production#enquiry" className="mms-button persistent-cta fixed z-30 inline-flex items-center px-4 py-3 rounded-full font-semibold text-xs shadow-lg transition-all">Plan Your Conference</Link>
    </div>
  );
}
