import type { Metadata } from "next";
import { db } from "@/lib/db";
import ServicesView from "./ServicesView";
export const metadata: Metadata = { title: 'Services | MMS', description: 'Conference and event production, audiovisual equipment and creative media services.', alternates: { canonical: "/services" } };
export const dynamic = "force-dynamic";
export default async function ServicesPage() {
  const rows = await db.service.findMany({ where: { published: true }, orderBy: [{ sortOrder: "asc" }, { slug: "asc" }] });
  return <ServicesView catalog={rows.map(row => ({ heroAlt: row.heroAlt || row.title, galleryAlts: row.galleryAlts, slug: row.slug, title: row.title, tag: row.category, desc: row.description, image: row.heroImage, gallery: row.gallery, features: row.features, cta: row.ctaLabel, href: row.slug === "conference-microphone-interpretation-equipment" ? "/conference-production" : "/contact" }))} />;
}
