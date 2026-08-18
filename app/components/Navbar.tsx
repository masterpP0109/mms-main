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

const goldGlowButtonBase =
  "group relative isolate inline-flex items-center justify-center overflow-hidden rounded-full bg-gradient-to-r from-[#b48a3d] via-[#d6bd7d] to-[#c5a880] text-[#050507] font-semibold shadow-[0_0_0_1px_rgba(229,207,154,0.28),0_0_18px_rgba(180,138,61,0.2)] transition-[transform,filter,box-shadow] duration-300 before:absolute before:inset-0 before:rounded-full before:bg-[linear-gradient(110deg,transparent_18%,rgba(255,255,255,0.62)_48%,transparent_78%)] before:-translate-x-[140%] before:transition-transform before:duration-700 hover:-translate-y-0.5 hover:brightness-110 hover:shadow-[0_0_0_1px_rgba(229,207,154,0.55),0_0_34px_rgba(197,168,128,0.48)] hover:before:translate-x-[140%] active:translate-y-0 active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#e5cf9a]";

export default function Navbar() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) setMobileOpen(false);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  return (
    <nav className="fixed top-4 md:top-6 left-1/2 -translate-x-1/2 z-50 w-[calc(100%_-_1.5rem)] sm:w-[calc(100%_-_3rem)] xl:max-w-[1540px]">
      <div className="glass-navbar-wrapper w-full">
        <div className="glass-navbar flex w-full items-center justify-between gap-3 rounded-full px-4 sm:px-6 py-3.5">
          {/* Logo */}
          <Link href="/" className="relative z-10 flex shrink-0 items-center logo-glow" style={{ minWidth: 132 }}>
            <Image
              src="/mmslogo.webp"
              alt="MMS Logo"
              width={140}
              height={38}
              className="object-contain"
              priority
            />
          </Link>

          {/* Divider */}
          <div className="w-px h-7 bg-white/20 mx-2" />

          {/* Nav Links */}
          <div className="hidden lg:flex flex-1 items-center justify-center gap-1 xl:gap-2">
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

          {/* CTA Button */}
          <Link
            href="/conference-production#enquiry"
            className={`${goldGlowButtonBase} relative z-10 hidden sm:inline-flex shrink-0 px-6 xl:px-7 py-2.5 text-[10px] uppercase tracking-widest`}
          >
            <span className="relative z-10">Plan Your Conference</span>
          </Link>

          {/* Mobile Menu Button */}
          <button
            type="button"
            className="nav-icon-btn lg:hidden relative z-10 p-3 text-white ml-2"
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
            className="lg:hidden mt-2 mobile-menu-glass rounded-2xl p-4 flex flex-col gap-2"
          >
            {navLinks.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMobileOpen(false)}
                className={`px-4 py-2.5 rounded-full text-xs uppercase tracking-widest text-center transition-colors duration-200 ${
                  isActive(item.href)
                    ? "bg-white/15 text-white"
                    : "text-[#f4ebd0]/70 hover:text-white hover:bg-white/5"
                }`}
              >
                {item.label}
              </Link>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
