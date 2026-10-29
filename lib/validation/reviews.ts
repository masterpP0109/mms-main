import { z } from "zod";

const text = (max: number) =>
  z.string()
    .trim()
    .min(1)
    .max(max)
    .refine((value) => !/[\x00-\x08\x0b\x0c\x0e-\x1f\x7f]/.test(value), "Invalid characters");

const optionalText = (max: number) =>
  z.string()
    .trim()
    .max(max)
    .optional()
    .transform((v) => v || undefined);

export const reviewSubmissionSchema = z.object({
  // Section 1: About You
  name: text(120),
  organisation: text(160),
  email: z.string().trim().email().max(254),
  role: optionalText(120),
  services: z.array(z.string().trim().max(120)).min(1, "Please select at least one service provided"),
  service: optionalText(120),
  eventDate: optionalText(80),

  // Section 2: Your Experience
  rating: z.coerce.number().int().min(1).max(5),
  stoodOut: text(2000),
  contribution: optionalText(2000),
  improvements: optionalText(2000),
  wouldRecommend: z.enum(["Yes", "Maybe", "No"]).default("Yes"),

  // Section 3: Share Your Experience
  headline: text(300), // "In a few words, how would you describe your experience..."
  content: optionalText(3000), // Full recommendation or composite text
  consent: z.boolean().default(true),
  attribution: z.enum([
    "My name and organisation",
    "My name only",
    "Organisation only (subject to authorisation)",
    "Anonymous client",
  ]).default("My name and organisation"),

  // Anti-spam honeypot
  website: z.string().max(0).optional(),
}).strict();

export type ReviewSubmissionInput = z.infer<typeof reviewSubmissionSchema>;

export const reviewModerationSchema = z.object({
  status: z.enum(["pending", "approved", "rejected"]).optional(),
  featured: z.boolean().optional(),
  verified: z.boolean().optional(),
  notes: optionalText(2000),
  moderatedBy: optionalText(120),
}).strict().refine((data) => Object.keys(data).length > 0, "No fields provided to update");

export type ReviewModerationInput = z.infer<typeof reviewModerationSchema>;
