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
  Quote,
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  Camera,
  Megaphone,
  Palette,
  PenTool,
  Menu,
  X
} from "lucide-react";

export default function Home() {
  const [loading, setLoading] = useState(true);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [conferenceSlide, setConferenceSlide] = useState(0);
  const [cinematicSlide, setCinematicSlide] = useState(0);
  const [testimonialSlide, setTestimonialSlide] = useState(0);
  const pastWorkRef = useRef<HTMLElement | null>(null);
  const navbarRef = useRef<HTMLDivElement | null>(null);
  const [activeNav, setActiveNav] = useState("Home");
  const [mobileOpen, setMobileOpen] = useState(false);
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

  // Auto-play Hero carousel every 6 seconds
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev === 2 ? 0 : prev + 1));
    }, 6000);
    return () => clearInterval(timer);
  }, []);

  // Close mobile menu on desktop resize
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) setMobileOpen(false);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Navbar mouse follow tilt
  const handleNavMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!navbarRef.current) return;
    const rect = navbarRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    const rotateX = ((y - centerY) / centerY) * -0.5;
    const rotateY = ((x - centerX) / centerX) * 0.5;
    navbarRef.current.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
  };

  const handleNavMouseLeave = () => {
    if (!navbarRef.current) return;
    navbarRef.current.style.transform = `perspective(1000px) rotateX(0deg) rotateY(0deg)`;
  };

  // Initialize GSAP ScrollTrigger Animations
  useLayoutEffect(() => {
    if (typeof window !== "undefined") {
      gsap.registerPlugin(ScrollTrigger);

      // Navbar entrance animation
      const navbar = document.querySelector(".gsap-nav-entrance");
      if (navbar) {
        gsap.fromTo(
          navbar,
          { opacity: 0, y: -20 },
          {
            opacity: 1,
            y: 0,
            duration: 0.7,
            ease: "power2.out",
            delay: 0.2,
          }
        );
      }

      // GSAP Reveal for card/scenic background images (increases opacity from 0.15 to 0.5 on scroll)
      gsap.utils.toArray<HTMLElement>(".gsap-reveal-bg-img").forEach((img) => {
        const triggerEl = img.closest("section") || img.closest(".group") || img;
        gsap.fromTo(img,
          { opacity: 0.15 },
          {
            opacity: 0.5,
            duration: 1.5,
            ease: "power2.out",
            scrollTrigger: {
              trigger: triggerEl,
              start: "top 80%",
              once: true
            }
          }
        );
      });

      // GSAP Reveal for custom video thumbnails (increases from 0.3 to 0.65)
      gsap.utils.toArray<HTMLElement>(".gsap-reveal-image").forEach((img) => {
        gsap.fromTo(img,
          { opacity: 0.3 },
          {
            opacity: 0.65,
            duration: 1.5,
            ease: "power2.out",
            scrollTrigger: {
              trigger: img,
              start: "top 85%",
              once: true
            }
          }
        );
      });

      // Animate Hero side background images slightly on load
      gsap.fromTo(".gsap-hero-bg-left",
        { opacity: 0.3 },
        { opacity: 0.65, duration: 2.0, ease: "power2.out" }
      );
      gsap.fromTo(".gsap-hero-bg-right",
        { opacity: 0.3 },
        { opacity: 0.6, duration: 2.0, ease: "power2.out" }
      );

      // GSAP Section enter animation
      gsap.utils.toArray<HTMLElement>(".gsap-section-bg").forEach((sec) => {
        gsap.fromTo(sec,
          { y: 25 },
          {
            y: 0,
            duration: 1,
            ease: "power3.out",
            scrollTrigger: {
              trigger: sec,
              start: "top 85%",
              end: "bottom top",
              once: true,
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
          ".gsap-button",
          ".gsap-bento-card"
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
                once: true,
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
            once: true
          }
        }
      );

      // Horizontal "wheel" carousel for Past Work
      let pastWorkCtx: gsap.Context | undefined;
      const section = pastWorkRef?.current;
      if (section) {
        pastWorkCtx = gsap.context(() => {
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

        return () => pastWorkCtx?.revert();
      }

      window.addEventListener("load", () => {
        ScrollTrigger.refresh();
      });

      // Timeline steps bounce/reveal animation
    }
  }, []);

  useEffect(() => {
    if (typeof window !== "undefined") {
      ScrollTrigger.refresh();
    }
  }, []);

  // Slides configuration
  const slides = [
    {
      image: "/mms/wedding1.jpg",
      tag: "Weddings & Elopements",
      title: "Your Love Story, Beautifully Told.",
      desc: "We capture every glance, every laugh, every tear that makes your day yours , a cinematic love story you'll treasure forever.",
      btnText: "Begin Your Story",
      link: "#weddings-experience"
    },
    {
      image: "/mms/DSC_7906.jpg",
      tag: "Conferences & Live Storytelling",
      title: "Events That Spark Genuine Connection.",
      desc: "From large screens and podcast capture to digital podiums and brand briefs, we create conferences that feel emotional, cinematic and unforgettable.",
      btnText: "Start Your Epic Event Journey",
      link: "#corporate-experience"
    },
    {
      image: "/mms/DSC_8497.jpg",
      tag: "Brand Storytelling",
      title: "Where Moments Become Movies — Live, Cinematic, Unforgettable.",
      desc: "We turn events into emotional experiences, powered by world-class equipment, social amplification, and stunning cinematic craft.",
      btnText: "Build Your Project",
      link: "#builder"
    }
  ];

  // Conference & Cinematic slides (for separate carousels)
  const conferenceSlides = [
    {
      image: "/mms/the_Conference_Hall_of_the_Federal_Tax_Service_1.jpg",
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
      image: "/mms/IMG_9198.jpeg",
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
      image: "/mms/OEM-ODM-86-Inch-Business-Meeting-Presentation-Interactive-LED-Touch-Screen-Monitor-White-Board.jpg",
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
      image: "/mms/creative-designer-photographer-workspace-desk-setup-free-photo.webp",
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
      image: "/mms/videographer-2.webp",
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
      image: "/mms/African-Distillers-e1768319604563.webp",
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

  const testimonials = [
    {
      name: "Tanya, Bride",
      role: "Wedding Client",
      content: "From the moment we spoke, they made us feel at ease. On the day, they were invisible but captured everything. We treasure our film forever.",
      avatar: "/mms/videographer-2.webp",
      rating: 5
    },
    {
      name: "Jason P.",
      role: "International Corporate Client, Events Manager",
      content: "Communications were fast, clear and professional. The team delivered beyond expectations. Highly recommended for global events.",
      avatar: null,
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
      name: "David K.",
      role: "Brand Marketing Director",
      content: "They transformed our product launch into a visual story that still gets compliments months later. Truly world-class production.",
      avatar: null,
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
      title: "Visual Storytelling",
      image: "/mms/wedding1.jpg",
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
      image: "/mms/the_Conference_Hall_of_the_Federal_Tax_Service_1.jpg",
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
      image: "/mms/DSC_7504.jpg",
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
      image: "/mms/_DSC7098.jpg",
      category: "Wedding Film",
      title: "Victoria Falls Wedding Film",
      desc: "An emotional, intimate film captured across waterfall light and golden celebration.",
      tags: ["Cinematography", "Editing", "Color Grading"],
      link: "#gallery"
    },
    {
      image: "/mms/the_Conference_Hall_of_the_Federal_Tax_Service_1.jpg",
      category: "Live Production",
      title: "Global Summit Production",
      desc: "A fully produced conference experience with multiple screens, live streaming and branded stages.",
      tags: ["Event Production", "Live Streaming", "AV Staging"],
      link: "#gallery"
    },
    {
      image: "/mms/creative-designer-photographer-workspace-desk-setup-free-photo.webp",
      category: "Brand Campaign",
      title: "Corporate Event Experience",
      desc: "Interactive screens, digital podiums and branded media that kept guests engaged throughout.",
      tags: ["Brand Strategy", "Motion Design", "Content Creation"],
      link: "#gallery"
    },
    {
      image: "/mms/Victoria-Falls-Video-Conference-Hire.webp",
      category: "Corporate Event",
      title: "Luxury Brand Campaign",
      desc: "Creative ads, motion design and polished visuals for a launch that moved audiences across channels.",
      tags: ["Corporate Events", "Digital Displays", "Live Capture"],
      link: "#gallery"
    },
    {
      image: "/mms/Zambia-Zimbabwe-Victoria-Falls-Impressive-View-1.jpg",
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

  useEffect(() => {
    const timer = setInterval(() => {
      setTestimonialSlide((prev) => (prev === testimonials.length - 1 ? 0 : prev + 1));
    }, 5000);
    return () => clearInterval(timer);
  }, [testimonials.length]);

  return (
    <div className="min-h-screen bg-[#050507] text-[#f4ebd0] overflow-x-hidden font-sans selection:bg-[#b48a3d] selection:text-[#050507]">

      {/* 1) TOP NAVIGATION BAR & HERO SECTION */}
      <header className="relative w-full z-50">

        {/* Navigation Bar - Liquid Glass Pill */}
        <nav className="fixed top-6 left-1/2 -translate-x-1/2 z-50 gsap-nav-entrance">
          <div
            ref={navbarRef}
            className="glass-navbar-wrapper"
            onMouseMove={handleNavMouseMove}
            onMouseLeave={handleNavMouseLeave}
          >
            <div className="glass-navbar flex items-center gap-3 rounded-full pl-6 pr-5 py-3.5">
              {/* Logo */}
              <a href="#" className="relative z-10 flex items-center logo-glow" style={{ minWidth: 140 }}>
                <Image
                  src="/mmslogo.webp"
                  alt="MMS Logo"
                  width={140}
                  height={38}
                  className="object-contain"
                  priority
                />
              </a>

              {/* Divider */}
              <div className="w-px h-7 bg-white/20 mx-2" />

              {/* Nav Links */}
              <div className="hidden md:flex items-center gap-2">
                {["Home", "Services", "Builder", "Gallery", "About", "Clients", "Contact"].map((item) => (
                  <a
                    key={item}
                    href={`#${item.toLowerCase()}`}
                    onClick={() => setActiveNav(item)}
                    className={`nav-item relative px-5 py-2.5 text-xs uppercase tracking-widest ${
                      activeNav === item ? "active text-white" : "text-[#f4ebd0]/70 hover:text-white"
                    }`}
                  >
                    {activeNav === item && (
                      <motion.div
                        layoutId="nav-pill"
                        className="absolute inset-0 rounded-full"
                        style={{ background: "rgba(255,255,255,0.12)" }}
                        transition={{ type: "spring", stiffness: 300, damping: 30 }}
                      />
                    )}
                    <span className="relative z-10">{item}</span>
                  </a>
                ))}
              </div>

              {/* CTA Button */}
              <a
                href="#contact"
                className="relative z-10 ml-4 inline-flex items-center justify-center px-7 py-2.5 text-[10px] uppercase tracking-widest bg-gradient-to-r from-[#b48a3d] to-[#c5a880] text-[#050507] font-semibold rounded-full hover:brightness-110 transition-all duration-300"
              >
                Get a Quote
              </a>

              {/* Mobile Menu Button */}
              <button
                className="nav-icon-btn md:hidden relative z-10 p-3 text-white ml-2"
                onClick={() => setMobileOpen(!mobileOpen)}
                aria-label="Toggle menu"
              >
                {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>

          {/* Mobile Menu Dropdown */}
          <AnimatePresence>
            {mobileOpen && (
              <motion.div
                initial={{ opacity: 0, y: -8, scale: 0.96 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -8, scale: 0.96 }}
                transition={{ duration: 0.25, ease: "easeOut" }}
                className="md:hidden mt-2 mobile-menu-glass rounded-2xl p-4 flex flex-col gap-2"
              >
                {["Home", "Services", "Builder", "Gallery", "About", "Clients", "Contact"].map((item) => (
                  <a
                    key={item}
                    href={`#${item.toLowerCase()}`}
                    onClick={() => {
                      setActiveNav(item);
                      setMobileOpen(false);
                    }}
                    className={`px-4 py-2.5 rounded-full text-xs uppercase tracking-widest text-center transition-colors duration-200 ${
                      activeNav === item
                        ? "bg-white/15 text-white"
                        : "text-[#f4ebd0]/70 hover:text-white hover:bg-white/5"
                    }`}
                  >
                    {item}
                  </a>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
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
              className="absolute inset-0 w-full h-full bg-[#050507]"
            >
              {/* Background Image of current slide */}
              <Image
                src={slides[currentSlide].image}
                alt={slides[currentSlide].tag}
                fill
                className="object-fill  scale-105 animate-[zoom_20s_infinite_alternate] bright-image"
                style={{ opacity: 0.7, objectPosition: "center" }}
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
     
      {/* 2) TRUST / VALUE ICON STRIP (NO-IMAGE SECTION: Uses background image with parallax and GSAP reveal overlay) */}
      <section className="relative -mt-4 z-30 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 gsap-section-bg overflow-hidden rounded-3xl border border-[#c5a880]/20 shadow-2xl bg-black">
        {/* Parallax Background Image */}
        <div className="absolute inset-0 z-0 w-full h-full">
          <Image
            src="/mms/Zambia-Zimbabwe-Victoria-Falls-Impressive-View-1.jpg"
            alt="MMS Partners Background"
            fill
            className="object-cover object-center gsap-reveal-bg-img pointer-events-none"
            style={{ opacity: 0.35 }}
          />
          <div className="absolute inset-0 bg-black/40 z-10" />
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
                  className="object-cover object-center gsap-reveal-image bright-image transition-transform duration-7000 ease-out group-hover:scale-105"
                  style={{ opacity: 0.85 }}
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
      <section id="about" className="relative py-16 md:py-24 border-t border-b border-[#c5a880]/15 gsap-section-bg overflow-hidden bg-black">
        {/* Background Image */}
        <div className="absolute inset-0 z-0 w-full h-full">
          <Image
            src="/victoria_falls_banner.png"
            alt="Scenic Falls Parallax"
            fill
            className="object-cover object-center gsap-reveal-bg-img pointer-events-none"
            style={{ opacity: 0.3 }}
          />
          <div className="absolute inset-0 bg-black/40 z-10" />
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

      {/* 7) TESTIMONIALS / CLIENT REACTIONS */}
      <section id="clients" className="relative py-16 md:py-24 border-b border-[#c5a880]/15 gsap-section-bg overflow-hidden bg-black">
        {/* Background Image */}
        <div className="absolute inset-0 z-0 w-full h-full">
          <Image
            src="/mms/wedding1.jpg"
            alt="Wedding scenic background"
            fill
            className="object-cover object-center gsap-reveal-bg-img pointer-events-none"
            style={{ opacity: 0.3 }}
          />
          <div className="absolute inset-0 bg-black/40 z-10" />
        </div>

        <div className="relative z-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16 gsap-fade-up">
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
                    "{testimonials[testimonialSlide].content}"
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
                onClick={() => setTestimonialSlide((prev) => (prev === 0 ? testimonials.length - 1 : prev - 1))}
                className="p-2.5 rounded-full border border-[#c5a880]/30 text-[#c5a880] hover:bg-[#c5a880] hover:text-[#050507] hover:border-transparent transition-all duration-300 cursor-pointer"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>

              <div className="flex space-x-2">
                {testimonials.map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => setTestimonialSlide(idx)}
                    className={`w-2 h-2 rounded-full transition-all duration-300 ${idx === testimonialSlide ? "bg-[#c5a880] w-6" : "bg-[#f4ebd0]/30"}`}
                  />
                ))}
              </div>

              <button
                onClick={() => setTestimonialSlide((prev) => (prev === testimonials.length - 1 ? 0 : prev + 1))}
                className="p-2.5 rounded-full border border-[#c5a880]/30 text-[#c5a880] hover:bg-[#c5a880] hover:text-[#050507] hover:border-transparent transition-all duration-300 cursor-pointer"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </section>


      <section id="contact" className="relative py-12 md:py-16 gsap-section-bg overflow-hidden bg-black">
        {/* Background Image */}
        <div className="absolute inset-0 z-0 w-full h-full">
          <Image
            src="/victoria_falls_banner.png"
            alt="Scenic Falls Parallax"
            fill
            className="object-cover object-center gsap-reveal-bg-img pointer-events-none"
            style={{ opacity: 0.3 }}
          />
          <div className="absolute inset-0 bg-black/50 z-10" />
        </div>

        <div className="relative z-20 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-10 space-y-3 gsap-fade-up">
            <span className="text-[10px] tracking-[0.4em] text-[#c5a880] uppercase font-semibold block">Get In Touch</span>
            <h2 className="text-2xl md:text-4xl font-light text-white font-serif leading-tight">Ready to Create Something Unforgettable?</h2>
            <p className="text-xs text-[#f4ebd0]/70 font-light">
              Let&apos;s bring your vision to life. Start with a free discovery call and get a custom quote within 24 hours.
            </p>
          </div>

          <section id="builder" className="py-16 md:py-24 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative gsap-section-bg">
     

        <div className="glass-panel rounded-3xl border border-[#c5a880]/20 p-8 md:p-10 gsap-fade-up">
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
                    <div className="w-10 h-10 rounded-full bg-[#c5a880]/15 flex items-center justify-center shrink-0 mt-1">
                      <opt.icon className="w-4 h-4 text-[#c5a880]" />
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
                    <div>
                      <span className="text-sm font-medium text-white block">{opt.label}</span>
                      <span className="text-[11px] text-[#f4ebd0]/60 mt-1 block">{opt.desc}</span>
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
      

          {/* Footer */}
          <footer className="pt-10 border-t border-[#c5a880]/15 gsap-fade-up relative z-10">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8 mb-8">

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
                  Crafting luxury wedding films and world-class event productions across the globe, blending cinematic artistry with brand storytelling that converts attention into bookings.
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
