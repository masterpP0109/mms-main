"use client";

import React, { useMemo, useState } from "react";
import Link from "next/link";
import { ArrowRight, Check } from "lucide-react";
import FitImage from "@/app/components/FitImage";
import type { EquipmentItem } from "@/lib/technology-catalog";

export function EquipmentCard({
  item,
  comparable,
  selectedForCompare,
  onToggleCompare,
}: {
  item: EquipmentItem;
  comparable?: boolean;
  selectedForCompare?: boolean;
  onToggleCompare?: (slug: string) => void;
}) {
  const previewSpecs = item.specs.slice(0, 2);

  return (
    <div className="flex flex-col rounded-2xl overflow-hidden bg-[#efefef] border border-[#050507]/10 hover:border-[#7f141f]/50 transition-all duration-300 group">
      <Link href={`/services/${item.parentCategorySlug}/${item.slug}`} className="flex flex-col flex-1">
        <div className="relative aspect-[16/10] w-full overflow-hidden bg-[#dcdcdc]">
          <FitImage
            src={item.primaryImage}
            alt={item.primaryImageAlt}
            sizes="(max-width:767px) 100vw, (max-width:1023px) 50vw, 33vw"
            className="transition-transform duration-500 group-hover:scale-105"
          />
        </div>
        <div className="p-6 flex flex-col flex-1 justify-between gap-4">
          <div className="space-y-2">
            <span className="text-[11px] uppercase tracking-[0.2em] text-[#7f141f] font-semibold block">
              {item.equipmentTypeName} · {item.manufacturer}
            </span>
            <h3 className="text-xl font-semibold text-[#050507] font-heading group-hover:text-[#7f141f] transition-colors">
              {item.name}
            </h3>
            <p className="text-sm text-[#050507]/80 leading-relaxed">{item.shortDescription}</p>
            {previewSpecs.length > 0 && (
              <ul className="pt-2 space-y-1 text-xs text-[#050507]/70 border-t border-[#050507]/10">
                {previewSpecs.map((spec) => (
                  <li key={spec.label} className="truncate">
                    <span className="font-semibold text-[#050507]">{spec.label}:</span> {spec.value}
                  </li>
                ))}
              </ul>
            )}
          </div>
          <span className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.16em] font-semibold text-[#7f141f] pt-1">
            View Details
            <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" aria-hidden="true" />
          </span>
        </div>
      </Link>
      {comparable && onToggleCompare && (
        <div className="px-6 pb-4 pt-1 border-t border-[#050507]/10 bg-white/40">
          <button
            type="button"
            onClick={() => onToggleCompare(item.slug)}
            aria-pressed={Boolean(selectedForCompare)}
            className={`inline-flex items-center gap-2 text-xs font-semibold py-1.5 px-3 rounded-full transition-colors ${
              selectedForCompare
                ? "bg-[#981b28] text-white"
                : "text-[#050507]/80 hover:text-[#7f141f]"
            }`}
          >
            {selectedForCompare && <Check className="w-3.5 h-3.5" aria-hidden="true" />}
            {selectedForCompare ? "Selected to compare" : "Compare"}
          </button>
        </div>
      )}
    </div>
  );
}

const COMPARISON_FIELDS: { key: keyof NonNullable<EquipmentItem["comparison"]>; label: string }[] = [
  { key: "environment", label: "Environment" },
  { key: "pixelPitch", label: "Pixel pitch" },
  { key: "brightness", label: "Brightness" },
  { key: "dimensions", label: "Dimensions" },
  { key: "microphoneType", label: "Microphone type" },
  { key: "connectivity", label: "Connectivity" },
  { key: "handsFree", label: "Hands-free" },
  { key: "fixtureType", label: "Fixture type" },
  { key: "colourMixing", label: "Colour mixing" },
  { key: "beamCharacteristics", label: "Beam coverage" },
  { key: "applicationFocus", label: "Best suited for" },
];

export default function CategoryCatalogueClient({
  items,
  pixelPitchNote,
}: {
  items: EquipmentItem[];
  pixelPitchNote?: string;
}) {
  const [selectedType, setSelectedType] = useState<string>("all");
  const [compareSlugs, setCompareSlugs] = useState<string[]>([]);

  const typeOptions = useMemo(() => {
    const seen = new Map<string, string>();
    for (const item of items) {
      if (!seen.has(item.equipmentTypeSlug)) {
        seen.set(item.equipmentTypeSlug, item.equipmentTypeName);
      }
    }
    return Array.from(seen.entries()).map(([slug, name]) => ({ slug, name }));
  }, [items]);

  const filteredItems = useMemo(() => {
    if (selectedType === "all") return items;
    return items.filter((item) => item.equipmentTypeSlug === selectedType);
  }, [items, selectedType]);

  const comparableCount = items.filter((i) => Boolean(i.comparison)).length;
  const comparedItems = items.filter((i) => compareSlugs.includes(i.slug));

  const activeComparisonRows = useMemo(() => {
    if (comparedItems.length < 2) return [];
    return COMPARISON_FIELDS.filter((field) =>
      comparedItems.some((item) => Boolean(item.comparison?.[field.key]))
    );
  }, [comparedItems]);

  const toggleCompare = (slug: string) => {
    setCompareSlugs((prev) => {
      if (prev.includes(slug)) return prev.filter((s) => s !== slug);
      if (prev.length >= 3) return prev;
      return [...prev, slug];
    });
  };

  return (
    <div className="space-y-8">
      {pixelPitchNote && (
        <p className="rounded-2xl bg-[#efefef] border border-[#050507]/12 px-5 py-3.5 text-sm text-[#050507]/85 max-w-3xl">
          <span className="font-semibold text-[#7f141f]">About pixel pitch:</span> {pixelPitchNote}
        </p>
      )}

      {typeOptions.length > 1 && (
        <div className="flex flex-wrap gap-2" role="group" aria-label="Filter by equipment type">
          <button
            type="button"
            onClick={() => setSelectedType("all")}
            aria-pressed={selectedType === "all"}
            className={`px-4 py-2 rounded-full text-xs font-semibold transition-colors ${
              selectedType === "all"
                ? "bg-[#981b28] text-white"
                : "bg-[#efefef] text-[#050507] border border-[#050507]/12 hover:border-[#981b28]"
            }`}
          >
            All Equipment
          </button>
          {typeOptions.map((opt) => (
            <button
              key={opt.slug}
              type="button"
              onClick={() => setSelectedType(opt.slug)}
              aria-pressed={selectedType === opt.slug}
              className={`px-4 py-2 rounded-full text-xs font-semibold transition-colors ${
                selectedType === opt.slug
                  ? "bg-[#981b28] text-white"
                  : "bg-[#efefef] text-[#050507] border border-[#050507]/12 hover:border-[#981b28]"
              }`}
            >
              {opt.name}
            </button>
          ))}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredItems.map((item) => (
          <EquipmentCard
            key={item.id}
            item={item}
            comparable={comparableCount >= 2 && Boolean(item.comparison)}
            selectedForCompare={compareSlugs.includes(item.slug)}
            onToggleCompare={toggleCompare}
          />
        ))}
      </div>

      {comparedItems.length >= 2 && activeComparisonRows.length > 0 && (
        <div className="rounded-3xl bg-[#efefef] border border-[#050507]/12 p-6 sm:p-8 space-y-4 overflow-x-auto">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <p className="text-xs uppercase tracking-[0.25em] text-[#7f141f] font-semibold">
                Side-by-Side Comparison
              </p>
              <h3 className="text-xl font-semibold text-[#050507] font-heading">
                Compare Selected Equipment
              </h3>
            </div>
            <button
              type="button"
              onClick={() => setCompareSlugs([])}
              className="text-xs font-semibold text-[#7f141f] hover:underline"
            >
              Clear comparison
            </button>
          </div>
          <table className="w-full text-left text-sm border-collapse min-w-[480px]">
            <thead>
              <tr className="border-b border-[#050507]/15">
                <th className="py-2.5 pr-4 font-semibold text-[#050507]/70">Attribute</th>
                {comparedItems.map((item) => (
                  <th key={item.id} className="py-2.5 px-4 font-semibold text-[#050507]">
                    {item.name}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-[#050507]/10">
              {activeComparisonRows.map((row) => (
                <tr key={row.key}>
                  <td className="py-2.5 pr-4 font-medium text-[#050507]/80">{row.label}</td>
                  {comparedItems.map((item) => (
                    <td key={item.id} className="py-2.5 px-4 text-[#050507]">
                      {item.comparison?.[row.key] || "Not specified"}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
