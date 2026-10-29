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
  name: text(120),
  email: z.string().trim().email().max(254),
  role: optionalText(120),
  organisation: optionalText(160),
  service: optionalText(120),
  eventDate: optionalText(80),
  rating: z.coerce.number().int().min(1).max(5),
  headline: optionalText(160),
  content: z.string()
    .trim()
    .min(10, "Review must be at least 10 characters long")
    .max(2000, "Review must be at most 2000 characters long")
    .refine((value) => !/[\x00-\x08\x0b\x0c\x0e-\x1f\x7f]/.test(value), "Invalid characters"),
  consent: z.boolean().refine((val) => val === true, {
    message: "You must confirm permission to display this review.",
  }),
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
