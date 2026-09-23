"use client";

import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X } from "lucide-react";

import { useModalFocus } from "./useModalFocus";

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
  const menuRef = useRef<HTMLDivElement>(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  useModalFocus(mobileOpen, menuRef, () => setMobileOpen(false));

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1280) setMobileOpen(false);
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

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : (pathname ?? "").startsWith(href);

  return (
    <header className="site-header fixed top-0 left-0 right-0 z-50">
      <div className="max-w-[1280px] mx-auto px-4 sm:px-8 flex items-center justify-between">
        <Link
          href="/"
          className="relative z-50 flex shrink-0 items-center"

          aria-label="MMS Home"
        >
          <Image
            src="/mms/MMS%20LOGO.png"
            alt="MMS Logo"
            width={140}
            height={38}
            className="w-[112px] sm:w-[140px] h-auto object-contain"
            preload
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
              <div className="hidden xl:flex items-center gap-1">
                {navLinks.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    aria-current={isActive(item.href) ? "page" : undefined}
                    className={`nav-item relative px-3 py-2.5 text-[11px] xl:text-xs uppercase tracking-widest ${
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
                className={`${ctaBase} nav-cta relative z-10 shrink-0 px-4 py-2.5`}
              >
                <span className="relative z-10">Start a Project</span>
              </Link>

              <button
                type="button"
                className="nav-icon-btn shrink-0 xl:hidden relative z-10 p-3 text-white ml-2"
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
            ref={menuRef}
            role="dialog"
            aria-modal="true"
            aria-label="Mobile navigation"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
            className="mobile-menu xl:hidden fixed inset-0 z-[60] bg-[#050507]/95 backdrop-blur-xl"
            onClick={() => setMobileOpen(false)}
          >
            <button type="button" aria-label="Close menu" onClick={() => setMobileOpen(false)} className="modal-close"><X /></button>
            <div
              className="mobile-menu-links flex flex-col items-stretch gap-2"
              onClick={(e) => e.stopPropagation()}
            >
              {navLinks.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setMobileOpen(false)}
                  className={`min-h-11 flex items-center justify-center text-center text-lg sm:text-2xl font-semibold tracking-widest uppercase transition-colors duration-300 font-heading focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#c5a880] rounded-sm ${
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
