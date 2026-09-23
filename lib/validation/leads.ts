import { z } from "zod";

const text = (max: number) => z.string().trim().min(1).max(max);
const optionalText = (max: number) => z.string().trim().max(max).optional().transform((v) => v || undefined);
const phone = optionalText(32).refine((value) => !value || /^\+?[0-9 ()-]{7,32}$/.test(value), "Invalid phone number");

export const contactLeadSchema = z.object({
  name: text(120),
  email: z.string().trim().email().max(254),
  phone,
  projectType: z.preprocess((value) => value === "" ? undefined : value, z.enum(["conference", "wedding", "brand", "event", "other"]).optional()),
  message: text(5000),
  website: z.string().max(0).optional(),
});

export const conferenceLeadSchema = z.object({
  organisation: text(160),
  contact: text(120),
  email: z.string().trim().email().max(254),
  phone,
  eventType: optionalText(120),
  date: optionalText(80),
  delegates: optionalText(40),
  venue: optionalText(200),
  organisationType: z.preprocess((value) => value === "" || value === "Type of organisation" ? undefined : value, z.enum(["Government", "International", "NGO", "Corporate"]).optional()),
  services: z.array(text(120)).max(20).default([]),
  details: optionalText(5000),
  website: z.string().max(0).optional(),
});

export const projectBriefSchema = z.object({
  name: text(120),
  email: z.string().trim().email().max(254),
  phone,
  goal: text(80),
  audience: text(120),
  timeline: text(80),
  details: optionalText(5000),
  website: z.string().max(0).optional(),
});

export type LeadInput = {
  source: "contact" | "conference" | "project_builder" | "whatsapp";
  name: string;
  email?: string;
  phone?: string;
  organisation?: string;
  projectType?: string;
  message: string;
  metadata?: Record<string, string | string[] | undefined>;
  externalId?: string;
};
