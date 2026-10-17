import type { Metadata } from "next";
import { db } from "@/lib/db";
import ProjectsView from "./ProjectsView";
export const metadata: Metadata = { title: 'Projects | MMS', description: 'Explore MMS conference, event and media production projects.', alternates: { canonical: "/projects" } };
export const dynamic = "force-dynamic";
export default async function ProjectsPage() {
  const rows = await db.project.findMany({ where: { published: true }, orderBy: [{ sortOrder: "asc" }, { slug: "asc" }] });
  return <ProjectsView projects={rows.map(row => ({ heroAlt: row.heroAlt || row.title, galleryAlts: row.galleryAlts, slug: row.slug, title: row.title, category: row.category, desc: row.description, image: row.heroImage, images: row.gallery, tags: row.tags, year: String(row.year) }))} />;
}
