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
  { label: "Packages", href: "/packages" },
  { label: "Drone Services", href: "/services/drone" },
  { label: "Projects", href: "/projects" },
  { label: "About", href: "/about" },
  { label: "Contact", href: "/contact" },
];

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
    href === "/" || href === "/services" ? pathname === href : (pathname ?? "").startsWith(href);

  return (
    <header className="site-header fixed top-0 left-0 right-0 z-50">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-8 flex items-center justify-between gap-4">
        <Link
          href="/"
          className="relative z-50 flex shrink-0 items-center transition-transform duration-300 hover:scale-[1.03]"
          aria-label="MMS Home"
        >
          <Image
            src="/mms/MMS%20LOGO.png"
            alt="MMS Logo"
            width={220}
            height={64}
            className="w-[92px] sm:w-[108px] lg:w-[120px] h-auto object-contain drop-shadow-[0_1px_3px_rgba(5,5,7,0.45)]"
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
                    className={`nav-item relative px-2.5 py-2.5 text-[10px] 2xl:text-[11px] uppercase tracking-[.06em] ${
                      isActive(item.href)
                        ? "active text-white font-semibold"
                        : "text-[#050507]/85 hover:text-[#7f141f] font-medium"
                    }`}
                  >
                    {isActive(item.href) && (
                      <motion.div
                        layoutId="nav-pill"
                        className="absolute inset-0 rounded-full"
                        style={{ background: "#981b28" }}
                        transition={{ type: "spring", stiffness: 300, damping: 30 }}
                      />
                    )}
                    <span className="relative z-10">{item.label}</span>
                  </Link>
                ))}
              </div>

              <button
                type="button"
                className="nav-icon-btn shrink-0 xl:hidden relative z-10 p-3 text-[#050507]"
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
            className="mobile-menu xl:hidden fixed inset-0 z-[60] bg-[#e4e4e4]/96 backdrop-blur-xl"
            onClick={() => setMobileOpen(false)}
          >
            <button
              type="button"
              aria-label="Close menu"
              onClick={() => setMobileOpen(false)}
              className="modal-close !bg-[#efefef] !text-[#050507] border border-[#050507]/15 shadow-sm"
            >
              <X />
            </button>
            <div
              className="mobile-menu-links flex flex-col items-stretch gap-2"
              onClick={(e) => e.stopPropagation()}
            >
              {navLinks.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setMobileOpen(false)}
                  aria-current={isActive(item.href) ? "page" : undefined}
                  className={`min-h-11 flex items-center justify-center text-center text-lg sm:text-2xl font-semibold tracking-widest uppercase transition-colors duration-300 font-heading focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#7f141f] rounded-full px-6 py-2 ${
                    isActive(item.href)
                      ? "bg-[#981b28] text-white"
                      : "text-[#050507]/85 hover:text-[#7f141f]"
                  }`}
                >
                  {item.label}
                </Link>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
