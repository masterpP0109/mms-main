"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Users, Video, Camera, Play, PenTool, Mic, Monitor, Globe,
  ChevronRight, CheckCircle, ArrowRight
} from "lucide-react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

const goldBtn =
  "group relative isolate inline-flex items-center justify-center overflow-hidden rounded-full bg-gradient-to-r from-[#b48a3d] via-[#d6bd7d] to-[#c5a880] text-[#050507] font-semibold shadow-[0_0_0_1px_rgba(229,207,154,0.28),0_0_18px_rgba(180,138,61,0.2)] transition-[transform,filter,box-shadow] duration-300 before:absolute before:inset-0 before:rounded-full before:bg-[linear-gradient(110deg,transparent_18%,rgba(255,255,255,0.62)_48%,transparent_78%)] before:-translate-x-[140%] before:transition-transform before:duration-700 hover:-translate-y-0.5 hover:brightness-110 hover:shadow-[0_0_0_1px_rgba(229,207,154,0.55),0_0_34px_rgba(197,168,128,0.48)] hover:before:translate-x-[140%] active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#e5cf9a]";

const capabilities = [
  { icon: Play, title: "Audiovisual Production", desc: "Professional sound, microphones, PA systems and projection equipment for any venue size." },
  { icon: Camera, title: "Photography & Documentation", desc: "Comprehensive event photography and documentation ready for reports and archives." },
  { icon: Video, title: "Multi-Camera Video", desc: "Multi-camera setups with professional editing and highlight reels delivered post-event." },
  { icon: Monitor, title: "Live Streaming", desc: "Hybrid and fully virtual conference streaming to national and international audiences." },
  { icon: PenTool, title: "Event Branding", desc: "Stage design, branded backdrops, digital slides and signage aligned to your identity." },
  { icon: Mic, title: "Speaker Interviews", desc: "On-site speaker interviews and post-event content packages for communications teams." },
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

const services = ["Sound and microphones", "Screens and projection", "Photography", "Video recording", "Multi-camera production", "Live streaming", "Event branding", "Speaker interviews", "Highlight video", "Post-event content"];

export default function ConferenceProduction() {
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    const data = new FormData(e.currentTarget);
    const body = Object.fromEntries(data.entries());
    try {
      const res = await fetch("/api/conference-enquiry", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      if (!res.ok) throw new Error("Request failed");
      setSubmitted(true);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Submission failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#050507] text-[#f4ebd0] font-sans">
      <Navbar />

      {/* Hero */}
      <section className="relative h-[70vh] min-h-[520px] w-full overflow-hidden flex items-center justify-center">
        <Image
          src="/mms/the_Conference_Hall_of_the_Federal_Tax_Service_1.jpg"
          alt="Conference production"
          fill
          className="object-cover object-center"
          style={{ opacity: 0.5 }}
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#050507] via-[#050507]/40 to-[#050507]/55" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#050507]/80 via-transparent to-transparent" />
        <div className="relative z-10 max-w-[1600px] mx-auto px-6 sm:px-10 lg:px-16 w-full pt-24">
          <span className="text-[10px] tracking-[0.4em] text-[#c5a880] uppercase font-semibold block mb-4">Conference & Seminar Production</span>
          <h1 className="text-4xl sm:text-5xl md:text-6xl xl:text-7xl font-light text-white leading-[1.05] font-serif max-w-3xl mb-6">
            Production you can depend on.
          </h1>
          <p className="text-sm md:text-base text-[#f4ebd0]/80 font-light leading-relaxed max-w-xl mb-8">
            MMS delivers coordinated media and technical production for conferences, seminars, workshops and institutional events in Victoria Falls and beyond.
          </p>
          <div className="flex flex-wrap gap-4">
            <a href="#enquiry" className={`${goldBtn} px-7 py-3.5 text-[11px] uppercase tracking-[0.18em]`}>
              <span className="relative z-10">Request a Proposal</span>
              <ArrowRight className="relative z-10 ml-2 h-4 w-4" />
            </a>
            <a href="#capabilities" className="inline-flex items-center gap-2 px-7 py-3.5 rounded-full border border-[#c5a880]/40 text-[#f4ebd0]/80 text-[11px] uppercase tracking-[0.18em] hover:border-[#c5a880] hover:text-white transition-all duration-300">
              Our Capabilities
            </a>
          </div>
        </div>
      </section>

      {/* Trust strip */}
      <section className="relative z-10 max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 -mt-4">
        <div className="glass-panel rounded-3xl border border-[#c5a880]/20 p-6 md:p-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center divide-y md:divide-y-0 md:divide-x divide-[#c5a880]/15">
            {[
              { label: "Response Time", value: "24hr" },
              { label: "Licensed & Insured", value: "Drone Certified" },
              { label: "Hybrid Events", value: "Supported" },
              { label: "Venue Knowledge", value: "Victoria Falls" },
            ].map((item) => (
              <div key={item.label} className="flex flex-col items-center justify-center p-3 pt-5 md:p-0">
                <p className="text-[9px] tracking-[0.15em] text-[#c5a880] uppercase font-semibold mb-1">{item.value}</p>
                <p className="text-xs text-white font-medium">{item.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Capabilities */}
      <section id="capabilities" className="py-20 md:py-28 max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-14">
          <span className="text-[10px] tracking-[0.4em] text-[#c5a880] uppercase font-semibold block mb-3">What We Provide</span>
          <h2 className="text-3xl md:text-5xl font-light text-white font-serif mb-4">Production Capabilities</h2>
          <p className="text-sm text-[#f4ebd0]/70 font-light max-w-xl mx-auto">
            Everything your event needs, coordinated by one team.
          </p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {capabilities.map((cap) => (
            <div key={cap.title} className="glass-panel rounded-2xl border border-[#c5a880]/15 p-6 hover:border-[#c5a880]/40 transition-all duration-300 group">
              <div className="w-10 h-10 rounded-full bg-[#c5a880]/10 flex items-center justify-center mb-4 group-hover:bg-[#c5a880]/20 transition-colors duration-300">
                <cap.icon className="w-5 h-5 text-[#c5a880]" />
              </div>
              <h3 className="text-sm font-medium text-white mb-2">{cap.title}</h3>
              <p className="text-xs text-[#f4ebd0]/60 leading-relaxed font-light">{cap.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Event types + Who we serve */}
      <section className="relative py-20 overflow-hidden bg-black border-t border-b border-[#c5a880]/15">
        <div className="absolute inset-0 z-0">
          <Image src="/victoria_falls_banner.png" alt="Victoria Falls" fill className="object-cover object-center pointer-events-none" style={{ opacity: 0.25 }} />
          <div className="absolute inset-0 bg-black/50" />
        </div>
        <div className="relative z-10 max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
            <div>
              <span className="text-[10px] tracking-[0.4em] text-[#c5a880] uppercase font-semibold block mb-3">Event Types</span>
              <h2 className="text-3xl md:text-4xl font-light text-white font-serif mb-8">Events We Support</h2>
              <ul className="space-y-3">
                {eventTypes.map((t) => (
                  <li key={t} className="flex items-center gap-3 text-sm text-[#f4ebd0]/80">
                    <CheckCircle className="w-4 h-4 text-[#c5a880] shrink-0" />
                    {t}
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <span className="text-[10px] tracking-[0.4em] text-[#c5a880] uppercase font-semibold block mb-3">Clients</span>
              <h2 className="text-3xl md:text-4xl font-light text-white font-serif mb-8">Who We Serve</h2>
              <ul className="space-y-3">
                {clients.map((c) => (
                  <li key={c} className="flex items-center gap-3 text-sm text-[#f4ebd0]/80">
                    <ChevronRight className="w-4 h-4 text-[#c5a880] shrink-0" />
                    {c}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Process */}
      <section className="py-20 md:py-28 max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-14">
          <span className="text-[10px] tracking-[0.4em] text-[#c5a880] uppercase font-semibold block mb-3">How We Work</span>
          <h2 className="text-3xl md:text-5xl font-light text-white font-serif mb-4">Our Production Process</h2>
        </div>
        <div className="relative grid grid-cols-1 md:grid-cols-5 gap-6 md:gap-4">
          <div className="absolute top-10 left-[10%] right-[10%] h-px bg-gradient-to-r from-transparent via-[#c5a880]/30 to-transparent hidden md:block" />
          {process.map((item) => (
            <div key={item.step} className="relative z-10 flex flex-col items-center text-center px-4">
              <div className="w-14 h-14 rounded-full bg-[#050507] border border-[#c5a880]/30 flex items-center justify-center mb-5 shadow-xl">
                <span className="text-sm font-serif font-semibold text-[#c5a880]">{item.step}</span>
              </div>
              <h3 className="text-base font-medium text-white mb-2">{item.title}</h3>
              <p className="text-xs text-[#f4ebd0]/65 leading-relaxed font-light">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Enquiry Form */}
      <section id="enquiry" className="relative py-20 md:py-28 overflow-hidden bg-black border-t border-[#c5a880]/15">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-[#1a1510]/60 via-[#050507] to-[#050507] z-0" />
        <div className="relative z-10 max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <span className="text-[10px] tracking-[0.4em] text-[#c5a880] uppercase font-semibold block mb-3">Get In Touch</span>
            <h2 className="text-3xl md:text-4xl font-light text-white font-serif mb-4">Conference Enquiry</h2>
            <p className="text-sm text-[#f4ebd0]/70 font-light max-w-md mx-auto">Fill in the form below and our production team will respond within 24 hours with a tailored proposal.</p>
          </div>

          <div className="max-w-3xl mx-auto glass-panel rounded-3xl border border-[#c5a880]/20 p-8 md:p-12">
            {!submitted ? (
              <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  { name: "organisation", placeholder: "Organisation name", required: true },
                  { name: "contact", placeholder: "Contact person", required: true },
                  { name: "email", placeholder: "Email address", type: "email", required: true },
                  { name: "phone", placeholder: "Phone number" },
                  { name: "eventType", placeholder: "Type of event" },
                  { name: "date", placeholder: "Proposed event date" },
                  { name: "delegates", placeholder: "Expected number of delegates" },
                  { name: "venue", placeholder: "Venue or location" },
                ].map((field) => (
                  <input
                    key={field.name}
                    name={field.name}
                    type={field.type || "text"}
                    placeholder={field.placeholder}
                    required={field.required}
                    className="w-full bg-[#050507]/70 border border-[#c5a880]/20 rounded-xl px-4 py-3 text-sm text-white placeholder:text-[#f4ebd0]/30 focus:outline-none focus:border-[#c5a880]/50 transition-colors"
                  />
                ))}

                <div className="md:col-span-2">
                  <select name="organisationType" className="w-full bg-[#050507]/70 border border-[#c5a880]/20 rounded-xl px-4 py-3 text-sm text-[#f4ebd0]/60 focus:outline-none focus:border-[#c5a880]/50 transition-colors">
                    <option>Type of organisation</option>
                    <option>Government</option>
                    <option>International</option>
                    <option>NGO</option>
                    <option>Corporate</option>
                  </select>
                </div>

                <div className="md:col-span-2">
                  <p className="text-[10px] uppercase tracking-widest text-[#c5a880] font-semibold mb-3">Required Services</p>
                  <div className="grid grid-cols-2 gap-2">
                    {services.map((s) => (
                      <label key={s} className="inline-flex items-center gap-2 p-3 bg-[#050507]/50 border border-[#c5a880]/10 rounded-xl cursor-pointer hover:border-[#c5a880]/30 transition-colors">
                        <input type="checkbox" name="services" value={s} className="accent-[#c5a880]" />
                        <span className="text-xs text-[#f4ebd0]/80">{s}</span>
                      </label>
                    ))}
                  </div>
                </div>

                <textarea
                  name="details"
                  placeholder="Additional information or specific requirements"
                  rows={4}
                  className="w-full md:col-span-2 bg-[#050507]/70 border border-[#c5a880]/20 rounded-xl px-4 py-3 text-sm text-white placeholder:text-[#f4ebd0]/30 focus:outline-none focus:border-[#c5a880]/50 transition-colors resize-none"
                />

                <div className="md:col-span-2 flex items-center gap-4">
                  <button type="submit" disabled={loading} className={`${goldBtn} px-8 py-3.5 text-xs uppercase tracking-widest disabled:opacity-50`}>
                    <span className="relative z-10">{loading ? "Sending…" : "Request a Conference Proposal"}</span>
                  </button>
                  {error && <span className="text-sm text-red-400">{error}</span>}
                </div>
              </form>
            ) : (
              <div className="text-center py-12">
                <CheckCircle className="w-14 h-14 text-[#c5a880] mx-auto mb-4" />
                <h3 className="text-xl font-light text-white font-serif mb-2">Thank you — we&apos;ll be in touch shortly.</h3>
                <p className="text-sm text-[#f4ebd0]/60">Our production team will respond within 24 hours.</p>
              </div>
            )}
          </div>
        </div>
      </section>

      <Footer />
      <Link href="/conference-production#enquiry" className="fixed bottom-6 right-6 z-50 inline-flex items-center px-4 py-3 rounded-full bg-[#b48a3d] text-[#050507] font-semibold text-xs shadow-lg hover:brightness-110 transition-all">Plan Your Conference</Link>
    </div>
  );
}
