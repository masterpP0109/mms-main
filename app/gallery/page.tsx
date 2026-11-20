"use client";

import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { X, ChevronLeft, ChevronRight, ArrowRight, ZoomIn } from "lucide-react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { useModalFocus } from "../components/useModalFocus";

interface GalleryItem {
  src: string;
  alt: string;
}

const galleryItems: GalleryItem[] = [
  { src: "/mms/mms/gallery/DSC_3531.jpg", alt: "Mosi Media Solutions gallery photograph 1" },
  { src: "/mms/mms/gallery/DSC_3548.jpg", alt: "Mosi Media Solutions gallery photograph 2" },
  { src: "/mms/mms/gallery/DSC_3722.jpg", alt: "Mosi Media Solutions gallery photograph 3" },
  { src: "/mms/mms/gallery/DSC_3908.jpg", alt: "Mosi Media Solutions gallery photograph 4" },
  { src: "/mms/mms/gallery/DSC_7044.jpg", alt: "Mosi Media Solutions gallery photograph 5" },
  { src: "/mms/mms/gallery/DSC_7080.jpg", alt: "Mosi Media Solutions gallery photograph 6" },
  { src: "/mms/mms/gallery/DSC_7504.jpg", alt: "Mosi Media Solutions gallery photograph 7" },
  { src: "/mms/mms/gallery/DSC_7941-1.jpg", alt: "Mosi Media Solutions gallery photograph 8" },
  { src: "/mms/mms/gallery/IMG_0600.jpg", alt: "Mosi Media Solutions gallery photograph 9" },
  { src: "/mms/mms/gallery/IMG_2300.jpg", alt: "Mosi Media Solutions gallery photograph 10" },
  { src: "/mms/mms/gallery/IMG_2306.jpg", alt: "Mosi Media Solutions gallery photograph 11" },
  { src: "/mms/mms/gallery/IMG_4524.jpg", alt: "Mosi Media Solutions gallery photograph 12" },
  { src: "/mms/mms/gallery/IMG_4641.jpg", alt: "Mosi Media Solutions gallery photograph 13" },
  { src: "/mms/mms/gallery/IMG_8846.jpg", alt: "Mosi Media Solutions gallery photograph 14" },
  { src: "/mms/mms/gallery/untitled-7266.jpg", alt: "Mosi Media Solutions gallery photograph 15" },
  { src: "/mms/mms/gallery/untitled-7271.jpg", alt: "Mosi Media Solutions gallery photograph 16" },
  { src: "/mms/mms/gallery/vlcsnap-2026-11-19-12h18m48s038.png", alt: "Mosi Media Solutions production still 1" },
  { src: "/mms/mms/gallery/vlcsnap-2026-11-19-14h45m41s499%20-%20Copy.png", alt: "Mosi Media Solutions production still 2" },
  { src: "/mms/mms/gallery/vlcsnap-2026-11-19-14h45m51s096.png", alt: "Mosi Media Solutions production still 3" },
  { src: "/mms/mms/gallery/wedding1.jpg", alt: "Mosi Media Solutions wedding celebration" },
  { src: "/mms/mms/gallery/_DSC8310.jpg", alt: "Mosi Media Solutions gallery photograph 21" },
];

export default function GalleryPage() {
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  const modalRef = useRef<HTMLDivElement>(null);

  useModalFocus(lightboxIndex !== null, modalRef, () => setLightboxIndex(null));

  useEffect(() => {
    if (lightboxIndex === null) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") {
        setLightboxIndex((prev) =>
          prev === null ? null : (prev + 1) % galleryItems.length,
        );
      } else if (e.key === "ArrowLeft") {
        setLightboxIndex((prev) =>
          prev === null
            ? null
            : (prev - 1 + galleryItems.length) % galleryItems.length,
        );
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [lightboxIndex]);

  const activeItem =
    lightboxIndex !== null ? galleryItems[lightboxIndex] : null;

  return (
    <div className="min-h-screen bg-[#e4e4e4] text-[#050507] font-sans">
      <Navbar />

      {/* Hero */}
      <section className="relative min-h-[48vh] flex items-end overflow-hidden bg-black pt-28 pb-12">
        <div className="absolute inset-0 z-0">
          <Image
            src="/mms/mms/gallery/DSC_7941-1.jpg"
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
              Moments captured across weddings, live productions, destinations and celebrations in Victoria Falls.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Pinterest-style Masonry Grid */}
      <section className="py-12 md:py-16 max-w-[1440px] mx-auto mms-gutter">
        <div className="columns-1 sm:columns-2 md:columns-3 lg:columns-4 gap-4 space-y-4">
          {galleryItems.map((item, idx) => (
            <button
              key={item.src}
              type="button"
              onClick={() => setLightboxIndex(idx)}
              className="group relative block w-full break-inside-avoid overflow-hidden rounded-2xl bg-[#d6d5d0] border border-[#050507]/10 shadow-sm hover:shadow-md transition-shadow duration-300 focus-visible:outline-2 focus-visible:outline-[#981b28] focus-visible:outline-offset-2 cursor-pointer"
              aria-label={`View ${item.alt}`}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={item.src}
                alt={item.alt}
                loading={idx < 8 ? "eager" : "lazy"}
                className="w-full h-auto block transition-transform duration-500 group-hover:scale-[1.03]"
              />
              <span className="pointer-events-none absolute inset-0 bg-[#050507]/0 group-hover:bg-[#050507]/20 transition-colors duration-300 flex items-end justify-end p-3">
                <span className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 inline-flex items-center justify-center w-9 h-9 rounded-full bg-white/90 text-[#050507] shadow">
                  <ZoomIn size={16} aria-hidden="true" />
                </span>
              </span>
            </button>
          ))}
        </div>

        <div className="mt-14 text-center">
          <Link href="/contact#enquiry" className="mms-button inline-flex items-center gap-2 px-7 py-3.5 text-sm">
            <span>Plan your event with MMS</span>
            <ArrowRight size={16} aria-hidden="true" />
          </Link>
        </div>
      </section>

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
                  (lightboxIndex - 1 + galleryItems.length) %
                    galleryItems.length,
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
                setLightboxIndex((lightboxIndex + 1) % galleryItems.length);
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
