import type { MetadataRoute } from "next";
import { db } from "@/lib/db";
export const dynamic = "force-dynamic";
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  if (!process.env.SITE_URL) return [];
  const base = new URL(process.env.SITE_URL);
  const [services, projects] = await Promise.all([
    db.service.findMany({ where: { published: true }, select: { slug: true, updatedAt: true } }),
    db.project.findMany({ where: { published: true }, select: { slug: true, updatedAt: true } }),
  ]);
  return ["/", "/about", "/services", "/projects", "/gallery", "/contact", "/conference-production", "/privacy"].map(route => ({ url: new URL(route, base).href })).concat([
    ...services.map(item => ({ url: new URL(`/services/${encodeURIComponent(item.slug)}`, base).href, lastModified: item.updatedAt })),
    ...projects.map(item => ({ url: new URL(`/projects/${encodeURIComponent(item.slug)}`, base).href, lastModified: item.updatedAt })),
  ]);
}
