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

    const handleAnchorClick = (event: MouseEvent) => {
      if (event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) {
        return;
      }
      const anchor = (event.target as Element | null)?.closest("a[href]");
      if (!anchor) return;
      const href = anchor.getAttribute("href");
      if (!href || href === "#") return;

      let hash = "";
      if (href.startsWith("#")) {
        hash = href.slice(1);
      } else {
        try {
          const url = new URL(href, window.location.href);
          if (url.origin === window.location.origin && url.pathname === window.location.pathname && url.hash.length > 1) {
            hash = url.hash.slice(1);
          }
        } catch {
          return;
        }
      }
      if (!hash) return;

      const target = document.getElementById(decodeURIComponent(hash));
      if (!target) return;

      event.preventDefault();
      target.scrollIntoView({
        behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth",
        block: "start",
      });
      if (window.location.hash !== `#${hash}`) {
        window.history.pushState(null, "", `#${hash}`);
      }
    };

    document.addEventListener("click", handleAnchorClick);

    const frame = requestAnimationFrame(() => targets.forEach((target) => observer.observe(target)));
    return () => {
      cancelAnimationFrame(frame);
      observer.disconnect();
      document.removeEventListener("click", handleAnchorClick);
    };
  }, [pathname]);

  return null;
}
