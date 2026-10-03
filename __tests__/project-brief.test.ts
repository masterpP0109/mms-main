import { projectBriefWhatsAppUrl } from "@/lib/project-brief";

it("routes the complete, encoded builder brief to the MMS WhatsApp number", () => {
  const details = ("Sound & video\n" + "Full project description. ".repeat(20)).trim();
  const url = new URL(projectBriefWhatsAppUrl({ goal: "corporate", audience: "large-event", timeline: "soon", name: "Ada", email: "ada@example.com", phone: "", details }));
  expect(url.pathname).toBe("/263788111391");
  const message = url.searchParams.get("text");
  for (const value of ["Corporate Event", "Large Event", "Soon (1–3 months)", "Ada", "ada@example.com", "Not provided", details]) expect(message).toContain(value);
});
