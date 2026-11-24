"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import wStyles from "./weddings.module.css";

const navSections = [
  { id: "destinations", label: "Destinations" },
  { id: "wedding-packages", label: "Wedding packages" },
  { id: "elopement-packages", label: "Elopement packages" },
  { id: "proposal-packages", label: "Proposal packages" },
  { id: "add-ons", label: "Add-ons" },
  { id: "package-information", label: "Important information" },
] as const;

export default function WeddingStickyNav({
  enquiryHref,
}: {
  enquiryHref: string;
}) {
  const [activeSection, setActiveSection] = useState<string>("destinations");

  useEffect(() => {
    const ids = navSections.map((item) => item.id);
    const elements = ids
      .map((id) => document.getElementById(id))
      .filter((el): el is HTMLElement => Boolean(el));

    if (!elements.length || typeof IntersectionObserver === "undefined") return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        if (visible[0]?.target.id) {
          setActiveSection(visible[0].target.id);
        }
      },
      { rootMargin: "-25% 0px -60% 0px", threshold: 0 },
    );

    elements.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  return (
    <nav aria-label="Page sections" className={wStyles.stickyNav}>
      <div className={wStyles.stickyNavInner}>
        {navSections.map((section) => {
          const isActive = activeSection === section.id;
          return (
            <a
              key={section.id}
              href={`#${section.id}`}
              onClick={() => setActiveSection(section.id)}
              aria-current={isActive ? "true" : undefined}
              className={`${wStyles.navPill} ${
                isActive ? wStyles.navPillActive : ""
              }`}
            >
              {section.label}
            </a>
          );
        })}
        <div className={wStyles.navAction}>
          <Link href={enquiryHref} className={wStyles.navCta}>
            <span>Start planning</span>
            <ArrowRight size={14} aria-hidden="true" />
          </Link>
        </div>
      </div>
    </nav>
  );
}
