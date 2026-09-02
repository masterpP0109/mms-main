"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  Globe, MessageSquare, Users, Play, Video, Camera, Megaphone, Palette, PenTool, Briefcase, ArrowRight
} from "lucide-react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

const goldBtn =
  "group relative isolate inline-flex items-center justify-center overflow-hidden rounded-full bg-gradient-to-r from-[#b48a3d] via-[#d6bd7d] to-[#c5a880] text-[#050507] font-semibold shadow-[0_0_0_1px_rgba(229,207,154,0.28),0_0_18px_rgba(180,138,61,0.2)] transition-all duration-300 before:absolute before:inset-0 before:rounded-full before:bg-[linear-gradient(110deg,transparent_18%,rgba(255,255,255,0.62)_48%,transparent_78%)] before:-translate-x-[140%] before:transition-transform before:duration-700 hover:-translate-y-0.5 hover:brightness-110 hover:shadow-[0_0_0_1px_rgba(229,207,154,0.55),0_0_34px_rgba(197,168,128,0.48)] hover:before:translate-x-[140%] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#e5cf9a]";

const services = [
  {
    title: "Conference Microphone & Interpretation Equipment",
    image: "/mms/DSC_7204.jpg",
    gallery: ["/mms/DSC_7176.jpg", "/mms/DSC_7204.jpg", "/mms/DSC_7218.jpg"],
    tag: "Audio & Interpretation",
    desc: "Professional conference audio, microphone systems and simultaneous interpretation booths for multilingual institutional events, government meetings and international conferences.",
    items: [
      { label: "Microphone Systems", icon: Users },
      { label: "Interpretation Booths", icon: Globe },
      { label: "Receivers & Headsets", icon: Play },
      { label: "Conference Audio", icon: Video },
      { label: "Multi-language Support", icon: MessageSquare },
    ],
    cta: "Plan Your Conference",
    href: "/conference-production",
  },
  {
    title: "LED Screen Rental",
    image: "/mms/DSC_7215.jpg",
    gallery: ["/mms/DSC_7215.jpg", "/mms/DSC_7176.jpg", "/mms/DSC_7208.jpg"],
    tag: "Visual Display",
    desc: "High-brightness LED screens, video walls and digital displays for conferences, brand activations and outdoor events — available in any size with on-site technical support.",
    items: [
      { label: "LED Screens", icon: Globe },
      { label: "Indoor & Outdoor", icon: Play },
      { label: "Video Walls", icon: Video },
      { label: "Custom Content", icon: PenTool },
      { label: "On-site Support", icon: Briefcase },
    ],
    cta: "Build Your Event",
    href: "/contact",
  },
  {
    title: "Professional Sound Systems",
    image: "/mms/Victoria-Falls-Video-Conference-Hire.webp",
    gallery: ["/mms/Victoria-Falls-Video-Conference-Hire.webp", "/mms/DSC_7204.jpg", "/mms/DSC_7218.jpg"],
    tag: "Audio Engineering",
    desc: "Comprehensive PA systems, line arrays, mixing consoles and wireless microphones engineered for clear, reliable sound at every venue size.",
    items: [
      { label: "PA Systems", icon: Play },
      { label: "Line Arrays", icon: Users },
      { label: "Mixing Consoles", icon: Video },
      { label: "Wireless Mics", icon: Globe },
      { label: "Acoustics", icon: MessageSquare },
    ],
    cta: "Start a Project",
    href: "/contact",
  },
  {
    title: "Live Streaming Production",
    image: "/mms/DSC_9244.jpg",
    gallery: ["/mms/DSC_9244.jpg", "/mms/DSC_7215.jpg", "/mms/DSC_7176.jpg"],
    tag: "Hybrid Events",
    desc: "Full-service live streaming with multi-camera switching, platform integration, virtual backdrops and real-time graphics for hybrid and fully virtual conferences.",
    items: [
      { label: "Multi-camera Streaming", icon: Video },
      { label: "Platform Integration", icon: Play },
      { label: "Virtual Backdrops", icon: Globe },
      { label: "Live Graphics", icon: Camera },
      { label: "Replay & Editing", icon: PenTool },
    ],
    cta: "Plan Your Conference",
    href: "/conference-production",
  },
  {
    title: "Videography & Photography",
    image: "/mms/DSC_2327-Edit.jpg",
    gallery: ["/mms/DSC_2327-Edit.jpg", "/mms/DSC_2484.jpg", "/mms/DSC_2591.jpg"],
    tag: "Creative Capture",
    desc: "Cinematic event videography and professional photography — from same-day edits and highlight reels to full event archives and brand campaign imagery.",
    items: [
      { label: "Event Videography", icon: Camera },
      { label: "Photography", icon: Video },
      { label: "Highlight Reels", icon: Play },
      { label: "Same-day Edit", icon: PenTool },
      { label: "Post-production", icon: Globe },
    ],
    cta: "Start Visual Storytelling",
    href: "/contact",
  },
  {
    title: "Drone Services",
    image: "/mms/_MG_0072.jpg",
    gallery: ["/mms/_MG_0072.jpg", "/mms/_MG_2920.jpg", "/mms/IMG_9198.jpeg"],
    tag: "Aerial Capture",
    desc: "Licensed drone cinematography and aerial photography for events, venues, landscapes and brand campaigns — 4K RAW footage delivered with full regulatory compliance.",
    items: [
      { label: "Aerial Videography", icon: Camera },
      { label: "Drone Photography", icon: Video },
      { label: "Site Survey", icon: Play },
      { label: "Licensed Pilots", icon: Globe },
      { label: "4K & RAW", icon: Users },
    ],
    cta: "See Cinematic Work",
    href: "/gallery",
  },
  {
    title: "Event Lighting & Stage Setup",
    image: "/mms/DSC_7356.jpg",
    gallery: ["/mms/DSC_7356.jpg", "/mms/DSC_7317.jpg", "/mms/DSC_7343.jpg"],
    tag: "Stage Design",
    desc: "Complete stage design, theatrical lighting, truss rigging and branded backdrops that transform any venue into a professional production space.",
    items: [
      { label: "Stage Design", icon: Play },
      { label: "Lighting Design", icon: Globe },
      { label: "Truss & Rigging", icon: Video },
      { label: "LED Walls", icon: PenTool },
      { label: "Backdrops", icon: Users },
    ],
    cta: "Build Your Event",
    href: "/contact",
  },
  {
    title: "Special Effects Services",
    image: "/mms/Iconic Final Look with Pyro.jpg",
    gallery: ["/mms/Iconic Final Look with Pyro.jpg", "/mms/LCG SPITFIRE Cold Spark Machine Package (2x Spitfire w_ Case & Granules).jpg", "/mms/IMG_9198.jpeg"],
    tag: "FX & Atmosphere",
    desc: "High-impact special effects including pyrotechnics, cold spark machines, haze, confetti and custom atmospheric effects for galas, launches and grand finales.",
    items: [
      { label: "Pyrotechnics", icon: Play },
      { label: "Cold Sparks", icon: Palette },
      { label: "Haze & Fog", icon: Video },
      { label: "Confetti", icon: Globe },
      { label: "Custom Effects", icon: MessageSquare },
    ],
    cta: "See Cinematic Work",
    href: "/gallery",
  },
];

const addOns = [
  { icon: Camera,       label: "Drone Cinematography",  img: "/mms/_MG_2920.jpg",          desc: "Licensed aerial photography and video for events, venues and brand campaigns." },
  { icon: Video,        label: "360° Capture",           img: "/mms/IMG_9203.jpeg",          desc: "Immersive 360-degree video experiences for events and digital platforms." },
  { icon: MessageSquare,label: "Podcast Production",     img: "/mms/DSC_7598.jpg",           desc: "On-location podcast capture with multi-track audio and professional editing." },
  { icon: Globe,        label: "Interpretation Systems", img: "/mms/DSC_7204.jpg",           desc: "Simultaneous interpretation booths and receiver units for multilingual events." },
  { icon: Megaphone,    label: "Social Media Packages",  img: "/mms/DSC_2505.jpg",           desc: "Edited reels, clips and graphics delivered for immediate post-event publishing." },
  { icon: Briefcase,    label: "Equipment Hire",         img: "/mms/Victoria-Falls-Video-Conference-Hire.webp", desc: "Standalone hire of PA systems, screens, cameras and broadcast equipment." },
];

export default function ServicesPage() {
  return (
    <div className="min-h-screen bg-[#050507] text-[#f4ebd0] font-sans">
      <Navbar />

      {/* Hero */}
      <section className="relative min-h-[62vh] flex items-end overflow-hidden bg-black pt-28 pb-14">
        <div className="absolute inset-0 z-0">
          <Image src="/mms/DSC_7204.jpg" alt="MMS Services" fill className="object-cover object-center" style={{ opacity: 0.55 }} priority />
        </div>
        <div className="absolute inset-0 bg-gradient-to-t from-[#050507] via-[#050507]/55 to-[#050507]/20 z-10" />
        <div className="relative z-20 max-w-[1400px] mx-auto px-6 sm:px-10 lg:px-16 w-full">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }} className="max-w-2xl space-y-5">
            <span className="text-[10px] tracking-[0.4em] text-[#c5a880] uppercase font-bold block">What We Offer</span>
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-light text-white leading-tight font-serif">Our Services</h1>
            <p className="text-sm md:text-base text-[#f4ebd0]/75 font-light leading-relaxed">
              End-to-end multimedia production crafted with creativity and precision — from conference AV to cinematic films and brand campaigns.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Services — alternating layout, each with 3-image gallery strip */}
      <section className="py-16 md:py-24 max-w-[1400px] mx-auto px-6 sm:px-10 lg:px-16">
        <div className="space-y-28 md:space-y-36">
          {services.map((service, idx) => (
            <motion.div
              key={service.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="space-y-8"
            >
              {/* Main grid */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
                {/* Primary image */}
                <div className={`relative rounded-3xl overflow-hidden glass-panel border border-[#c5a880]/15 aspect-[4/3] group ${idx % 2 === 1 ? "lg:order-2" : "lg:order-1"}`}>
                  <Image
                    src={service.image}
                    alt={service.title}
                    fill
                    className="object-cover object-center transition-transform duration-700 group-hover:scale-105"
                    style={{ opacity: 0.88 }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#050507]/70 via-[#050507]/20 to-transparent z-10" />
                  <div className="absolute bottom-4 left-4 z-20">
                    <span className="text-[9px] uppercase tracking-[0.25em] bg-[#c5a880]/20 text-[#c5a880] border border-[#c5a880]/30 px-3 py-1.5 rounded-full backdrop-blur-sm">
                      {service.tag}
                    </span>
                  </div>
                </div>

                {/* Text */}
                <div className={`space-y-6 ${idx % 2 === 1 ? "lg:order-1" : "lg:order-2"}`}>
                  <h2 className="text-2xl md:text-4xl font-light text-white font-serif">{service.title}</h2>
                  <p className="text-sm text-[#f4ebd0]/70 leading-relaxed font-light">{service.desc}</p>
                  <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 pt-2">
                    {service.items.map((item) => (
                      <div key={item.label} className="glass-panel flex flex-col items-center justify-center gap-2.5 min-h-[90px] rounded-2xl border border-[#c5a880]/20 hover:border-[#c5a880]/50 transition-all duration-300 text-center px-3">
                        <item.icon className="w-4 h-4 text-[#c5a880]" />
                        <span className="text-[10px] text-white font-medium leading-tight">{item.label}</span>
                      </div>
                    ))}
                  </div>
                  <Link href={service.href} className={`${goldBtn} px-6 py-3 text-[10px] uppercase tracking-[0.18em] inline-flex`}>
                    <span className="relative z-10">{service.cta}</span>
                    <ArrowRight className="relative z-10 ml-2 h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-1" />
                  </Link>
                </div>
              </div>

              {/* 3-image thumbnail strip */}
              <div className="grid grid-cols-3 gap-3">
                {service.gallery.map((img, i) => (
                  <div key={i} className="relative aspect-[16/9] rounded-2xl overflow-hidden border border-[#c5a880]/10 group">
                    <Image src={img} alt={`${service.title} ${i + 1}`} fill className="object-cover object-center transition-transform duration-500 group-hover:scale-105" />
                    <div className="absolute inset-0 bg-[#050507]/30 group-hover:bg-[#050507]/10 transition-colors duration-300" />
                  </div>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Add-Ons — cards with image thumbnails */}
      <section className="py-20 bg-black border-t border-[#c5a880]/10">
        <div className="max-w-[1400px] mx-auto px-6 sm:px-10 lg:px-16">
          <div className="text-center mb-14">
            <span className="text-[10px] tracking-[0.4em] text-[#c5a880] uppercase font-semibold block mb-3">Optional Add-Ons</span>
            <h2 className="text-3xl md:text-4xl font-light text-white font-serif">Enhance Your Production</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {addOns.map((addon, idx) => (
              <motion.div
                key={addon.label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: idx * 0.06 }}
                className="glass-panel rounded-2xl border border-[#c5a880]/15 overflow-hidden hover:border-[#c5a880]/35 transition-all duration-300 group"
              >
                <div className="relative h-40 overflow-hidden">
                  <Image src={addon.img} alt={addon.label} fill className="object-cover object-center transition-transform duration-500 group-hover:scale-105" />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#050507] via-[#050507]/40 to-transparent" />
                  <div className="absolute bottom-3 left-4">
                    <div className="w-8 h-8 rounded-full bg-[#c5a880]/20 backdrop-blur-sm flex items-center justify-center border border-[#c5a880]/30">
                      <addon.icon className="w-4 h-4 text-[#c5a880]" />
                    </div>
                  </div>
                </div>
                <div className="p-5">
                  <h3 className="text-sm font-medium text-white mb-1.5">{addon.label}</h3>
                  <p className="text-xs text-[#f4ebd0]/60 leading-relaxed font-light">{addon.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA — full-bleed image background */}
      <section className="relative py-24 overflow-hidden">
        <div className="absolute inset-0 z-0">
          <Image src="/mms/Zambia-Zimbabwe-Victoria-Falls-Impressive-View-1.jpg" alt="" fill className="object-cover object-center opacity-35" />
          <div className="absolute inset-0 bg-[#050507]/75" />
        </div>
        <div className="relative z-10 max-w-[700px] mx-auto px-6 text-center space-y-6">
          <span className="text-[10px] tracking-[0.4em] text-[#c5a880] uppercase font-semibold block">Get Started</span>
          <h2 className="text-3xl md:text-4xl font-light text-white font-serif">Ready to create something memorable?</h2>
          <p className="text-sm text-[#f4ebd0]/60 font-light leading-relaxed">Tell us about your project and we&apos;ll respond within 24 hours with a tailored proposal.</p>
          <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
            <Link href="/contact" className={`${goldBtn} px-8 py-3.5 text-[11px] uppercase tracking-[0.18em]`}>
              <span className="relative z-10">Start a Project</span>
              <ArrowRight className="relative z-10 ml-2 h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
            </Link>
            <Link href="/conference-production#enquiry" className="inline-flex items-center px-8 py-3.5 rounded-full border border-[#c5a880]/30 text-[#f4ebd0]/80 text-[11px] uppercase tracking-[0.18em] hover:border-[#c5a880] hover:text-white transition-all duration-300">
              Conference Enquiry
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
