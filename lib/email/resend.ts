import "server-only";
import { Resend } from "resend";
import { z } from "zod";
import { requireEmailEnv } from "@/lib/env";

type Email = { replyTo?: { name: string; email: string }; subject: string; text: string; html: string; leadId: string };
export async function sendEmail(email: Email): Promise<string> {
  const config = requireEmailEnv();
  try {
    const { data, error } = await new Resend(config.apiKey).emails.send({
      from: config.from, to: [config.to],
      replyTo: email.replyTo && z.email().safeParse(email.replyTo.email).success ? email.replyTo.email : undefined,
      subject: email.subject.replace(/[\r\n]/g, " "), text: email.text, html: email.html,
    }, { idempotencyKey: `mms-lead/${email.leadId}`, signal: AbortSignal.timeout(15000) });
    if (error || !data?.id) {
      // Never log provider messages, request bodies, email addresses or credentials.
      console.error("Resend notification rejected", { leadId: email.leadId, status: error?.statusCode ?? null });
      throw new Error("Email provider rejected the notification");
    }
    return data.id;
  } catch {
    throw new Error("Email provider rejected the notification");
  }
}
