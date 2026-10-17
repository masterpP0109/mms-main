import { cache } from "react";
import { db } from "@/lib/db";

// PostgreSQL is authoritative. Missing/unpublished records never fall back to snapshots.
export const getService = cache(async (slug: string) =>
  db.service.findFirst({ where: { slug, published: true } })
);
