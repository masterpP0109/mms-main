"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowRight, Check, ChevronDown } from "lucide-react";
import type { WeddingElopementPackage } from "@/lib/weddings-elopements";
import wStyles from "./weddings.module.css";

const packageEnquiryHref = (packageName: string) =>
  `/contact?${new URLSearchParams({
    service: "Weddings & Elopements",
    origin: "/services/weddings-elopements",
    package: packageName,
  }).toString()}#enquiry`;

export default function WeddingPackagePanels({
  packages,
  sectionId,
}: {
  packages: WeddingElopementPackage[];
  sectionId: string;
}) {
  const [openIds, setOpenIds] = useState<Record<number, boolean>>({});

  const togglePackage = (pkgNumber: number) => {
    setOpenIds((prev) => ({
      ...prev,
      [pkgNumber]: !prev[pkgNumber],
    }));
  };

  return (
    <div className={wStyles.packageList}>
      {packages.map((pkg) => {
        const isOpen = Boolean(openIds[pkg.number]);
        const panelId = `${sectionId}-package-${pkg.number}-details`;
        const headingId = `${sectionId}-package-${pkg.number}-heading`;

        return (
          <article
            key={pkg.number}
            aria-labelledby={headingId}
            className={`${wStyles.packagePanel} ${
              pkg.badge ? wStyles.packagePanelFeatured : ""
            }`}
          >
            <div className={wStyles.packagePanelSummary}>
              {/* Left zone: Identity & Pricing */}
              <div className={wStyles.packageIdentity}>
                <div className={wStyles.packageMeta}>
                  <span className={wStyles.packageNumber}>
                    Package {pkg.number}
                  </span>
                  {pkg.badge ? (
                    <span className={wStyles.packageBadge}>{pkg.badge}</span>
                  ) : null}
                </div>
                <h3 id={headingId} className={wStyles.packageTitle}>
                  {pkg.name}
                </h3>
                <div className={wStyles.packagePricing}>
                  <div className={wStyles.packagePrice}>{pkg.price}</div>
                  <div className={wStyles.packagePriceNote}>{pkg.priceNote}</div>
                </div>
              </div>

              {/* Right zone: Description & Controls */}
              <div className={wStyles.packageOverview}>
                <p className={wStyles.packageDescription}>{pkg.description}</p>
                <div className={wStyles.packageControls}>
                  <button
                    type="button"
                    aria-expanded={isOpen}
                    aria-controls={panelId}
                    onClick={() => togglePackage(pkg.number)}
                    className={wStyles.packageToggle}
                  >
                    <span>
                      {isOpen
                        ? "Hide complete inclusions"
                        : "View complete inclusions"}
                    </span>
                    <ChevronDown
                      size={18}
                      aria-hidden="true"
                      className={`${wStyles.packageChevron} ${
                        isOpen ? wStyles.packageChevronOpen : ""
                      }`}
                    />
                  </button>
                  <Link
                    href={packageEnquiryHref(pkg.name)}
                    className={wStyles.packageCta}
                  >
                    <span>Enquire about {pkg.name}</span>
                    <ArrowRight size={16} aria-hidden="true" />
                  </Link>
                </div>
              </div>
            </div>

            {/* Expandable Details Region */}
            {isOpen ? (
              <div
                id={panelId}
                role="region"
                aria-labelledby={headingId}
                className={wStyles.packageDetails}
              >
                <div className={wStyles.packageInclusionsBlock}>
                  <h4 className={wStyles.packageSubheading}>
                    Package inclusions
                  </h4>
                  <ul className={wStyles.inclusionsList}>
                    {pkg.inclusions.map((item) => (
                      <li key={item}>
                        <Check
                          size={16}
                          className={wStyles.inclusionIcon}
                          aria-hidden="true"
                        />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className={wStyles.packageDetailsFooter}>
                  <p className={wStyles.recommendedLocations}>
                    <strong>Recommended locations:</strong>{" "}
                    {pkg.recommendedLocations}
                  </p>
                </div>
              </div>
            ) : null}
          </article>
        );
      })}
    </div>
  );
}
