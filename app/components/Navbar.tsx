"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X } from "lucide-react";

const navLinks = [
  { label: "Home", href: "/" },
  { label: "Conference Production", href: "/conference-production" },
  { label: "Services", href: "/services" },
  { label: "Projects", href: "/projects" },
  { label: "Gallery", href: "/gallery" },
  { label: "About", href: "/about" },
  { label: "Contact", href: "/contact" },
];

const ctaBase =
  "relative inline-flex items-center justify-center rounded-full bg-gradient-to-r from-[#b48a3d] via-[#d6bd7d] to-[#c5a880] text-[#050507] text-[10px] uppercase tracking-widest font-semibold hover:brightness-110 transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#e5cf9a] focus-visible:ring-offset-2 focus-visible:ring-offset-[#050507]";

export default function Navbar() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) setMobileOpen(false);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 80);
    };
    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    if (!mobileOpen) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setMobileOpen(false);
    };
    document.addEventListener("keydown", handleKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", handleKey);
      document.body.style.overflow = "";
    };
  }, [mobileOpen]);

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  return (
    <header className="fixed top-0 left-0 right-0 z-50">
      <div className="max-w-[1280px] mx-auto px-6 sm:px-8 flex items-center justify-between">
        <Link
          href="/"
          className="relative z-50 flex shrink-0 items-center"
          style={{ minWidth: 132 }}
          aria-label="MMS Home"
        >
          <Image
            src="/mmslogo.webp"
            alt="MMS Logo"
            width={140}
            height={38}
            className="object-contain"
            priority
          />
        </Link>

        <nav
          className={`relative z-40 transition-all duration-500 ease-out ${
            scrolled ? "py-2" : "py-3"
          }`}
          role="navigation"
          aria-label="Main navigation"
        >
          <div className="glass-navbar-wrapper">
            <div className={`glass-navbar flex items-center justify-between gap-3 rounded-full px-4 sm:px-6 py-3.5 ${scrolled ? "glass-navbar-scrolled" : ""}`}>
              <div className="hidden lg:flex items-center gap-1 xl:gap-2">
                {navLinks.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`nav-item relative px-3 xl:px-5 py-2.5 text-[11px] xl:text-xs uppercase tracking-widest ${
                      isActive(item.href) ? "active text-white" : "text-[#f4ebd0]/70 hover:text-white"
                    }`}
                  >
                    {isActive(item.href) && (
                      <motion.div
                        layoutId="nav-pill"
                        className="absolute inset-0 rounded-full"
                        style={{ background: "rgba(255,255,255,0.12)" }}
                        transition={{ type: "spring", stiffness: 300, damping: 30 }}
                      />
                    )}
                    <span className="relative z-10">{item.label}</span>
                  </Link>
                ))}
              </div>

              <Link
                href="/contact"
                className={`${ctaBase} relative z-10 hidden sm:inline-flex shrink-0 px-6 xl:px-7 py-2.5`}
              >
                <span className="relative z-10">Start a Project</span>
              </Link>

              <button
                type="button"
                className="nav-icon-btn lg:hidden relative z-10 p-3 text-white ml-2"
                onClick={() => setMobileOpen(!mobileOpen)}
                aria-label={mobileOpen ? "Close menu" : "Open menu"}
                aria-expanded={mobileOpen}
                aria-controls="mobile-menu"
              >
                {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>
        </nav>
      </div>

      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            id="mobile-menu"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
            className="lg:hidden fixed inset-0 z-40 bg-[#050507]/95 backdrop-blur-xl"
            onClick={() => setMobileOpen(false)}
          >
            <div
              className="flex flex-col items-center justify-center h-full gap-8 p-8"
              onClick={(e) => e.stopPropagation()}
            >
              {navLinks.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setMobileOpen(false)}
                  className={`text-2xl font-light tracking-widest uppercase transition-colors duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#c5a880] rounded-sm ${
                    isActive(item.href) ? "text-white" : "text-[#f4ebd0]/70 hover:text-white"
                  }`}
                >
                  {item.label}
                </Link>
              ))}
              <Link
                href="/contact"
                onClick={() => setMobileOpen(false)}
                className={`${ctaBase} mt-4 px-8 py-3`}
              >
                <span className="relative z-10">Start a Project</span>
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
