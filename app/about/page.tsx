"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { Shield, Users, MessageSquare, Award, ArrowRight, CheckCircle } from "lucide-react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

const goldBtn =
  "group relative isolate inline-flex items-center justify-center overflow-hidden rounded-full bg-gradient-to-r from-[#b48a3d] via-[#d6bd7d] to-[#c5a880] text-[#050507] font-semibold shadow-[0_0_0_1px_rgba(229,207,154,0.28),0_0_18px_rgba(180,138,61,0.2)] transition-all duration-300 before:absolute before:inset-0 before:rounded-full before:bg-[linear-gradient(110deg,transparent_18%,rgba(255,255,255,0.62)_48%,transparent_78%)] before:-translate-x-[140%] before:transition-transform before:duration-700 hover:-translate-y-0.5 hover:brightness-110 hover:shadow-[0_0_0_1px_rgba(229,207,154,0.55),0_0_34px_rgba(197,168,128,0.48)] hover:before:translate-x-[140%] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#e5cf9a]";

const values = [
  { icon: Shield,       title: "Professionalism", desc: "We hold ourselves to the highest standards of conduct and delivery on every project." },
  { icon: Users,        title: "Partnership",      desc: "We work alongside clients as trusted partners, not just vendors." },
  { icon: MessageSquare,title: "Preparation",      desc: "Thorough pre-event planning means the day runs seamlessly." },
  { icon: Award,        title: "Quality",          desc: "Every deliverable is refined until it reflects the importance of the occasion." },
];

const faqs = [
  { q: "Where are you based?",                       a: "We are based in Victoria Falls, Zimbabwe, and operate across the country and wider southern African region." },
  { q: "What types of organisations do you work with?", a: "We primarily serve government ministries, international development organisations, NGOs, professional associations and corporate institutions." },
  { q: "Do you travel for events?",                   a: "Yes. While Victoria Falls is our home base, we regularly travel across Zimbabwe and the region for institutional events." },
  { q: "How do I get a quote?",                       a: "Fill in the enquiry form on the Conference Production page or use the Contact form and we will respond within 24 hours." },
  { q: "Are you licensed and insured?",               a: "Yes. We are fully licensed, insured and our drone operators hold valid CAA certification." },
  { q: "Do you handle both video and photography?",   a: "Yes — all our productions include both video and photography as standard, with additional specialist packages available." },
];

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-[#050507] text-[#f4ebd0] font-sans">
      <Navbar />

      {/* Hero — Victoria Falls panorama */}
      <section className="relative min-h-[68vh] flex items-end overflow-hidden bg-black pt-28 pb-16">
        <div className="absolute inset-0 z-0">
          <Image
            src="/mms/Zambia-Zimbabwe-Victoria-Falls-Impressive-View-1.jpg"
            alt="Victoria Falls"
            fill
            className="object-cover object-center"
            style={{ opacity: 0.6 }}
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#050507] via-[#050507]/45 to-[#050507]/10" />
          <div className="absolute inset-0 bg-gradient-to-r from-[#050507]/70 via-transparent to-transparent" />
        </div>
        <div className="relative z-10 max-w-[1400px] mx-auto px-6 sm:px-10 lg:px-16 w-full pb-6">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }} className="max-w-3xl space-y-5">
            <span className="text-[10px] tracking-[0.4em] text-[#c5a880] uppercase font-bold block">About Us</span>
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-light text-white leading-tight font-serif">
              We help organisations deliver important events professionally.
            </h1>
            <p className="text-sm md:text-base text-[#f4ebd0]/75 font-light leading-relaxed max-w-2xl">
              Mosi Media Solutions is a Victoria Falls-based conference and media production company supporting institutions that need their events professionally presented, documented and shared.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Who We Are — text + 2×2 image grid */}
      <section className="py-20 md:py-28 max-w-[1400px] mx-auto px-6 sm:px-10 lg:px-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-20 items-center">
          <div className="space-y-6">
            <span className="text-[10px] tracking-[0.4em] text-[#c5a880] uppercase font-semibold block">Who We Are</span>
            <h2 className="text-3xl md:text-4xl font-light text-white font-serif">A dedicated team built around institutional excellence.</h2>
            <p className="text-sm text-[#f4ebd0]/70 leading-relaxed font-light">
              We are a small, professional production team specialising in institutional events and conference delivery. Our core work focuses on conferences, seminars, workshops and institutional gatherings for government, development, professional and corporate organisations.
            </p>
            <p className="text-sm text-[#f4ebd0]/70 leading-relaxed font-light">
              We prioritise preparation, discretion and reliable technical delivery. Every event receives the same rigorous pre-production process — whether an intimate ministerial workshop or a multi-day international summit.
            </p>
            <div className="space-y-3 pt-2">
              {[
                "End-to-end conference production",
                "Live streaming and hybrid conference delivery",
                "Event photography and documentation",
                "Multi-camera video coverage and post-event editing",
                "Event branding, staging and interpretation systems",
              ].map((item) => (
                <div key={item} className="flex items-center gap-3">
                  <CheckCircle className="w-4 h-4 text-[#c5a880] shrink-0" />
                  <span className="text-sm text-[#f4ebd0]/75 font-light">{item}</span>
                </div>
              ))}
            </div>
          </div>

          {/* 2×2 photo grid */}
          <div className="grid grid-cols-2 gap-3">
            {[
              "/mms/DSC_7208.jpg",
              "/mms/DSC_7218.jpg",
              "/mms/DSC_7176.jpg",
              "/mms/Victoria-Falls-Video-Conference-Hire.webp",
            ].map((src, i) => (
              <div key={i} className={`relative rounded-2xl overflow-hidden border border-[#c5a880]/12 ${i === 0 ? "aspect-[4/3]" : i === 3 ? "aspect-[4/3]" : "aspect-square"}`}>
                <Image src={src} alt="MMS production" fill className="object-cover object-center" />
                <div className="absolute inset-0 bg-[#050507]/25" />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Work in pictures — horizontal image strip */}
      <section className="overflow-hidden border-y border-[#c5a880]/10">
        <div className="flex h-52 md:h-72">
          {[
            "/mms/DSC_2349.jpg",
            "/mms/DSC_7317.jpg",
            "/mms/DSC_1257.jpg",
            "/mms/DSC_7550.jpg",
            "/mms/DSC_2484.jpg",
            "/mms/DSC_7343.jpg",
          ].map((src, i) => (
            <div key={i} className="relative flex-1 overflow-hidden group">
              <Image src={src} alt="MMS work" fill className="object-cover object-center transition-transform duration-700 group-hover:scale-105" />
              <div className="absolute inset-0 bg-[#050507]/30 group-hover:bg-[#050507]/10 transition-colors duration-300" />
            </div>
          ))}
        </div>
      </section>

      {/* Victoria Falls — with scenic image pair */}
      <section className="py-20 md:py-28 max-w-[1400px] mx-auto px-6 sm:px-10 lg:px-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-20 items-center">
          {/* Images */}
          <div className="grid grid-cols-2 gap-3">
            <div className="relative aspect-[3/4] rounded-2xl overflow-hidden border border-[#c5a880]/12">
              <Image src="/mms/vic falls bridge.jpg" alt="Victoria Falls Bridge" fill className="object-cover object-center" />
            </div>
            <div className="space-y-3">
              <div className="relative aspect-square rounded-2xl overflow-hidden border border-[#c5a880]/12">
                <Image src="/mms/bridge.jpg" alt="Falls bridge aerial" fill className="object-cover object-center" />
              </div>
              <div className="relative aspect-square rounded-2xl overflow-hidden border border-[#c5a880]/12">
                <Image src="/mms/_MG_2920.jpg" alt="Aerial landscape" fill className="object-cover object-center" />
              </div>
            </div>
          </div>
          {/* Text */}
          <div className="space-y-6">
            <span className="text-[10px] tracking-[0.4em] text-[#c5a880] uppercase font-semibold block">Our Base</span>
            <h2 className="text-3xl md:text-4xl font-light text-white font-serif">Why Victoria Falls</h2>
            <p className="text-sm text-[#f4ebd0]/70 leading-relaxed font-light">
              Victoria Falls offers strategic proximity to regional events and unique world-class venues that attract international delegations. Our local knowledge of the venue landscape, logistics networks and regulatory environment helps us deliver seamless productions for visiting organisations.
            </p>
            <p className="text-sm text-[#f4ebd0]/70 leading-relaxed font-light">
              From the iconic Victoria Falls Hotel to conference facilities along the Zambezi, we know how to make the most of every space and deliver productions that match the significance of the setting.
            </p>
            <Link href="/gallery?cat=Drone" className="inline-flex items-center gap-2 text-xs text-[#c5a880] hover:text-white transition-colors">
              See our Victoria Falls aerials
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-20 bg-black border-t border-[#c5a880]/10">
        <div className="max-w-[1400px] mx-auto px-6 sm:px-10 lg:px-16">
          <div className="text-center mb-16">
            <span className="text-[10px] tracking-[0.4em] text-[#c5a880] uppercase font-semibold block mb-3">What Guides Us</span>
            <h2 className="text-3xl md:text-4xl font-light text-white font-serif">Our Values</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map((value, idx) => (
              <motion.div
                key={value.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: idx * 0.08 }}
                className="glass-panel rounded-2xl border border-[#c5a880]/15 p-6 space-y-4 hover:border-[#c5a880]/35 transition-all duration-300"
              >
                <div className="w-10 h-10 rounded-full bg-[#c5a880]/10 flex items-center justify-center">
                  <value.icon className="w-5 h-5 text-[#c5a880]" />
                </div>
                <h3 className="text-base font-medium text-white">{value.title}</h3>
                <p className="text-xs text-[#f4ebd0]/60 leading-relaxed font-light">{value.desc}</p>
              </motion.div>
            ))}
          </div>
          <div className="mt-10 grid grid-cols-2 sm:grid-cols-4 gap-4">
            {["Reliability", "Discretion", "Innovation", "Integrity"].map((val) => (
              <div key={val} className="text-center py-5 rounded-2xl border border-[#c5a880]/10 bg-[#c5a880]/5">
                <span className="text-sm font-medium text-[#c5a880]">{val}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Selected work teaser — 5 images */}
      <section className="py-16 max-w-[1400px] mx-auto px-6 sm:px-10 lg:px-16">
        <div className="flex items-end justify-between mb-8">
          <h2 className="text-2xl md:text-3xl font-light text-white font-serif">Selected Work</h2>
          <Link href="/gallery" className="text-xs text-[#c5a880] hover:text-white transition-colors flex items-center gap-1.5">
            Full Gallery <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
          {[
            { src: "/mms/DSC_7906.jpg",     tall: true  },
            { src: "/mms/DSC_1864.jpg",     tall: false },
            { src: "/mms/DSC_2643 (2).jpg", tall: false },
            { src: "/mms/DSC_7551.jpg",     tall: true  },
            { src: "/mms/DSC_7589.jpg",     tall: false },
          ].map(({ src, tall }, i) => (
            <Link
              key={i}
              href="/gallery"
              className={`relative overflow-hidden rounded-2xl border border-[#c5a880]/10 group ${tall ? "row-span-2 aspect-[3/4]" : "aspect-square"}`}
            >
              <Image src={src} alt="work" fill className="object-cover object-center transition-transform duration-500 group-hover:scale-105" />
              <div className="absolute inset-0 bg-[#050507]/35 group-hover:bg-[#050507]/10 transition-colors duration-300" />
            </Link>
          ))}
        </div>
      </section>

      {/* FAQs */}
      <section className="py-16 bg-black border-t border-[#c5a880]/10">
        <div className="max-w-[900px] mx-auto px-6 sm:px-10">
          <div className="text-center mb-12">
            <span className="text-[10px] tracking-[0.4em] text-[#c5a880] uppercase font-semibold block mb-3">Quick Answers</span>
            <h2 className="text-3xl md:text-4xl font-light text-white font-serif">Frequently Asked Questions</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {faqs.map((faq) => (
              <div key={faq.q} className="glass-panel rounded-2xl border border-[#c5a880]/15 p-6 space-y-2">
                <h3 className="text-sm font-medium text-white">{faq.q}</h3>
                <p className="text-xs text-[#f4ebd0]/60 leading-relaxed font-light">{faq.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 max-w-[1400px] mx-auto px-6 sm:px-10 lg:px-16">
        <div className="relative rounded-3xl overflow-hidden border border-[#c5a880]/20">
          <Image src="/mms/DSC_7590.jpg" alt="CTA background" fill className="object-cover object-center opacity-25" />
          <div className="absolute inset-0 bg-[#050507]/80" />
          <div className="relative z-10 p-10 md:p-14 flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="space-y-3 max-w-xl">
              <h2 className="text-2xl md:text-3xl font-light text-white font-serif">Ready to work together?</h2>
              <p className="text-sm text-[#f4ebd0]/60 font-light">Tell us about your event or project and our team will respond within 24 hours.</p>
            </div>
            <div className="flex flex-wrap gap-4 shrink-0">
              <Link href="/contact" className={`${goldBtn} px-7 py-3.5 text-[11px] uppercase tracking-[0.18em]`}>
                <span className="relative z-10">Get in Touch</span>
                <ArrowRight className="relative z-10 ml-2 h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
              </Link>
              <Link href="/conference-production#enquiry" className="inline-flex items-center px-7 py-3.5 rounded-full border border-[#c5a880]/30 text-[#f4ebd0]/80 text-[11px] uppercase tracking-[0.18em] hover:border-[#c5a880] hover:text-white transition-all duration-300">
                Conference Enquiry
              </Link>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
