"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { MapPin, Mail, Clock, MessageSquare, ArrowRight, CheckCircle } from "lucide-react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

const goldBtn =
  "group relative isolate inline-flex items-center justify-center overflow-hidden rounded-full bg-gradient-to-r from-[#b48a3d] via-[#d6bd7d] to-[#c5a880] text-[#050507] font-semibold shadow-[0_0_0_1px_rgba(229,207,154,0.28),0_0_18px_rgba(180,138,61,0.2)] transition-all duration-300 before:absolute before:inset-0 before:rounded-full before:bg-[linear-gradient(110deg,transparent_18%,rgba(255,255,255,0.62)_48%,transparent_78%)] before:-translate-x-[140%] before:transition-transform before:duration-700 hover:-translate-y-0.5 hover:brightness-110 hover:shadow-[0_0_0_1px_rgba(229,207,154,0.55),0_0_34px_rgba(197,168,128,0.48)] hover:before:translate-x-[140%] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#e5cf9a]";

type ProjectType = "" | "conference" | "wedding" | "brand" | "event" | "other";

// Recent work thumbnails shown in the sidebar
const recentWork = [
  { src: "/mms/DSC_1257.jpg",    label: "Wedding Film" },
  { src: "/mms/DSC_9244.jpg",    label: "Conference Production" },
  { src: "/mms/DSC_2484.jpg",    label: "Brand Campaign" },
  { src: "/mms/IMG_9198.jpeg",   label: "360° Immersive" },
];

export default function ContactPage() {
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [projectType, setProjectType] = useState<ProjectType>("");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 1200));
    setLoading(false);
    setSubmitted(true);
  };

  return (
    <div className="min-h-screen bg-[#050507] text-[#f4ebd0] font-sans">
      <Navbar />

      {/* Hero — scenic Victoria Falls with warm overlay */}
      <section className="relative min-h-[55vh] flex items-end overflow-hidden bg-black pt-28 pb-14">
        <div className="absolute inset-0 z-0">
          <Image
            src="/mms/DSC_7590.jpg"
            alt="Victoria Falls contact"
            fill
            className="object-cover object-center"
            style={{ opacity: 0.5 }}
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#050507] via-[#050507]/50 to-[#050507]/15" />
          <div className="absolute inset-0 bg-gradient-to-r from-[#050507]/65 via-transparent to-transparent" />
        </div>
        <div className="relative z-10 max-w-[1400px] mx-auto px-6 sm:px-10 lg:px-16 w-full">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }} className="max-w-2xl space-y-5">
            <span className="text-[10px] tracking-[0.4em] text-[#c5a880] uppercase font-bold block">Get In Touch</span>
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-light text-white leading-tight font-serif">
              Ready to Create Something Unforgettable?
            </h1>
            <p className="text-sm md:text-base text-[#f4ebd0]/75 font-light leading-relaxed">
              Tell us about your project and we will respond within 24 hours with a tailored proposal.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Contact Info + Form */}
      <section className="py-16 md:py-24 max-w-[1400px] mx-auto px-6 sm:px-10 lg:px-16">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-16">

          {/* Info Panel */}
          <div className="lg:col-span-2 space-y-8">
            <div>
              <span className="text-[10px] tracking-[0.4em] text-[#c5a880] uppercase font-semibold block mb-4">Contact Details</span>
              <h2 className="text-2xl md:text-3xl font-light text-white font-serif mb-5">We&apos;d love to hear from you.</h2>
              <p className="text-sm text-[#f4ebd0]/65 font-light leading-relaxed">
                Whether you are planning a government conference, a destination wedding, a brand campaign or just exploring — send us a message and let&apos;s talk.
              </p>
            </div>

            <div className="space-y-5">
              {[
                { icon: MapPin,        label: "Location",      value: "Victoria Falls, Zimbabwe" },
                { icon: Mail,          label: "Email",         value: "info@mosimediasolutions.com" },
                { icon: Clock,         label: "Response Time", value: "Within 24 hours" },
                { icon: MessageSquare, label: "WhatsApp",      value: "Available on request" },
              ].map((item) => (
                <div key={item.label} className="flex items-start gap-4">
                  <div className="w-9 h-9 rounded-full bg-[#c5a880]/10 flex items-center justify-center shrink-0">
                    <item.icon className="w-4 h-4 text-[#c5a880]" />
                  </div>
                  <div>
                    <p className="text-[9px] uppercase tracking-[0.2em] text-[#c5a880] font-semibold mb-0.5">{item.label}</p>
                    <p className="text-sm text-[#f4ebd0]/80 font-light">{item.value}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Recent work thumbnails */}
            <div className="space-y-3">
              <h3 className="text-[10px] uppercase tracking-[0.25em] text-[#c5a880] font-semibold">Recent Work</h3>
              <div className="grid grid-cols-2 gap-2">
                {recentWork.map((item) => (
                  <Link key={item.src} href="/gallery" className="group relative aspect-square rounded-xl overflow-hidden border border-[#c5a880]/12">
                    <Image src={item.src} alt={item.label} fill className="object-cover object-center transition-transform duration-500 group-hover:scale-105" />
                    <div className="absolute inset-0 bg-[#050507]/40 group-hover:bg-[#050507]/20 transition-colors duration-300" />
                    <div className="absolute bottom-2 left-2">
                      <span className="text-[8px] text-white/80 font-light">{item.label}</span>
                    </div>
                  </Link>
                ))}
              </div>
            </div>

            {/* Quick Links */}
            <div className="glass-panel rounded-2xl border border-[#c5a880]/15 p-6 space-y-4">
              <h3 className="text-sm font-medium text-white">Common Enquiries</h3>
              <div className="space-y-2">
                {[
                  { label: "Conference Production", href: "/conference-production#enquiry" },
                  { label: "Wedding Film",          href: "/gallery?cat=Wedding" },
                  { label: "Brand Campaign",        href: "/gallery?cat=Brand" },
                  { label: "View Our Work",         href: "/gallery" },
                ].map((link) => (
                  <Link
                    key={link.label}
                    href={link.href}
                    className="flex items-center justify-between text-xs text-[#f4ebd0]/65 hover:text-[#c5a880] transition-colors duration-200 py-1.5 border-b border-[#c5a880]/8 last:border-0"
                  >
                    {link.label}
                    <ArrowRight className="w-3 h-3" />
                  </Link>
                ))}
              </div>
            </div>
          </div>

          {/* Form */}
          <div className="lg:col-span-3">
            {!submitted ? (
              <form onSubmit={handleSubmit} className="glass-panel rounded-3xl border border-[#c5a880]/20 p-8 md:p-10 space-y-5">
                <h3 className="text-xl font-light text-white font-serif mb-2">Send us a message</h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-[9px] uppercase tracking-[0.2em] text-[#c5a880] font-semibold block mb-2">Your Name</label>
                    <input type="text" name="name" placeholder="e.g. Sarah Johnson" required
                      className="w-full bg-[#050507]/70 border border-[#c5a880]/20 rounded-xl px-4 py-3 text-sm text-white placeholder:text-[#f4ebd0]/30 focus:outline-none focus:border-[#c5a880]/50 transition-colors" />
                  </div>
                  <div>
                    <label className="text-[9px] uppercase tracking-[0.2em] text-[#c5a880] font-semibold block mb-2">Email Address</label>
                    <input type="email" name="email" placeholder="you@organisation.com" required
                      className="w-full bg-[#050507]/70 border border-[#c5a880]/20 rounded-xl px-4 py-3 text-sm text-white placeholder:text-[#f4ebd0]/30 focus:outline-none focus:border-[#c5a880]/50 transition-colors" />
                  </div>
                </div>

                <div>
                  <label className="text-[9px] uppercase tracking-[0.2em] text-[#c5a880] font-semibold block mb-2">Phone Number (optional)</label>
                  <input type="tel" name="phone" placeholder="+263 ..."
                    className="w-full bg-[#050507]/70 border border-[#c5a880]/20 rounded-xl px-4 py-3 text-sm text-white placeholder:text-[#f4ebd0]/30 focus:outline-none focus:border-[#c5a880]/50 transition-colors" />
                </div>

                <div>
                  <label className="text-[9px] uppercase tracking-[0.2em] text-[#c5a880] font-semibold block mb-3">Type of Project</label>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                    {[
                      { id: "conference" as const, label: "Conference / Event" },
                      { id: "wedding"    as const, label: "Wedding Film" },
                      { id: "brand"      as const, label: "Brand Campaign" },
                      { id: "event"      as const, label: "Corporate Event" },
                      { id: "other"      as const, label: "Other / Not Sure" },
                    ].map((opt) => (
                      <button
                        type="button"
                        key={opt.id}
                        onClick={() => setProjectType(opt.id)}
                        className={`py-2.5 px-3 rounded-xl text-xs border transition-all duration-200 cursor-pointer ${
                          projectType === opt.id
                            ? "bg-[#c5a880]/15 border-[#c5a880] text-white"
                            : "border-[#c5a880]/15 text-[#f4ebd0]/55 hover:border-[#c5a880]/40 hover:text-white"
                        }`}
                      >
                        {opt.label}
                      </button>
                    ))}
                  </div>
                  <input type="hidden" name="projectType" value={projectType} />
                </div>

                <div>
                  <label className="text-[9px] uppercase tracking-[0.2em] text-[#c5a880] font-semibold block mb-2">Your Message</label>
                  <textarea name="message" placeholder="Tell us about your project — dates, location, size, what you need..." rows={5} required
                    className="w-full bg-[#050507]/70 border border-[#c5a880]/20 rounded-xl px-4 py-3 text-sm text-white placeholder:text-[#f4ebd0]/30 focus:outline-none focus:border-[#c5a880]/50 transition-colors resize-none" />
                </div>

                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 pt-2">
                  <button type="submit" disabled={loading} className={`${goldBtn} px-8 py-3.5 text-[11px] uppercase tracking-[0.18em] disabled:opacity-50`}>
                    <span className="relative z-10">{loading ? "Sending…" : "Send Message"}</span>
                    <ArrowRight className="relative z-10 ml-2 h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
                  </button>
                  <p className="text-[10px] text-[#f4ebd0]/35">We respect your privacy. No spam, ever.</p>
                </div>
              </form>
            ) : (
              <div className="glass-panel rounded-3xl border border-[#c5a880]/20 p-12 text-center space-y-4">
                <CheckCircle className="w-14 h-14 text-[#c5a880] mx-auto" />
                <h3 className="text-xl font-light text-white font-serif">Message received — thank you!</h3>
                <p className="text-sm text-[#f4ebd0]/60 font-light">Our team will review your enquiry and respond within 24 hours.</p>
                <Link href="/" className="inline-flex items-center gap-2 text-xs text-[#c5a880] hover:text-white transition-colors mt-4">
                  Back to Home <ArrowRight className="w-3 h-3" />
                </Link>
              </div>
            )}

            {/* Gallery preview strip below form */}
            <div className="mt-6 grid grid-cols-4 gap-2">
              {["/mms/DSC_7551.jpg", "/mms/DSC_7589.jpg", "/mms/DSC_7640.jpg", "/mms/DSC_7703.jpg"].map((src, i) => (
                <Link key={i} href="/gallery" className="group relative aspect-square rounded-xl overflow-hidden border border-[#c5a880]/10">
                  <Image src={src} alt="gallery preview" fill className="object-cover object-center transition-transform duration-500 group-hover:scale-110" />
                  <div className="absolute inset-0 bg-[#050507]/40 group-hover:bg-[#050507]/10 transition-colors duration-300" />
                </Link>
              ))}
            </div>
            <p className="text-center mt-3 text-[10px] text-[#f4ebd0]/35">
              <Link href="/gallery" className="hover:text-[#c5a880] transition-colors">View full gallery →</Link>
            </p>
          </div>
        </div>
      </section>

      {/* Conference CTA with scenic background */}
      <section className="relative py-16 overflow-hidden">
        <div className="absolute inset-0 z-0">
          <Image src="/mms/DSC_9244.jpg" alt="Conference" fill className="object-cover object-center opacity-30" />
          <div className="absolute inset-0 bg-[#050507]/80" />
        </div>
        <div className="relative z-10 max-w-[1400px] mx-auto px-6 sm:px-10 lg:px-16">
          <div className="glass-panel rounded-3xl border border-[#c5a880]/20 p-8 md:p-12 flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="space-y-3 max-w-xl">
              <span className="text-[9px] uppercase tracking-[0.25em] text-[#c5a880] font-semibold block">Institutional Production</span>
              <h2 className="text-2xl md:text-3xl font-light text-white font-serif">Planning a conference or government event?</h2>
              <p className="text-sm text-[#f4ebd0]/60 font-light">Use the dedicated conference enquiry form to give us all the details we need — organisation type, delegate count, venue and required services.</p>
            </div>
            <Link href="/conference-production#enquiry" className={`${goldBtn} px-7 py-3.5 text-[11px] uppercase tracking-[0.18em] shrink-0`}>
              <span className="relative z-10">Conference Enquiry Form</span>
              <ArrowRight className="relative z-10 ml-2 h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
