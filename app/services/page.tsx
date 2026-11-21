import type { Metadata } from "next";
import { db } from "@/lib/db";
import ServicesView from "./ServicesView";
export const metadata: Metadata = {
  title: "Conference AV, LED Screens & Event Services Victoria Falls | MMS",
  description: "Hire conference audiovisual services, LED screens, PA sound systems, simultaneous interpretation equipment, live streaming, digital podiums and event production in Victoria Falls, Zimbabwe.",
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
export default async function ServicesPage() {
  const rows = await db.service.findMany({ where: { published: true }, orderBy: [{ sortOrder: "asc" }, { slug: "asc" }] });
  return <ServicesView catalog={rows.map(row => ({ heroAlt: row.heroAlt || row.title, galleryAlts: row.galleryAlts, slug: row.slug, title: row.title, tag: row.category, desc: row.description, image: row.heroImage, gallery: row.gallery, features: row.features, cta: row.ctaLabel, href: row.slug === "conference-microphone-interpretation-equipment" ? "/conference-production" : "/contact" }))} />;
}
