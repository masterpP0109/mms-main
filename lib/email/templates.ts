import type { LeadInput } from "@/lib/validation/leads";
import { briefLabel } from "@/lib/project-brief";
import { enquiryReference } from "@/lib/enquiry-reference";

export type EmailLead = LeadInput & { id: string; createdAt: Date };
export const MMS_EMAIL = "info@mosimediasolutions.com";
const escape = (value: string) => value.replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]!);
const label = (value: unknown): string => Array.isArray(value) ? value.filter(v => typeof v === "string").map(briefLabel).join(", ") : typeof value === "string" ? briefLabel(value) : "";
type Row = [string, string | undefined];

/** Zimbabwe mobile prefixes only. Do not guess a country for foreign/ambiguous numbers. */
export function zimbabweWhatsAppLink(phone?: string): string | undefined {
  if (!phone || !/^\+?[\d ()-]+$/.test(phone)) return undefined;
  let digits = phone.replace(/[ ()-]/g, "");
  if (digits.startsWith("+")) digits = digits.slice(1);
  else if (digits.startsWith("00")) digits = digits.slice(2);
  if (/^0(?:71|73|77|78)\d{7}$/.test(digits)) digits = `263${digits.slice(1)}`;
  return /^263(?:71|73|77|78)\d{7}$/.test(digits) ? `https://wa.me/${digits}` : undefined;
}

export function enquiryRows(lead: EmailLead, audience: "mms" | "customer" = "mms"): Row[] {
  const meta = lead.metadata ?? {};
  const services = label(meta.service || meta.services) || label(lead.projectType) || "General enquiry";
  const contact: Row[] = [["Full name", lead.name], ["Contact email", lead.email || "Not provided"], ["Phone / WhatsApp", lead.phone || "Not provided"]];
  // Acknowledgements contain only the requested summary, not a reflection of
  // arbitrary message text or extra metadata from an unverified public sender.
  if (audience === "customer") return [...contact, ["Requested service", services], ["Timeline", label(meta.timeline) || label(meta.date)]]
    .filter((row): row is [string, string] => typeof row[1] === "string" && row[1].length > 0);
  const details: Row[] = [
    ["Requested service", services], ["Timeline", label(meta.timeline) || label(meta.date)],
    ["Event / project type", label(lead.projectType) !== services ? label(lead.projectType) : undefined], ["Event date", meta.date as string | undefined],
    ["Venue / location", meta.venue as string | undefined], ["Attendees", meta.delegates as string | undefined],
    ["Audience type", label(meta.audience)], ["Message / additional requirements", lead.message],
  ];
  return [...contact, ...(audience === "mms" ? [["Organisation", lead.organisation], ["Organisation type", meta.organisationType]] as Row[] : []), ...details]
    .filter((row): row is [string, string] => typeof row[1] === "string" && row[1].length > 0);
}

export function renderEnquiryEmail(lead: EmailLead, audience: "mms" | "customer") {
  const customer = audience === "customer";
  const reference = enquiryReference(lead.id);
  const title = customer ? "Thank you for your enquiry" : "New MMS enquiry";
  const intro = customer
    ? `Hello ${lead.name}, thank you for contacting Mosi Media Solutions. We have received your enquiry. Our team will review your requirements and contact you to discuss the next steps.`
    : "A new enquiry has been received. Review the requirements below and reply to the client to discuss availability and a proposal.";
  const rows = enquiryRows(lead, audience);
  const keepReference = `Please keep your enquiry reference when contacting us: ${reference}.`;
  const submitted = new Intl.DateTimeFormat("en-GB", { dateStyle: "long", timeStyle: "short", timeZone: "Africa/Harare" }).format(lead.createdAt) + " (Zimbabwe, UTC+2)";
  const technical: Row[] = customer ? [] : [
    ["Enquiry reference", reference],
    ["Source page", label(lead.metadata?.origin) || ({ contact: "/contact", conference: "/conference-production", project_builder: "/#builder", whatsapp: "WhatsApp" })[lead.source]],
    ["Submitted", submitted],
  ];
  const whatsapp = customer ? undefined : zimbabweWhatsAppLink(lead.phone);
  const footer = `Mosi Media Solutions · Victoria Falls, Zimbabwe\n${MMS_EMAIL}\nhttps://www.mosimediasolutions.com`;
  const text = [title, intro, ...rows.map(([key, value]) => `${key}: ${value}`), ...(whatsapp ? [`Contact on WhatsApp: ${whatsapp}`] : []), customer ? keepReference : "Internal reference details", ...technical.map(([key, value]) => `${key}: ${value}`), footer].join("\n\n");
  const renderRows = (items: Row[]) => items.map(([key, value]) => `<div style="padding:12px 0;border-bottom:1px solid #f0dce0;overflow-wrap:anywhere;word-break:break-word"><p style="margin:0 0 5px;font-size:12px;font-weight:bold;color:#981b28">${escape(key)}</p><p style="margin:0;font-size:15px;white-space:pre-wrap">${escape(value ?? "")}</p></div>`).join("");
  const html = `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>${title}</title><style>
.email-button { transition:background-color .25s ease,color .25s ease,box-shadow .25s ease; }
.email-button:hover,.email-button:focus { background-color:#fff !important;color:#981b28 !important;box-shadow:0 0 0 2px #981b28; }
.email-link:hover,.email-link:focus { color:#ed1c24 !important; }
@media(prefers-reduced-motion:reduce) { .email-button { transition:none !important; } }
</style></head><body style="margin:0;padding:0;background:#f5f5f5;color:#222;font-family:Arial,Helvetica,sans-serif"><table role="presentation" width="100%" cellpadding="0" cellspacing="0"><tr><td align="center" style="padding:24px 12px"><table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:640px;background:#fff;border:1px solid #eadde0"><tr><td style="padding:28px 24px;background:#050507;color:#fda4af;border-bottom:4px solid #981b28"><p style="margin:0;font-size:12px;letter-spacing:2px">MOSI MEDIA SOLUTIONS</p><h1 style="margin:14px 0 0;color:#fff;font-size:26px;line-height:1.3">${title}</h1></td></tr><tr><td style="padding:24px;line-height:1.6"><p style="margin:0 0 24px">${escape(intro)}</p>${customer ? `<p style="padding:12px;background:#fff5f6;overflow-wrap:anywhere">${escape(keepReference)}</p>` : ""}${renderRows(rows)}${whatsapp ? `<p><a class="email-button" href="${whatsapp}" style="display:inline-block;padding:12px 16px;border:1px solid #981b28;border-radius:24px;background-color:#981b28;color:#fff;font-weight:bold;text-decoration:none">Contact client on WhatsApp</a></p>` : ""}</td></tr>${customer ? "" : `<tr><td style="padding:16px 24px;background:#f5f5f5;color:#666;font-size:12px;line-height:1.7;overflow-wrap:anywhere"><strong>Internal reference details</strong>${technical.map(([key, value]) => `<br>${escape(key)}: ${escape(value ?? "")}`).join("")}</td></tr>`}<tr><td style="padding:20px 24px;background:#fff5f6;font-size:13px;line-height:1.7;color:#4b5563"><strong>Mosi Media Solutions</strong><br>Victoria Falls, Zimbabwe<br><a class="email-link" style="color:#981b28;word-break:break-all" href="mailto:${MMS_EMAIL}">${MMS_EMAIL}</a><br><a class="email-link" style="color:#981b28" href="https://www.mosimediasolutions.com">Visit our website</a></td></tr></table></td></tr></table></body></html>`;
  return { subject: customer ? `Your MMS enquiry — ${reference}` : `New MMS enquiry — ${reference}`, text, html };
}
