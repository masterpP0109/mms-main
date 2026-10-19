import "server-only";
import { sendEmail } from "@/lib/email/smtp";
import type { LeadInput } from "@/lib/validation/leads";

const escapeHtml = (value: string) => value.replace(/[&<>'"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", "'": "&#39;", '"': "&quot;" })[c]!);

export async function sendLeadEmail(lead: LeadInput & { id: string; createdAt: Date }) {
  const metadata = lead.metadata ?? {};
  const category = lead.source === "conference" ? "Conference Services" : lead.source === "project_builder" ? "Request a Quote" : String(metadata.service || lead.projectType || "General Contact");
  const details = [
    ["Customer name", lead.name], ["Organisation / company", lead.organisation],
    ["Email", lead.email], ["Phone / WhatsApp", lead.phone], ["Service requested", metadata.service || metadata.services || lead.projectType || category],
    ["Event type", lead.source === "conference" ? lead.projectType : undefined],
    ["Event date", metadata.date], ["Venue / location", metadata.venue], ["Attendees", metadata.delegates],
    ["Organisation type", metadata.organisationType], ["Audience / event type", metadata.audience],
    ["Timeline", metadata.timeline], ["Message / project details", lead.message],
    ["Originating page", metadata.origin || ({ contact: "/contact", conference: "/conference-production", project_builder: "/", whatsapp: "WhatsApp" })[lead.source]],
    ["Submission ID", lead.id], ["Submission date (UTC)", lead.createdAt.toISOString()],
  ].filter((entry) => Boolean(entry[1])).map(([label, value]) => [String(label), Array.isArray(value) ? value.join(", ") : String(value)]);
  return sendEmail({
    leadId: lead.id,
    replyTo: lead.email ? { name: lead.name, email: lead.email } : undefined,
    subject: `New MMS Enquiry \u2014 ${category} \u2014 ${lead.name}`,
    text: details.map(([key, value]) => `${key}: ${value}`).join("\n\n"),
    html: `<div style="font-family:Arial,sans-serif;color:#222;max-width:720px;margin:auto"><h2 style="color:#806128">Mosi Media Solutions</h2><p>New website enquiry. Please review the details below.</p><table style="border-collapse:collapse;width:100%">${details.map(([key, value]) => `<tr><th style="text-align:left;vertical-align:top;padding:8px">${escapeHtml(key)}</th><td style="padding:8px;white-space:pre-wrap">${escapeHtml(value)}</td></tr>`).join("")}</table></div>`,
  });
}
