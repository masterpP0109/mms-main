import type { Metadata } from "next";
import type { ServiceCardData } from "@/lib/content-types";
import { db } from "@/lib/db";
import { contentSlug, services as snapshotServices } from "@/lib/services";
import ServicesView from "./ServicesView";

export const metadata: Metadata = {
  title: "Conference AV, LED Screens & Event Services Victoria Falls | MMS",
  description:
    "Hire conference audiovisual services, LED screens, PA sound systems, simultaneous interpretation equipment, live streaming, digital podiums and event production in Victoria Falls, Zimbabwe.",
  keywords: [
    "conference audiovisual services Zimbabwe",
    "conference equipment hire Victoria Falls",
    "LED screen hire Victoria Falls",
    "simultaneous interpretation equipment Zimbabwe",
    "conference live streaming Zimbabwe",
    "professional sound systems Zimbabwe",
    "digital podiums Zimbabwe",
    "DJ services Victoria Falls",
  ],
  alternates: { canonical: "/services" },
};

export const dynamic = "force-dynamic";

function mapSnapshotCatalog(): ServiceCardData[] {
  return snapshotServices.map((item) => {
    const slug = contentSlug(item.title);
    return {
      heroAlt: item.title,
      galleryAlts: [],
      slug,
      title: item.title,
      tag: item.tag,
      desc: item.desc,
      image: item.image,
      gallery: item.gallery,
      features: item.items.map((f) => f.label),
      cta: item.cta,
      href: slug === "conference-microphone-interpretation-equipment" ? "/conference-production" : "/contact",
    };
  });
}

async function loadServicesCatalog(): Promise<ServiceCardData[]> {
  const isPreview = process.env.VERCEL_ENV === "preview";
  if (isPreview && !process.env.DATABASE_URL) {
    return mapSnapshotCatalog();
  }
  try {
    const rows = await db.service.findMany({
      where: { published: true },
      orderBy: [{ sortOrder: "asc" }, { slug: "asc" }],
    });
    if (isPreview && rows.length === 0) {
      return mapSnapshotCatalog();
    }
    return rows.map((row) => ({
      heroAlt: row.heroAlt || row.title,
      galleryAlts: row.galleryAlts,
      slug: row.slug,
      title: row.title,
      tag: row.category,
      desc: row.description,
      image: row.heroImage,
      gallery: row.gallery,
      features: row.features,
      cta: row.ctaLabel,
      href: row.slug === "conference-microphone-interpretation-equipment" ? "/conference-production" : "/contact",
    }));
  } catch (err) {
    if (isPreview) {
      return mapSnapshotCatalog();
    }
    throw err;
  }
}

export default async function ServicesPage() {
  const catalog = await loadServicesCatalog();
  return <ServicesView catalog={catalog} />;
}
