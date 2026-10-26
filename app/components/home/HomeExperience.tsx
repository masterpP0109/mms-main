"use client";

import ProjectBriefBuilder from "./ProjectBriefBuilder";
import SignatureExperiences from "../packages/SignatureExperiences";

import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { useHomeMotion } from "./useHomeMotion";
import { motion, AnimatePresence } from "framer-motion";
import { MessageSquare, Shield, Users, Lock, Play, Video, Award, Star, Quote, ArrowRight, ChevronLeft, ChevronRight, Camera, Megaphone, Palette, Mic, Monitor, Volume2, Zap } from "lucide-react";
import Navbar from "@/app/components/Navbar";
import Footer from "@/app/components/Footer";

export default function Home() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [testimonialSlide, setTestimonialSlide] = useState(0);
  const pageRef = useRef<HTMLDivElement | null>(null);
  const pastWorkRef = useRef<HTMLElement | null>(null);
  const heroTouchStartX = useRef<number | null>(null);
  const workViewportRef = useRef<HTMLDivElement>(null);
  const [workIndex, setWorkIndex] = useState(0);
  const [carouselPaused, setCarouselPaused] = useState(false);


  // Auto-play the hero service categories every 6 seconds.
  useEffect(() => {
    if (carouselPaused || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const timer = window.setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % 5);
    }, 6000);

    return () => window.clearInterval(timer);
  }, [carouselPaused]);

  // Keep normal page content visible by default. GSAP is used only for the
  // navbar entrance and the dedicated horizontal Past Work carousel.
  useHomeMotion(pageRef, pastWorkRef);

  // Hero carousel: the four main MMS service categories from the company profile.
  const slides = [
    {
      image: "/mms/conference%20hero%20img.png",
      imagePosition: "center center",
      title: "Conferences & Corporate Events",
      desc: "From screens and digital displays, to desktop setups and digital podiums with lapels, comprehensive AV solutions for professional conferences and corporate events.",
      btnText: "Explore Conference Solutions",
      link: "/conference-production"
    },
    {
      image: "/mms/audio1.jpg",
      imagePosition: "center center",
      title: "Audio Solutions",
      desc: "Professional PA systems, microphones, conference audio and interpretation technology for clear, reliable communication at every event.",
      btnText: "Explore Audio Solutions",
      link: "#services"
    },
    {
      image: "/mms/media-prodction.jpg.jpeg",
      imagePosition: "center center",
      title: "Media Production",
      desc: "Photography, videography, live streaming, drone filming and podcast production brought together through professional visual storytelling.",
      btnText: "Explore Media Production",
      link: "#services"
    },
    {
      image: "/mms/ledScreens/billo.png",
      imagePosition: "center center",
      title: "Display & Digital Billboard Advertising Solutions",
      desc: "From high-impact indoor LED screens and digital signage to outdoor advertising displays, we provide scalable visual solutions for events, corporate branding, and public-facing promotional campaigns.",
      btnText: "Explore Display & Advertising Solutions",
      link: "#services"
    },
    {
      image: "/mms/special-effects.jpg.jpeg",
      imagePosition: "center center",
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
      image: "/services%20images/5e3c3df339009497f72d40842dd6c19b.jpg",
      alt: "Conference microphones and interpretation booth setup",
      desc: "Professional conference audio, microphone systems and simultaneous interpretation booths for multilingual institutional events, government meetings and international conferences.",
      href: "/services"
    },
    {
      title: "LED Screen Rental",
      icon: Monitor,
      image: "/services%20images/LED%20Screen%20Rental.jpg",
      alt: "Large LED screens and display technology at an event",
      desc: "High-brightness LED screens, video walls and digital displays for conferences, brand activations and outdoor events available in any size with on-site support.",
      href: "/services"
    },
    {
      title: "Professional Sound Systems",
      icon: Volume2,
      image: "/services%20images/Professional%20Sound%20Systems.jpg",
      alt: "Professional sound system and PA setup at an event",
      desc: "Comprehensive PA systems, line arrays, mixing consoles and wireless microphones engineered for clear, reliable sound at every venue size.",
      href: "/services"
    },
    {
      title: "Live Streaming Production",
      icon: Play,
      image: "/services%20images/Live%20Streaming%20Production.jpg",
      alt: "Multi-camera live streaming control setup",
      desc: "Full-service live streaming with multi-camera switching, platform integration, virtual backdrops and real-time graphics for hybrid and virtual events.",
      href: "/services"
    },
    {
      title: "Videography & Photography",
      icon: Camera,
      image: "/services%20images/videography-photography.jpg",
      alt: "Cinematic filming and photography at an event",
      desc: "Cinematic event videography and professional photography from same-day edits and highlight reels to full event archives and brand campaign imagery.",
      href: "/services"
    },
    {
      title: "Drone Packages",
      icon: Video,
      image: "/services%20images/Drone%20Services.jpg",
      alt: "Illustrative image of a drone above a city",
      desc: "Explore aerial photography and videography for events, venues, landscapes and promotional stories. Coverage depends on location, weather and applicable permissions.",
      href: "/services/drone"
    },
    {
      title: "Event Lighting & Stage Setup",
      icon: Zap,
      image: "/mms/DSC_7356.jpg",
      alt: "Event lighting and stage setup at a venue",
      desc: "Complete stage design, theatrical lighting, truss rigging and branded backdrops that transform any venue into a professional production space.",
      href: "/services"
    },
    {
      title: "Interactive Screens",
      icon: Monitor,
      image: "/services%20images/LED%20Screen%20Rental.jpg",
      alt: "Interactive digital displays and touch screens",
      desc: "Interactive digital displays, touch screens and smart podiums that elevate audience engagement — from live polling and Q&A to real-time content integration.",
      href: "/services"
    },
    {
      title: "DJ Services",
      icon: Megaphone,
      image: "/services%20images/Professional%20Sound%20Systems.jpg",
      alt: "Professional DJ and entertainment services",
      desc: "Professional DJ services with state-of-the-art sound systems, lighting integration and music curation for weddings, corporate events and celebrations.",
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
    if (carouselPaused || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const timer = setInterval(() => {
      setTestimonialSlide((prev) => (prev === testimonials.length - 1 ? 0 : prev + 1));
    }, 5000);
    return () => clearInterval(timer);
  }, [testimonials.length, carouselPaused]);

  const primaryButton = "mms-button group";

  return (
    <div ref={pageRef} className="mms-page min-h-screen bg-[#050507] text-brand-foreground font-sans selection:bg-brand-primary selection:text-white">

      {/* 1) TOP NAVIGATION BAR & HERO SECTION */}
      <header id="home" className="relative w-full z-40">
        <Navbar />

        {/* Hero Carousel Section - offset for fixed navbar */}
        <div
          className="home-hero relative w-full overflow-hidden bg-black flex items-center justify-center z-10"
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
                loading="eager"
                fetchPriority={currentSlide === 0 ? "high" : "auto"}
              />
            </motion.div>
          </AnimatePresence>

          {/* Keep contrast consistent across every image and slide transition. */}
          <div aria-hidden="true" className="absolute inset-0 z-10 pointer-events-none bg-black/65">
            <div className="absolute inset-0 bg-gradient-to-r from-black/35 to-transparent" />
            <div className="absolute inset-0 bg-gradient-to-t from-[#050507]/60 via-transparent to-transparent" />
          </div>

          {/* Slide Text Content - Left Aligned with Shade */}
          <div className="relative z-30 w-full h-full flex items-center pointer-events-none">
            <div className="w-full max-w-[1600px] mx-auto px-10 md:px-14 lg:px-20 xl:pl-24 2xl:pl-28 flex justify-start">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentSlide}
                initial={{ opacity: 0, x: -40 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 40 }}
                transition={{ duration: 0.8, delay: 0.2 }}
                className="space-y-5 max-w-2xl xl:max-w-3xl relative z-20"
              >
                <h1 className="text-[clamp(1.875rem,5vw,3.75rem)] font-semibold text-white font-heading leading-[1.05] gsap-heading drop-shadow-[0_2px_10px_rgba(0,0,0,0.45)]">
                  {slides[currentSlide].title}
                </h1>

                <p className="text-sm xl:text-base text-white tracking-wide font-normal leading-relaxed max-w-lg gsap-copy drop-shadow-[0_1px_6px_rgba(0,0,0,0.45)]">
                  {slides[currentSlide].desc}
                </p>

                <div className="pt-6 gsap-action pointer-events-auto flex flex-col sm:flex-row sm:items-center gap-3">
                  <a
                    href={slides[currentSlide].link}
                    data-lead-cta
                    className={`${primaryButton} px-6 py-3 text-[10px] uppercase tracking-[0.1em] premium-button`}
                  >
                    <span className="relative z-10">{slides[currentSlide].btnText}</span>
                    <ArrowRight className="relative z-10 ml-2 h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
                  </a>
                  <a
                    href="#contact"
                    className="inline-flex items-center justify-center rounded-full border border-white/30 bg-black/25 px-6 py-3 text-[10px] font-semibold uppercase tracking-[0.1em] text-white backdrop-blur-sm transition-all duration-300 hover:border-brand-accent hover:bg-brand-accent/10 hover:text-brand-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-accent"
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
            className="hero-arrow hero-arrow-prev absolute left-3 sm:left-6 lg:left-8 z-40 p-2.5 sm:p-3 rounded-full border border-brand-accent/45 bg-black/35 text-white backdrop-blur-md shadow-[0_0_18px_rgba(253,164,175,0.16)] hover:bg-brand-accent hover:text-[#050507] hover:border-brand-accent hover:shadow-[0_0_28px_rgba(253,164,175,0.55)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-accent transition-all duration-300 cursor-pointer"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button
            type="button"
            aria-label="Next hero slide"
            onClick={() => setCurrentSlide((prev) => (prev + 1) % slides.length)}
            className="hero-arrow hero-arrow-next absolute right-3 sm:right-6 lg:right-8 z-40 p-2.5 sm:p-3 rounded-full border border-brand-accent/45 bg-black/35 text-white backdrop-blur-md shadow-[0_0_18px_rgba(253,164,175,0.16)] hover:bg-brand-accent hover:text-[#050507] hover:border-brand-accent hover:shadow-[0_0_28px_rgba(253,164,175,0.55)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-accent transition-all duration-300 cursor-pointer"
          >
            <ChevronRight className="w-5 h-5" />
          </button>

          {/* Dots Indicator */}
          <div className="hero-dots absolute bottom-7 left-0 w-full z-30 px-6">
            <div className="mx-auto flex max-w-xl items-center justify-center gap-2 sm:gap-3">
              <span className="hidden sm:inline text-xs font-mono tracking-[0.22em] text-brand-foreground/55">
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
                    className={`carousel-dot ${idx === currentSlide ? "is-current" : ""}`}
                  />
                ))}
              </div>
              <span className="hidden sm:inline text-xs font-mono tracking-[0.22em] text-brand-foreground/55">
                {String(slides.length).padStart(2, "0")}
              </span>
            </div>
          </div>
        </div>
      </header>

      {/* Inserted homepage copy removed — conference section will follow Services below */}

      {/* 2) TRUST / VALUE ICON STRIP (NO-IMAGE SECTION: Uses background image with parallax and GSAP reveal overlay) */}
      <section style={{ opacity: 1, visibility: "visible" }} className="trust-strip relative -mt-4 z-30 max-w-[1600px] mx-auto mms-wide-gutter overflow-hidden rounded-3xl border border-brand-accent/20 shadow-2xl bg-black">
        {/* Parallax Background Image */}
        <div className="absolute inset-0 z-0 w-full h-full">
          <Image
            src="/mms/Zambia-Zimbabwe-Victoria-Falls-Impressive-View-1.jpg"
            alt="MMS Partners Background"
            fill sizes="100vw"
            className="object-cover object-center pointer-events-none"
            style={{ opacity: 0.35 }}
          />
          <div className="absolute inset-0 bg-black/40 z-10" />
        </div>

        <div className="relative z-20 p-5 sm:p-8 md:p-10">
          {/* Icon Row */}
          <div data-stagger className="grid grid-cols-1 min-[360px]:grid-cols-2 md:grid-cols-4 gap-4 md:gap-4 text-center items-stretch">
            {/* Item 1 */}
            <div className="flex flex-col items-center justify-center p-3 pt-6 md:p-0">
              <MessageSquare className="w-6 h-6 text-brand-accent mb-3" />
              <p className="text-xs tracking-[0.15em] text-brand-accent uppercase font-semibold mb-1">24hr</p>
              <p className="text-base text-white font-medium">Avg. Response Time</p>
            </div>
            {/* Item 2 */}
            <div className="flex flex-col items-center justify-center p-3 pt-6 md:p-0">
              <Shield className="w-6 h-6 text-brand-accent mb-3" />
              <p className="text-xs tracking-[0.15em] text-brand-accent uppercase font-semibold mb-1">Your Location</p>
              <p className="text-base text-white font-medium">Our Starting Point</p>
            </div>
            {/* Item 3 */}
            <div className="flex flex-col items-center justify-center p-3 pt-6 md:p-0">
              <Users className="w-6 h-6 text-brand-accent mb-3" />
              <p className="text-xs tracking-[0.15em] text-brand-accent uppercase font-semibold mb-1">Trusted by Tourism</p>
              <p className="text-base text-white font-medium">& Corporate Brands</p>
            </div>
            {/* Item 4 */}
            <div className="flex flex-col items-center justify-center p-3 pt-6 md:p-0">
              <Lock className="w-6 h-6 text-brand-accent mb-3" />
              <p className="text-xs tracking-[0.15em] text-brand-accent uppercase font-semibold mb-1">Secure Payments</p>
              <p className="text-base text-white font-medium">100% Protected</p>
            </div>
          </div>

          {/* Logo Row */}

        </div>
      </section>

      {/* 2a) ABOUT US SECTION */}
      <section className="relative pt-6 md:pt-8 pb-8 md:pb-12 bg-[#050507]">
        <div className="max-w-[1600px] mx-auto mms-wide-gutter">
          <div data-stagger className="flex flex-col lg:flex-row gap-12 lg:gap-16 items-start">
            {/* Left — Text + CTA */}
            <div className="w-full lg:w-[45%] space-y-6">
            <span className="text-xs tracking-[0.4em] text-brand-accent uppercase font-semibold block">About Mosi Media Solutions</span>
            <h2 className="text-3xl md:text-5xl font-semibold text-white leading-tight font-heading">Experience <span className="text-brand-red">Elevated</span></h2>
              <p className="text-sm md:text-base text-brand-foreground/70 leading-relaxed font-light">
                Mosi Media Solutions is a dynamic multimedia production and event technology company that delivers high quality visual, audio, and digital solutions for corporate events, conferences, social functions, and advertising platforms.
              </p>
              <p className="text-sm md:text-base text-brand-foreground/70 leading-relaxed font-light">
                We combine creativity with cutting edge technology to create immersive experiences that elevate events and brands. Our services are tailored to meet each client’s unique needs, ensuring professionalism, reliability, and exceptional delivery.
              </p>
              <div className="pt-2">
                <Link
                  href="/about"
                  className="mms-button inline-flex items-center justify-center px-6 py-2.5 text-xs uppercase tracking-widest font-semibold rounded-full transition-all duration-300 premium-button"
                >
                  Learn More About Us
                </Link>
              </div>
            </div>

            {/* Right — Text list */}
            <div className="w-full lg:w-[55%] lg:pt-[42px]">
              <div className="flex flex-col gap-4">
                {[
                  { title: "Trusted", desc: "We build lasting relationships through professionalism and dependable service.", icon: Shield },
                  { title: "Creative", desc: "Ideas shaped around your audience, brand and objectives.", icon: Palette },
                  { title: "Reliable", desc: "Professional execution from planning through delivery.", icon: Award },
                  { title: "Innovative", desc: "Cutting-edge technology and creative solutions that push boundaries.", icon: Zap },
                ].map((card) => (
                  <div
                    key={card.title}
                    className="flex items-center gap-4 group transition-all duration-200"
                  >
                    <div className="flex-shrink-0 w-8 h-8 rounded-full border border-brand-accent/20 bg-[#050507] flex items-center justify-center">
                      <card.icon className="w-4 h-4 text-brand-accent" />
                    </div>
                    <div className="flex-1">
                      <h4 className="text-lg font-medium text-white mb-0.5">{card.title}</h4>
                      <p className="text-base text-brand-foreground/55 leading-normal font-light">{card.desc}</p>
                    </div>
                    <ArrowRight className="flex-shrink-0 w-3.5 h-3.5 text-brand-accent opacity-40 group-hover:opacity-100 group-hover:translate-x-1 transition-all duration-200" />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2b) OUR SERVICES SECTION */}
      <section id="services" className="relative pt-8 md:pt-12 pb-16 md:pb-24 bg-[#050507]">
        <div className="max-w-[1600px] mx-auto mms-wide-gutter">
          <div data-reveal className="text-center mb-12 md:mb-16">
            <span className="text-base tracking-[0.4em] text-brand-accent uppercase font-semibold block mb-3 font-heading">What We Offer</span>
            <h2 className="text-3xl md:text-5xl font-semibold text-white font-heading mb-4">Our Services</h2>
            <p className="text-lg md:text-xl text-brand-foreground/70 font-light max-w-xl mx-auto">
              From media production and live broadcasting to professional audio, screen technology and event enhancements, MMS delivers the creative and technical solutions needed to bring every experience to life.
            </p>
          </div>

          <div data-stagger className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-10">
            {services.slice(0, 6).map((service) => (
              <Link key={service.title} href={service.href} data-lift className="group min-w-0 flex flex-col rounded-2xl" aria-label={`Learn more about ${service.title}`}>
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
                    <div className="w-10 h-10 rounded-full border border-brand-accent/20 bg-[#050507] flex items-center justify-center">
                      <service.icon className="w-5 h-5 text-brand-accent" />
                    </div>
                  </div>
                </div>
                <h3 className="text-center text-2xl font-semibold text-white font-heading mb-2">{service.title}</h3>
                <p className="text-center text-lg text-brand-foreground/60 leading-relaxed font-light mb-4">
                  {service.desc}
                </p>
                <div className="text-center mt-auto">
                  <span
                    className="inline-flex items-center text-xs uppercase tracking-widest text-brand-accent hover:text-white transition-colors duration-200"
                  >
                    Learn More
                    <ArrowRight className="ml-2 w-3.5 h-3.5 transition-transform duration-200 group-hover:translate-x-1" />
                  </span>
                </div>
              </Link>
            ))}
          </div>

          <div className="mt-12 text-center">
            <Link
              href="/services"
              className="mms-button inline-flex items-center justify-center gap-2 px-6 py-2.5 text-xs uppercase tracking-widest"
            >
              Explore All Services
            </Link>
          </div>
        </div>
      </section>



      {/* 5) STORIES THAT BECAME MEMORIES SECTION - HORIZONTAL WHEEL CAROUSEL */}
      <SignatureExperiences />
      <section
        style={{ opacity: 1, visibility: "visible" }}
        id="gallery"
        ref={pastWorkRef}
        className="past-work-section relative w-full bg-[#050507] isolation-isolate z-10"
      >
        <div className="past-work-pin relative w-full bg-[#050507]">
          <div className="past-work-heading z-20 text-center">
            <span className="pw-eyebrow text-[12px] uppercase tracking-[0.28em] text-brand-accent font-semibold block mb-4 font-heading">
              OUR FEATURED WORK
            </span>
            <div className="overflow-hidden">
              <h2 className="pw-heading-line text-3xl md:text-5xl leading-[0.98] md:leading-[1.02] font-semibold text-white tracking-tight font-heading">
                Stories That Became Memories
              </h2>
            </div>
            <p className="pw-supporting mt-6 mx-auto max-w-[520px] text-sm md:text-base text-brand-foreground/70 leading-7">
              A selection of weddings, corporate productions and immersive experiences brought to life through cinematic storytelling.
            </p>
          </div>

          <div className="past-work-viewport" ref={workViewportRef} tabIndex={0} role="region" aria-label="Featured projects, swipe or use arrow keys" onScroll={(event) => { const cards = event.currentTarget.querySelectorAll<HTMLElement>(".pw-card"); const left = event.currentTarget.getBoundingClientRect().left; let closest = 0; let distance = Infinity; cards.forEach((card, index) => { const delta = Math.abs(card.getBoundingClientRect().left - left - 16); if (delta < distance) { distance = delta; closest = index; } }); setWorkIndex(closest); }}>
            <div className="past-work-track">
              {pastWorkItems.map((item, idx) => (
                <div
                  key={idx}
                  className="pw-card relative flex-shrink-0 rounded-[30px] border border-brand-accent/10 bg-[#050507] shadow-[0_35px_100px_rgba(0,0,0,0.65),0_10px_35px_rgba(0,0,0,0.45)] overflow-hidden will-change-transform"
                  style={{ transformStyle: "preserve-3d" }}
                >
                  <div className="pw-card-inner relative rounded-[30px]">
                    <div className="pw-card-image relative overflow-hidden">
                      <Image
                        src={item.image}
                        alt={item.title}
                        fill sizes="(max-width:767px) calc(100vw - 32px), (max-width:1279px) 55vw, 36vw"
                        className="object-cover object-center"
                        style={{ transform: "scale(1.05)" }}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-[#050507]/45 via-transparent to-transparent" />
                    </div>
                    <div className="pw-card-content relative z-10 flex flex-1 flex-col justify-between p-6 lg:p-8 bg-[#050507]">
                      <div className="space-y-3">
                        <span className="text-xs uppercase tracking-[0.28em] text-brand-accent font-semibold block font-heading">
                          {item.category}
                        </span>
                        <h3 className="text-2xl md:text-3xl font-semibold text-white font-heading leading-tight">
                          {item.title}
                        </h3>
                        <p className="text-xs md:text-sm text-brand-foreground/70 leading-relaxed font-light max-w-xl">
                          {item.desc}
                        </p>
                      </div>
                      <div className="mt-5 flex flex-wrap items-center gap-3">
                        <div className="flex flex-wrap gap-2">
                          {item.tags.map((tag) => (
                            <span
                              key={tag}
                              className="text-xs uppercase tracking-[0.18em] bg-brand-accent/10 text-brand-foreground px-2.5 py-1 rounded-full border border-brand-accent/15"
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                        <div className="flex items-center gap-3 sm:ml-auto">
                          <a
                            href={item.link}
                            className="inline-flex items-center justify-center px-5 py-2.5 text-xs uppercase tracking-[0.32em] bg-brand-accent text-[#050507] font-semibold rounded-full hover:brightness-110 transition-all duration-300"
                          >
                            View Project
                          </a>
                          <span className="pw-card-counter text-xs uppercase tracking-[0.3em] text-brand-foreground/70 font-heading">
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

          <div className="work-controls flex items-center justify-center gap-5 mt-6">
            <button type="button" aria-label="Previous featured project" disabled={workIndex === 0} onClick={() => { const viewport = workViewportRef.current; if (viewport) viewport.scrollBy({ left: -viewport.clientWidth, behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "instant" : "smooth" }); }} className="rounded-full border border-brand-accent/30 p-3 disabled:opacity-30"><ChevronLeft /></button>
            <span className="text-sm text-brand-accent" aria-live="polite">{workIndex + 1} / {pastWorkItems.length}</span>
            <button type="button" aria-label="Next featured project" disabled={workIndex === pastWorkItems.length - 1} onClick={() => { const viewport = workViewportRef.current; if (viewport) viewport.scrollBy({ left: viewport.clientWidth, behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "instant" : "smooth" }); }} className="rounded-full border border-brand-accent/30 p-3 disabled:opacity-30"><ChevronRight /></button>
          </div>
          <div className="past-work-progress">
            <div className="relative h-1 rounded-full bg-white/10 overflow-hidden">
              <div className="progress-fill absolute inset-0 origin-left scale-x-0 bg-brand-accent" />
            </div>
          </div>
        </div>
      </section>

      {/* 3) INTERACTIVE BUILDER: PLAN YOUR PROJECT */}

    {/* 6) OUR PROCESS SECTION (NO-IMAGE SECTION: Uses background image with parallax and GSAP reveal overlay) */}
      <section style={{ opacity: 1, visibility: "visible" }} id="about" className="relative py-16 md:py-24 border-t border-b border-brand-accent/15 overflow-hidden bg-black">
        {/* Background Image */}
        <div className="absolute inset-0 z-0 w-full h-full">
          <Image
            src="/victoria_falls_banner.png"
            alt="Scenic Falls Parallax"
            fill sizes="100vw"
            className="object-cover object-center pointer-events-none"
            style={{ opacity: 0.3 }}
          />
          <div className="absolute inset-0 bg-black/40 z-10" />
        </div>

        <div className="relative z-20 max-w-[1600px] mx-auto mms-wide-gutter">
          <div data-reveal className="text-center mb-16">
            <span className="text-base tracking-[0.4em] text-brand-accent uppercase font-semibold block mb-3 font-heading">Our Workflow</span>
            <h2 className="text-4xl md:text-6xl font-semibold text-white font-heading mb-4">Our Process: A Smooth Journey To Your Story</h2>
          </div>

          {/* 4-column timeline */}
          <div data-stagger className="process-timeline relative grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 md:gap-4">
            {/* Connector Line (Desktop Only) */}
            <div className="absolute top-12 left-[12%] right-[12%] h-[1px] bg-gradient-to-r from-brand-accent/10 via-brand-accent/30 to-brand-accent/10 z-0 hidden lg:block" />

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
                <div className="w-16 h-16 rounded-full bg-[#050507] border border-brand-accent/30 flex items-center justify-center mb-6 shadow-xl relative group-hover:border-brand-accent transition-colors duration-300">
                  <span className="text-xl font-semibold text-brand-accent font-heading">{item.step}</span>
                </div>
                <h3 className="text-xl font-medium text-white mb-2">{item.title}</h3>
                <p className="text-base text-brand-foreground/70 leading-relaxed font-light">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 7) TESTIMONIALS / CLIENT REACTIONS */}
      <section style={{ opacity: 1, visibility: "visible" }} id="clients" className="relative py-16 md:py-24 border-b border-brand-accent/15 overflow-hidden bg-black">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-[#1a1510]/60 via-[#050507] to-[#050507] z-0" />

        <div className="relative z-20 max-w-[1600px] mx-auto mms-wide-gutter">
          <div data-reveal className="text-center mb-16">
            <span className="text-xs tracking-[0.4em] text-brand-accent uppercase font-semibold block mb-3 font-heading">Client Feedback</span>
            <h2 className="text-3xl md:text-5xl font-semibold text-white font-heading mb-4">What Our Clients Say</h2>
          </div>

          <div className="flex justify-center mb-4"><button type="button" aria-pressed={carouselPaused} onClick={() => setCarouselPaused(!carouselPaused)} className="text-xs text-brand-accent px-4 py-2 rounded-full border border-brand-accent/30">{carouselPaused ? "Resume slides" : "Pause slides"}</button></div>
          {/* Testimonial Carousel */}
          <div className="relative max-w-3xl mx-auto">
            <AnimatePresence mode="wait">
                <motion.div
                  key={testimonialSlide}
                  initial={{ opacity: 0, y: 50, scale: 0.96 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -50, scale: 0.96 }}
                  transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                  className="bg-[#050507] p-5 sm:p-8 md:p-12 rounded-3xl border border-brand-accent/10 relative overflow-hidden"
                >
                <Quote className="absolute top-6 left-6 w-10 h-10 text-brand-accent/15" />

                <div className="flex flex-col items-center text-center space-y-6 relative z-10">
                  <div className="flex items-center text-brand-accent space-x-1">
                    {[...Array(testimonials[testimonialSlide].rating)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-current" />
                    ))}
                  </div>

                  <p className="text-xl md:text-2xl text-brand-foreground/90 leading-relaxed font-light italic">
                    {`"${testimonials[testimonialSlide].content}"`}
                  </p>

                  <div className="flex flex-col items-center space-y-2 pt-2">
                    <div className="w-16 h-16 rounded-full overflow-hidden border border-brand-accent/30 shadow-md">
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
                          <span className="text-2xl font-bold text-brand-accent font-heading">JP</span>
                        </div>
                      )}
                    </div>
                    <div className="space-y-1">
                      <h4 className="text-xl font-medium text-white">{testimonials[testimonialSlide].name}</h4>
                      <p className="text-sm tracking-widest text-brand-accent uppercase font-medium">{testimonials[testimonialSlide].role}</p>
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
                className="p-2.5 rounded-full border border-brand-accent/30 text-brand-accent hover:bg-brand-accent hover:text-[#050507] hover:border-transparent transition-all duration-300 cursor-pointer"
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
                    className={`carousel-dot ${idx === testimonialSlide ? "is-current" : ""}`}
                  />
                ))}
              </div>

              <button
                type="button"
                aria-label="Next testimonial"
                onClick={() => setTestimonialSlide((prev) => (prev === testimonials.length - 1 ? 0 : prev + 1))}
                className="p-2.5 rounded-full border border-brand-accent/30 text-brand-accent hover:bg-brand-accent hover:text-[#050507] hover:border-transparent transition-all duration-300 cursor-pointer"
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
            fill sizes="100vw"
            className="object-cover object-center pointer-events-none"
            style={{ opacity: 0.3 }}
          />
          <div className="absolute inset-0 bg-black/50 z-10" />
        </div>

        <div className="relative z-20 max-w-[1600px] mx-auto mms-wide-gutter">
          <div data-reveal className="text-center max-w-2xl mx-auto mb-10 space-y-3">
            <span className="text-base tracking-[0.4em] text-brand-accent uppercase font-semibold block font-heading">Get In Touch</span>
            <h2 className="text-3xl md:text-5xl font-semibold text-white font-heading leading-tight">Ready to Create Something Unforgettable?</h2>
            <p className="text-base text-brand-foreground/70 font-light">
              Let&apos;s bring your vision to life. Start with a free discovery call and tell us what you need for a custom quote.
            </p>
          </div>

          <ProjectBriefBuilder />
        </div>
      </section>

      <Footer />

      {/* Persistent CTA */}
      <Link href="/conference-production#enquiry" className="mms-button persistent-cta fixed z-30 inline-flex items-center px-4 py-2.5 rounded-full font-semibold text-[10px] shadow-lg">Plan Your Conference</Link>

    </div>
  );
}
