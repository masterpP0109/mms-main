import type { MetadataRoute } from "next";
import { db } from "@/lib/db";
import { packageExperiences, packagePath } from "@/lib/packages";
import { siteOrigin } from "@/lib/site-metadata";
import { PROJECTS_ENABLED } from "@/lib/site-flags";
import { getAllPublishedEquipment } from "@/lib/technology-catalog";
import { CONFERENCE_SOLUTIONS } from "@/lib/conference-solutions";

export const dynamic = "force-dynamic";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = new URL(siteOrigin());
  let services: { slug: string; updatedAt?: Date }[] = [];
  let projects: { slug: string; updatedAt?: Date }[] = [];
  try {
    services = await db.service.findMany({ where: { published: true }, select: { slug: true, updatedAt: true } });
  } catch {
    console.error("Failed to load services for sitemap");
  }
  try {
    if (PROJECTS_ENABLED) projects = await db.project.findMany({ where: { published: true }, select: { slug: true, updatedAt: true } });
  } catch {
    console.error("Failed to load projects for sitemap");
  }

  const dedicatedServices = new Set(["drone", "weddings-elopements", "special-effects"]);
  return [
    "/",
    "/about",
    "/services",
    "/services/drone",
    "/services/weddings-elopements",
    "/services/special-effects",
    "/packages",
    ...packageExperiences.map(item => packagePath(item.slug)),
    ...(PROJECTS_ENABLED ? ["/projects"] : []),
    "/gallery",
    "/contact",
    "/conference-production",
    ...CONFERENCE_SOLUTIONS.map(item => `/conference-production/${item.slug}`),
    "/reviews",
    "/privacy",
  ].map(route => ({ url: new URL(route, base).href })).concat([
    ...services.filter(item => !dedicatedServices.has(item.slug)).map(item => ({ url: new URL(`/services/${encodeURIComponent(item.slug)}`, base).href, lastModified: item.updatedAt })),
    ...getAllPublishedEquipment().map(item => ({ url: new URL(`/services/${encodeURIComponent(item.parentCategorySlug)}/${encodeURIComponent(item.slug)}`, base).href })),
    ...projects.map(item => ({ url: new URL(`/projects/${encodeURIComponent(item.slug)}`, base).href, lastModified: item.updatedAt })),
  ]);
}
