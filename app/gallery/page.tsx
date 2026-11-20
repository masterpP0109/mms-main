"use client";

import React, { useState, useEffect, useRef, useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { X, ChevronLeft, ChevronRight, ArrowRight, ZoomIn } from "lucide-react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { useModalFocus } from "../components/useModalFocus";

type GalleryCategory = "Corporate" | "Weddings" | "Social Events";
type FilterCategory = "All" | GalleryCategory;

interface GalleryItem {
  src: string;
  alt: string;
  category: GalleryCategory;
}

interface GallerySection {
  category: GalleryCategory;
  eyebrow: string;
  title: string;
  description: string;
  items: GalleryItem[];
}

const corporateItems: GalleryItem[] = [
  { src: "/mms/mms/gallery/corporate/DSC_1213.jpg", alt: "Corporate event coverage 1", category: "Corporate" },
  { src: "/mms/mms/gallery/corporate/DSC_9848.jpg", alt: "Corporate event coverage 2", category: "Corporate" },
  { src: "/mms/mms/gallery/corporate/DSC_9868.jpg", alt: "Corporate event coverage 3", category: "Corporate" },
  { src: "/mms/mms/gallery/corporate/DSC_9892.jpg", alt: "Corporate event coverage 4", category: "Corporate" },
  { src: "/mms/mms/gallery/corporate/IMG_0600.jpg", alt: "Corporate event coverage 5", category: "Corporate" },
  { src: "/mms/mms/gallery/corporate/IMG_8703.jpg", alt: "Corporate event coverage 6", category: "Corporate" },
  { src: "/mms/mms/gallery/corporate/IMG_8846.jpg", alt: "Corporate event coverage 7", category: "Corporate" },
  { src: "/mms/mms/gallery/corporate/_DSC8272.jpg", alt: "Corporate event coverage 8", category: "Corporate" },
  { src: "/mms/mms/gallery/corporate/_DSC8310.jpg", alt: "Corporate event coverage 9", category: "Corporate" },
  { src: "/mms/mms/gallery/corporate/vlcsnap-2026-11-19-12h02m26s119.png", alt: "Corporate production frame 1", category: "Corporate" },
  { src: "/mms/mms/gallery/corporate/vlcsnap-2026-11-19-12h06m01s029.png", alt: "Corporate production frame 2", category: "Corporate" },
  { src: "/mms/mms/gallery/corporate/vlcsnap-2026-11-19-12h09m37s469.png", alt: "Corporate production frame 3", category: "Corporate" },
  { src: "/mms/mms/gallery/corporate/vlcsnap-2026-11-19-12h10m19s045.png", alt: "Corporate production frame 4", category: "Corporate" },
  { src: "/mms/mms/gallery/corporate/vlcsnap-2026-11-19-12h22m47s454.png", alt: "Corporate production frame 5", category: "Corporate" },
  { src: "/mms/mms/gallery/corporate/vlcsnap-2026-11-19-14h36m08s903.png", alt: "Corporate production frame 6", category: "Corporate" },
  { src: "/mms/mms/gallery/corporate/vlcsnap-2026-11-19-14h39m18s938.png", alt: "Corporate production frame 7", category: "Corporate" },
  { src: "/mms/mms/gallery/corporate/vlcsnap-2026-11-19-14h45m41s499.png", alt: "Corporate production frame 8", category: "Corporate" },
  { src: "/mms/mms/gallery/corporate/vlcsnap-2026-11-19-14h45m41s499%20-%20Copy.png", alt: "Corporate production frame 9", category: "Corporate" },
  { src: "/mms/mms/gallery/corporate/vlcsnap-2026-11-19-14h45m51s096.png", alt: "Corporate production frame 10", category: "Corporate" },
];

const weddingItems: GalleryItem[] = [
  { src: "/mms/mms/gallery/weddings/DSC_2505.jpg", alt: "Wedding & elopement photography 1", category: "Weddings" },
  { src: "/mms/mms/gallery/weddings/DSC_2689%20(2).jpg", alt: "Wedding & elopement photography 2", category: "Weddings" },
  { src: "/mms/mms/gallery/weddings/DSC_2778.jpg", alt: "Wedding & elopement photography 3", category: "Weddings" },
  { src: "/mms/mms/gallery/weddings/DSC_2790.jpg", alt: "Wedding & elopement photography 4", category: "Weddings" },
  { src: "/mms/mms/gallery/weddings/DSC_3722.jpg", alt: "Wedding & elopement photography 5", category: "Weddings" },
  { src: "/mms/mms/gallery/weddings/DSC_3908.jpg", alt: "Wedding & elopement photography 6", category: "Weddings" },
  { src: "/mms/mms/gallery/weddings/IMG_2727.jpg", alt: "Wedding & proposal photography 7", category: "Weddings" },
  { src: "/mms/mms/gallery/weddings/untitled-7262.jpg", alt: "Wedding & elopement photography 8", category: "Weddings" },
  { src: "/mms/mms/gallery/weddings/untitled-7266.jpg", alt: "Wedding & elopement photography 9", category: "Weddings" },
  { src: "/mms/mms/gallery/weddings/untitled-7268.jpg", alt: "Wedding & elopement photography 10", category: "Weddings" },
  { src: "/mms/mms/gallery/weddings/untitled-7271.jpg", alt: "Wedding & elopement photography 11", category: "Weddings" },
  { src: "/mms/mms/gallery/weddings/vlcsnap-2026-11-19-12h18m48s038.png", alt: "Wedding production frame", category: "Weddings" },
  { src: "/mms/mms/gallery/weddings/wedding1.jpg", alt: "Wedding celebration", category: "Weddings" },
];

const socialEventItems: GalleryItem[] = [
  { src: "/mms/mms/gallery/Social%20Events/DSC_3531.jpg", alt: "Social event photography 1", category: "Social Events" },
  { src: "/mms/mms/gallery/Social%20Events/DSC_3548.jpg", alt: "Social event photography 2", category: "Social Events" },
  { src: "/mms/mms/gallery/Social%20Events/DSC_7504.jpg", alt: "Social event photography 3", category: "Social Events" },
  { src: "/mms/mms/gallery/Social%20Events/DSC_7941-1.jpg", alt: "Social event photography 4", category: "Social Events" },
  { src: "/mms/mms/gallery/Social%20Events/IMG_4524.jpg", alt: "Social event photography 5", category: "Social Events" },
  { src: "/mms/mms/gallery/Social%20Events/IMG_4641.jpg", alt: "Social event photography 6", category: "Social Events" },
];

const gallerySections: GallerySection[] = [
  {
    category: "Corporate",
    eyebrow: "01 · Conferences & Business",
    title: "Corporate",
    description:
      "Conferences, summits, executive panels, live stage production and corporate events.",
    items: corporateItems,
  },
  {
    category: "Weddings",
    eyebrow: "02 · Love Stories",
    title: "Weddings",
    description:
      "Destination weddings, intimate elopements and marriage proposals in Victoria Falls.",
    items: weddingItems,
  },
  {
    category: "Social Events",
    eyebrow: "03 · Celebrations",
    title: "Social Events",
    description:
      "Private parties, live entertainment, DJ productions and special celebrations.",
    items: socialEventItems,
  },
];

const filterCategories: FilterCategory[] = [
  "All",
  "Corporate",
  "Weddings",
  "Social Events",
];

export default function GalleryPage() {
  const [activeCategory, setActiveCategory] = useState<FilterCategory>("All");
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  const modalRef = useRef<HTMLDivElement>(null);

  const visibleSections = useMemo(
    () =>
      activeCategory === "All"
        ? gallerySections
        : gallerySections.filter((s) => s.category === activeCategory),
    [activeCategory],
  );

  const flatVisibleItems = useMemo(
    () => visibleSections.flatMap((s) => s.items),
    [visibleSections],
  );

  useModalFocus(lightboxIndex !== null, modalRef, () => setLightboxIndex(null));

  useEffect(() => {
    if (lightboxIndex === null) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") {
        setLightboxIndex((prev) =>
          prev === null ? null : (prev + 1) % flatVisibleItems.length,
        );
      } else if (e.key === "ArrowLeft") {
        setLightboxIndex((prev) =>
          prev === null
            ? null
            : (prev - 1 + flatVisibleItems.length) % flatVisibleItems.length,
        );
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [lightboxIndex, flatVisibleItems.length]);

  const activeItem =
    lightboxIndex !== null ? flatVisibleItems[lightboxIndex] ?? null : null;

  return (
    <div className="min-h-screen bg-[#e4e4e4] text-[#050507] font-sans">
      <Navbar />

      {/* Hero */}
      <section className="relative min-h-[48vh] flex items-end overflow-hidden bg-black pt-28 pb-12">
        <div className="absolute inset-0 z-0">
          <Image
            src="/mms/mms/gallery/Social%20Events/DSC_7941-1.jpg"
            alt="MMS Gallery"
            fill
            sizes="100vw"
            className="object-cover object-center"
            style={{ opacity: 0.45 }}
            preload
          />
        </div>
        <div className="absolute inset-0 bg-gradient-to-t from-[#050507] via-[#050507]/55 to-[#050507]/15 z-10" />
        <div className="relative z-20 max-w-[1400px] mx-auto mms-gutter w-full">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            className="max-w-2xl space-y-4"
          >
            <span className="text-[11px] tracking-[0.35em] text-brand-accent uppercase font-bold block font-heading">
              Visual Archive
            </span>
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-semibold text-white font-heading">
              Gallery
            </h1>
            <p className="text-sm md:text-base text-brand-foreground/80 font-light leading-relaxed">
              Moments captured across corporate productions, weddings and social events in Victoria Falls.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Sticky Category Filter Ribbon */}
      <div className="sticky top-[72px] lg:top-[82px] z-30 bg-white/95 backdrop-blur-md border-b border-[#050507]/12 py-3">
        <div className="max-w-[1440px] mx-auto mms-gutter flex items-center gap-2.5 overflow-x-auto scrollbar-none">
          {filterCategories.map((cat) => {
            const isActive = activeCategory === cat;
            return (
              <button
                key={cat}
                type="button"
                onClick={() => {
                  setActiveCategory(cat);
                  setLightboxIndex(null);
                }}
                aria-pressed={isActive}
                className={`shrink-0 min-h-[44px] px-5 py-2 rounded-full text-xs sm:text-sm font-semibold transition-colors duration-200 cursor-pointer ${
                  isActive
                    ? "bg-[#981b28] text-white"
                    : "bg-[#f8f8f8] border border-[#050507]/16 text-[#111827] hover:border-[#981b28] hover:text-[#981b28]"
                }`}
              >
                {cat}
              </button>
            );
          })}
          <span className="ml-auto text-xs font-medium text-[#050507]/65 pl-4 border-l border-[#050507]/15 shrink-0">
            {flatVisibleItems.length} photos
          </span>
        </div>
      </div>

      {/* Folder-Ordered Pinterest Masonry Sections */}
      <div className="py-12 md:py-16 max-w-[1440px] mx-auto mms-gutter space-y-16">
        {visibleSections.map((section) => {
          const sectionOffset = flatVisibleItems.findIndex(
            (item) => item.src === section.items[0]?.src,
          );

          return (
            <section
              key={section.category}
              aria-labelledby={`gallery-section-${section.category}`}
            >
              <div className="mb-8 max-w-2xl">
                <p className="text-xs uppercase tracking-[0.2em] text-[#7f141f] font-semibold mb-2">
                  {section.eyebrow}
                </p>
                <h2
                  id={`gallery-section-${section.category}`}
                  className="text-3xl sm:text-4xl font-semibold text-[#050507] font-heading tracking-tight"
                >
                  {section.title}
                </h2>
                <p className="mt-2 text-sm sm:text-base text-[#050507]/80 leading-relaxed">
                  {section.description}
                </p>
              </div>

              <div className="columns-1 sm:columns-2 md:columns-3 lg:columns-4 gap-4 space-y-4">
                {section.items.map((item, idx) => {
                  const globalIdx = sectionOffset + idx;
                  return (
                    <button
                      key={item.src}
                      type="button"
                      onClick={() => setLightboxIndex(globalIdx)}
                      className="group relative block w-full break-inside-avoid overflow-hidden rounded-2xl bg-[#d6d5d0] border border-[#050507]/10 shadow-sm hover:shadow-md transition-shadow duration-300 focus-visible:outline-2 focus-visible:outline-[#981b28] focus-visible:outline-offset-2 cursor-pointer"
                      aria-label={`View ${item.alt}`}
                    >
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={item.src}
                        alt={item.alt}
                        loading={globalIdx < 8 ? "eager" : "lazy"}
                        className="w-full h-auto block transition-transform duration-500 group-hover:scale-[1.03]"
                      />
                      <span className="pointer-events-none absolute inset-0 bg-[#050507]/0 group-hover:bg-[#050507]/20 transition-colors duration-300 flex items-end justify-end p-3">
                        <span className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 inline-flex items-center justify-center w-9 h-9 rounded-full bg-white/90 text-[#050507] shadow">
                          <ZoomIn size={16} aria-hidden="true" />
                        </span>
                      </span>
                    </button>
                  );
                })}
              </div>
            </section>
          );
        })}

        <div className="pt-4 text-center">
          <Link
            href="/contact#enquiry"
            className="mms-button inline-flex items-center gap-2 px-7 py-3.5 text-sm"
          >
            <span>Plan your event with MMS</span>
            <ArrowRight size={16} aria-hidden="true" />
          </Link>
        </div>
      </div>

      {/* Lightbox Modal */}
      <AnimatePresence>
        {activeItem && lightboxIndex !== null && (
          <motion.div
            ref={modalRef}
            role="dialog"
            aria-modal="true"
            aria-label="Gallery image viewer"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/90 backdrop-blur-sm flex items-center justify-center p-4 sm:p-8"
            onClick={() => setLightboxIndex(null)}
          >
            <button
              type="button"
              onClick={() => setLightboxIndex(null)}
              aria-label="Close gallery viewer"
              className="absolute top-4 right-4 z-10 w-11 h-11 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors cursor-pointer"
            >
              <X size={20} aria-hidden="true" />
            </button>

            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                setLightboxIndex(
                  (lightboxIndex - 1 + flatVisibleItems.length) %
                    flatVisibleItems.length,
                );
              }}
              aria-label="Previous image"
              className="absolute left-3 sm:left-6 z-10 w-11 h-11 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors cursor-pointer"
            >
              <ChevronLeft size={22} aria-hidden="true" />
            </button>

            <div
              className="relative max-w-5xl max-h-[85vh] flex items-center justify-center"
              onClick={(e) => e.stopPropagation()}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={activeItem.src}
                alt={activeItem.alt}
                className="max-h-[85vh] w-auto max-w-full rounded-xl object-contain shadow-2xl"
              />
            </div>

            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                setLightboxIndex((lightboxIndex + 1) % flatVisibleItems.length);
              }}
              aria-label="Next image"
              className="absolute right-3 sm:right-6 z-10 w-11 h-11 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors cursor-pointer"
            >
              <ChevronRight size={22} aria-hidden="true" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      <Footer />
    </div>
  );
}
