export const BUILDER_WHATSAPP_NUMBER = "263788111391";

const labels: Record<string, string> = {
  conference: "Conference Production", event: "Corporate Event", other: "General Enquiry",
  wedding: "Wedding Film", corporate: "Corporate Event", brand: "Brand Campaign", content: "Content Package",
  intimate: "Intimate Gathering", "large-event": "Large Event", "corporate-audience": "Corporate Audience", "digital-first": "Digital-First",
  urgent: "Urgent (within 2 weeks)", soon: "Soon (1–3 months)", planned: "Planning Ahead (3–6 months)", flexible: "Just Exploring (no fixed date)",
};

export function briefLabel(value: string) {
  return labels[value] || value;
}

export type ProjectBrief = {
  goal: string; audience: string; timeline: string; name: string; email: string; phone: string; details: string;
};

export function projectBriefRows(brief: ProjectBrief) {
  return [
    { label: "Project Goal", value: briefLabel(brief.goal) },
    { label: "Audience / Event Type", value: briefLabel(brief.audience) },
    { label: "Timeline", value: briefLabel(brief.timeline) },
    { label: "Name", value: brief.name.trim() },
    { label: "Email", value: brief.email.trim() },
    { label: "Phone", value: brief.phone.trim() || "Not provided" },
    { label: "Project Details", value: brief.details.trim() || "Not provided" },
  ];
}

export function projectBriefWhatsAppUrl(brief: ProjectBrief) {
  const message = ["*MOSI MEDIA SOLUTIONS*", "*Project brief · Quote request*", "", ...projectBriefRows(brief).map(({ label, value }) => `*${label}*\n${value}`), "", "Please send me a quote for this project."].join("\n\n");
  return `https://wa.me/${BUILDER_WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
}
