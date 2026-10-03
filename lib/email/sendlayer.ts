import "server-only";
import { requireEmailEnv } from "@/lib/env";

type Address = { name: string; email: string };
type Email = { replyTo?: Address; subject: string; text: string; html: string };

export async function sendEmail(email: Email): Promise<string> {
  const config = requireEmailEnv();
  try {
    const response = await fetch("https://console.sendlayer.com/api/v1/email", {
      method: "POST",
      headers: { Authorization: `Bearer ${config.apiKey}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        From: { name: "Mosi Media Solutions", email: config.from },
        To: [{ name: "MMS Team", email: config.to }],
        ...(email.replyTo ? { ReplyTo: [email.replyTo] } : {}),
        Subject: email.subject.replace(/[\r\n]/g, " "),
        ContentType: "HTML", HTMLContent: email.html, PlainContent: email.text,
      }),
      cache: "no-store",
      signal: AbortSignal.timeout(15000),
    });
    const body = await response.json().catch(() => null) as { MessageID?: string; Errors?: { Code?: number }[] } | null;
    if (!response.ok || body?.Errors?.length || typeof body?.MessageID !== "string" || !body.MessageID) {
      console.error("SendLayer rejected email", { status: response.status, codes: body?.Errors?.map((error) => error.Code).filter((code) => typeof code === "number") });
      throw new Error("Email provider rejected the notification");
    }
    return body.MessageID;
  } catch (error) {
    console.error("SendLayer request failed", { type: error instanceof Error ? error.name : "Unknown" });
    throw new Error("Email provider rejected the notification");
  }
}
