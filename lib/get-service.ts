import { cache } from "react";
import { db } from "@/lib/db";
import { contentSlug, services as snapshotServices } from "@/lib/services";

function snapshotServiceBySlug(slug: string) {
  const match = snapshotServices.find((item) => contentSlug(item.title) === slug);
  if (!match) return null;
  const now = new Date();
  return {
    id: `preview-${slug}`,
    slug,
    title: match.title,
    category: match.tag,
    description: match.desc,
    heroImage: match.image,
    heroAlt: match.title,
    galleryAlts: [] as string[],
    seoTitle: null as string | null,
    seoDescription: null as string | null,
    gallery: match.gallery,
    features: match.items.map((f) => f.label),
    ctaLabel: match.cta,
    published: true,
    sortOrder: 0,
    createdAt: now,
    updatedAt: now,
  };
}

// PostgreSQL is authoritative in production/staging. Unconfigured Vercel Previews fall back cleanly.
export const getService = cache(async (slug: string) => {
  const isPreview = process.env.VERCEL_ENV === "preview";
  if (isPreview && !process.env.DATABASE_URL) {
    return snapshotServiceBySlug(slug);
  }
  try {
    const record = await db.service.findFirst({ where: { slug, published: true } });
    if (!record && isPreview) {
      return snapshotServiceBySlug(slug);
    }
    return record;
  } catch (err) {
    if (isPreview) {
      return snapshotServiceBySlug(slug);
    }
    throw err;
  }
});
