"use client";

import React, { useState, useEffect, useLayoutEffect, useRef } from "react";
import Image from "next/image";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { motion, AnimatePresence } from "framer-motion";
import {
  Globe,
  MessageSquare,
  Shield,
  Users,
  Lock,
  Play,
  Heart,
  Briefcase,
  Compass,
  Sun,
  Video,
  Award,
  Star,
  ChevronLeft,
  ChevronRight,
  Camera,
  Megaphone,
  Palette,
  PenTool
} from "lucide-react";

export default function Home() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [conferenceSlide, setConferenceSlide] = useState(0);
  const [cinematicSlide, setCinematicSlide] = useState(0);
  const pastWorkRef = useRef<HTMLElement | null>(null);

  // Auto-play Hero carousel every 6 seconds
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev === 2 ? 0 : prev + 1));
    }, 6000);
    return () => clearInterval(timer);
  }, []);

  // Initialize GSAP ScrollTrigger Animations
  useLayoutEffect(() => {
    if (typeof window !== "undefined") {
      gsap.registerPlugin(ScrollTrigger);

      // GSAP Reveal for card/scenic background images (increases opacity from 0.08 to 0.35 on scroll)
      gsap.utils.toArray<HTMLElement>(".gsap-reveal-bg-img").forEach((img) => {
        const triggerEl = img.closest("section") || img.closest(".group") || img;
        gsap.fromTo(img,
          { opacity: 0.08 },
          {
            opacity: 0.35,
            duration: 1.5,
            ease: "power2.out",
            scrollTrigger: {
              trigger: triggerEl,
              start: "top 80%",
              toggleActions: "play reverse play reverse"
            }
          }
        );
      });

      // GSAP Reveal for custom video thumbnails (increases from 0.15 to 0.5)
      gsap.utils.toArray<HTMLElement>(".gsap-reveal-image").forEach((img) => {
        gsap.fromTo(img,
          { opacity: 0.15 },
          {
            opacity: 0.5,
            duration: 1.5,
            ease: "power2.out",
            scrollTrigger: {
              trigger: img,
              start: "top 85%",
              toggleActions: "play reverse play reverse"
            }
          }
        );
      });

      // Animate Hero side background images slightly on load
      gsap.fromTo(".gsap-hero-bg-left",
        { opacity: 0.15 },
        { opacity: 0.5, duration: 2.0, ease: "power2.out" }
      );
      gsap.fromTo(".gsap-hero-bg-right",
        { opacity: 0.15 },
        { opacity: 0.45, duration: 2.0, ease: "power2.out" }
      );

      // GSAP Section enter tracking & in animation
      gsap.utils.toArray<HTMLElement>(".gsap-section-bg").forEach((sec) => {
        gsap.fromTo(sec,
          { autoAlpha: 0, y: 25 },
          {
            autoAlpha: 1,
            y: 0,
            duration: 1,
            ease: "power3.out",
            scrollTrigger: {
              trigger: sec,
              start: "top 85%",
              end: "bottom top",
              toggleActions: "play reverse play reverse",
            }
          }
        );
      });

      // GSAP Reveal for section elements (slide-up fade-in)
      const sectionRevealTargets = [
        ".gsap-fade-up",
        ".gsap-service-card",
        ".gsap-experience-card",
        ".gsap-testimonial",
        ".gsap-cta-card",
        ".gsap-small-card",
        ".gsap-button"
      ].join(", ");

      gsap.utils.toArray<HTMLElement>(".gsap-section-bg").forEach((sec) => {
        const elements = sec.querySelectorAll(sectionRevealTargets);
        if (elements.length > 0) {
          gsap.fromTo(elements,
            { opacity: 0, y: 35 },
            {
              opacity: 1,
              y: 0,
              duration: 1.0,
              stagger: 0.12,
              ease: "power3.out",
              scrollTrigger: {
                trigger: sec,
                start: "top 85%",
                toggleActions: "play reverse play reverse"
              }
            }
          );
        }
      });

      // Timeline steps bounce/reveal animation
      gsap.fromTo(".gsap-timeline-step",
        { opacity: 0, scale: 0.8, y: 20 },
        {
          opacity: 1,
          scale: 1,
          y: 0,
          duration: 0.8,
          stagger: 0.2,
          ease: "back.out(1.5)",
          scrollTrigger: {
            trigger: ".gsap-timeline-container",
            start: "top 80%",
            toggleActions: "play reverse play reverse"
          }
        }
      );

      // Horizontal "wheel" carousel for Past Work
      const section = pastWorkRef.current;
      if (section) {
        const ctx = gsap.context(() => {
          const pinContainer = section.querySelector<HTMLElement>(".past-work-pin");
          const track = section.querySelector<HTMLElement>(".past-work-track");
          const heading = section.querySelector<HTMLElement>(".past-work-heading");
          const progressFill = section.querySelector<HTMLElement>(".progress-fill");
          const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

          const cards = track ? gsap.utils.toArray<HTMLElement>(track.querySelectorAll(".pw-card")) : [];
          if (!pinContainer || !track || !heading || cards.length === 0) return;

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

          updateLayout();

          const headingTl = gsap.timeline({ paused: true });
          headingTl
            .fromTo(
              ".pw-eyebrow",
              { y: 15, autoAlpha: 0 },
              { y: 0, autoAlpha: 1, duration: 0.7, ease: "power2.out" }
            )
            .fromTo(
              ".pw-heading-line",
              { yPercent: 110, autoAlpha: 0, rotation: 2 },
              { yPercent: 0, autoAlpha: 1, rotation: 0, duration: 1.05, stagger: 0.1, ease: "power3.out" },
              "-=0.45"
            )
            .fromTo(
              ".pw-supporting",
              { y: 15, autoAlpha: 0 },
              { y: 0, autoAlpha: 1, duration: 0.65, ease: "power2.out" },
              "-=0.55"
            );

          ScrollTrigger.create({
            trigger: heading,
            start: "top 85%",
            once: true,
            onEnter: () => headingTl.play(),
          });

          const travel = getTravel();

          if (travel > 0) {
            ScrollTrigger.create({
              trigger: pinContainer,
              start: "top top",
              end: () => `+=${travel + window.innerHeight}`,
              pin: pinContainer,
              pinSpacing: true,
              scrub: 1,
              anticipatePin: 1,
              invalidateOnRefresh: true,
              snap: {
                snapTo: 1 / (cards.length - 1),
                duration: { min: 0.25, max: 0.65 },
                delay: 0.08,
                ease: "power2.inOut",
              },
              onUpdate(self) {
                const progress = self.progress;
                const currentX = -progress * travel;

                if (!reduced) {
                  const velocity = self.getVelocity() / window.innerHeight;
                  const skew = gsap.utils.clamp(-2.5, 2.5, velocity * 0.25);
                  gsap.to(track, { skewX: skew, duration: 0.35, overwrite: "auto" });
                }

                gsap.set(track, { x: currentX });

                const viewportCenter = window.innerWidth / 2;

                cards.forEach((card) => {
                  const cardCenter = card.offsetLeft + card.offsetWidth / 2 + currentX;
                  const dist = (cardCenter - viewportCenter) / card.offsetWidth;
                  const abs = Math.abs(dist);

                  const scale = reduced ? 1 : Math.max(0.82, 1 - abs * 0.14);
                  const rotateY = reduced ? 0 : dist * -12;
                  const opacity = reduced ? 1 : Math.max(0.25, 1 - abs * 0.75);
                  const blur = reduced ? 0 : Math.min(2.4, abs * 2);
                  const zIndex = Math.round(100 - abs * 15);
                  const brightness = reduced ? 1 : Math.max(0.85, 1 - abs * 0.18);

                  gsap.set(card, {
                    scale,
                    rotationY: rotateY,
                    opacity,
                    filter: reduced ? "none" : `blur(${blur}px)`,
                    zIndex,
                    willChange: "transform, opacity, filter",
                  });

                  const textContent = card.querySelector<HTMLElement>(".pw-card-content");
                  if (textContent) {
                    const textOpacity = Math.max(0.2, 1 - abs * 1.4);
                    const textY = abs * 12;
                    gsap.set(textContent, { opacity: textOpacity, y: textY });
                  }

                  const image = card.querySelector<HTMLImageElement>(".pw-card-image img");
                  if (image && !reduced) {
                    const imgOffset = dist * 18;
                    const imgScale = 1.03 - abs * 0.025;
                    gsap.set(image, { x: imgOffset, scale: imgScale, filter: brightness < 0.99 ? `brightness(${brightness})` : "brightness(1)" });
                  }
                });

                if (progressFill) {
                  gsap.set(progressFill, { scaleX: progress, transformOrigin: "left center" });
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
                  gsap.to(heading, { opacity: 1, y: 0, duration: 0.25, overwrite: "auto" });
                }
              },
            });
          }

          const resizeHandler = () => {
            updateLayout();
            ScrollTrigger.refresh();
          };
          window.addEventListener("resize", resizeHandler);

          const refreshOnLoad = () => {
            updateLayout();
            ScrollTrigger.refresh();
          };
          cards.forEach((card) => {
            const img = card.querySelector("img");
            if (img && !img.complete) {
              img.addEventListener("load", refreshOnLoad);
            }
          });
          window.addEventListener("load", refreshOnLoad);

          const keyHandler = (e: KeyboardEvent) => {
            if (e.key === "ArrowDown" || e.key === "PageDown" || e.key === "ArrowRight") {
              window.scrollBy({ top: window.innerHeight * 0.9, behavior: "smooth" });
            } else if (e.key === "ArrowUp" || e.key === "PageUp" || e.key === "ArrowLeft") {
              window.scrollBy({ top: -window.innerHeight * 0.9, behavior: "smooth" });
            }
          };
          window.addEventListener("keydown", keyHandler);

          return () => {
            window.removeEventListener("resize", resizeHandler);
            window.removeEventListener("load", refreshOnLoad);
            window.removeEventListener("keydown", keyHandler);
          };
        }, section);

        return () => ctx.revert();
      }

      window.addEventListener("load", () => {
        ScrollTrigger.refresh();
      });
    }
  }, []);

  // Slides configuration
  const slides = [
    {
      image: "/hero_wedding.png",
      tag: "Weddings & Elopements",
      title: "Your Love Story, Beautifully Told.",
      desc: "We capture every glance, every laugh, every tear that makes your day yours — a cinematic love story you'll treasure forever.",
      btnText: "Begin Your Story",
      link: "#weddings-experience"
    },
    {
      image: "/hero_conference.png",
      tag: "Conferences & Live Storytelling",
      title: "Events That Spark Genuine Connection.",
      desc: "From large screens and podcast capture to digital podiums and brand briefs, we create conferences that feel emotional, cinematic and unforgettable.",
      btnText: "Start Your Epic Event Journey",
      link: "#corporate-experience"
    },
    {
      image: "/DSC_7504.jpg",
      tag: "Brand Storytelling",
      title: "Where Moments Become Movies — Live, Cinematic, Unforgettable.",
      desc: "We turn events into emotional experiences — powered by world-class equipment, social amplification, and the unique stage of Victoria Falls.",
      btnText: "Discover Our Work",
      link: "#builder"
    }
  ];

  // Conference & Cinematic slides (for separate carousels)
  const conferenceSlides = [
    {
      image: "/conference_card.png",
      title: "Conferences: Capture Every Angle",
      desc: "Large screens, interpretation systems, audio equipment and polished production bring every presentation, idea and voice into focus.",
      features: [
        "Large screens",
        "Interpretation systems",
        "Audio equipment",
        "Multicam capture"
      ]
    },
    {
      image: "/conference_setup2.jpg",
      title: "Podcast & Live Capture",
      desc: "On-site podcast rigs, intimate interview zones and ongoing content capture make each session feel alive beyond the event.",
      features: [
        "Podcast equipment",
        "Drone capture",
        "360 booth",
        "Personal experiences"
      ]
    },
    {
      image: "/conference_screens.jpg",
      title: "Corporate Event Amplification",
      desc: "Corporate events layered with social media marketing, billboards, digital podiums and visual storytelling that widens every audience.",
      features: [
        "Social media marketing",
        "Billboards",
        "Digital podiums",
        "Live streaming"
      ]
    }
  ];

  const cinematicSlides = [
    {
      image: "/cinema_ad.jpg",
      title: "Cinematic Campaigns",
      desc: "Advertisements, animation, posters and motion design crafted to make your story feel polished, emotional and unforgettable.",
      features: [
        "Advertisements",
        "Animation",
        "Posters",
        "Graphic design"
      ]
    },
    {
      image: "/cinematic_drone.jpg",
      title: "Immersive Capture",
      desc: "Drone sequences, 360 capture and podcast experiences that bring personal moments to life with cinematic scale.",
      features: [
        "Drone footage",
        "360 booths",
        "Podcast setup",
        "Shareable moments"
      ]
    },
    {
      image: "/cinema_posters.jpg",
      title: "Creative Storytelling",
      desc: "Design-forward visuals and film assets that turn campaigns into stories audiences feel and remember.",
      features: [
        "Creative assets",
        "Motion graphics",
        "Brand campaigns",
        "Digital premieres"
      ]
    }
  ];

  // Our Services configuration
  const services = [
    {
      title: "Visual Storytelling",
      image: "/wedding_card.png",
      alt: "Visual storytelling through photography and videography",
      desc: "Corporate events, social media marketing, billboards and digital podiums sit above our visual storytelling — pairing creative capture with high-impact campaigns.",
      items: [
        { label: "Photography", icon: Camera },
        { label: "Videography", icon: Video },
        { label: "Social Media Marketing", icon: Megaphone },
        { label: "Billboards", icon: Globe },
        { label: "Digital Podium", icon: PenTool }
      ],
      cta: "Start Visual Storytelling"
    },
    {
      title: "Event Experiences",
      image: "/conference_card.png",
      alt: "Event experiences, planning and coordination",
      desc: "Large screens, interpretation systems, audio equipment, interactive digital displays and live streaming come together for seamless event production.",
      items: [
        { label: "Corporate Events", icon: Users },
        { label: "Large Screens", icon: Globe },
        { label: "PA System", icon: Play },
        { label: "Live Streaming", icon: Video },
        { label: "Equipment Hire", icon: Briefcase }
      ],
      cta: "Build Your Event"
    },
    {
      title: "Cinematic Experiences",
      image: "/DSC_7504.jpg",
      alt: "Digital presence, social media and branding",
      desc: "Advertisements, animation, posters, graphic design and creative campaigns shape cinematic experiences for brands, weddings and destination stories.",
      items: [
        { label: "Advertisements", icon: Palette },
        { label: "Animation", icon: PenTool },
        { label: "Graphic Design", icon: Palette },
        { label: "Podcast Capture", icon: MessageSquare },
        { label: "Drone Footage", icon: Camera }
      ],
      cta: "See Cinematic Work"
    }
  ];

  const pastWorkItems = [
    {
      image: "/wedding_card.png",
      category: "Wedding Film",
      title: "Victoria Falls Wedding Film",
      desc: "An emotional, intimate film captured across waterfall light and golden celebration.",
      tags: ["Cinematography", "Editing", "Color Grading"],
      link: "#gallery"
    },
    {
      image: "/conference_card.png",
      category: "Live Production",
      title: "Global Summit Production",
      desc: "A fully produced conference experience with multiple screens, live streaming and branded stages.",
      tags: ["Event Production", "Live Streaming", "AV Staging"],
      link: "#gallery"
    },
    {
      image: "/cinema_ad.jpg",
      category: "Brand Campaign",
      title: "Luxury Brand Campaign",
      desc: "Creative ads, motion design and polished visuals for a launch that moved audiences across channels.",
      tags: ["Brand Strategy", "Motion Design", "Content Creation"],
      link: "#gallery"
    },
    {
      image: "/cinematic_drone.jpg",
      category: "Corporate Event",
      title: "Corporate Event Experience",
      desc: "Interactive screens, digital podiums and branded media that kept guests engaged throughout.",
      tags: ["Corporate Events", "Digital Displays", "Live Capture"],
      link: "#gallery"
    },
    {
      image: "/cinema_posters.jpg",
      category: "Immersive Media",
      title: "Immersive Media Production",
      desc: "360 capture, drone sequences and podcast experiences that transformed events into shareable stories.",
      tags: ["Immersive Tech", "Drone Cinematography", "360 Capture"],
      link: "#gallery"
    }
  ];

  useEffect(() => {
    const t1 = setInterval(() => setConferenceSlide((p) => (p === conferenceSlides.length - 1 ? 0 : p + 1)), 6000);
    const t2 = setInterval(() => setCinematicSlide((p) => (p === cinematicSlides.length - 1 ? 0 : p + 1)), 7000);
    return () => { clearInterval(t1); clearInterval(t2); };
  }, [conferenceSlides.length, cinematicSlides.length]);

  return (
    <div className="min-h-screen bg-[#050507] text-[#f4ebd0] overflow-x-hidden font-sans selection:bg-[#b48a3d] selection:text-[#050507]">

      {/* 1) TOP NAVIGATION BAR & HERO SECTION */}
      <header className="relative w-full z-50">

        {/* Navigation Bar - Fixed and showing throughout the page */}
        <nav className="fixed top-0 left-0 w-full bg-[#050507] border-b border-[#c5a880]/15 py-4 px-4 sm:px-6 lg:px-8 shadow-xl z-50">
          <div className="max-w-7xl mx-auto flex items-center justify-between">
            {/* Logo - Untouched white logo */}
            <div className="flex items-center gsap-nav-logo">
              <Image
                src="/mmslogo.webp"
                alt="MMS Logo"
                width={130}
                height={38}
                className="object-contain"
                priority
              />
            </div>

            {/* Nav Links */}
            <div className="hidden md:flex items-center space-x-8 gsap-nav-links">
              {["Home", "Services", "Experiences", "Gallery", "About", "Clients", "Contact"].map((item) => (
                <a
                  key={item}
                  href={`#${item.toLowerCase()}`}
                  className="text-xs uppercase tracking-widest text-[#f4ebd0]/70 hover:text-white transition-colors duration-200 underline-link gsap-nav-link"
                >
                  {item}
                </a>
              ))}
            </div>

            {/* CTA Button */}
            <div>
              <a
                href="#contact"
                className="inline-flex items-center justify-center px-5 py-2 text-xs uppercase tracking-widest bg-gradient-to-r from-[#b48a3d] to-[#c5a880] text-[#050507] font-semibold rounded-full hover:brightness-110 hover:shadow-lg hover:shadow-[#b48a3d]/20 transition-all duration-300 premium-button gsap-nav-cta"
              >
                Get a Quote
              </a>
            </div>
          </div>
        </nav>

        {/* Hero Carousel Section - offset for fixed navbar */}
        <div className="relative h-[80vh] min-h-[580px] w-full overflow-hidden bg-black flex items-center justify-center z-10 pt-16 md:pt-20">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentSlide}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 1.2, ease: "easeInOut" }}
              className="absolute inset-0 w-full h-full"
            >
              {/* Background Image of current slide */}
              <Image
                src={slides[currentSlide].image}
                alt={slides[currentSlide].tag}
                fill
                className="object-cover scale-105 animate-[zoom_20s_infinite_alternate] bright-image"
                style={{ opacity: 0.55 }}
                priority
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#050507] via-transparent to-[#050507]/60" />
            </motion.div>
          </AnimatePresence>

          {/* Slide Text Content - Left Aligned with Shade */}
          <div className="relative z-20 w-full h-full flex items-center pl-6 md:pl-12">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentSlide}
                initial={{ opacity: 0, x: -40 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 40 }}
                transition={{ duration: 0.8, delay: 0.2 }}
                className="space-y-6 max-w-2xl relative z-10"
              >
                {/* shade removed per request */}
                <span className="text-[10px] tracking-[0.4em] text-[#c5a880] uppercase font-bold block gsap-eyebrow">
                  {slides[currentSlide].tag}
                </span>

                <h1 className="text-4xl sm:text-5xl md:text-6xl font-light text-white leading-tight font-serif gsap-heading">
                  {slides[currentSlide].title}
                </h1>

                <p className="text-xs sm:text-sm md:text-base text-[#f4ebd0]/80 tracking-wide font-light leading-relaxed max-w-lg gsap-copy">
                  {slides[currentSlide].desc}
                </p>

                <div className="pt-6 gsap-action">
                  <a
                    href={slides[currentSlide].link}
                    className="group inline-flex items-center space-x-2 text-xs uppercase tracking-widest text-white border border-[#c5a880]/30 hover:border-[#c5a880] px-6 py-3 rounded-full bg-black/40 backdrop-blur-sm transition-all duration-300 font-semibold premium-button"
                  >
                    <span>{slides[currentSlide].btnText}</span>
                    <span className="text-[#c5a880] group-hover:translate-x-1 transition-transform duration-200">| →</span>
                  </a>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Slider Controls */}
          <button
            onClick={() => setCurrentSlide((prev) => (prev === 2 ? 0 : prev + 1))}
            className="absolute left-6 top-1/2 -translate-y-1/2 z-30 p-2.5 rounded-full border border-[#c5a880]/30 text-white hover:bg-[#c5a880] hover:text-[#050507] hover:border-transparent transition-all duration-300 cursor-pointer hidden sm:block"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button
            onClick={() => setCurrentSlide((prev) => (prev === 2 ? 0 : prev + 1))}
            className="absolute right-6 top-1/2 -translate-y-1/2 z-30 p-2.5 rounded-full border border-[#c5a880]/30 text-white hover:bg-[#c5a880] hover:text-[#050507] hover:border-transparent transition-all duration-300 cursor-pointer hidden sm:block"
          >
            <ChevronRight className="w-5 h-5" />
          </button>

          {/* Dots Indicator */}
          <div className="absolute bottom-10 left-0 w-full flex items-center justify-center space-x-3 z-30">
            {slides.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentSlide(idx)}
                className={`w-2 h-2 rounded-full transition-all duration-300 ${idx === currentSlide ? "bg-[#c5a880] w-6" : "bg-[#f4ebd0]/30"}`}
              />
            ))}
          </div>
        </div>
      </header>

      {/* Inserted AI hero intro copy */}
      <section className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 gsap-section-bg">
        <div className="text-center mb-6">
          <h2 className="text-4xl md:text-5xl font-light text-white font-serif gsap-heading">Where Moments Become Movies — Live, Cinematic, Unforgettable.</h2>
          <p className="text-sm md:text-base text-[#f4ebd0]/70 font-light max-w-2xl mx-auto mt-4 gsap-copy">We turn events into emotional experiences — powered by world-class equipment, social amplification, and the unique stage of Victoria Falls.</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
          <div className="glass-panel p-6 rounded-2xl border border-[#c5a880]/15 gsap-small-card">
            <h4 className="text-lg font-medium text-white">Live Events</h4>
            <p className="text-sm text-[#f4ebd0]/70 mt-2">Full AV staging, LED canvases, digital podiums and PA systems — so your message lands with clarity, power, and emotional resonance.</p>
          </div>
          <div className="glass-panel p-6 rounded-2xl border border-[#c5a880]/15">
            <h4 className="text-lg font-medium text-white">Cinematic Experiences</h4>
            <p className="text-sm text-[#f4ebd0]/70 mt-2">End-to-end film, animation, drone cinematography and podcast studios — crafted to feel like cinema, built to live on any screen.</p>
          </div>
          <div className="glass-panel p-6 rounded-2xl border border-[#c5a880]/15">
            <h4 className="text-lg font-medium text-white">Amplified Reach</h4>
            <p className="text-sm text-[#f4ebd0]/70 mt-2">Social-first content, live streaming and digital billboards — the moment doesn’t end at the venue; it multiplies across feeds and screens.</p>
          </div>
        </div>
        <div className="text-center mt-8">
          <a href="#contact" className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-[#b48a3d] to-[#c5a880] text-[#050507] rounded-full font-semibold premium-button gsap-action">Book a creative brief</a>
        </div>
      </section>

      {/* 2) TRUST / VALUE ICON STRIP (NO-IMAGE SECTION: Uses background image with parallax and GSAP reveal overlay) */}
      <section className="relative -mt-4 z-30 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 gsap-section-bg overflow-hidden rounded-3xl border border-[#c5a880]/20 shadow-2xl bg-black">
        {/* Parallax Background Image */}
        <div className="absolute inset-0 z-0 w-full h-full">
          <Image
            src="/victoria_falls_banner.png"
            alt="MMS Partners Background"
            fill
            className="object-cover gsap-reveal-bg-img pointer-events-none"
            style={{ opacity: 0.2 }}
          />
          <div className="absolute inset-0 bg-black/60 z-10" />
        </div>

        <div className="relative z-20 p-8 md:p-10">
          {/* Icon Row */}
          <div className="grid grid-cols-2 md:grid-cols-5 gap-6 md:gap-4 text-center items-stretch divide-y md:divide-y-0 md:divide-x divide-[#c5a880]/15 gsap-fade-up">
            {/* Item 1 */}
           
            {/* Item 2 */}
            <div className="flex flex-col items-center justify-center p-3 pt-6 md:p-0">
              <MessageSquare className="w-5 h-5 text-[#c5a880] mb-3" />
              <p className="text-[9px] tracking-[0.15em] text-[#c5a880] uppercase font-semibold mb-1">24hr</p>
              <p className="text-xs text-white font-medium">Avg. Response Time</p>
            </div>
            {/* Item 3 */}
            <div className="flex flex-col items-center justify-center p-3 pt-6 md:p-0">
              <Shield className="w-5 h-5 text-[#c5a880] mb-3" />
              <p className="text-[9px] tracking-[0.15em] text-[#c5a880] uppercase font-semibold mb-1">Licensed, Insured</p>
              <p className="text-xs text-white font-medium">& Drone Certified</p>
            </div>
            {/* Item 4 */}
            <div className="flex flex-col items-center justify-center p-3 pt-6 md:p-0">
              <Users className="w-5 h-5 text-[#c5a880] mb-3" />
              <p className="text-[9px] tracking-[0.15em] text-[#c5a880] uppercase font-semibold mb-1">Trusted by Tourism</p>
              <p className="text-xs text-white font-medium">& Corporate Brands</p>
            </div>
            {/* Item 5 */}
            <div className="flex flex-col items-center justify-center p-3 pt-6 md:p-0">
              <Lock className="w-5 h-5 text-[#c5a880] mb-3" />
              <p className="text-[9px] tracking-[0.15em] text-[#c5a880] uppercase font-semibold mb-1">Secure Payments</p>
              <p className="text-xs text-white font-medium">100% Protected</p>
            </div>
          </div>

          {/* Logo Row */}

        </div>
      </section>

      {/* 2b) OUR SERVICES SECTION */}
      <section id="services" className="relative py-16 md:py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 gsap-section-bg">
        <div className="text-center mb-16 gsap-fade-up">
          <span className="text-[10px] tracking-[0.4em] text-[#c5a880] uppercase font-semibold block mb-3 gsap-eyebrow">What We Offer</span>
          <h2 className="text-3xl md:text-5xl font-light text-white font-serif mb-4 gsap-heading">Our Services</h2>
          <p className="text-sm md:text-base text-[#f4ebd0]/70 font-light max-w-xl mx-auto gsap-copy">
            End-to-end multimedia crafted with creativity and precision.
          </p>
        </div>

        <div className="space-y-16 md:space-y-24">
          {services.map((service, idx) => (
            <div
              key={service.title}
              className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-center gsap-service-card"
            >
              {/* Image side */}
              <div
                className={`relative rounded-3xl overflow-hidden glass-panel border border-[#c5a880]/15 aspect-[4/3] group gsap-image-card ${idx % 2 === 1 ? "lg:order-2" : "lg:order-1"}`}
              >
                <Image
                  src={service.image}
                  alt={service.alt}
                  fill
                  className="object-cover gsap-reveal-image bright-image transition-transform duration-7000 ease-out group-hover:scale-105"
                  style={{ opacity: 0.75 }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#050507] via-[#050507]/40 to-transparent z-10" />
              </div>

              {/* Text side */}
              <div className={`space-y-6 gsap-fade-up ${idx % 2 === 1 ? "lg:order-1" : "lg:order-2"}`}>
                <h3 className="text-2xl md:text-3xl font-light text-white font-serif">{service.title}</h3>
                <p className="text-sm text-[#f4ebd0]/70 leading-relaxed font-light max-w-xl">
                  {service.desc}
                </p>

                {/* Sub-service cards */}
                <div className="flex flex-wrap gap-4 pt-2">
                  {service.items.map((item) => (
                    <div
                      key={item.label}
                      className="glass-panel flex flex-col items-center justify-center gap-3 w-32 h-28 rounded-2xl border border-[#c5a880]/20 hover:border-[#c5a880]/50 transition-all duration-300 text-center px-3 gsap-small-card"
                    >
                      <span className="text-xs text-white font-medium leading-tight">{item.label}</span>
                      <item.icon className="w-5 h-5 text-[#c5a880]" />
                    </div>
                  ))}
                </div>

                <div className="pt-4">
                  <a
                    href="#contact"
                    className="inline-flex items-center justify-center px-6 py-2.5 text-xs uppercase tracking-widest bg-gradient-to-r from-[#b48a3d] to-[#c5a880] text-[#050507] font-semibold rounded-full hover:brightness-110 hover:shadow-lg hover:shadow-[#b48a3d]/20 transition-all duration-300 premium-button gsap-button"
                  >
                    {service.cta}
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 2b-CAROUSEL 2) CONFERENCES CAROUSEL - Styled like Hero */}
      <section className="py-16 md:py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative gsap-section-bg">
        <div className="text-center mb-12">
          <span className="text-[10px] tracking-[0.4em] text-[#c5a880] uppercase font-semibold block mb-3 gsap-eyebrow">Corporate & Conferences</span>
          <h2 className="text-3xl md:text-5xl font-light text-white font-serif gsap-heading">Conferences & Large-Scale Events</h2>
          <p className="text-sm md:text-base text-[#f4ebd0]/70 font-light max-w-xl mx-auto mt-4 gsap-copy">Large screens, interpretation systems, audio equipment and full AV setup to capture every message and stream it globally.</p>
        </div>

        {/* Carousel Container */}
        <div className="relative h-[60vh] min-h-[500px] w-full overflow-hidden bg-black rounded-3xl flex items-center justify-center border border-[#c5a880]/20">
          <AnimatePresence mode="wait">
            <motion.div
              key={conferenceSlide}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 1.2, ease: "easeInOut" }}
              className="absolute inset-0 w-full h-full"
            >
              <Image
                src={conferenceSlides[conferenceSlide].image}
                alt={conferenceSlides[conferenceSlide].title}
                fill
                className="object-cover scale-105 animate-[zoom_20s_infinite_alternate]"
                style={{ opacity: 0.5 }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#050507] via-transparent to-[#050507]/60" />
            </motion.div>
          </AnimatePresence>

          {/* Content Overlay */}
          <div className="relative z-20 w-full h-full flex items-center pl-6 md:pl-12">
            <AnimatePresence mode="wait">
              <motion.div
                key={conferenceSlide}
                initial={{ opacity: 0, x: -40 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 40 }}
                transition={{ duration: 0.8, delay: 0.2 }}
                className="space-y-6 max-w-2xl"
              >
                <h3 className="text-3xl sm:text-4xl md:text-5xl font-light text-white leading-tight font-serif">
                  {conferenceSlides[conferenceSlide].title}
                </h3>
                <p className="text-xs sm:text-sm md:text-base text-[#f4ebd0]/80 tracking-wide font-light leading-relaxed max-w-lg">
                  {conferenceSlides[conferenceSlide].desc}
                </p>
                <div className="flex flex-wrap gap-3 pt-4 max-w-lg">
                  {conferenceSlides[conferenceSlide].features.map((feature) => (
                    <span key={feature} className="text-[10px] uppercase tracking-[0.2em] bg-[#c5a880]/10 text-[#f4ebd0] px-3 py-1 rounded-full border border-[#c5a880]/15">
                      {feature}
                    </span>
                  ))}
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Carousel Controls */}
          <button
            onClick={() => setConferenceSlide((prev) => (prev === conferenceSlides.length - 1 ? 0 : prev + 1))}
            className="absolute left-6 top-1/2 -translate-y-1/2 z-30 p-2.5 rounded-full border border-[#c5a880]/30 text-white hover:bg-[#c5a880] hover:text-[#050507] transition-all duration-300 hidden sm:block"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button
            onClick={() => setConferenceSlide((prev) => (prev === conferenceSlides.length - 1 ? 0 : prev + 1))}
            className="absolute right-6 top-1/2 -translate-y-1/2 z-30 p-2.5 rounded-full border border-[#c5a880]/30 text-white hover:bg-[#c5a880] hover:text-[#050507] transition-all duration-300 hidden sm:block"
          >
            <ChevronRight className="w-5 h-5" />
          </button>

          {/* Dots */}
          <div className="absolute bottom-8 left-0 w-full flex items-center justify-center space-x-3 z-30">
            {conferenceSlides.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setConferenceSlide(idx)}
                className={`w-2 h-2 rounded-full transition-all duration-300 ${idx === conferenceSlide ? "bg-[#c5a880] w-6" : "bg-[#f4ebd0]/30"}`}
              />
            ))}
          </div>
        </div>
      </section>

      {/* 2c-CAROUSEL 3) CINEMATIC EXPERIENCES CAROUSEL - Styled like Hero */}
      <section className="py-16 md:py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative gsap-section-bg">
        <div className="text-center mb-12">
          <span className="text-[10px] tracking-[0.4em] text-[#c5a880] uppercase font-semibold block mb-3 gsap-eyebrow">Cinematic & Creative</span>
          <h2 className="text-3xl md:text-5xl font-light text-white font-serif gsap-heading">Cinematic Experiences</h2>
          <p className="text-sm md:text-base text-[#f4ebd0]/70 font-light max-w-xl mx-auto mt-4 gsap-copy">Advertisements, animation, drone sequences, 360 immersive booths and creative assets that turn events into unforgettable moments.</p>
        </div>

        {/* Carousel Container */}
        <div className="relative h-[60vh] min-h-[500px] w-full overflow-hidden bg-black rounded-3xl flex items-center justify-center border border-[#c5a880]/20">
          <AnimatePresence mode="wait">
            <motion.div
              key={cinematicSlide}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 1.2, ease: "easeInOut" }}
              className="absolute inset-0 w-full h-full"
            >
              <Image
                src={cinematicSlides[cinematicSlide].image}
                alt={cinematicSlides[cinematicSlide].title}
                fill
                className="object-cover scale-105 animate-[zoom_20s_infinite_alternate]"
                style={{ opacity: 0.5 }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#050507] via-transparent to-[#050507]/60" />
            </motion.div>
          </AnimatePresence>

          {/* Content Overlay */}
          <div className="relative z-20 w-full h-full flex items-center pl-6 md:pl-12">
            <AnimatePresence mode="wait">
              <motion.div
                key={cinematicSlide}
                initial={{ opacity: 0, x: -40 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 40 }}
                transition={{ duration: 0.8, delay: 0.2 }}
                className="space-y-6 max-w-2xl"
              >
                <h3 className="text-3xl sm:text-4xl md:text-5xl font-light text-white leading-tight font-serif">
                  {cinematicSlides[cinematicSlide].title}
                </h3>
                <p className="text-xs sm:text-sm md:text-base text-[#f4ebd0]/80 tracking-wide font-light leading-relaxed max-w-lg">
                  {cinematicSlides[cinematicSlide].desc}
                </p>
                <div className="flex flex-wrap gap-3 pt-4 max-w-lg">
                  {cinematicSlides[cinematicSlide].features.map((feature) => (
                    <span key={feature} className="text-[10px] uppercase tracking-[0.2em] bg-[#c5a880]/10 text-[#f4ebd0] px-3 py-1 rounded-full border border-[#c5a880]/15">
                      {feature}
                    </span>
                  ))}
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Carousel Controls */}
          <button
            onClick={() => setCinematicSlide((prev) => (prev === cinematicSlides.length - 1 ? 0 : prev + 1))}
            className="absolute left-6 top-1/2 -translate-y-1/2 z-30 p-2.5 rounded-full border border-[#c5a880]/30 text-white hover:bg-[#c5a880] hover:text-[#050507] transition-all duration-300 hidden sm:block"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button
            onClick={() => setCinematicSlide((prev) => (prev === cinematicSlides.length - 1 ? 0 : prev + 1))}
            className="absolute right-6 top-1/2 -translate-y-1/2 z-30 p-2.5 rounded-full border border-[#c5a880]/30 text-white hover:bg-[#c5a880] hover:text-[#050507] transition-all duration-300 hidden sm:block"
          >
            <ChevronRight className="w-5 h-5" />
          </button>

          {/* Dots */}
          <div className="absolute bottom-8 left-0 w-full flex items-center justify-center space-x-3 z-30">
            {cinematicSlides.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCinematicSlide(idx)}
                className={`w-2 h-2 rounded-full transition-all duration-300 ${idx === cinematicSlide ? "bg-[#c5a880] w-6" : "bg-[#f4ebd0]/30"}`}
              />
            ))}
          </div>
        </div>
      </section>

      {/* 5) STORIES THAT BECAME MEMORIES SECTION - HORIZONTAL WHEEL CAROUSEL */}
      <section
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
                    <div className="pw-card-content relative z-10 flex flex-1 flex-col justify-between p-8 lg:p-10 bg-[#09090d]">
                      <div className="space-y-4">
                        <span className="text-[10px] uppercase tracking-[0.32em] text-[#c5a880] font-semibold block">
                          {item.category}
                        </span>
                        <h3 className="text-3xl md:text-4xl font-light text-white font-serif leading-tight">
                          {item.title}
                        </h3>
                        <p className="text-sm text-[#f4ebd0]/70 leading-relaxed font-light max-w-xl">
                          {item.desc}
                        </p>
                      </div>
                      <div className="mt-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                        <div className="flex flex-wrap gap-2">
                          {item.tags.map((tag) => (
                            <span
                              key={tag}
                              className="text-[10px] uppercase tracking-[0.18em] bg-[#c5a880]/10 text-[#f4ebd0] px-3 py-1.5 rounded-full border border-[#c5a880]/15"
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                          <a
                            href={item.link}
                            className="inline-flex items-center justify-center px-6 py-2.5 text-[10px] uppercase tracking-[0.32em] bg-[#c5a880] text-[#050507] font-semibold rounded-full hover:brightness-110 transition-all duration-300"
                          >
                            View Project
                          </a>
                          <span className="pw-card-counter text-xs uppercase tracking-[0.3em] text-[#f4ebd0]/70 font-mono">
                            {String(idx + 1).padStart(2, "0")} / {String(pastWorkItems.length).padStart(2, "0")}
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

      {/* 3) CHOOSE YOUR EXPERIENCE SECTION */}
      

     
      {/* 6) OUR PROCESS SECTION (NO-IMAGE SECTION: Uses background image with parallax and GSAP reveal overlay) */}
      <section id="about" className="relative py-16 md:py-24 border-t border-b border-[#c5a880]/15 gsap-section-bg overflow-hidden bg-black">
        {/* Background Image */}
        <div className="absolute inset-0 z-0 w-full h-full">
          <Image
            src="/victoria_falls_banner.png"
            alt="Scenic Falls Parallax"
            fill
            className="object-cover gsap-reveal-bg-img pointer-events-none"
            style={{ opacity: 0.2 }}
          />
          <div className="absolute inset-0 bg-black/60 z-10" />
        </div>

        <div className="relative z-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16 gsap-fade-up">
            <span className="text-[10px] tracking-[0.4em] text-[#c5a880] uppercase font-semibold block mb-3">Our Workflow</span>
            <h2 className="text-3xl md:text-5xl font-light text-white font-serif mb-4">Our Process: A Smooth Journey To Your Story</h2>
          </div>

          {/* 4-column timeline */}
          <div className="relative grid grid-cols-1 md:grid-cols-4 gap-8 md:gap-4 gsap-timeline-container">
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
              <div key={idx} className="relative z-10 flex flex-col items-center text-center px-4 gsap-timeline-step">
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

      {/* 7) TESTIMONIALS / CLIENT REACTIONS (NO-IMAGE SECTION: Uses background image with parallax and GSAP reveal overlay) */}
      <section id="clients" className="relative py-16 md:py-24 border-b border-[#c5a880]/15 gsap-section-bg overflow-hidden bg-black">
        {/* Background Image */}
        <div className="absolute inset-0 z-0 w-full h-full">
          <Image
            src="/hero_wedding.png"
            alt="Scenic Falls Parallax"
            fill
            className="object-cover gsap-reveal-bg-img pointer-events-none"
            style={{ opacity: 0.2 }}
          />
          <div className="absolute inset-0 bg-black/60 z-10" />
        </div>

        <div className="relative z-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16 gsap-fade-up">
            <span className="text-[10px] tracking-[0.4em] text-[#c5a880] uppercase font-semibold block mb-3">Client Feedback</span>
            <h2 className="text-3xl md:text-5xl font-light text-white font-serif mb-4">What Our Clients Say</h2>
          </div>

          {/* 2 Testimonial Cards Side by Side */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">

            {/* Testimonial Card 1 */}
            <div className="glass-panel p-8 rounded-3xl border border-[#c5a880]/15 flex flex-col sm:flex-row gap-6 items-start gsap-fade-up">
              <div className="relative w-16 h-16 rounded-full overflow-hidden shrink-0 border border-[#c5a880]/30 shadow-md">
                <Image
                  src="/avatar1.png"
                  alt="Tanya, Bride"
                  fill
                  className="object-cover"
                />
              </div>
              <div className="flex-1 space-y-3">
                <div className="space-y-1">
                  <h4 className="text-lg font-medium text-white leading-tight">Wedding Client</h4>
                  <div className="flex items-center text-[#c5a880]">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-3 h-3 fill-current" />
                    ))}
                  </div>
                </div>
                <p className="text-xs text-[#f4ebd0]/80 leading-relaxed font-light italic">
                  &quot;From the moment we spoke, they made us feel at ease. On the day, they were invisible but captured everything. We treasure our film forever.&quot;
                </p>
                <p className="text-[10px] tracking-widest text-[#c5a880] uppercase font-medium">— Tanya, Bride</p>
              </div>
            </div>

            {/* Testimonial Card 2 */}
            <div className="glass-panel p-8 rounded-3xl border border-[#c5a880]/15 flex flex-col sm:flex-row gap-6 items-start gsap-fade-up">
              <div className="relative w-16 h-16 rounded-full overflow-hidden shrink-0 border border-[#c5a880]/30 shadow-md bg-[#121218] flex items-center justify-center">
                <span className="text-lg font-serif font-bold text-[#c5a880]">JP</span>
              </div>
              <div className="flex-1 space-y-3">
                <div className="space-y-1">
                  <h4 className="text-lg font-medium text-white leading-tight">International Corporate Client</h4>
                  <div className="flex items-center text-[#c5a880]">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-3 h-3 fill-current" />
                    ))}
                  </div>
                </div>
                <p className="text-xs text-[#f4ebd0]/80 leading-relaxed font-light italic">
                  &quot;Communications were fast, clear and professional. The team delivered beyond expectations. Highly recommended for global events.&quot;
                </p>
                <p className="text-[10px] tracking-widest text-[#c5a880] uppercase font-medium">— Jason P., Events Manager</p>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 8) WHY VICTORIA FALLS BANNER SECTION */}
      <section className="relative w-full overflow-hidden py-24 md:py-32 border-b border-[#c5a880]/15">
        {/* Background Scenic Image */}
        <div className="absolute inset-0 z-0 w-full h-full">
          <Image
            src="/victoria_falls_banner.png"
            alt="Scenic view of Victoria Falls"
            fill
            className="object-cover gsap-reveal-bg-img"
            style={{ opacity: 0.15 }}
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#050507] via-[#050507]/90 to-[#050507]/45 z-10" />
          <div className="absolute inset-0 bg-[#050507]/50 z-10" />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 z-20">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">

            {/* Left Column Content */}
            <div className="space-y-6">
              <h2 className="text-4xl md:text-5xl font-light text-white font-serif leading-tight">
                WHY VICTORIA FALLS?<br />
                More than a destination.<br />
                It&apos;s a feeling.
              </h2>

              {/* 2x2 Feature points */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 rounded-full bg-[#c5a880]/15 flex items-center justify-center shrink-0">
                    <Compass className="w-4 h-4 text-[#c5a880]" />
                  </div>
                  <span className="text-[10px] tracking-wider uppercase text-white font-medium">Breathtaking Landscapes</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 rounded-full bg-[#c5a880]/15 flex items-center justify-center shrink-0">
                    <Sun className="w-4 h-4 text-[#c5a880]" />
                  </div>
                  <span className="text-[10px] tracking-wider uppercase text-white font-medium">Unique Light & Atmosphere</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 rounded-full bg-[#c5a880]/15 flex items-center justify-center shrink-0">
                    <Award className="w-4 h-4 text-[#c5a880]" />
                  </div>
                  <span className="text-[10px] tracking-wider uppercase text-white font-medium">Exclusive Destination</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 rounded-full bg-[#c5a880]/15 flex items-center justify-center shrink-0">
                    <Users className="w-4 h-4 text-[#c5a880]" />
                  </div>
                  <span className="text-[10px] tracking-wider uppercase text-white font-medium">Unforgettable Experience</span>
                </div>
              </div>
            </div>

            {/* Right Column Action Overlaid card */}
            <div className="flex flex-col lg:items-end justify-center">
              <div className="glass-panel p-8 rounded-2xl max-w-md border border-[#c5a880]/20 space-y-6 lg:text-left">
                <p className="text-xs text-[#f4ebd0]/70 leading-relaxed font-light">
                  From the roar of the falls to the golden sunsets, Victoria Falls provides the perfect backdrop for stories that last.
                </p>
                <a
                  href="#contact"
                  className="inline-flex items-center justify-center px-6 py-2.5 text-xs uppercase tracking-widest bg-transparent border border-[#c5a880] text-[#c5a880] hover:bg-[#c5a880] hover:text-[#050507] rounded-full transition-all duration-300 font-semibold"
                >
                  Discover the Art
                </a>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 9) FINAL CTA SECTION & FOOTER (NO-IMAGE SECTION: Uses background image with parallax and GSAP reveal overlay) */}
      <section id="contact" className="relative py-20 md:py-28 gsap-section-bg overflow-hidden bg-black">
        {/* Background Image */}
        <div className="absolute inset-0 z-0 w-full h-full">
          <Image
            src="/victoria_falls_banner.png"
            alt="Scenic Falls Parallax"
            fill
            className="object-cover gsap-reveal-bg-img pointer-events-none"
            style={{ opacity: 0.2 }}
          />
          <div className="absolute inset-0 bg-black/60 z-10" />
        </div>

        <div className="relative z-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16 space-y-4 gsap-fade-up">
            <span className="text-[10px] tracking-[0.4em] text-[#c5a880] uppercase font-semibold block">Get In Touch</span>
            <h2 className="text-3xl md:text-5xl font-light text-white font-serif leading-tight">Ready to Create Something Unforgettable?</h2>
            <p className="text-sm text-[#f4ebd0]/70 font-light">
              Let&apos;s bring your vision to life in one of the world&apos;s most extraordinary places.
            </p>
          </div>

          {/* Action Cards Side by Side */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-20 relative">
            {/* OR badge inside center */}
            <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-20 hidden md:flex items-center justify-center w-10 h-10 rounded-full bg-[#050507] border border-[#c5a880] shadow-[0_0_10px_rgba(197,168,128,0.2)]">
              <span className="text-[10px] font-serif text-[#c5a880] uppercase font-semibold">OR</span>
            </div>

            {/* Card 1: Let's Create Your Wedding Story */}
            <div className="glass-panel p-8 md:p-12 rounded-3xl border border-[#c5a880]/20 bg-[#161310]/95 flex flex-col justify-between space-y-8 group transition-all duration-500 hover:shadow-[0_0_20px_rgba(197,168,128,0.15)] gsap-fade-up z-10">
              <div className="space-y-4">
                <div className="w-12 h-12 rounded-full bg-[#c5a880]/15 flex items-center justify-center">
                  <Heart className="w-5 h-5 text-[#c5a880]" />
                </div>
                <h3 className="text-2xl font-light text-white font-serif">Let&apos;s Create Your Wedding Story</h3>
                <p className="text-xs text-[#f4ebd0]/70 leading-relaxed font-light">
                  Tell us your vision and we&apos;ll help craft an unforgettable experience.
                </p>
              </div>
              <div>
                <button
                  onClick={() => alert("Thank you! Wedding Inquiry Form Coming Soon.")}
                  className="w-full sm:w-auto inline-flex items-center justify-center px-6 py-2.5 text-[10px] uppercase tracking-widest bg-[#c5a880] text-[#050507] hover:bg-white transition-colors duration-300 rounded-full font-bold cursor-pointer"
                >
                  Start Planning Your Wedding
                </button>
              </div>
            </div>

            {/* Card 2: Plan Your Next Production */}
            <div className="glass-panel p-8 md:p-12 rounded-3xl border border-violet-500/25 bg-[#120f1a]/95 flex flex-col justify-between space-y-8 group transition-all duration-500 hover:shadow-[0_0_20px_rgba(139,92,246,0.15)] gsap-fade-up z-10">
              <div className="space-y-4">
                <div className="w-12 h-12 rounded-full bg-violet-500/10 flex items-center justify-center">
                  <Briefcase className="w-5 h-5 text-violet-400" />
                </div>
                <h3 className="text-2xl font-light text-white font-serif">Plan Your Next Production</h3>
                <p className="text-xs text-[#f4ebd0]/70 leading-relaxed font-light">
                  Professional coverage and cinematic content tailored to your needs.
                </p>
              </div>
              <div>
                <button
                  onClick={() => alert("Thank you! Event Inquiry Form Coming Soon.")}
                  className="w-full sm:w-auto inline-flex items-center justify-center px-6 py-2.5 text-[10px] uppercase tracking-widest bg-violet-600 text-white hover:bg-violet-500 transition-colors duration-300 rounded-full font-bold cursor-pointer"
                >
                  Plan Your Event Production
                </button>
              </div>
            </div>

          </div>

          {/* Footer */}
          <footer className="pt-16 border-t border-[#c5a880]/15 gsap-fade-up relative z-10">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-10 mb-12">

              {/* Column 1 */}
              <div className="col-span-2 md:col-span-1 space-y-4">
                <div className="flex items-center">
                  <Image
                    src="/mmslogo.webp"
                    alt="MMS Logo"
                    width={130}
                    height={38}
                    className="object-contain"
                  />
                </div>
                <p className="text-xs text-[#f4ebd0]/60 leading-relaxed font-light">
                  Crafting luxury wedding films and world-class event productions across the globe, set in the natural wonder of Victoria Falls.
                </p>
              </div>

              {/* Column 2 */}
              <div className="space-y-4">
                <h4 className="text-xs uppercase tracking-widest text-[#c5a880] font-semibold">Experiences</h4>
                <ul className="space-y-2 text-xs text-[#f4ebd0]/60 font-light">
                  <li><a href="#experiences" className="hover:text-white transition-colors">Destination Weddings</a></li>
                  <li><a href="#experiences" className="hover:text-white transition-colors">Luxury Elopements</a></li>
                  <li><a href="#experiences" className="hover:text-white transition-colors">Corporate Summits</a></li>
                  <li><a href="#experiences" className="hover:text-white transition-colors">Live Streaming Services</a></li>
                </ul>
              </div>

              {/* Column 3 */}
              <div className="space-y-4">
                <h4 className="text-xs uppercase tracking-widest text-[#c5a880] font-semibold">Gallery</h4>
                <ul className="space-y-2 text-xs text-[#f4ebd0]/60 font-light">
                  <li><a href="#gallery" className="hover:text-white transition-colors">Wedding Highlights</a></li>
                  <li><a href="#gallery" className="hover:text-white transition-colors">Corporate Keynotes</a></li>
                  <li><a href="#gallery" className="hover:text-white transition-colors">Scenic Drones</a></li>
                  <li><a href="#gallery" className="hover:text-white transition-colors">Client Work</a></li>
                </ul>
              </div>

              {/* Column 4 */}
              <div className="space-y-4">
                <h4 className="text-xs uppercase tracking-widest text-[#c5a880] font-semibold">Company</h4>
                <ul className="space-y-2 text-xs text-[#f4ebd0]/60 font-light">
                  <li><a href="#about" className="hover:text-white transition-colors">About Our Team</a></li>
                  <li><a href="#about" className="hover:text-white transition-colors">Partnerships</a></li>
                  <li><a href="#contact" className="hover:text-white transition-colors">Contact Us</a></li>
                  <li><a href="#about" className="hover:text-white transition-colors">FAQS</a></li>
                </ul>
              </div>

            </div>

            {/* Bottom Copyright bar */}
            <div className="pt-8 border-t border-[#c5a880]/10 flex flex-col sm:flex-row items-center justify-between text-[11px] text-[#f4ebd0]/40 gap-4">
              <p>© {new Date().getFullYear()} MMS Cinematic Experiences. All rights reserved.</p>
              <div className="flex space-x-6">
                <a href="#" className="hover:text-[#c5a880] transition-colors">Privacy Policy</a>
                <a href="#" className="hover:text-[#c5a880] transition-colors">Terms of Service</a>
              </div>
            </div>
          </footer>
        </div>
      </section>

    </div>
  );
}
