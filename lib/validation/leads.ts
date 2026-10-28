import { z } from "zod";
import { CONTACT_ORIGIN_PATTERN } from "@/lib/contact-referral";
import { getPackageExperience, isLegacyWeddingPackage } from "@/lib/packages";

const text = (max: number) => z.string().trim().min(1).max(max).refine((value) => !/[\x00-\x08\x0b\x0c\x0e-\x1f\x7f]/.test(value), "Invalid characters");
const optionalText = (max: number) => z.string().trim().max(max).optional().transform((v) => v || undefined);
const phone = optionalText(32).refine((value) => !value || /^\+?[0-9 ()-]{7,32}$/.test(value), "Invalid phone number");

export const contactLeadSchema = z.object({
  name: text(120),
  email: z.string().trim().email().max(254),
  phone,
  organisation: optionalText(160),
  service: optionalText(160),
  origin: z.string().max(300).regex(CONTACT_ORIGIN_PATTERN).optional(),
  projectType: z.preprocess((value) => value === "" ? undefined : value, z.enum(["conference", "wedding", "brand", "event", "other"]).optional()),
  message: text(5000),
  website: z.string().max(0).optional(),
}).strict();

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
}).strict();

export const projectBriefSchema = z.object({
  name: text(120),
  email: z.string().trim().email().max(254),
  phone,
  goal: text(80),
  audience: text(120),
  timeline: text(80),
  details: optionalText(5000),
  website: z.string().max(0).optional(),
}).strict();

const campaignValue = optionalText(200);
export const packageLeadSchema = z.object({
  kind: z.literal("package"),
  category: z.enum(["weddings", "drone", "podcasts"]),
  packageId: text(80),
  name: text(120), email: z.string().trim().email().max(254), phone,
  date: z.string().date().optional(),
  location: optionalText(200),
  details: text(5000),
  attribution: z.object({
    utm_source: campaignValue, utm_medium: campaignValue, utm_campaign: campaignValue,
    utm_term: campaignValue, utm_content: campaignValue, utm_id: campaignValue,
    gclid: campaignValue, gbraid: campaignValue, wbraid: campaignValue, fbclid: campaignValue,
    landingPage: z.string().max(300).regex(CONTACT_ORIGIN_PATTERN).optional(),
  }).strict().optional(),
  website: z.string().max(0).optional(),
}).strict().superRefine((input, ctx) => {
  const isLegacy = isLegacyWeddingPackage(input.category, input.packageId);
  if (input.packageId !== "tailored" && !isLegacy && !getPackageExperience(input.category)?.options.some(option => option.id === input.packageId)) {
    ctx.addIssue({ code: "custom", path: ["packageId"], message: "Choose an option from this service category" });
  }
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
