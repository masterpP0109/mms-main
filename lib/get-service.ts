import { cache } from "react";
import { db } from "@/lib/db";
import { contentSlug, services } from "@/lib/services";

// Local entries are the source of truth for both the listing and detail pages.
// The database can still provide services that are not in the local catalog.
export const getService = cache(async (slug: string) => {
  const service = services.find((item) => contentSlug(item.title) === slug);
  if (!service) {
    return process.env.DATABASE_URL?.trim()
      ? db.service.findFirst({ where: { slug, published: true } })
      : null;
  }

  return {
    slug,
    title: service.title,
    category: service.tag,
    description: service.desc,
    heroImage: service.image,
    gallery: service.gallery,
    features: service.items.map((item) => item.label),
    ctaLabel: service.cta,
  };
});
