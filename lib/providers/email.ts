import { Resend } from "resend";
import { requireEmailEnv } from "@/lib/env";
import type { LeadInput } from "@/lib/validation/leads";

const escapeHtml = (value: string) => value.replace(/[&<>'"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", "'": "&#39;", '"': "&quot;" })[c]!);

export async function sendLeadEmail(lead: LeadInput & { id: string }) {
  const config = requireEmailEnv();
  const resend = new Resend(config.apiKey);
  const details = [
    ["Source", lead.source], ["Name", lead.name], ["Email", lead.email], ["Phone", lead.phone],
    ["Organisation", lead.organisation], ["Project type", lead.projectType], ["Message", lead.message],
  ].filter((entry): entry is [string, string] => Boolean(entry[1]));
  const { data, error } = await resend.emails.send({
    from: config.from,
    to: [config.to],
    replyTo: lead.email,
    subject: `New MMS ${lead.source.replaceAll("_", " ")} enquiry — ${lead.name}`,
    text: details.map(([key, value]) => `${key}: ${value}`).join("\n"),
    html: `<h2>New MMS enquiry</h2>${details.map(([key, value]) => `<p><strong>${escapeHtml(key)}:</strong> ${escapeHtml(value)}</p>`).join("")}<p>Lead ID: ${escapeHtml(lead.id)}</p>`,
    headers: { "X-Entity-Ref-ID": lead.id },
  });
  if (error || !data?.id) throw new Error("Email provider rejected the notification");
  return data.id;
}
