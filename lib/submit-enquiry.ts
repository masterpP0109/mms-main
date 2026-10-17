"use client";

import type { z } from "zod";
import type { contactLeadSchema, conferenceLeadSchema, projectBriefSchema } from "@/lib/validation/leads";
import { acknowledgeSubmission, submissionKey } from "@/lib/submission-key";

export type ContactEnquiry = z.input<typeof contactLeadSchema>;
export type ConferenceEnquiry = z.input<typeof conferenceLeadSchema>;
export type BriefEnquiry = z.input<typeof projectBriefSchema>;
type Acknowledgement = { success: true; saved: true; submissionId: string; notificationStatus: string };

/** A success means durable persistence, not provider delivery. Keep keys on uncertain outcomes. */
export function submitEnquiry(endpoint: "/api/leads", payload: ContactEnquiry | BriefEnquiry): Promise<Acknowledgement>;
export function submitEnquiry(endpoint: "/api/conference-enquiry", payload: ConferenceEnquiry): Promise<Acknowledgement>;
export async function submitEnquiry(endpoint: "/api/leads" | "/api/conference-enquiry", payload: ContactEnquiry | ConferenceEnquiry | BriefEnquiry): Promise<Acknowledgement> {
  const response = await fetch(endpoint, {
    method: "POST",
    headers: { "Content-Type": "application/json", "Idempotency-Key": await submissionKey(payload) },
    body: JSON.stringify(payload),
    signal: AbortSignal.timeout(20_000),
  });
  const data: unknown = await response.json();
  if (!response.ok || typeof data !== "object" || data === null || !("success" in data) || data.success !== true || !("saved" in data) || data.saved !== true || !("submissionId" in data) || typeof data.submissionId !== "string" || !data.submissionId || !("notificationStatus" in data) || typeof data.notificationStatus !== "string") {
    throw new Error("We couldn't confirm your enquiry. Please try again or contact MMS directly.");
  }
  await acknowledgeSubmission(payload);
  return data as Acknowledgement;
}
