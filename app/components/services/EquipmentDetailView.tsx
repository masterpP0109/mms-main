"use client";

import React, { useState } from "react";
import Link from "next/link";
import { ArrowLeft, ArrowRight, CheckCircle, ChevronDown, ChevronRight } from "lucide-react";
import FitImage from "@/app/components/FitImage";
import TechnologyDemo from "@/app/components/services/TechnologyDemo";
import type { EquipmentItem } from "@/lib/technology-catalog";

export default function EquipmentDetailView({ item }: { item: EquipmentItem }) {
  const galleryImages =
    item.gallery.length > 0
      ? item.gallery
      : [{ src: item.primaryImage, alt: item.primaryImageAlt, caption: item.name }];

  const [selectedIndex, setSelectedIndex] = useState(0);
  const [specsOpen, setSpecsOpen] = useState(false);

  const activeImage = galleryImages[selectedIndex] ?? galleryImages[0];
  const enquiryHref = `/contact?service=${encodeURIComponent(
    `${item.parentCategoryTitle} — ${item.name}`
  )}&origin=${encodeURIComponent(`/services/${item.parentCategorySlug}/${item.slug}`)}`;

  return (
    <main className="pt-28 pb-20">
      <div className="mx-auto max-w-[1400px] mms-gutter space-y-16">
        {/* Breadcrumb */}
        <nav aria-label="Breadcrumb" className="flex flex-wrap items-center gap-2 text-xs uppercase tracking-[0.18em] text-[#050507]/70">
          <Link href="/services" className="inline-flex items-center gap-1.5 hover:text-[#7f141f] transition-colors">
            <ArrowLeft className="w-3.5 h-3.5" aria-hidden="true" />
            Services &amp; Technology
          </Link>
          <ChevronRight className="w-3.5 h-3.5 text-[#050507]/40" aria-hidden="true" />
          <Link href={`/services/${item.parentCategorySlug}`} className="hover:text-[#7f141f] transition-colors">
            {item.parentCategoryTitle}
          </Link>
          <ChevronRight className="w-3.5 h-3.5 text-[#050507]/40" aria-hidden="true" />
          <span className="text-[#7f141f] font-semibold">{item.name}</span>
        </nav>

        {/* Above the fold: Gallery (left) + Summary & CTA (right) */}
        <section className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
          <div className="lg:col-span-7 space-y-4">
            <div className="relative aspect-[16/10] w-full overflow-hidden rounded-3xl border border-[#050507]/12 bg-[#efefef]">
              <FitImage
                src={activeImage.src}
                alt={activeImage.alt}
                sizes="(max-width:1023px) 100vw, 58vw"
                preload
              />
            </div>
            {galleryImages.length > 1 && (
              <div className="grid grid-cols-3 sm:grid-cols-4 gap-3" role="group" aria-label="Equipment image gallery">
                {galleryImages.map((img, idx) => (
                  <button
                    key={img.src + idx}
                    type="button"
                    onClick={() => setSelectedIndex(idx)}
                    aria-pressed={selectedIndex === idx}
                    aria-label={`View image ${idx + 1}: ${img.alt}`}
                    className={`relative aspect-[16/10] overflow-hidden rounded-xl border transition-all bg-[#efefef] ${
                      selectedIndex === idx
                        ? "border-[#981b28] ring-2 ring-[#981b28]/30"
                        : "border-[#050507]/12 hover:border-[#7f141f]/50"
                    }`}
                  >
                    <FitImage src={img.src} alt={img.alt} sizes="(max-width:639px) 30vw, 15vw" />
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="lg:col-span-5 space-y-6">
            <div className="space-y-3">
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-xs uppercase tracking-[0.26em] text-[#7f141f] font-semibold">
                  {item.manufacturer} · {item.equipmentTypeName}
                </span>
              </div>
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-semibold text-[#050507] font-heading leading-tight">
                {item.name}
              </h1>
              <p className="text-base text-[#050507]/85 leading-relaxed">{item.shortDescription}</p>
            </div>

            <div className="space-y-3">
              <p className="text-xs uppercase tracking-[0.25em] text-[#7f141f] font-semibold">
                Key Benefits
              </p>
              <ul className="space-y-2.5">
                {item.benefits.map((benefit) => (
                  <li key={benefit} className="flex items-start gap-2.5 text-sm text-[#050507]/90">
                    <CheckCircle className="w-4 h-4 text-[#7f141f] shrink-0 mt-0.5" aria-hidden="true" />
                    <span>{benefit}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="pt-2 flex flex-col sm:flex-row lg:flex-col gap-3">
              <Link
                data-lead-cta
                href={enquiryHref}
                className="mms-button inline-flex items-center justify-center px-7 py-3.5 text-xs uppercase tracking-[0.16em] font-semibold"
              >
                Enquire About This Technology
                <ArrowRight className="ml-2 w-4 h-4" aria-hidden="true" />
              </Link>
              <Link
                href="/contact"
                className="inline-flex items-center justify-center px-6 py-3 rounded-full border border-[#050507]/20 text-xs font-semibold text-[#050507] hover:border-[#7f141f] hover:text-[#7f141f] transition-colors"
              >
                Not sure what you need? Talk to our production team.
              </Link>
            </div>
          </div>
        </section>

        {/* Overview + Ideal For */}
        <section className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          <div className="lg:col-span-7 rounded-3xl bg-[#efefef] border border-[#050507]/12 p-6 sm:p-8 space-y-3">
            <h2 className="text-2xl font-semibold text-[#050507] font-heading">What does it do?</h2>
            <p className="text-base text-[#050507]/85 leading-relaxed">{item.whatItDoes}</p>
          </div>

          <div className="lg:col-span-5 rounded-3xl bg-[#efefef] border border-[#050507]/12 p-6 sm:p-8 space-y-4">
            <h2 className="text-xl font-semibold text-[#050507] font-heading">Ideal For</h2>
            <div className="flex flex-wrap gap-2">
              {item.eventApplications.map((app) => (
                <span
                  key={app}
                  className="rounded-full bg-white border border-[#050507]/12 px-3.5 py-1.5 text-xs font-medium text-[#050507]"
                >
                  {app}
                </span>
              ))}
            </div>
          </div>
        </section>

        {/* Interactive Demonstration (when applicable) */}
        {item.demonstrationType && (
          <section aria-label="Interactive demonstration">
            <TechnologyDemo type={item.demonstrationType} />
          </section>
        )}

        {/* Equipment in Action */}
        {galleryImages.length > 0 && (
          <section className="space-y-6">
            <div>
              <p className="text-xs uppercase tracking-[0.28em] text-[#7f141f] font-semibold">
                In Action
              </p>
              <h2 className="text-2xl sm:text-3xl font-semibold text-[#050507] font-heading mt-1">
                How it looks at real events
              </h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {galleryImages.map((img, idx) => (
                <figure
                  key={img.src + idx}
                  className="rounded-2xl overflow-hidden bg-[#efefef] border border-[#050507]/12 flex flex-col"
                >
                  <div className="relative aspect-[16/10] w-full bg-[#dcdcdc]">
                    <FitImage src={img.src} alt={img.alt} sizes="(max-width:767px) 100vw, 33vw" />
                  </div>
                  <figcaption className="p-4 text-sm text-[#050507]/85">{img.caption}</figcaption>
                </figure>
              ))}
            </div>
          </section>
        )}

        {/* Expandable Technical Specifications */}
        {item.specs.length > 0 && (
          <section className="rounded-3xl bg-[#efefef] border border-[#050507]/12 overflow-hidden">
            <button
              type="button"
              onClick={() => setSpecsOpen((prev) => !prev)}
              aria-expanded={specsOpen}
              aria-controls="equipment-specs-panel"
              className="w-full flex items-center justify-between gap-4 p-6 sm:p-8 text-left hover:bg-black/[0.02] transition-colors"
            >
              <div>
                <p className="text-xs uppercase tracking-[0.25em] text-[#7f141f] font-semibold">
                  Technical &amp; Operational Notes
                </p>
                <h2 className="text-xl sm:text-2xl font-semibold text-[#050507] font-heading mt-1">
                  Specifications &amp; Scoping Details
                </h2>
              </div>
              <ChevronDown
                className={`w-5 h-5 text-[#050507] transition-transform duration-200 ${
                  specsOpen ? "rotate-180" : ""
                }`}
                aria-hidden="true"
              />
            </button>
            {specsOpen && (
              <div id="equipment-specs-panel" className="px-6 sm:px-8 pb-6 sm:pb-8 border-t border-[#050507]/10 pt-4">
                <dl className="divide-y divide-[#050507]/10">
                  {item.specs.map((spec) => (
                    <div key={spec.label} className="py-3 grid grid-cols-1 sm:grid-cols-3 gap-2">
                      <dt className="text-sm font-semibold text-[#050507]">{spec.label}</dt>
                      <dd className="text-sm text-[#050507]/80 sm:col-span-2">{spec.value}</dd>
                    </div>
                  ))}
                </dl>
              </div>
            )}
          </section>
        )}

        {/* Related Technology */}
        {item.relatedSlugs.length > 0 && (
          <section className="space-y-6">
            <div className="flex flex-wrap items-end justify-between gap-4">
              <div>
                <p className="text-xs uppercase tracking-[0.28em] text-[#7f141f] font-semibold">
                  Works Well With
                </p>
                <h2 className="text-2xl sm:text-3xl font-semibold text-[#050507] font-heading mt-1">
                  Related Technology
                </h2>
              </div>
              <Link
                href={`/services/${item.parentCategorySlug}`}
                className="inline-flex items-center gap-1.5 text-xs uppercase tracking-[0.16em] font-semibold text-[#7f141f] hover:underline"
              >
                Back to {item.parentCategoryTitle}
                <ArrowRight className="w-3.5 h-3.5" aria-hidden="true" />
              </Link>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {item.relatedSlugs.map((rel) => (
                <Link
                  key={`${rel.categorySlug}/${rel.equipmentSlug}`}
                  href={`/services/${rel.categorySlug}/${rel.equipmentSlug}`}
                  className="group flex items-center gap-4 rounded-2xl bg-[#efefef] border border-[#050507]/12 p-4 hover:border-[#7f141f]/50 transition-colors"
                >
                  <div className="relative w-20 h-16 rounded-xl overflow-hidden bg-[#dcdcdc] shrink-0">
                    <FitImage src={rel.image} alt={rel.name} sizes="80px" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-base font-semibold text-[#050507] group-hover:text-[#7f141f] transition-colors truncate">
                      {rel.name}
                    </p>
                    <span className="inline-flex items-center gap-1 text-xs font-semibold text-[#7f141f] mt-1">
                      View details <ArrowRight className="w-3.5 h-3.5" aria-hidden="true" />
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}
      </div>
    </main>
  );
}
