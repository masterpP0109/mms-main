"use client";

import React, { useState, useEffect, Suspense } from "react";
import Image from "next/image";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { X, ChevronLeft, ChevronRight, ArrowRight, ZoomIn } from "lucide-react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

type Category = "All" | "Wedding" | "Conference" | "Brand" | "Drone" | "Events";

interface GalleryItem {
  src: string;
  alt: string;
  cat: Category;
  title: string;
  tall?: boolean; // makes card span 2 rows in masonry
}

const items: GalleryItem[] = [
  // Weddings
  { src: "/mms/_DSC7098.jpg",       alt: "Victoria Falls wedding",          cat: "Wedding",    title: "Victoria Falls Ceremony",      tall: true  },
  { src: "/mms/wedding1.jpg",       alt: "Wedding celebration",             cat: "Wedding",    title: "Golden Hour Celebration"               },
  { src: "/mms/DSC_7607.jpg",       alt: "Wedding portrait",                cat: "Wedding",    title: "Intimate Portraits",           tall: true  },
  { src: "/mms/DSC_0453.jpg",       alt: "Wedding reception",               cat: "Wedding",    title: "Reception Evening"                     },
  { src: "/mms/DSC_0477.jpg",       alt: "Bride and groom",                 cat: "Wedding",    title: "Bride & Groom"                 },
  { src: "/mms/DSC_0481 (2).jpg",   alt: "Wedding ceremony",                cat: "Wedding",    title: "The Ceremony",                 tall: true  },
  { src: "/mms/DSC_0676.jpg",       alt: "Wedding party",                   cat: "Wedding",    title: "Bridal Party"                  },
  { src: "/mms/DSC_1105.jpg",       alt: "Wedding couple",                  cat: "Wedding",    title: "Couple Portraits"                      },
  { src: "/mms/DSC_1257.jpg",       alt: "Wedding dance",                   cat: "Wedding",    title: "First Dance",                  tall: true  },
  { src: "/mms/DSC_1258.jpg",       alt: "Wedding vows",                    cat: "Wedding",    title: "Exchange of Vows"                      },
  { src: "/mms/DSC_1347.jpg",       alt: "Wedding venue",                   cat: "Wedding",    title: "Victoria Falls Venue"                  },
  { src: "/mms/DSC_1349.jpg",       alt: "Wedding detail",                  cat: "Wedding",    title: "Details & Florals",            tall: true  },
  { src: "/mms/DSC_1821.jpg",       alt: "Outdoor wedding",                 cat: "Wedding",    title: "Outdoor Celebration"                   },
  { src: "/mms/DSC_1825.jpg",       alt: "Sunset wedding",                  cat: "Wedding",    title: "Sunset Portraits"                      },
  { src: "/mms/DSC_1864.jpg",       alt: "Wedding toast",                   cat: "Wedding",    title: "Champagne Toast"               },
  { src: "/mms/AllanLinda-31.jpg",  alt: "Allan & Linda wedding",           cat: "Wedding",    title: "Allan & Linda",                tall: true  },
  { src: "/mms/untitled-455.jpg",   alt: "Wedding editorial",               cat: "Wedding",    title: "Editorial Shoot"                       },
  { src: "/mms/untitled-477.jpg",   alt: "Wedding editorial 2",             cat: "Wedding",    title: "Golden Light"                  },
  { src: "/mms/wedding 12.jpg",     alt: "Wedding celebration 2",           cat: "Wedding",    title: "Joyful Celebration",           tall: true  },

  // Conferences
  { src: "/mms/the_Conference_Hall_of_the_Federal_Tax_Service_1.jpg", alt: "Conference hall", cat: "Conference", title: "Grand Conference Hall", tall: true },
  { src: "/mms/Victoria-Falls-Video-Conference-Hire.webp", alt: "Video conference hire", cat: "Conference", title: "Video Conference Setup"  },
  { src: "/mms/DSC_7176.jpg",       alt: "Conference session",              cat: "Conference", title: "Plenary Session",              tall: true  },
  { src: "/mms/DSC_7188.jpg",       alt: "Conference panel",                cat: "Conference", title: "Expert Panel"                          },
  { src: "/mms/DSC_7204.jpg",       alt: "Conference speaker",              cat: "Conference", title: "Keynote Speaker"               },
  { src: "/mms/DSC_7208.jpg",       alt: "Conference delegates",            cat: "Conference", title: "Delegate Engagement",          tall: true  },
  { src: "/mms/DSC_7211.jpg",       alt: "Conference setup",                cat: "Conference", title: "AV Production Setup"                   },
  { src: "/mms/DSC_7215.jpg",       alt: "Conference stage",                cat: "Conference", title: "Branded Stage"                 },
  { src: "/mms/DSC_7218.jpg",       alt: "Conference audience",             cat: "Conference", title: "Full-House Audience",          tall: true  },
  { src: "/mms/DSC_7258.jpg",       alt: "Conference networking",           cat: "Conference", title: "Networking Session"                    },
  { src: "/mms/DSC_7262.jpg",       alt: "Conference breakout",             cat: "Conference", title: "Breakout Session"              },

  // Brand / Events
  { src: "/mms/DSC_2260.jpg",       alt: "Brand event",                     cat: "Brand",      title: "Brand Launch Event",           tall: true  },
  { src: "/mms/DSC_2297.jpg",       alt: "Campaign shoot",                  cat: "Brand",      title: "Campaign Shoot"                        },
  { src: "/mms/DSC_2327-Edit.jpg",  alt: "Editorial brand",                 cat: "Brand",      title: "Editorial Brand Story"         },
  { src: "/mms/DSC_2349.jpg",       alt: "Product campaign",                cat: "Brand",      title: "Product Campaign",             tall: true  },
  { src: "/mms/DSC_2353.jpg",       alt: "Brand shoot",                     cat: "Brand",      title: "Lifestyle Shoot"                       },
  { src: "/mms/DSC_2475.jpg",       alt: "Corporate portrait",              cat: "Brand",      title: "Corporate Portraits"           },
  { src: "/mms/DSC_2484.jpg",       alt: "Brand storytelling",              cat: "Brand",      title: "Brand Storytelling",           tall: true  },
  { src: "/mms/DSC_2505.jpg",       alt: "Creative campaign",               cat: "Brand",      title: "Creative Campaign"                     },
  { src: "/mms/DSC_2591.jpg",       alt: "Commercial shoot",                cat: "Brand",      title: "Commercial Production"         },
  { src: "/mms/DSC_2643 (2).jpg",   alt: "Brand identity",                  cat: "Brand",      title: "Brand Identity Shoot",         tall: true  },
  { src: "/mms/DSC_2660 (2).jpg",   alt: "Advertising campaign",            cat: "Brand",      title: "Advertising Campaign"                  },
  { src: "/mms/MMss.webp",          alt: "MMS brand",                       cat: "Brand",      title: "MMS Production"                },

  // Events
  { src: "/mms/DSC_7286.jpg",       alt: "Live event",                      cat: "Events",     title: "Live Stage Production",        tall: true  },
  { src: "/mms/DSC_7297.jpg",       alt: "Event crowd",                     cat: "Events",     title: "Audience Engagement"                   },
  { src: "/mms/DSC_7314.jpg",       alt: "Event stage",                     cat: "Events",     title: "Main Stage"                    },
  { src: "/mms/DSC_7317.jpg",       alt: "Event speakers",                  cat: "Events",     title: "Guest Speakers",               tall: true  },
  { src: "/mms/DSC_7320.jpg",       alt: "Event lighting",                  cat: "Events",     title: "Stage Lighting"                        },
  { src: "/mms/DSC_7343.jpg",       alt: "Event entertainment",             cat: "Events",     title: "Live Entertainment"            },
  { src: "/mms/DSC_7356.jpg",       alt: "Event production",                cat: "Events",     title: "Full Production",              tall: true  },
  { src: "/mms/DSC_7362.jpg",       alt: "Awards night",                    cat: "Events",     title: "Awards Evening"                        },
  { src: "/mms/DSC_7368.jpg",       alt: "Gala dinner",                     cat: "Events",     title: "Gala Dinner"                   },
  { src: "/mms/Iconic Final Look with Pyro.jpg", alt: "Pyro finale", cat: "Events", title: "Pyro Grand Finale",           tall: true  },
  { src: "/mms/LCG SPITFIRE Cold Spark Machine Package (2x Spitfire w_ Case & Granules).jpg", alt: "Cold spark machines", cat: "Events", title: "Cold Spark Machines" },

  // Drone / Scenic
  { src: "/mms/Zambia-Zimbabwe-Victoria-Falls-Impressive-View-1.jpg", alt: "Victoria Falls aerial", cat: "Drone", title: "Victoria Falls Aerial", tall: true },
  { src: "/mms/victoria_falls_banner.png", alt: "Victoria Falls panorama", cat: "Drone", title: "Falls Panorama"            },
  { src: "/mms/vic falls bridge.jpg", alt: "Victoria Falls bridge", cat: "Drone", title: "Falls Bridge",             tall: true  },
  { src: "/mms/bridge.jpg",          alt: "Bridge aerial",                  cat: "Drone",      title: "Bridge Aerial"                         },
  { src: "/mms/_MG_0072.jpg",        alt: "Drone landscape",                cat: "Drone",      title: "Landscape Film",               tall: true  },
  { src: "/mms/_MG_0305.jpg",        alt: "Aerial shot",                    cat: "Drone",      title: "Aerial Sequence"                       },
  { src: "/mms/_MG_2920.jpg",        alt: "Drone event coverage",           cat: "Drone",      title: "Event Aerial Coverage",        tall: true  },
  { src: "/mms/360.webp",            alt: "360 degree capture",             cat: "Drone",      title: "360° Immersive Capture"                },
  { src: "/mms/IMG_9196.jpeg",       alt: "Immersive media",                cat: "Drone",      title: "Immersive Media"               },
  { src: "/mms/IMG_9198.jpeg",       alt: "360 booth",                      cat: "Drone",      title: "360° Experience Booth",        tall: true  },
  { src: "/mms/IMG_9203.jpeg",       alt: "Tech setup",                     cat: "Drone",      title: "Production Tech"                       },
  { src: "/mms/IMG_9220.jpeg",       alt: "Drone cinematic",                cat: "Drone",      title: "Cinematic Drone Shot"          },
  { src: "/mms/IMG_9221.jpeg",       alt: "Aerial landscape",               cat: "Drone",      title: "Aerial Landscape",             tall: true  },
];

const cats: Category[] = ["All", "Wedding", "Conference", "Brand", "Events", "Drone"];

function GalleryContent() {
  const searchParams = useSearchParams();
  const paramCat = searchParams.get("cat") as Category | null;
  const initCat: Category = paramCat && cats.includes(paramCat) ? paramCat : "All";

  const [active, setActive] = useState<Category>(initCat);
  const [lightboxIdx, setLightboxIdx] = useState<number | null>(null);

  // sync URL param on mount
  useEffect(() => {
    if (paramCat && cats.includes(paramCat)) setActive(paramCat);
  }, [paramCat]);

  const filtered = active === "All" ? items : items.filter((i) => i.cat === active);

  // Navigate lightbox
  const prev = () => setLightboxIdx((n) => (n === null ? null : (n - 1 + filtered.length) % filtered.length));
  const next = () => setLightboxIdx((n) => (n === null ? null : (n + 1) % filtered.length));

  // Close lightbox on Escape / arrow keys
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") setLightboxIdx(null);
      if (e.key === "ArrowRight") next();
      if (e.key === "ArrowLeft") prev();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  });

  return (
    <>
      {/* Sticky filter bar */}
      <div className="sticky top-[72px] z-30 bg-[#050507]/92 backdrop-blur-md border-b border-[#c5a880]/12 py-3.5">
        <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 flex items-center gap-2.5 overflow-x-auto scrollbar-none">
          {cats.map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => setActive(cat)}
              className={`shrink-0 px-5 py-2 rounded-full text-[10px] uppercase tracking-[0.22em] font-medium transition-all duration-250 cursor-pointer ${
                active === cat
                  ? "bg-[#c5a880] text-[#050507]"
                  : "border border-[#c5a880]/25 text-[#f4ebd0]/60 hover:border-[#c5a880]/60 hover:text-white"
              }`}
            >
              {cat}
            </button>
          ))}
          <span className="ml-auto shrink-0 text-[10px] text-[#f4ebd0]/35 font-light pl-4 border-l border-[#c5a880]/12">
            {filtered.length} photos
          </span>
        </div>
      </div>

      {/* Masonry grid */}
      <div className="max-w-[1600px] mx-auto px-4 sm:px-5 lg:px-8 py-8 md:py-12">
        <motion.div
          layout
          className="columns-2 sm:columns-3 lg:columns-4 xl:columns-5 gap-3 space-y-0"
        >
          <AnimatePresence mode="popLayout">
            {filtered.map((item, idx) => (
              <motion.div
                key={item.src}
                layout
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.3, delay: Math.min(idx * 0.02, 0.3) }}
                className={`break-inside-avoid mb-3 group relative overflow-hidden rounded-xl border border-[#c5a880]/10 cursor-pointer bg-[#0d0d10] ${
                  item.tall ? "row-span-2" : ""
                }`}
                onClick={() => setLightboxIdx(idx)}
              >
                <div className={`relative w-full ${item.tall ? "aspect-[3/4]" : "aspect-[4/3]"}`}>
                  <Image
                    src={item.src}
                    alt={item.alt}
                    fill
                    sizes="(max-width:640px) 50vw, (max-width:1024px) 33vw, 25vw"
                    className="object-cover object-center transition-transform duration-500 group-hover:scale-105"
                  />
                  {/* hover overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-[#050507]/80 via-[#050507]/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  <div className="absolute inset-0 flex flex-col justify-end p-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <span className="text-[9px] uppercase tracking-[0.2em] text-[#c5a880] font-semibold mb-0.5">{item.cat}</span>
                    <p className="text-xs text-white font-medium leading-tight">{item.title}</p>
                  </div>
                  <div className="absolute top-2.5 right-2.5 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <div className="w-7 h-7 rounded-full bg-black/50 backdrop-blur-sm flex items-center justify-center">
                      <ZoomIn className="w-3.5 h-3.5 text-white" />
                    </div>
                  </div>
                  {/* category pill always visible */}
                  <div className="absolute top-2 left-2">
                    <span className="text-[8px] uppercase tracking-[0.15em] bg-black/50 backdrop-blur-sm text-[#c5a880]/90 px-2 py-0.5 rounded-full">
                      {item.cat}
                    </span>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>

        {filtered.length === 0 && (
          <div className="text-center py-24 text-[#f4ebd0]/40 text-sm">No images in this category yet.</div>
        )}
      </div>

      {/* Lightbox */}
      <AnimatePresence>
        {lightboxIdx !== null && (
          <motion.div
            key="lightbox"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.22 }}
            className="fixed inset-0 z-[200] flex items-center justify-center bg-black/92 backdrop-blur-lg"
            onClick={() => setLightboxIdx(null)}
          >
            {/* Close */}
            <button
              type="button"
              onClick={() => setLightboxIdx(null)}
              className="absolute top-5 right-5 z-10 w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors"
              aria-label="Close"
            >
              <X className="w-5 h-5 text-white" />
            </button>

            {/* Prev */}
            <button
              type="button"
              onClick={(e) => { e.stopPropagation(); prev(); }}
              className="absolute left-4 sm:left-8 z-10 w-11 h-11 rounded-full bg-white/10 hover:bg-[#c5a880] hover:text-[#050507] text-white flex items-center justify-center transition-all duration-300 cursor-pointer"
              aria-label="Previous"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>

            {/* Next */}
            <button
              type="button"
              onClick={(e) => { e.stopPropagation(); next(); }}
              className="absolute right-4 sm:right-8 z-10 w-11 h-11 rounded-full bg-white/10 hover:bg-[#c5a880] hover:text-[#050507] text-white flex items-center justify-center transition-all duration-300 cursor-pointer"
              aria-label="Next"
            >
              <ChevronRight className="w-5 h-5" />
            </button>

            {/* Image */}
            <motion.div
              key={lightboxIdx}
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.96 }}
              transition={{ duration: 0.22 }}
              className="relative max-w-[90vw] max-h-[85vh] w-full flex flex-col items-center"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="relative w-full max-h-[78vh] flex items-center justify-center">
                <Image
                  src={filtered[lightboxIdx].src}
                  alt={filtered[lightboxIdx].alt}
                  width={1400}
                  height={1000}
                  className="object-contain max-h-[78vh] rounded-xl shadow-2xl"
                  priority
                />
              </div>
              <div className="mt-3 text-center space-y-0.5">
                <p className="text-white font-medium text-sm">{filtered[lightboxIdx].title}</p>
                <p className="text-[10px] uppercase tracking-[0.2em] text-[#c5a880]">{filtered[lightboxIdx].cat}</p>
              </div>
              <p className="mt-2 text-[10px] text-white/30">{lightboxIdx + 1} / {filtered.length}</p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

export default function GalleryPage() {
  return (
    <div className="min-h-screen bg-[#050507] text-[#f4ebd0] font-sans">
      <Navbar />

      {/* Hero */}
      <section className="relative min-h-[42vh] flex items-center justify-center overflow-hidden bg-black pt-28 pb-14">
        <div className="absolute inset-0 z-0">
          <Image
            src="/mms/DSC_7598.jpg"
            alt="MMS Gallery"
            fill
            className="object-cover object-center opacity-40"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#050507] via-[#050507]/55 to-[#050507]/20" />
        </div>
        <div className="relative z-10 text-center max-w-2xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            className="space-y-4"
          >
            <span className="text-[10px] tracking-[0.4em] text-[#c5a880] uppercase font-bold block">Our Portfolio</span>
            <h1 className="text-4xl sm:text-5xl font-light text-white leading-tight font-serif">Gallery</h1>
            <p className="text-sm text-[#f4ebd0]/70 font-light">
              Weddings, conferences, brand campaigns, drone aerials and immersive productions — browse our full body of work.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Gallery with filter — wrapped in Suspense for useSearchParams */}
      <Suspense fallback={<div className="py-24 text-center text-[#f4ebd0]/30 text-sm">Loading gallery…</div>}>
        <GalleryContent />
      </Suspense>

      {/* CTA */}
      <section className="py-16 border-t border-[#c5a880]/10 bg-black">
        <div className="max-w-[1400px] mx-auto px-6 sm:px-10 lg:px-16 flex flex-col md:flex-row items-center justify-between gap-6">
          <div>
            <h3 className="text-xl md:text-2xl font-light text-white font-serif">Ready to be in our gallery?</h3>
            <p className="text-sm text-[#f4ebd0]/55 font-light mt-1">Let&apos;s create something beautiful together.</p>
          </div>
          <div className="flex flex-wrap gap-3 shrink-0">
            <Link
              href="/contact"
              className="group relative isolate inline-flex items-center justify-center overflow-hidden rounded-full bg-gradient-to-r from-[#b48a3d] via-[#d6bd7d] to-[#c5a880] text-[#050507] font-semibold px-7 py-3.5 text-[11px] uppercase tracking-[0.18em] transition-all duration-300 hover:-translate-y-0.5 hover:brightness-110 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#e5cf9a]"
            >
              Start a Project
              <ArrowRight className="ml-2 h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
            </Link>
            <Link
              href="/conference-production#enquiry"
              className="inline-flex items-center px-7 py-3.5 rounded-full border border-[#c5a880]/30 text-[#f4ebd0]/80 text-[11px] uppercase tracking-[0.18em] hover:border-[#c5a880] hover:text-white transition-all duration-300"
            >
              Conference Enquiry
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
