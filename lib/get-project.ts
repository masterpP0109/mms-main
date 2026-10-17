import { cache } from "react";
import { db } from "@/lib/db";
export const getProject = cache(async (slug: string) => db.project.findFirst({ where: { slug, published: true } }));
