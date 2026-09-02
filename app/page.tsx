"use client";

import React, { useState, useEffect, useLayoutEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { gsap } from "gsap";
import { motion, AnimatePresence } from "framer-motion";
import {
  MessageSquare,
  Shield,
  Users,
  Lock,
  Play,
  Heart,
  Briefcase,
  Video,
  Award,
  Star,
  Quote,
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  Camera,
  Megaphone,
  Palette,
  Mic,
  Monitor,
  Volume2,
  Zap,
} from "lucide-react";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";

export default function Home() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [testimonialSlide, setTestimonialSlide] = useState(0);
  const pageRef = useRef<HTMLDivElement | null>(null);
  const pastWorkRef = useRef<HTMLElement | null>(null);
  const heroTouchStartX = useRef<number | null>(null);
  const [builderStep, setBuilderStep] = useState(0);
  const [builderData, setBuilderData] = useState({
    goal: "",
    audience: "",
    timeline: "",
    name: "",
    email: "",
    phone: "",
    details: ""
  });

  // Auto-play the hero service categories every 6 seconds.
  useEffect(() => {
    const timer = window.setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % 5);
    }, 6000);

    return () => window.clearInterval(timer);
  }, []);

  // Keep normal page content visible by default. GSAP is used only for the
  // navbar entrance and the dedicated horizontal Past Work carousel.
  useLayoutEffect(() => {
    let cancelled = false;
    let ctx: gsap.Context | undefined;
    const cleanupFunctions: Array<() => void> = [];

    const initializeAnimations = async () => {
      let ScrollTrigger: typeof import("gsap/ScrollTrigger").ScrollTrigger;

      try {
        ({ ScrollTrigger } = await import("gsap/ScrollTrigger"));
      } catch (error) {
        console.error("ScrollTrigger failed to load. Static content remains visible.", error);
        return;
      }

      if (cancelled || !pageRef.current) return;

      gsap.registerPlugin(ScrollTrigger);

      ctx = gsap.context(() => {
        const section = pastWorkRef.current;
        if (!section) return;

        const pinContainer = section.querySelector<HTMLElement>(".past-work-pin");
        const track = section.querySelector<HTMLElement>(".past-work-track");
        const heading = section.querySelector<HTMLElement>(".past-work-heading");
        const progressFill = section.querySelector<HTMLElement>(".progress-fill");

        if (!pinContainer || !track || !heading) return;

        const cards = gsap.utils.toArray<HTMLElement>(track.querySelectorAll(".pw-card"));
        if (cards.length === 0) return;

        const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

        gsap.set([heading, track, cards], { autoAlpha: 1 });
        gsap.set(track, { x: 0 });
        gsap.set(cards, { opacity: 1, scale: 1, rotationY: 0, filter: "none" });

        const updateLayout = () => {
          const firstCard = cards[0];
          if (!firstCard) return;
          const startOffset = Math.max(28, (window.innerWidth - firstCard.offsetWidth) / 2);
          track.style.paddingInline = `${startOffset}px`;
        };

        const getTravel = () => Math.max(0, track.scrollWidth - window.innerWidth);
        let travel = 0;

        const refreshMeasurements = () => {
          updateLayout();
          travel = getTravel();
        };

        refreshMeasurements();

        const headingTimeline = gsap.timeline({ paused: true });
        headingTimeline
          .fromTo(
            ".pw-eyebrow",
            { y: 15, autoAlpha: 0 },
            { y: 0, autoAlpha: 1, duration: 0.7, ease: "power2.out", immediateRender: false }
          )
          .fromTo(
            ".pw-heading-line",
            { yPercent: 110, autoAlpha: 0, rotation: 2 },
            {
              yPercent: 0,
              autoAlpha: 1,
              rotation: 0,
              duration: 1.05,
              stagger: 0.1,
              ease: "power3.out",
              immediateRender: false,
            },
            "-=0.45"
          )
          .fromTo(
            ".pw-supporting",
            { y: 15, autoAlpha: 0 },
            { y: 0, autoAlpha: 1, duration: 0.65, ease: "power2.out", immediateRender: false },
            "-=0.55"
          );

        ScrollTrigger.create({
          trigger: heading,
          start: "top 85%",
          once: true,
          onEnter: () => headingTimeline.play(),
        });

        if (travel > 0) {
          const trackQuickToX = gsap.quickTo(track, "x", {
            duration: 0.2,
            ease: "power2.out",
          });
          const trackQuickToSkew = gsap.quickTo(track, "skewX", {
            duration: 0.35,
            ease: "power2.out",
          });

          ScrollTrigger.create({
            trigger: pinContainer,
            start: "top top",
            end: () => {
              refreshMeasurements();
              return `+=${travel + window.innerHeight}`;
            },
            pin: pinContainer,
            pinSpacing: true,
            scrub: 1,
            anticipatePin: 1,
            invalidateOnRefresh: true,
            snap:
              cards.length > 1
                ? {
                    snapTo: 1 / (cards.length - 1),
                    duration: { min: 0.25, max: 0.65 },
                    delay: 0.08,
                    ease: "power2.inOut",
                  }
                : undefined,
            onRefreshInit: refreshMeasurements,
            onUpdate(self) {
              const progress = self.progress;
              const currentX = -progress * travel;

              if (!reducedMotion) {
                const velocity = self.getVelocity() / window.innerHeight;
                trackQuickToSkew(gsap.utils.clamp(-2.5, 2.5, velocity * 0.25));
              }

              trackQuickToX(currentX);

              const viewportCenter = window.innerWidth / 2;

              cards.forEach((card) => {
                const cardCenter = card.offsetLeft + card.offsetWidth / 2 + currentX;
                const distance = (cardCenter - viewportCenter) / card.offsetWidth;
                const absoluteDistance = Math.abs(distance);

                const scale = reducedMotion ? 1 : Math.max(0.82, 1 - absoluteDistance * 0.14);
                const rotateY = reducedMotion ? 0 : distance * -12;
                const opacity = reducedMotion ? 1 : Math.max(0.25, 1 - absoluteDistance * 0.75);
                const blur = reducedMotion ? 0 : Math.min(2.4, absoluteDistance * 2);
                const zIndex = Math.round(100 - absoluteDistance * 15);
                const brightness = reducedMotion
                  ? 1
                  : Math.max(0.85, 1 - absoluteDistance * 0.18);

                gsap.set(card, {
                  scale,
                  rotationY: rotateY,
                  opacity,
                  filter: reducedMotion ? "none" : `blur(${blur}px)`,
                  zIndex,
                });

                const textContent = card.querySelector<HTMLElement>(".pw-card-content");
                if (textContent) {
                  gsap.set(textContent, {
                    opacity: Math.max(0.2, 1 - absoluteDistance * 1.4),
                    y: absoluteDistance * 12,
                  });
                }

                const image = card.querySelector<HTMLImageElement>(".pw-card-image img");
                if (image && !reducedMotion) {
                  gsap.set(image, {
                    x: distance * 18,
                    scale: 1.03 - absoluteDistance * 0.025,
                    filter: `brightness(${brightness})`,
                  });
                }
              });

              if (progressFill) {
                gsap.set(progressFill, {
                  scaleX: progress,
                  transformOrigin: "left center",
                });
              }

              if (progress > 0.92) {
                const fadeProgress = (progress - 0.92) / 0.08;
                gsap.to(heading, {
                  opacity: 1 - fadeProgress,
                  y: -15 * fadeProgress,
                  duration: 0.35,
                  overwrite: "auto",
                });
              } else {
                gsap.to(heading, {
                  opacity: 1,
                  y: 0,
                  duration: 0.25,
                  overwrite: "auto",
                });
              }
            },
          });
        }

        const handleResize = () => {
          refreshMeasurements();
          ScrollTrigger.refresh();
        };
        window.addEventListener("resize", handleResize);
        cleanupFunctions.push(() => window.removeEventListener("resize", handleResize));

        cards.forEach((card) => {
          const image = card.querySelector<HTMLImageElement>("img");
          if (!image || image.complete) return;

          const handleImageLoad = () => {
            refreshMeasurements();
            ScrollTrigger.refresh();
          };

          image.addEventListener("load", handleImageLoad, { once: true });
          cleanupFunctions.push(() => image.removeEventListener("load", handleImageLoad));
        });

      }, pageRef);

      const handleWindowLoad = () => ScrollTrigger.refresh();
      window.addEventListener("load", handleWindowLoad);
      cleanupFunctions.push(() => window.removeEventListener("load", handleWindowLoad));

      requestAnimationFrame(() => ScrollTrigger.refresh());
    };

    void initializeAnimations();

    return () => {
      cancelled = true;
      cleanupFunctions.splice(0).forEach((cleanup) => cleanup());
      ctx?.revert();
    };
  }, []);

  // Hero carousel: the four main MMS service categories from the company profile.
  const slides = [
    {
      image: "/mms/DSC_9244.jpg",
      imagePosition: "center center",
      tag: "MOSI MEDIA SOLUTIONS",
      title: "Conferences & Corporate Events",
      desc: "From screens and digital displays to desktop setups and digital podiums with lapels — comprehensive AV solutions for professional conferences and corporate events.",
      btnText: "Explore Conference Solutions",
      link: "/conference-production"
    },
    {
      image: "/mms/audio1.jpg",
      imagePosition: "center center",
      tag: "MOSI MEDIA SOLUTIONS",
      title: "Audio Solutions",
      desc: "Professional PA systems, microphones, conference audio and interpretation technology for clear, reliable communication at every event.",
      btnText: "Explore Audio Solutions",
      link: "#services"
    },
    {
      image: "/mms/media-prodction.jpg.jpeg",
      imagePosition: "center center",
      tag: "MOSI MEDIA SOLUTIONS",
      title: "Media Production",
      desc: "Photography, videography, live streaming, drone filming and podcast production brought together through professional visual storytelling.",
      btnText: "Explore Media Production",
      link: "#services"
    },
    {
      image: "/mms/screens.jpg.jpeg",
      imagePosition: "center center",
      tag: "MOSI MEDIA SOLUTIONS",
      title: "Display & Advertisement Solutions",
      desc: "LED screens, interactive displays, vertical screens and digital podiums designed to increase visibility, engagement and presentation impact.",
      btnText: "Explore Display Solutions",
      link: "#services"
    },
    {
      image: "/mms/special-effects.jpg.jpeg",
      imagePosition: "center center",
      tag: "MOSI MEDIA SOLUTIONS",
      title: "Special Effects",
      desc: "Cold sparks, low-lying cloud effects, digital advertising billboards and immersive 360 booth experiences that elevate events and create memorable visual moments.",
      btnText: "Explore Special Effects",
      link: "#services"
    }
  ];

  const testimonials = [
    {
      name: "David K.",
      role: "Brand Marketing Director",
      content: "They transformed our product launch into a visual story that still gets compliments months later. Truly world-class production.",
      avatar: null,
      rating: 5
    },
    {
      name: "Tanya, Bride",
      role: "Wedding Client",
      content: "From the moment we spoke, they made us feel at ease. On the day, they were invisible but captured everything. We treasure our film forever.",
      avatar: "/mms/wedding1.jpg",
      rating: 5
    },
    {
      name: "Sarah M.",
      role: "Luxury Wedding Planner",
      content: "The cinematic quality was breathtaking. Every frame felt intentional, emotional, and perfectly aligned with our clients' vision.",
      avatar: "/mms/MMss.webp",
      rating: 5
    },
    {
      name: "Maria R.",
      role: "Destination Wedding Bride",
      content: "Our wedding in Victoria Falls was pure magic on film. The team captured every tear, every laugh, and every golden sunset moment flawlessly.",
      avatar: "/mms/wedding1.jpg",
      rating: 5
    },
    {
      name: "Alex T.",
      role: "Tech Conference Organizer",
      content: "From setup to teardown, the AV team was flawless. Our hybrid event reached 50,000+ viewers with zero technical issues. Incredible.",
      avatar: null,
      rating: 5
    }
  ];

  // Our Services configuration
  const services = [
    {
      title: "Conference Microphone & Interpretation Equipment",
      icon: Mic,
      image: "/mms/DSC_7204.jpg",
      alt: "Conference microphones and interpretation booth setup",
      desc: "Professional conference audio, microphone systems and simultaneous interpretation booths for multilingual institutional events, government meetings and international conferences.",
      href: "/services"
    },
    {
      title: "LED Screen Rental",
      icon: Monitor,
      image: "/mms/DSC_7215.jpg",
      alt: "Large LED screens and display technology at an event",
      desc: "High-brightness LED screens, video walls and digital displays for conferences, brand activations and outdoor events available in any size with on-site support.",
      href: "/services"
    },
    {
      title: "Professional Sound Systems",
      icon: Volume2,
      image: "/mms/Victoria-Falls-Video-Conference-Hire.webp",
      alt: "Professional sound system and PA setup at an event",
      desc: "Comprehensive PA systems, line arrays, mixing consoles and wireless microphones engineered for clear, reliable sound at every venue size.",
      href: "/services"
    },
    {
      title: "Live Streaming Production",
      icon: Play,
      image: "/mms/DSC_9244.jpg",
      alt: "Multi-camera live streaming control setup",
      desc: "Full-service live streaming with multi-camera switching, platform integration, virtual backdrops and real-time graphics for hybrid and virtual events.",
      href: "/services"
    },
    {
      title: "Videography & Photography",
      icon: Camera,
      image: "/mms/DSC_2327-Edit.jpg",
      alt: "Cinematic filming and photography at an event",
      desc: "Cinematic event videography and professional photography from same-day edits and highlight reels to full event archives and brand campaign imagery.",
      href: "/services"
    },
    {
      title: "Drone Services",
      icon: Video,
      image: "/mms/_MG_0072.jpg",
      alt: "Aerial drone filming over a landscape",
      desc: "Licensed drone cinematography and aerial photography for events, venues, landscapes and brand campaigns with 4K RAW footage delivered.",
      href: "/services"
    },
    {
      title: "Event Lighting & Stage Setup",
      icon: Zap,
      image: "/mms/DSC_7356.jpg",
      alt: "Event lighting and stage setup at a venue",
      desc: "Complete stage design, theatrical lighting, truss rigging and branded backdrops that transform any venue into a professional production space.",
      href: "/services"
    }
  ];

  const pastWorkItems = [
    {
      image: "/mms/_DSC7098.jpg",
      category: "Wedding Film",
      title: "Victoria Falls Wedding Film",
      desc: "An emotional, intimate film captured across waterfall light and golden celebration.",
      tags: ["Cinematography", "Editing", "Color Grading"],
      link: "/gallery"
    },
    {
      image: "/mms/DSC_9244.jpg",
      category: "Live Production",
      title: "Global Summit Production",
      desc: "A fully produced conference experience with multiple screens, live streaming and branded stages.",
      tags: ["Event Production", "Live Streaming", "AV Staging"],
      link: "/gallery"
    },
    {
      image: "/mms/DSC_7607.jpg",
      category: "Brand Campaign",
      title: "Corporate Event Experience",
      desc: "Interactive screens, digital podiums and branded media that kept guests engaged throughout.",
      tags: ["Brand Strategy", "Motion Design", "Content Creation"],
      link: "/gallery"
    },
    {
      image: "/mms/Victoria-Falls-Video-Conference-Hire.webp",
      category: "Corporate Event",
      title: "Luxury Brand Campaign",
      desc: "Creative ads, motion design and polished visuals for a launch that moved audiences across channels.",
      tags: ["Corporate Events", "Digital Displays", "Live Capture"],
      link: "/gallery"
    },
    {
      image: "/mms/_MG_0072.jpg",
      category: "Immersive Media",
      title: "Immersive Media Production",
      desc: "360 capture, drone sequences and podcast experiences that transformed events into shareable stories.",
      tags: ["Immersive Tech", "Drone Cinematography", "360 Capture"],
      link: "/gallery"
    }
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setTestimonialSlide((prev) => (prev === testimonials.length - 1 ? 0 : prev + 1));
    }, 5000);
    return () => clearInterval(timer);
  }, [testimonials.length]);

  const goldGlowButtonBase =
    "group relative isolate inline-flex items-center justify-center overflow-hidden rounded-full bg-gradient-to-r from-[#b48a3d] via-[#d6bd7d] to-[#c5a880] text-[#050507] font-semibold shadow-[0_0_0_1px_rgba(229,207,154,0.28),0_0_18px_rgba(180,138,61,0.2)] transition-[transform,filter,box-shadow] duration-300 before:absolute before:inset-0 before:rounded-full before:bg-[linear-gradient(110deg,transparent_18%,rgba(255,255,255,0.62)_48%,transparent_78%)] before:-translate-x-[140%] before:transition-transform before:duration-700 after:absolute after:inset-0 after:rounded-full after:shadow-[inset_0_0_0_1px_rgba(255,255,255,0.2),inset_0_0_18px_rgba(255,244,211,0.12)] after:opacity-70 after:transition-opacity after:duration-300 hover:-translate-y-0.5 hover:brightness-110 hover:shadow-[0_0_0_1px_rgba(229,207,154,0.55),0_0_34px_rgba(197,168,128,0.48)] hover:before:translate-x-[140%] hover:after:opacity-100 active:translate-y-0 active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#e5cf9a] focus-visible:ring-offset-2 focus-visible:ring-offset-[#050507]";

  return (
    <div ref={pageRef} className="mms-page min-h-screen bg-[#050507] text-[#f4ebd0] overflow-x-hidden font-sans selection:bg-[#b48a3d] selection:text-[#050507]">

      {/* 1) TOP NAVIGATION BAR & HERO SECTION */}
      <header id="home" className="relative w-full z-40">
        <Navbar />

        {/* Hero Carousel Section - offset for fixed navbar */}
        <div
          className="relative h-[82vh] min-h-[640px] md:min-h-[620px] w-full overflow-hidden bg-black flex items-center justify-center z-10 pt-16 md:pt-20"
          onTouchStart={(event) => {
            heroTouchStartX.current = event.touches[0]?.clientX ?? null;
          }}
          onTouchEnd={(event) => {
            const startX = heroTouchStartX.current;
            const endX = event.changedTouches[0]?.clientX;
            heroTouchStartX.current = null;

            if (startX !== null && endX !== undefined) {
              const deltaX = endX - startX;
              if (Math.abs(deltaX) > 45) {
                setCurrentSlide((prev) =>
                  deltaX < 0
                    ? (prev + 1) % slides.length
                    : (prev - 1 + slides.length) % slides.length
                );
              }
            }

          }}
        >
          <AnimatePresence mode="wait">
            <motion.div
              key={currentSlide}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 1.2, ease: "easeInOut" }}
              className="absolute inset-0 w-full h-full bg-[#050507] pointer-events-none"
            >
              {/* Background Image of current slide */}
              <Image
                src={slides[currentSlide].image}
                alt={`${slides[currentSlide].title} — Mosi Media Solutions`}
                fill
                sizes="100vw"
                className="bright-image object-cover scale-105 animate-[zoom_20s_infinite_alternate]"
                style={{ opacity: 0.74, objectPosition: slides[currentSlide].imagePosition }}
                priority={currentSlide === 0}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#050507]/90 via-transparent to-[#050507]/55" />
              <div className="absolute inset-0 bg-gradient-to-r from-[#050507]/95 via-[#050507]/48 to-transparent" />
            </motion.div>
          </AnimatePresence>

          {/* Slide Text Content - Left Aligned with Shade */}
          <div className="relative z-20 w-full h-full flex items-center pointer-events-none">
            <div className="w-full max-w-[1600px] mx-auto px-6 sm:px-10 lg:px-16 2xl:px-20">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentSlide}
                initial={{ opacity: 0, x: -40 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 40 }}
                transition={{ duration: 0.8, delay: 0.2 }}
                className="space-y-6 max-w-2xl xl:max-w-3xl relative z-10"
              >
                {/* shade removed per request */}
                <span className="text-[10px] tracking-[0.4em] text-[#c5a880] uppercase font-bold block gsap-eyebrow">
                  {slides[currentSlide].tag}
                </span>

                <h1 className="text-3xl sm:text-5xl md:text-6xl xl:text-7xl font-light text-white leading-[1.05] font-serif gsap-heading">
                  {slides[currentSlide].title}
                </h1>

                <p className="text-sm md:text-base xl:text-lg text-[#f4ebd0]/82 tracking-wide font-light leading-relaxed max-w-lg gsap-copy">
                  {slides[currentSlide].desc}
                </p>

                <div className="pt-6 gsap-action pointer-events-auto flex flex-col sm:flex-row sm:items-center gap-3">
                  <a
                    href={slides[currentSlide].link}
                    className={`${goldGlowButtonBase} px-7 py-3.5 text-[10px] sm:text-xs uppercase tracking-[0.15em] sm:tracking-[0.18em] premium-button`}
                  >
                    <span className="relative z-10">{slides[currentSlide].btnText}</span>
                    <ArrowRight className="relative z-10 ml-2 h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
                  </a>
                  <a
                    href="#contact"
                    className="inline-flex items-center justify-center rounded-full border border-white/30 bg-black/25 px-7 py-3.5 text-[10px] sm:text-xs font-semibold uppercase tracking-[0.15em] sm:tracking-[0.18em] text-white backdrop-blur-sm transition-all duration-300 hover:border-[#c5a880] hover:bg-[#c5a880]/10 hover:text-[#f4ebd0] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#e5cf9a]"
                  >
                    Request a Quote
                  </a>
                </div>
              </motion.div>
            </AnimatePresence>
            </div>
          </div>

          {/* Slider Controls */}
          <button
            type="button"
            aria-label="Previous hero slide"
            onClick={() => setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length)}
            className="absolute left-3 sm:left-6 lg:left-8 top-[46%] md:top-1/2 -translate-y-1/2 z-40 p-2.5 sm:p-3 rounded-full border border-[#c5a880]/45 bg-black/35 text-white backdrop-blur-md shadow-[0_0_18px_rgba(197,168,128,0.16)] hover:bg-[#c5a880] hover:text-[#050507] hover:border-[#e5cf9a] hover:shadow-[0_0_28px_rgba(197,168,128,0.55)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#e5cf9a] transition-all duration-300 cursor-pointer"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button
            type="button"
            aria-label="Next hero slide"
            onClick={() => setCurrentSlide((prev) => (prev + 1) % slides.length)}
            className="absolute right-3 sm:right-6 lg:right-8 top-[46%] md:top-1/2 -translate-y-1/2 z-40 p-2.5 sm:p-3 rounded-full border border-[#c5a880]/45 bg-black/35 text-white backdrop-blur-md shadow-[0_0_18px_rgba(197,168,128,0.16)] hover:bg-[#c5a880] hover:text-[#050507] hover:border-[#e5cf9a] hover:shadow-[0_0_28px_rgba(197,168,128,0.55)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#e5cf9a] transition-all duration-300 cursor-pointer"
          >
            <ChevronRight className="w-5 h-5" />
          </button>

          {/* Dots Indicator */}
          <div className="absolute bottom-7 sm:bottom-10 left-0 w-full z-30 px-6">
            <div className="mx-auto flex max-w-xl items-center justify-center gap-2 sm:gap-3">
              <span className="hidden sm:inline text-[9px] font-mono tracking-[0.22em] text-[#f4ebd0]/55">
                {String(currentSlide + 1).padStart(2, "0")}
              </span>
              <div className="flex items-center justify-center gap-1.5 sm:gap-2">
                {slides.map((slide, idx) => (
                  <button
                    type="button"
                    key={slide.title}
                    aria-label={`Go to ${slide.title} slide`}
                    aria-current={idx === currentSlide ? "true" : undefined}
                    onClick={() => setCurrentSlide(idx)}
                    className={`h-1.5 rounded-full transition-all duration-300 ${idx === currentSlide ? "bg-[#c5a880] w-5 sm:w-7" : "bg-[#f4ebd0]/30 w-1.5 sm:w-2"}`}
                  />
                ))}
              </div>
              <span className="hidden sm:inline text-[9px] font-mono tracking-[0.22em] text-[#f4ebd0]/55">
                {String(slides.length).padStart(2, "0")}
              </span>
            </div>
          </div>
        </div>
      </header>

      {/* Inserted homepage copy removed — conference section will follow Services below */}
     
      {/* 2) TRUST / VALUE ICON STRIP (NO-IMAGE SECTION: Uses background image with parallax and GSAP reveal overlay) */}
      <section style={{ opacity: 1, visibility: "visible" }} className="relative -mt-4 z-30 max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 2xl:px-12 overflow-hidden rounded-3xl border border-[#c5a880]/20 shadow-2xl bg-black">
        {/* Parallax Background Image */}
        <div className="absolute inset-0 z-0 w-full h-full">
          <Image
            src="/mms/Zambia-Zimbabwe-Victoria-Falls-Impressive-View-1.jpg"
            alt="MMS Partners Background"
            fill
            className="object-cover object-center pointer-events-none"
            style={{ opacity: 0.35 }}
          />
          <div className="absolute inset-0 bg-black/40 z-10" />
        </div>

        <div className="relative z-20 p-8 md:p-10">
          {/* Icon Row */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-4 text-center items-stretch divide-y md:divide-y-0 md:divide-x divide-[#c5a880]/15">
            {/* Item 1 */}
            <div className="flex flex-col items-center justify-center p-3 pt-6 md:p-0">
              <MessageSquare className="w-5 h-5 text-[#c5a880] mb-3" />
              <p className="text-[9px] tracking-[0.15em] text-[#c5a880] uppercase font-semibold mb-1">24hr</p>
              <p className="text-xs text-white font-medium">Avg. Response Time</p>
            </div>
            {/* Item 2 */}
            <div className="flex flex-col items-center justify-center p-3 pt-6 md:p-0">
              <Shield className="w-5 h-5 text-[#c5a880] mb-3" />
              <p className="text-[9px] tracking-[0.15em] text-[#c5a880] uppercase font-semibold mb-1">Licensed, Insured</p>
              <p className="text-xs text-white font-medium">& Drone Certified</p>
            </div>
            {/* Item 3 */}
            <div className="flex flex-col items-center justify-center p-3 pt-6 md:p-0">
              <Users className="w-5 h-5 text-[#c5a880] mb-3" />
              <p className="text-[9px] tracking-[0.15em] text-[#c5a880] uppercase font-semibold mb-1">Trusted by Tourism</p>
              <p className="text-xs text-white font-medium">& Corporate Brands</p>
            </div>
            {/* Item 4 */}
            <div className="flex flex-col items-center justify-center p-3 pt-6 md:p-0">
              <Lock className="w-5 h-5 text-[#c5a880] mb-3" />
              <p className="text-[9px] tracking-[0.15em] text-[#c5a880] uppercase font-semibold mb-1">Secure Payments</p>
              <p className="text-xs text-white font-medium">100% Protected</p>
            </div>
          </div>

          {/* Logo Row */}

        </div>
      </section>

      {/* 2a) ABOUT US SECTION */}
      <section className="relative py-20 md:py-28 bg-[#050507]">
        <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 2xl:px-12">
          <div className="flex flex-col lg:flex-row gap-12 lg:gap-16 items-start">
            {/* Left — Text + CTA */}
            <div className="w-full lg:w-[45%] space-y-6">
              <span className="text-[10px] tracking-[0.4em] text-[#c5a880] uppercase font-semibold block">About Mosi Media Solutions</span>
              <h2 className="text-3xl md:text-5xl font-light text-white font-serif leading-tight">Experience <span className="text-[#e53e3e]">Elevated</span></h2>
              <p className="text-sm md:text-base text-[#f4ebd0]/70 leading-relaxed font-light">
                Mosi Media Solutions is a dynamic multimedia production and event technology company that delivers high quality visual, audio, and digital solutions for corporate events, conferences, social functions, and advertising platforms.
              </p>
              <p className="text-sm md:text-base text-[#f4ebd0]/70 leading-relaxed font-light">
                We combine creativity with cutting edge technology to create immersive experiences that elevate events and brands. Our services are tailored to meet each client’s unique needs, ensuring professionalism, reliability, and exceptional delivery.
              </p>
              <div className="pt-2">
                <Link
                  href="/about"
                  className="inline-flex items-center justify-center px-6 py-2.5 text-xs uppercase tracking-widest bg-gradient-to-r from-[#b48a3d] to-[#c5a880] text-[#050507] font-semibold rounded-full hover:brightness-110 hover:shadow-lg hover:shadow-[#b48a3d]/20 transition-all duration-300 premium-button"
                >
                  Learn More About Us
                </Link>
              </div>
            </div>

            {/* Right — Cards list */}
            <div className="w-full lg:w-[55%]">
              <div className="flex flex-col gap-2">
                {[
                  { title: "Trusted", desc: "We build lasting relationships through professionalism and dependable service.", icon: Shield },
                  { title: "Creative", desc: "Ideas shaped around your audience, brand and objectives.", icon: Palette },
                  { title: "Reliable", desc: "Professional execution from planning through delivery.", icon: Award },
                  { title: "Innovative", desc: "Cutting-edge technology and creative solutions that push boundaries.", icon: Zap },
                ].map((card) => (
                  <div
                    key={card.title}
                    className="group relative flex items-center gap-3 rounded-xl bg-[#0b0b0f] border border-[#c5a880]/15 px-4 py-3 transition-all duration-200 hover:border-[#c5a880]/40 hover:bg-[#0f0f14] hover:shadow-[0_0_24px_rgba(197,168,128,0.08)]"
                  >
                    <div className="flex-shrink-0 w-7 h-7 rounded-full border border-[#c5a880]/20 bg-[#0b0b0f] flex items-center justify-center">
                      <card.icon className="w-3.5 h-3.5 text-[#c5a880]" />
                    </div>
                    <div className="flex-1 space-y-0.5">
                      <h4 className="text-xs font-medium text-white">{card.title}</h4>
                      <p className="text-[11px] text-[#f4ebd0]/55 leading-relaxed font-light">{card.desc}</p>
                    </div>
                    <ArrowRight className="flex-shrink-0 w-3 h-3 text-[#c5a880] opacity-0 group-hover:opacity-100 transition-all duration-200 group-hover:translate-x-1" />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2b) OUR SERVICES SECTION */}
      <section id="services" className="relative py-16 md:py-24 bg-[#050507]">
        <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 2xl:px-12">
          <div className="text-center mb-12 md:mb-16">
            <span className="text-[10px] tracking-[0.4em] text-[#c5a880] uppercase font-semibold block mb-3">What We Offer</span>
            <h2 className="text-3xl md:text-5xl font-light text-white font-serif mb-4">Our Services</h2>
            <p className="text-sm md:text-base text-[#f4ebd0]/70 font-light max-w-xl mx-auto">
              From media production and live broadcasting to professional audio, screen technology and event enhancements, MMS delivers the creative and technical solutions needed to bring every experience to life.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-10">
            {services.slice(0, 6).map((service) => (
              <div key={service.title} className="group">
                <div className="relative aspect-[4/3] overflow-hidden rounded-2xl mb-5">
                  <Image
                    src={service.image}
                    alt={service.alt}
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    className="object-cover object-center bright-image transition-transform duration-500 group-hover:scale-105"
                    style={{ opacity: 0.85 }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#050507]/70 via-transparent to-transparent opacity-60 transition-opacity duration-300" />
                  <div className="absolute bottom-3 left-3">
                    <div className="w-8 h-8 rounded-full border border-[#c5a880]/20 bg-[#0b0b0f] flex items-center justify-center">
                      <service.icon className="w-4 h-4 text-[#c5a880]" />
                    </div>
                  </div>
                </div>
                <h3 className="text-center text-lg font-medium text-white font-serif mb-2">{service.title}</h3>
                <p className="text-center text-sm text-[#f4ebd0]/60 leading-relaxed font-light mb-4">
                  {service.desc}
                </p>
                <div className="text-center">
                  <Link
                    href="/services"
                    className="inline-flex items-center text-xs uppercase tracking-widest text-[#c5a880] hover:text-white transition-colors duration-200"
                  >
                    Learn More
                    <ArrowRight className="ml-2 w-3.5 h-3.5 transition-transform duration-200 group-hover:translate-x-1" />
                  </Link>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-12 text-center">
            <Link
              href="/services"
              className="inline-flex items-center justify-center px-6 py-2.5 text-xs uppercase tracking-widest border border-[#c5a880]/30 text-[#f4ebd0] rounded-full hover:border-[#c5a880] hover:text-white transition-all duration-300"
            >
              Explore All Services
            </Link>
          </div>
        </div>
      </section>



      {/* 5) STORIES THAT BECAME MEMORIES SECTION - HORIZONTAL WHEEL CAROUSEL */}
      <section
        style={{ opacity: 1, visibility: "visible" }}
        id="gallery"
        ref={pastWorkRef}
        className="past-work-section relative w-full bg-[#050507] isolation-isolate z-10"
      >
        <div className="past-work-pin relative w-full h-screen min-h-[700px] bg-[#050507]">
          <div className="past-work-heading z-20 text-center">
            <span className="pw-eyebrow text-[12px] uppercase tracking-[0.28em] text-[#c5a880] font-semibold block mb-4">
              OUR FEATURED WORK
            </span>
            <div className="overflow-hidden">
              <h2 className="pw-heading-line text-3xl md:text-5xl leading-[0.98] md:leading-[1.02] font-serif font-light text-white tracking-tight">
                Stories That Became Memories
              </h2>
            </div>
            <p className="pw-supporting mt-6 mx-auto max-w-[520px] text-sm md:text-base text-[#f4ebd0]/70 leading-7">
              A selection of weddings, corporate productions and immersive experiences brought to life through cinematic storytelling.
            </p>
          </div>

          <div className="past-work-viewport">
            <div className="past-work-track flex items-center gap-[clamp(6vw,7vw,9vw)] w-max px-[14vw] will-change-transform">
              {pastWorkItems.map((item, idx) => (
                <div
                  key={idx}
                  className="pw-card relative flex-shrink-0 w-[clamp(760px,72vw,1180px)] h-[clamp(480px,58vh,680px)] min-h-[480px] rounded-[30px] border border-[#c5a880]/15 bg-[#09090d] shadow-[0_35px_100px_rgba(0,0,0,0.65),0_10px_35px_rgba(0,0,0,0.45),0_0_45px_rgba(190,145,73,0.08)] overflow-hidden will-change-transform"
                  style={{ transformStyle: "preserve-3d" }}
                >
                  <div className="relative flex h-full flex-col overflow-hidden rounded-[30px] md:flex-row">
                    <div className="pw-card-image relative w-full md:w-[58%] min-h-[240px] h-[40vh] md:h-full overflow-hidden">
                      <Image
                        src={item.image}
                        alt={item.title}
                        fill
                        className="object-cover object-center"
                        style={{ transform: "scale(1.05)" }}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-[#050507]/45 via-transparent to-transparent" />
                    </div>
                    <div className="pw-card-content relative z-10 flex flex-1 flex-col justify-between p-6 lg:p-8 bg-[#09090d]">
                      <div className="space-y-3">
                        <span className="text-[10px] uppercase tracking-[0.28em] text-[#c5a880] font-semibold block">
                          {item.category}
                        </span>
                        <h3 className="text-2xl md:text-3xl font-light text-white font-serif leading-tight">
                          {item.title}
                        </h3>
                        <p className="text-xs md:text-sm text-[#f4ebd0]/70 leading-relaxed font-light max-w-xl">
                          {item.desc}
                        </p>
                      </div>
                      <div className="mt-5 flex flex-wrap items-center gap-3">
                        <div className="flex flex-wrap gap-2">
                          {item.tags.map((tag) => (
                            <span
                              key={tag}
                              className="text-[10px] uppercase tracking-[0.18em] bg-[#c5a880]/10 text-[#f4ebd0] px-2.5 py-1 rounded-full border border-[#c5a880]/15"
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                        <div className="flex items-center gap-3 sm:ml-auto">
                          <a
                            href={item.link}
                            className="inline-flex items-center justify-center px-5 py-2 text-[10px] uppercase tracking-[0.32em] bg-[#c5a880] text-[#050507] font-semibold rounded-full hover:brightness-110 transition-all duration-300"
                          >
                            View Project
                          </a>
                          <span className="pw-card-counter text-[10px] uppercase tracking-[0.3em] text-[#f4ebd0]/70 font-mono">
                            {String(idx + 1).padStart(2, "00")} / {String(pastWorkItems.length).padStart(2, "00")}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="past-work-progress absolute left-1/2 top-[9vh] -translate-x-1/2 z-20 w-[calc(100vw-3rem)] max-w-[720px]">
            <div className="relative h-1 rounded-full bg-white/10 overflow-hidden">
              <div className="progress-fill absolute inset-y-0 left-0 origin-left scale-x-0 bg-[#c5a880]" />
            </div>
          </div>
        </div>
      </section>

      {/* 3) INTERACTIVE BUILDER: PLAN YOUR PROJECT */}
     
    {/* 6) OUR PROCESS SECTION (NO-IMAGE SECTION: Uses background image with parallax and GSAP reveal overlay) */}
      <section style={{ opacity: 1, visibility: "visible" }} id="about" className="relative py-16 md:py-24 border-t border-b border-[#c5a880]/15 overflow-hidden bg-black">
        {/* Background Image */}
        <div className="absolute inset-0 z-0 w-full h-full">
          <Image
            src="/victoria_falls_banner.png"
            alt="Scenic Falls Parallax"
            fill
            className="object-cover object-center pointer-events-none"
            style={{ opacity: 0.3 }}
          />
          <div className="absolute inset-0 bg-black/40 z-10" />
        </div>

        <div className="relative z-20 max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 2xl:px-12">
          <div className="text-center mb-16">
            <span className="text-[10px] tracking-[0.4em] text-[#c5a880] uppercase font-semibold block mb-3">Our Workflow</span>
            <h2 className="text-3xl md:text-5xl font-light text-white font-serif mb-4">Our Process: A Smooth Journey To Your Story</h2>
          </div>

          {/* 4-column timeline */}
          <div className="relative grid grid-cols-1 md:grid-cols-4 gap-8 md:gap-4">
            {/* Connector Line (Desktop Only) */}
            <div className="absolute top-12 left-[12%] right-[12%] h-[1px] bg-gradient-to-r from-[#c5a880]/10 via-[#c5a880]/30 to-[#c5a880]/10 z-0 hidden md:block" />

            {[
              {
                step: "1",
                title: "Discovery & Vision",
                desc: "We get to know you, your story and what matters most."
              },
              {
                step: "2",
                title: "Planning Together",
                desc: "We craft a custom plan and align every detail with your goals."
              },
              {
                step: "3",
                title: "Capturing the Experience",
                desc: "Our expert team captures every moment with creativity and precision."
              },
              {
                step: "4",
                title: "Delivering Your Story",
                desc: "You receive a cinematic masterpiece to relive for years to come."
              }
            ].map((item, idx) => (
              <div key={idx} className="relative z-10 flex flex-col items-center text-center px-4">
                {/* Step Number Circle */}
                <div className="w-14 h-14 rounded-full bg-[#050507] border border-[#c5a880]/30 flex items-center justify-center mb-6 shadow-xl relative group-hover:border-[#c5a880] transition-colors duration-300">
                  <span className="text-sm font-serif font-semibold text-[#c5a880]">{item.step}</span>
                </div>
                <h3 className="text-lg font-medium text-white mb-2">{item.title}</h3>
                <p className="text-xs text-[#f4ebd0]/70 leading-relaxed font-light">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 7) TESTIMONIALS / CLIENT REACTIONS */}
      <section style={{ opacity: 1, visibility: "visible" }} id="clients" className="relative py-16 md:py-24 border-b border-[#c5a880]/15 overflow-hidden bg-black">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-[#1a1510]/60 via-[#050507] to-[#050507] z-0" />

        <div className="relative z-20 max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 2xl:px-12">
          <div className="text-center mb-16">
            <span className="text-[10px] tracking-[0.4em] text-[#c5a880] uppercase font-semibold block mb-3">Client Feedback</span>
            <h2 className="text-3xl md:text-5xl font-light text-white font-serif mb-4">What Our Clients Say</h2>
          </div>

          {/* Testimonial Carousel */}
          <div className="relative max-w-3xl mx-auto">
            <AnimatePresence mode="wait">
              <motion.div
                key={testimonialSlide}
                initial={{ opacity: 0, y: 50, scale: 0.96 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -50, scale: 0.96 }}
                transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                className="glass-panel p-8 md:p-12 rounded-3xl border border-[#c5a880]/15 relative overflow-hidden"
              >
                <Quote className="absolute top-6 left-6 w-10 h-10 text-[#c5a880]/15" />

                <div className="flex flex-col items-center text-center space-y-6 relative z-10">
                  <div className="flex items-center text-[#c5a880] space-x-1">
                    {[...Array(testimonials[testimonialSlide].rating)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-current" />
                    ))}
                  </div>

                  <p className="text-base md:text-xl text-[#f4ebd0]/90 leading-relaxed font-light italic">
                    {`"${testimonials[testimonialSlide].content}"`}
                  </p>

                  <div className="flex flex-col items-center space-y-2 pt-2">
                    <div className="w-14 h-14 rounded-full overflow-hidden border border-[#c5a880]/30 shadow-md">
                      {testimonials[testimonialSlide].avatar ? (
                        <Image
                          src={testimonials[testimonialSlide].avatar}
                          alt={testimonials[testimonialSlide].name}
                          width={56}
                          height={56}
                          className="object-cover object-center"
                        />
                      ) : (
                        <div className="w-full h-full bg-[#121218] flex items-center justify-center">
                          <span className="text-lg font-serif font-bold text-[#c5a880]">JP</span>
                        </div>
                      )}
                    </div>
                    <div className="space-y-1">
                      <h4 className="text-lg font-medium text-white">{testimonials[testimonialSlide].name}</h4>
                      <p className="text-[10px] tracking-widest text-[#c5a880] uppercase font-medium">{testimonials[testimonialSlide].role}</p>
                    </div>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>

            {/* Carousel Controls */}
            <div className="flex items-center justify-center mt-8 space-x-6">
              <button
                type="button"
                aria-label="Previous testimonial"
                onClick={() => setTestimonialSlide((prev) => (prev === 0 ? testimonials.length - 1 : prev - 1))}
                className="p-2.5 rounded-full border border-[#c5a880]/30 text-[#c5a880] hover:bg-[#c5a880] hover:text-[#050507] hover:border-transparent transition-all duration-300 cursor-pointer"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>

              <div className="flex space-x-2">
                {testimonials.map((_, idx) => (
                  <button
                    type="button"
                    key={idx}
                    aria-label={`Go to testimonial ${idx + 1}`}
                    onClick={() => setTestimonialSlide(idx)}
                    className={`w-2 h-2 rounded-full transition-all duration-300 ${idx === testimonialSlide ? "bg-[#c5a880] w-6" : "bg-[#f4ebd0]/30"}`}
                  />
                ))}
              </div>

              <button
                type="button"
                aria-label="Next testimonial"
                onClick={() => setTestimonialSlide((prev) => (prev === testimonials.length - 1 ? 0 : prev + 1))}
                className="p-2.5 rounded-full border border-[#c5a880]/30 text-[#c5a880] hover:bg-[#c5a880] hover:text-[#050507] hover:border-transparent transition-all duration-300 cursor-pointer"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </section>


      <section style={{ opacity: 1, visibility: "visible" }} id="contact" className="relative py-12 md:py-16 overflow-hidden bg-black">
        {/* Background Image */}
        <div className="absolute inset-0 z-0 w-full h-full">
          <Image
            src="/victoria_falls_banner.png"
            alt="Scenic Falls Parallax"
            fill
            className="object-cover object-center pointer-events-none"
            style={{ opacity: 0.3 }}
          />
          <div className="absolute inset-0 bg-black/50 z-10" />
        </div>

        <div className="relative z-20 max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 2xl:px-12">
          <div className="text-center max-w-2xl mx-auto mb-10 space-y-3">
            <span className="text-[10px] tracking-[0.4em] text-[#c5a880] uppercase font-semibold block">Get In Touch</span>
            <h2 className="text-2xl md:text-4xl font-light text-white font-serif leading-tight">Ready to Create Something Unforgettable?</h2>
            <p className="text-xs text-[#f4ebd0]/70 font-light">
              Let&apos;s bring your vision to life. Start with a free discovery call and get a custom quote within 24 hours.
            </p>
          </div>

          <section style={{ opacity: 1, visibility: "visible" }} id="builder" className="py-16 md:py-24 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 2xl:px-12 relative">
     

        <div className="glass-panel rounded-3xl border border-[#c5a880]/20 p-8 md:p-10">
          {/* Step Progress Indicator */}
          <div className="flex items-center justify-between mb-10 max-w-md mx-auto">
            {["Goal", "Audience", "Timeline", "Contact", "Review"].map((label, idx) => {
              const stepNum = idx + 1;
              const isActive = builderStep === idx;
              const isDone = builderStep > idx;
              return (
                <div key={label} className="flex flex-col items-center">
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center text-[10px] font-bold transition-all duration-300 ${
                      isActive
                        ? "bg-[#c5a880] text-[#050507] scale-110"
                        : isDone
                        ? "bg-[#c5a880]/30 text-[#c5a880]"
                        : "bg-[#c5a880]/10 text-[#f4ebd0]/40"
                    }`}
                  >
                    {isDone ? "✓" : stepNum}
                  </div>
                  <span className={`text-[8px] uppercase tracking-widest mt-1.5 ${
                    isActive ? "text-[#c5a880]" : isDone ? "text-[#c5a880]/60" : "text-[#f4ebd0]/30"
                  }`}>
                    {label}
                  </span>
                </div>
              );
            })}
          </div>

          {/* Step 1: Goal Selection */}
          {builderStep === 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-6"
            >
              <div className="text-center mb-6">
                <h3 className="text-xl font-serif text-white font-light">What type of project are you planning?</h3>
                <p className="text-xs text-[#f4ebd0]/60 mt-2">Select the option that best describes your needs</p>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {[
                  { id: "wedding", label: "Wedding Film", desc: "Cinematic wedding coverage & elopements", icon: Heart },
                  { id: "corporate", label: "Corporate Event", desc: "Conferences, summits & live productions", icon: Briefcase },
                  { id: "brand", label: "Brand Campaign", desc: "Advertisements, motion & brand storytelling", icon: Palette },
                  { id: "content", label: "Content Package", desc: "Social content, podcasts & digital assets", icon: Megaphone },
                ].map((opt) => (
                  <button
                    key={opt.id}
                    onClick={() => setBuilderData({ ...builderData, goal: opt.id })}
                    className={`flex items-start gap-4 p-5 rounded-2xl border text-left transition-all duration-300 cursor-pointer ${
                      builderData.goal === opt.id
                        ? "border-[#c5a880] bg-[#c5a880]/10 shadow-[0_0_20px_rgba(197,168,128,0.1)]"
                        : "border-[#c5a880]/15 bg-[#050507]/50 hover:border-[#c5a880]/40"
                    }`}
                  >
                    <div className="grow text-left">
                      <h4 className="text-sm font-medium text-white">{opt.label}</h4>
                      <p className="text-xs text-[#f4ebd0]/70 mt-1">{opt.desc}</p>
                    </div>
                  </button>
                ))}
              </div>
            </motion.div>
          )}

          {/* Step 2: Audience / Event Type */}
          {builderStep === 1 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-6"
            >
              <div className="text-center mb-6">
                <h3 className="text-xl font-serif text-white font-light">Tell us about your event or audience</h3>
                <p className="text-xs text-[#f4ebd0]/60 mt-2">This helps us tailor the creative approach</p>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {[
                  { id: "intimate", label: "Intimate Gathering", desc: "Small group, personal celebration" },
                  { id: "large-event", label: "Large Event", desc: "100+ guests, multi-camera setup" },
                  { id: "corporate-audience", label: "Corporate Audience", desc: "Stakeholders, partners, press" },
                  { id: "digital-first", label: "Digital-First", desc: "Content made for screens & social" },
                ].map((opt) => (
                  <button
                    key={opt.id}
                    onClick={() => setBuilderData({ ...builderData, audience: opt.id })}
                    className={`flex items-start gap-4 p-5 rounded-2xl border text-left transition-all duration-300 cursor-pointer ${
                      builderData.audience === opt.id
                        ? "border-[#c5a880] bg-[#c5a880]/10 shadow-[0_0_20px_rgba(197,168,128,0.1)]"
                        : "border-[#c5a880]/15 bg-[#050507]/50 hover:border-[#c5a880]/40"
                    }`}
                  >
                    <div className="w-8 h-8 rounded-full bg-[#c5a880]/15 flex items-center justify-center shrink-0">
                      <Users className="w-4 h-4 text-[#c5a880]" />
                    </div>
                    <div className="grow text-left">
                      <h4 className="text-sm font-medium text-white">{opt.label}</h4>
                      <p className="text-xs text-[#f4ebd0]/70 mt-1">{opt.desc}</p>
                    </div>
                  </button>
                ))}
              </div>
            </motion.div>
          )}

          {/* Step 3: Timeline */}
          {builderStep === 2 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-6"
            >
              <div className="text-center mb-6">
                <h3 className="text-xl font-serif text-white font-light">What&apos;s your timeline?</h3>
                <p className="text-xs text-[#f4ebd0]/60 mt-2">We work with all timelines — urgent to flexible</p>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {[
                  { id: "urgent", label: "Urgent", desc: "Within 2 weeks", days: "ASAP" },
                  { id: "soon", label: "Soon", desc: "1–3 months out", days: "Medium" },
                  { id: "planned", label: "Planning Ahead", desc: "3–6 months out", days: "Comfortable" },
                  { id: "flexible", label: "Just Exploring", desc: "No fixed date yet", days: "Flexible" },
                ].map((opt) => (
                  <button
                    key={opt.id}
                    onClick={() => setBuilderData({ ...builderData, timeline: opt.id })}
                    className={`flex items-start gap-4 p-5 rounded-2xl border text-left transition-all duration-300 cursor-pointer ${
                      builderData.timeline === opt.id
                        ? "border-[#c5a880] bg-[#c5a880]/10 shadow-[0_0_20px_rgba(197,168,128,0.1)]"
                        : "border-[#c5a880]/15 bg-[#050507]/50 hover:border-[#c5a880]/40"
                    }`}
                  >
                    <div className="w-10 h-10 rounded-full bg-[#c5a880]/15 flex items-center justify-center shrink-0">
                      <span className="text-xs font-bold text-[#c5a880]">{opt.days}</span>
                    </div>
                    <div>
                      <span className="text-sm font-medium text-white block">{opt.label}</span>
                      <span className="text-[11px] text-[#f4ebd0]/60 mt-1 block">{opt.desc}</span>
                    </div>
                  </button>
                ))}
              </div>
            </motion.div>
          )}

          {/* Step 4: Contact Capture */}
          {builderStep === 3 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-6 max-w-lg mx-auto"
            >
              <div className="text-center mb-6">
                <h3 className="text-xl font-serif text-white font-light">Where should we send your custom quote?</h3>
                <p className="text-xs text-[#f4ebd0]/60 mt-2">We&apos;ll respond within 24 hours</p>
              </div>
              <div className="space-y-4">
                <div>
                  <label className="text-[10px] uppercase tracking-widest text-[#c5a880] font-semibold block mb-2">Your Name</label>
                  <input
                    type="text"
                    value={builderData.name}
                    onChange={(e) => setBuilderData({ ...builderData, name: e.target.value })}
                    placeholder="e.g. Sarah Johnson"
                    className="w-full bg-[#050507]/70 border border-[#c5a880]/20 rounded-xl px-4 py-3 text-sm text-white placeholder:text-[#f4ebd0]/30 focus:outline-none focus:border-[#c5a880]/50 transition-colors"
                  />
                </div>
                <div>
                  <label className="text-[10px] uppercase tracking-widest text-[#c5a880] font-semibold block mb-2">Email Address</label>
                  <input
                    type="email"
                    value={builderData.email}
                    onChange={(e) => setBuilderData({ ...builderData, email: e.target.value })}
                    placeholder="e.g. sarah@example.com"
                    className="w-full bg-[#050507]/70 border border-[#c5a880]/20 rounded-xl px-4 py-3 text-sm text-white placeholder:text-[#f4ebd0]/30 focus:outline-none focus:border-[#c5a880]/50 transition-colors"
                  />
                </div>
                <div>
                  <label className="text-[10px] uppercase tracking-widest text-[#c5a880] font-semibold block mb-2">Phone (optional)</label>
                  <input
                    type="tel"
                    value={builderData.phone}
                    onChange={(e) => setBuilderData({ ...builderData, phone: e.target.value })}
                    placeholder="e.g. +1 234 567 890"
                    className="w-full bg-[#050507]/70 border border-[#c5a880]/20 rounded-xl px-4 py-3 text-sm text-white placeholder:text-[#f4ebd0]/30 focus:outline-none focus:border-[#c5a880]/50 transition-colors"
                  />
                </div>
                <div>
                  <label className="text-[10px] uppercase tracking-widest text-[#c5a880] font-semibold block mb-2">Project Details</label>
                  <textarea
                    value={builderData.details}
                    onChange={(e) => setBuilderData({ ...builderData, details: e.target.value })}
                    placeholder="Tell us about your vision, location, guest count, or any special requirements..."
                    rows={3}
                    className="w-full bg-[#050507]/70 border border-[#c5a880]/20 rounded-xl px-4 py-3 text-sm text-white placeholder:text-[#f4ebd0]/30 focus:outline-none focus:border-[#c5a880]/50 transition-colors resize-none"
                  />
                </div>
              </div>
            </motion.div>
          )}

          {/* Step 5: Summary & Quote-Ready CTA */}
          {builderStep === 4 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-8 max-w-lg mx-auto"
            >
              <div className="text-center mb-6">
                <div className="w-16 h-16 rounded-full bg-[#c5a880]/15 flex items-center justify-center mx-auto mb-4">
                  <Award className="w-7 h-7 text-[#c5a880]" />
                </div>
                <h3 className="text-xl font-serif text-white font-light">Your Brief Is Ready</h3>
                <p className="text-xs text-[#f4ebd0]/60 mt-2">Review your selections below. We&apos;ll create a custom quote based on your brief.</p>
              </div>

              <div className="space-y-3">
                {[
                  { label: "Project Goal", value: builderData.goal ? builderData.goal.charAt(0).toUpperCase() + builderData.goal.slice(1) : "Not selected" },
                  { label: "Audience / Event Type", value: builderData.audience ? builderData.audience.split("-").map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(" ") : "Not selected" },
                  { label: "Timeline", value: builderData.timeline ? builderData.timeline.charAt(0).toUpperCase() + builderData.timeline.slice(1) : "Not selected" },
                  { label: "Name", value: builderData.name || "Not provided" },
                  { label: "Email", value: builderData.email || "Not provided" },
                  { label: "Phone", value: builderData.phone || "Not provided" },
                  { label: "Details", value: builderData.details ? (builderData.details.length > 60 ? builderData.details.slice(0, 60) + "..." : builderData.details) : "Not provided" },
                ].map((item) => (
                  <div key={item.label} className="flex justify-between items-center py-2 border-b border-[#c5a880]/10">
                    <span className="text-[10px] uppercase tracking-widest text-[#c5a880]/70 font-semibold">{item.label}</span>
                    <span className="text-xs text-white font-medium text-right max-w-[60%]">{item.value}</span>
                  </div>
                ))}
              </div>

              <div className="text-center pt-4">
                <button
                  onClick={() => {
                    const message = encodeURIComponent(
                      `New Project Inquiry\n\nGoal: ${builderData.goal}\nAudience: ${builderData.audience}\nTimeline: ${builderData.timeline}\nName: ${builderData.name}\nEmail: ${builderData.email}\nPhone: ${builderData.phone}\nDetails: ${builderData.details}`
                    );
                    window.location.href = `mailto:hello@mmscreatives.com?subject=New%20Project%20Inquiry%20-%20${builderData.name || "New Lead"}&body=${message}`;
                  }}
                  disabled={!builderData.name || !builderData.email}
                  className="inline-flex items-center justify-center px-8 py-3 text-xs uppercase tracking-widest bg-gradient-to-r from-[#b48a3d] to-[#c5a880] text-[#050507] font-bold rounded-full hover:brightness-110 hover:shadow-lg hover:shadow-[#b48a3d]/20 transition-all duration-300 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
                >
                  Send My Brief & Get a Free Quote
                </button>
                <p className="text-[10px] text-[#f4ebd0]/40 mt-3">We respect your privacy. No spam, ever.</p>
              </div>
            </motion.div>
          )}

          {/* Navigation Buttons */}
          <div className="flex items-center justify-between mt-8 pt-6 border-t border-[#c5a880]/10">
            <button
              onClick={() => setBuilderStep((prev) => Math.max(0, prev - 1))}
              disabled={builderStep === 0}
              className="inline-flex items-center gap-2 text-[10px] uppercase tracking-widest text-[#f4ebd0]/50 hover:text-white transition-colors disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
            >
              <ChevronLeft className="w-3 h-3" />
              Back
            </button>

            <div className="flex items-center gap-3">
              {builderStep < 4 && (
                <button
                  onClick={() => {
                    // Validate current step before proceeding
                    if (builderStep === 0 && !builderData.goal) return;
                    if (builderStep === 1 && !builderData.audience) return;
                    if (builderStep === 2 && !builderData.timeline) return;
                    if (builderStep === 3 && (!builderData.name || !builderData.email)) return;
                    setBuilderStep((prev) => Math.min(4, prev + 1));
                  }}
                  className="inline-flex items-center gap-2 text-[10px] uppercase tracking-widest bg-[#c5a880] text-[#050507] px-5 py-2.5 rounded-full font-semibold hover:brightness-110 transition-all duration-300 cursor-pointer"
                >
                  {builderStep === 3 ? "Review Brief" : "Continue"}
                  <ChevronRight className="w-3 h-3" />
                </button>
              )}
              {builderStep > 0 && builderStep < 5 && (
                <button
                  onClick={() => {
                    setBuilderStep(0);
                    setBuilderData({ goal: "", audience: "", timeline: "", name: "", email: "", phone: "", details: "" });
                  }}
                  className="text-[10px] uppercase tracking-widest text-[#f4ebd0]/40 hover:text-[#f4ebd0]/70 transition-colors cursor-pointer"
                >
                  Reset
                </button>
              )}
            </div>
          </div>
        </div>
      </section>
        </div>
      </section>

      <Footer />

      {/* Persistent CTA */}
      <Link href="/conference-production#enquiry" className="fixed bottom-6 right-6 z-50 inline-flex items-center px-4 py-3 rounded-full bg-[#b48a3d] text-[#050507] font-semibold shadow-lg">Plan Your Conference</Link>

    </div>
  );
}