"use client";

import React, { useState, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, X } from "lucide-react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { useModalFocus } from "../components/useModalFocus";

const goldBtn =
  "group relative isolate inline-flex items-center justify-center overflow-hidden rounded-full bg-gradient-to-r from-[#b48a3d] via-[#d6bd7d] to-[#c5a880] text-[#050507] font-semibold shadow-[0_0_0_1px_rgba(229,207,154,0.28),0_0_18px_rgba(180,138,61,0.2)] transition-all duration-300 before:absolute before:inset-0 before:rounded-full before:bg-[linear-gradient(110deg,transparent_18%,rgba(255,255,255,0.62)_48%,transparent_78%)] before:-translate-x-[140%] before:transition-transform before:duration-700 hover:-translate-y-0.5 hover:brightness-110 hover:shadow-[0_0_0_1px_rgba(229,207,154,0.55),0_0_34px_rgba(197,168,128,0.48)] hover:before:translate-x-[140%] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#e5cf9a]";

const contentSlug = (title: string) =>
  title.toLowerCase().replace(/&/g, "").replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");

type Category = "All" | "Conference" | "Wedding" | "Brand" | "Immersive";

const projects = [
  {
    image: "/mms/DSC_9244.jpg",
    category: "Conference" as Category,
    title: "Global Summit Production",
    desc: "A fully produced conference experience with multiple screens, live streaming and branded stages for an international delegation.",
    tags: ["Event Production", "Live Streaming", "AV Staging"],
    year: "2024",
    images: ["/mms/DSC_7176.jpg", "/mms/DSC_7215.jpg"],
  },
  {
    image: "/mms/DSC_1257.jpg",
    category: "Wedding" as Category,
    title: "Victoria Falls Wedding Film",
    desc: "An emotional, intimate cinematic film captured across waterfall light and golden celebration moments.",
    tags: ["Cinematography", "Editing", "Colour Grading"],
    year: "2024",
    images: ["/mms/DSC_0453.jpg", "/mms/AllanLinda-31.jpg"],
  },
  {
    image: "/mms/DSC_2484.jpg",
    category: "Brand" as Category,
    title: "Corporate Brand Experience",
    desc: "Interactive screens, digital podiums and branded media that kept guests engaged throughout the multi-day corporate event.",
    tags: ["Brand Strategy", "Motion Design", "Content Creation"],
    year: "2024",
    images: ["/mms/DSC_2349.jpg", "/mms/DSC_2591.jpg"],
  },
  {
    image: "/mms/DSC_7218.jpg",
    category: "Conference" as Category,
    title: "Institutional Conference",
    desc: "End-to-end production for a ministerial conference with interpretation systems, photography and live documentation.",
    tags: ["Corporate Events", "Digital Displays", "Live Capture"],
    year: "2023",
    images: ["/mms/DSC_7188.jpg", "/mms/DSC_7262.jpg"],
  },
  {
    image: "/mms/IMG_9198.jpeg",
    category: "Immersive" as Category,
    title: "Immersive Media Production",
    desc: "360° capture, drone sequences and podcast experiences that transformed the event into shareable stories across digital channels.",
    tags: ["Immersive Tech", "Drone Cinematography", "360° Capture"],
    year: "2023",
    images: ["/mms/_MG_0072.jpg", "/mms/IMG_9220.jpeg"],
  },
  {
    image: "/mms/DSC_1821.jpg",
    category: "Wedding" as Category,
    title: "Destination Wedding in Victoria Falls",
    desc: "Cinematic multi-day wedding coverage with drone aerials over the Zambezi, ceremony films and same-day edits.",
    tags: ["Wedding Film", "Drone", "Same-Day Edit"],
    year: "2023",
    images: ["/mms/DSC_0676.jpg", "/mms/DSC_1349.jpg"],
  },
  {
    image: "/mms/DSC_2327-Edit.jpg",
    category: "Brand" as Category,
    title: "Luxury Brand Campaign",
    desc: "Creative ads, motion design and polished visuals for a launch that moved audiences across channels.",
    tags: ["Advertising", "Motion", "Photography"],
    year: "2023",
    images: ["/mms/DSC_2260.jpg", "/mms/DSC_2297.jpg"],
  },
  {
    image: "/mms/DSC_7356.jpg",
    category: "Immersive" as Category,
    title: "360° Event Experience",
    desc: "An immersive digital experience combining 360° stage coverage, drone aerials and interactive displays for a major cultural event.",
    tags: ["360° Film", "Drone", "Interactive"],
    year: "2022",
    images: ["/mms/DSC_7317.jpg", "/mms/IMG_9203.jpeg"],
  },
  {
    image: "/mms/DSC_7703.jpg",
    category: "Conference" as Category,
    title: "Regional Development Forum",
    desc: "Multi-day forum production with simultaneous interpretation, live documentation and post-event archive delivery.",
    tags: ["Multi-Camera", "Documentation", "Archive"],
    year: "2022",
    images: ["/mms/DSC_7704.jpg", "/mms/DSC_7258.jpg"],
  },
  {
    image: "/mms/DSC_1864.jpg",
    category: "Wedding" as Category,
    title: "Intimate Riverside Ceremony",
    desc: "A quiet, elegant wedding along the Zambezi captured with a small crew and a cinematic eye.",
    tags: ["Intimate Wedding", "Natural Light", "Film"],
    year: "2022",
    images: ["/mms/untitled-455.jpg", "/mms/untitled-477.jpg"],
  },
  {
    image: "/mms/DSC_2643 (2).jpg",
    category: "Brand" as Category,
    title: "African Distillers Campaign",
    desc: "Premium product photography and brand storytelling for one of the region's leading spirits brands.",
    tags: ["Product Photography", "Brand", "Lifestyle"],
    year: "2022",
    images: ["/mms/DSC_2660 (2).jpg", "/mms/DSC_2505.jpg"],
  },
  {
    image: "/mms/DSC_7906.jpg",
    category: "Immersive" as Category,
    title: "Drone Aerial Series",
    desc: "A sweeping aerial cinematography project showcasing Victoria Falls and the Zambezi corridor from above.",
    tags: ["Drone", "Aerial", "Landscape"],
    year: "2022",
    images: ["/mms/_MG_0305.jpg", "/mms/_MG_2920.jpg"],
  },
];

const categories: Category[] = ["All", "Conference", "Wedding", "Brand", "Immersive"];

export default function ProjectsPage() {
  const [active, setActive] = useState<Category>("All");
  const [selected, setSelected] = useState<typeof projects[0] | null>(null);
  const allFiltered = active === "All" ? projects : projects.filter((p) => p.category === active);
  const displayed = allFiltered.slice(0, 6);

  const modalRef = useRef<HTMLDivElement>(null);
  useModalFocus(selected !== null, modalRef, () => setSelected(null));

  return (
    <div className="min-h-screen bg-[#050507] text-[#f4ebd0] font-sans">
      <Navbar />

      {/* Hero */}
      <section className="relative min-h-[60vh] flex items-end overflow-hidden bg-black pt-28 pb-12">
        <div className="absolute inset-0 z-0">
          <Image src="/mms/DSC_9244.jpg" alt="MMS Projects" fill sizes="100vw" className="object-cover object-center" style={{ opacity: 0.5 }} preload />
        </div>
        <div className="absolute inset-0 bg-gradient-to-t from-[#050507] via-[#050507]/50 to-[#050507]/10 z-10" />
        <div className="relative z-20 max-w-[1400px] mx-auto mms-gutter w-full">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }} className="max-w-2xl space-y-5">
            <span className="text-[10px] tracking-[0.4em] text-[#c5a880] uppercase font-bold block font-heading">Our Featured Work</span>
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-semibold text-white font-heading">
              Stories That Became Memories
            </h1>
            <p className="text-sm md:text-base text-[#f4ebd0]/75 font-light leading-relaxed">
              A selection of weddings, corporate productions and immersive experiences brought to life through cinematic storytelling.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Filter */}
      <div className="sticky top-[72px] z-30 bg-[#050507]/90 backdrop-blur-md border-b border-[#c5a880]/10 py-4">
        <div className="max-w-[1400px] mx-auto mms-gutter flex items-center gap-3 overflow-x-auto scrollbar-none">
          {categories.map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => setActive(cat)}
              className={`shrink-0 px-5 py-2 rounded-full text-[10px] uppercase tracking-[0.2em] font-medium transition-all duration-300 cursor-pointer ${
                active === cat
                  ? "bg-[#c5a880] text-[#050507]"
                  : "border border-[#c5a880]/25 text-[#f4ebd0]/60 hover:border-[#c5a880]/60 hover:text-white"
              }`}
            >
              {cat}
            </button>
          ))}
          <span className="ml-auto text-[10px] text-[#f4ebd0]/30 pl-4 border-l border-[#c5a880]/10 shrink-0">{allFiltered.length} projects</span>
        </div>
      </div>

      {/* Grid — each card has a primary image + two small sub-images */}
      <section className="py-14 md:py-20 max-w-[1400px] mx-auto mms-gutter">
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
          {displayed.map((project, idx) => (
            <motion.div
              key={project.title}
              layout
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: idx * 0.05 }}
              className="group glass-panel rounded-3xl border border-[#c5a880]/15 overflow-hidden hover:border-[#c5a880]/35 transition-all duration-300 cursor-pointer"
              role="button"
              tabIndex={0}
              aria-label={`Preview ${project.title}`}
              onKeyDown={(event) => { if (event.target === event.currentTarget && (event.key === "Enter" || event.key === " ")) { event.preventDefault(); setSelected(project); } }}
              onClick={() => setSelected(project)}
            >
              {/* Primary image */}
              <div className="relative aspect-[4/3] overflow-hidden">
                <Image
                  src={project.image}
                  alt={project.title}
                  fill sizes="(max-width:767px) 100vw, (max-width:1279px) 50vw, 33vw"
                  className="object-cover object-center transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#050507] via-[#050507]/25 to-transparent" />
                <div className="absolute top-4 left-4">
                  <span className="text-[9px] uppercase tracking-[0.2em] bg-black/50 backdrop-blur-sm text-[#c5a880] border border-[#c5a880]/25 px-2.5 py-1 rounded-full">
                    {project.category}
                  </span>
                </div>
                <div className="absolute top-4 right-4">
                  <span className="text-[9px] text-white/50 font-mono">{project.year}</span>
                </div>
              </div>

              {/* Two secondary thumbnails */}
              <div className="grid grid-cols-2 gap-1 px-1 pt-1">
                {project.images.map((img, i) => (
                  <div key={i} className="relative aspect-[16/9] overflow-hidden rounded-lg">
                    <Image src={img} alt={`${project.title} detail ${i + 1}`} fill sizes="(max-width:767px) 50vw, (max-width:1279px) 25vw, 17vw" className="object-cover object-center transition-transform duration-500 group-hover:scale-105" />
                    <div className="absolute inset-0 bg-[#050507]/20" />
                  </div>
                ))}
              </div>

              {/* Content */}
              <div className="p-6 space-y-3">
                <h3 className="text-lg font-semibold text-white font-heading">{project.title}</h3>
                <p className="text-xs text-[#f4ebd0]/65 leading-relaxed font-light">{project.desc}</p>
                <div className="flex flex-wrap gap-2 pt-1">
                  {project.tags.map((tag) => (
                    <span key={tag} className="text-[9px] uppercase tracking-[0.15em] bg-[#c5a880]/8 text-[#f4ebd0]/60 border border-[#c5a880]/12 px-2.5 py-1 rounded-full">
                      {tag}
                    </span>
                  ))}
                </div>
                <Link
                  href={`/projects/${contentSlug(project.title)}`}
                  onClick={(event) => event.stopPropagation()}
                  className="inline-flex items-center gap-2 pt-2 text-[10px] uppercase tracking-[0.2em] text-[#c5a880] hover:text-white transition-colors"
                >
                  View case study <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              </div>
            </motion.div>
          ))}
        </div>

        {allFiltered.length > 6 && (
          <div className="mt-12 flex flex-wrap items-center justify-center gap-4">
            <span className="text-xs text-[#f4ebd0]/40 font-light">
              Showing {displayed.length} of {allFiltered.length} projects
            </span>
            <Link
              href="/gallery"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full border border-[#c5a880]/30 text-[#f4ebd0]/80 text-[11px] uppercase tracking-[0.18em] hover:border-[#c5a880] hover:text-white transition-all duration-300"
            >
              View More Projects
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        )}
      </section>

      {/* Full-bleed image strip */}
      <section className="overflow-hidden border-y border-[#c5a880]/10">
        <div className="photo-strip flex h-48 md:h-64">
          {["/mms/DSC_7550.jpg", "/mms/DSC_1821.jpg", "/mms/DSC_2475.jpg", "/mms/DSC_7551.jpg", "/mms/AllanLinda-31.jpg"].map((src, i) => (
            <div key={i} className="relative flex-1 overflow-hidden">
              <Image src={src} alt="work strip" fill sizes="(max-width:639px) 50vw, 20vw" className="object-cover object-center hover:scale-105 transition-transform duration-700" />
            </div>
          ))}
        </div>
      </section>

      {/* Stats */}
      <section className="py-16 bg-black">
        <div className="max-w-[1400px] mx-auto mms-gutter">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {[
              { number: "50+", label: "Events Produced" },
              { number: "200+", label: "Hours of Film Delivered" },
              { number: "30+", label: "Institutional Clients" },
              { number: "5★", label: "Average Client Rating" },
            ].map((stat) => (
              <div key={stat.label} className="space-y-2">
                <p className="text-3xl md:text-4xl font-semibold text-[#c5a880] font-heading">{stat.number}</p>
                <p className="text-xs uppercase tracking-[0.15em] text-[#f4ebd0]/55 font-light">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="relative py-20 overflow-hidden">
        <div className="absolute inset-0 z-0">
          <Image src="/mms/Zambia-Zimbabwe-Victoria-Falls-Impressive-View-1.jpg" alt="" fill sizes="100vw" className="object-cover object-center opacity-30" />
          <div className="absolute inset-0 bg-[#050507]/80" />
        </div>
        <div className="relative z-10 max-w-[700px] mx-auto px-6 text-center space-y-6">
            <span className="text-[10px] tracking-[0.4em] text-[#c5a880] uppercase font-semibold block font-heading">Start Your Project</span>
            <h2 className="text-3xl md:text-4xl font-semibold text-white font-heading">Your story deserves to be told beautifully.</h2>
          <p className="text-sm text-[#f4ebd0]/60 font-light leading-relaxed">Let&apos;s discuss your vision and build something worth remembering.</p>
          <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
            <Link href="/contact" className={`${goldBtn} px-8 py-3.5 text-[11px] uppercase tracking-[0.18em]`}>
              <span className="relative z-10">Start a Project</span>
              <ArrowRight className="relative z-10 ml-2 h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
            </Link>
            <Link href="/gallery" className="inline-flex items-center px-8 py-3.5 rounded-full border border-[#c5a880]/30 text-[#f4ebd0]/80 text-[11px] uppercase tracking-[0.18em] hover:border-[#c5a880] hover:text-white transition-all duration-300">
              Browse Gallery
            </Link>
          </div>
        </div>
      </section>

      {/* Project detail modal */}
      <AnimatePresence>
        {selected && (
          <motion.div
            key="project-detail"
            ref={modalRef}
            role="dialog"
            aria-modal="true"
            aria-label={selected.title}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="detail-overlay fixed inset-0 z-[200] flex items-center justify-center bg-black/92 backdrop-blur-lg"
            onClick={() => setSelected(null)}
          >
            <button
              type="button"
              onClick={() => setSelected(null)}
              className="modal-close absolute z-10 w-11 h-11 rounded-full bg-white/10 hover:bg-[#c5a880] hover:text-[#050507] text-white flex items-center justify-center transition-all duration-300"
              aria-label="Close"
            >
              <X className="w-5 h-5" />
            </button>

            <motion.div
              key={selected.title}
              initial={{ opacity: 0, scale: 0.96, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.96, y: 20 }}
              transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
              onClick={(e) => e.stopPropagation()}
              className="relative w-full max-w-4xl detail-panel overflow-y-auto glass-panel rounded-3xl border border-[#c5a880]/20 shadow-2xl"
            >
              <div className="relative aspect-[16/9] overflow-hidden rounded-t-3xl">
                <Image src={selected.image} alt={selected.title} fill sizes="(max-width:960px) 100vw, 896px" className="object-cover object-center" />
                <div className="absolute inset-0 bg-gradient-to-t from-[#050507]/80 via-transparent to-transparent" />
                <div className="absolute top-4 left-4 flex items-center gap-3">
                  <span className="text-[9px] uppercase tracking-[0.2em] bg-black/55 backdrop-blur-sm text-[#c5a880] border border-[#c5a880]/25 px-3 py-1.5 rounded-full">
                    {selected.category}
                  </span>
                  <span className="text-[9px] text-white/60 font-mono">{selected.year}</span>
                </div>
              </div>

              <div className="p-5 sm:p-9 space-y-5">
                <div>
                  <h2 className="text-2xl sm:text-3xl font-semibold text-white font-heading">{selected.title}</h2>
                </div>
                <p className="text-sm text-[#f4ebd0]/70 leading-relaxed font-light">{selected.desc}</p>

                <div className="flex flex-wrap gap-2">
                  {selected.tags.map((tag) => (
                    <span key={tag} className="text-[9px] uppercase tracking-[0.15em] bg-[#c5a880]/10 text-[#f4ebd0]/70 border border-[#c5a880]/15 px-2.5 py-1 rounded-full">
                      {tag}
                    </span>
                  ))}
                </div>

                {selected.images.length > 0 && (
                  <div className="grid grid-cols-2 gap-3 pt-2">
                    {selected.images.map((img, i) => (
                      <div key={i} className="relative aspect-[16/9] overflow-hidden rounded-xl border border-[#c5a880]/10">
                        <Image src={img} alt={`${selected.title} detail ${i + 1}`} fill sizes="(max-width:960px) 50vw, 448px" className="object-cover object-center" />
                        <div className="absolute inset-0 bg-[#050507]/20" />
                      </div>
                    ))}
                  </div>
                )}

                <div className="flex flex-wrap items-center gap-3 pt-3">
                  <Link href={`/projects/${contentSlug(selected.title)}`} className="px-6 py-3 rounded-full border border-[#c5a880]/30 text-[#f4ebd0]/80 text-[11px] uppercase tracking-[0.18em] hover:border-[#c5a880] hover:text-white transition-all duration-300">
                    Full case study
                  </Link>
                  <Link href="/contact" className={`${goldBtn} px-6 py-3 text-[11px] uppercase tracking-[0.18em] inline-flex items-center`}>
                    <span className="relative z-10">Start a Project</span>
                    <ArrowRight className="relative z-10 ml-2 h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
                  </Link>
                  <button
                    type="button"
                    onClick={close}
                    className="px-6 py-3 rounded-full border border-[#c5a880]/30 text-[#f4ebd0]/80 text-[11px] uppercase tracking-[0.18em] hover:border-[#c5a880] hover:text-white transition-all duration-300"
                  >
                    Close
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <Footer />
    </div>
  );
}
