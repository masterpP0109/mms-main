"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

/**
 * Lightweight, progressive scroll reveals for static page content.
 * Content remains visible without JavaScript and for reduced-motion users.
 */
export default function ScrollEffects() {
  const pathname = usePathname();

  useEffect(() => {
    const root = document.documentElement;
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const targets = Array.from(document.querySelectorAll<HTMLElement>("[data-reveal], [data-stagger]"));

    if (reducedMotion || !("IntersectionObserver" in window)) {
      targets.forEach((target) => target.classList.add("is-visible"));
      return;
    }

    root.classList.add("js-motion");
    targets.forEach((target) => {
      if (target.hasAttribute("data-stagger")) {
        Array.from(target.children).forEach((child, index) => {
          if (child instanceof HTMLElement) {
            child.style.setProperty("--reveal-index", String(Math.min(index, 8)));
          }
        });
      }
    });

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        });
      },
      { rootMargin: "0px 0px -10%", threshold: 0.12 },
    );

    const frame = requestAnimationFrame(() => targets.forEach((target) => observer.observe(target)));
    return () => {
      cancelAnimationFrame(frame);
      observer.disconnect();
    };
  }, [pathname]);

  return null;
}
