import type { LeadInput } from "@/lib/validation/leads";
import { briefLabel } from "@/lib/project-brief";

export type EmailLead = LeadInput & { id: string; createdAt: Date };
export const MMS_EMAIL = "info@mosimediasolutions.com";
const escape = (value: string) => value.replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]!);

export function enquiryRows(lead: EmailLead): [string, string][] {
  const meta = lead.metadata ?? {};
  const label = (value: unknown) => Array.isArray(value) ? value.join(", ") : typeof value === "string" ? briefLabel(value) : "";
  return [
    ["Customer name", lead.name], ["Email", lead.email || "Not provided"],
    ["Phone / WhatsApp", lead.phone || "Not provided"], ["Organisation", lead.organisation],
    ["Requested service", label(meta.service || meta.services || lead.projectType) || "General enquiry"],
    ["Event type", lead.source === "conference" ? lead.projectType : undefined],
    ["Event date", meta.date], ["Venue / location", meta.venue], ["Attendees", meta.delegates],
    ["Organisation type", meta.organisationType], ["Audience / event type", label(meta.audience)],
    ["Timeline", label(meta.timeline)], ["Message / project details", lead.message],
    ["Originating page", meta.origin || ({ contact: "/contact", conference: "/conference-production", project_builder: "/", whatsapp: "WhatsApp" })[lead.source]],
    ["Enquiry reference", lead.id], ["Submission date (UTC)", lead.createdAt.toISOString()],
  ].filter((row): row is [string, string] => typeof row[1] === "string" && row[1].length > 0);
}

export function renderEnquiryEmail(lead: EmailLead, audience: "mms" | "customer") {
  const customer = audience === "customer";
  const title = customer ? "Thank you for your enquiry" : "New MMS enquiry";
  const intro = customer
    ? `Thank you, ${lead.name}. Your enquiry has been saved. Our team will review your requirements and respond using the contact details you provided.`
    : "A new enquiry has been saved. Review the details below and reply directly to the customer.";
  const rows = enquiryRows(lead);
  const footer = `Mosi Media Solutions · Victoria Falls, Zimbabwe\n${MMS_EMAIL}\nhttps://www.mosimediasolutions.com`;
  const text = [title, intro, ...rows.map(([key, value]) => `${key}: ${value}`), "Please keep your enquiry reference when contacting us.", footer].join("\n\n");
  // Single-column tables and inline styles work without remote images or media queries.
  const html = `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>${title}</title></head><body style="margin:0;padding:0;background:#f4f1eb;color:#222;font-family:Arial,Helvetica,sans-serif"><table role="presentation" width="100%" cellpadding="0" cellspacing="0"><tr><td align="center" style="padding:24px 12px"><table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:640px;background:#fff;border:1px solid #ded4c1"><tr><td style="padding:28px 24px;background:#050507;color:#e5cf9a;border-bottom:4px solid #c5a880"><p style="margin:0;font-size:12px;letter-spacing:2px">MOSI MEDIA SOLUTIONS</p><h1 style="margin:14px 0 0;color:#fff;font-size:26px;line-height:1.3">${title}</h1></td></tr><tr><td style="padding:24px;line-height:1.6"><p style="margin:0 0 24px">${escape(intro)}</p>${rows.map(([key, value]) => `<div style="padding:12px 0;border-bottom:1px solid #eee;overflow-wrap:anywhere;word-break:break-word"><p style="margin:0 0 5px;font-size:12px;font-weight:bold;color:#65502e">${escape(key)}</p><p style="margin:0;font-size:15px;white-space:pre-wrap">${escape(value)}</p></div>`).join("")}<p style="margin:24px 0 0;font-size:13px">Please keep your enquiry reference when contacting us.</p></td></tr><tr><td style="padding:20px 24px;background:#f8f5ef;font-size:13px;line-height:1.7;color:#494337"><strong>Mosi Media Solutions</strong><br>Victoria Falls, Zimbabwe<br><a style="color:#65502e;word-break:break-all" href="mailto:${MMS_EMAIL}">${MMS_EMAIL}</a><br><a style="color:#65502e" href="https://www.mosimediasolutions.com">Visit our website</a></td></tr></table></td></tr></table></body></html>`;
  return { subject: customer ? `Your MMS enquiry — ${lead.id}` : `New MMS enquiry — ${lead.id}`, text, html };
}
