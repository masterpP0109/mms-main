import "server-only";
import nodemailer from "nodemailer";
import { z } from "zod";
import { requireEmailEnv } from "@/lib/env";
import { SmtpNotificationError, smtpFailure } from "./errors";

type Email = { replyTo?: { name: string; email: string }; subject: string; text: string; html: string; leadId: string } & ({ kind?: "notification"; to?: never } | { kind: "acknowledgement"; to: string });

// Bound the whole operation as well as each socket phase, including slow peers.
async function smtpDeadline<T>(operation: Promise<T>, retrySafe: boolean): Promise<T> {
  let timer: ReturnType<typeof setTimeout> | undefined;
  try {
    return await Promise.race([operation, new Promise<never>((_, reject) => {
      timer = setTimeout(() => reject(new SmtpNotificationError("ETIMEDOUT", retrySafe)), 45_000);
    })]);
  } finally { clearTimeout(timer); }
}

export function createSmtpTransport() {
  let config: ReturnType<typeof requireEmailEnv>;
  try { config = requireEmailEnv(); }
  catch { throw new SmtpNotificationError("ECONFIG", true); }
  const transporter = nodemailer.createTransport({
    host: config.host, port: config.port, secure: true,
    auth: { user: config.user, pass: config.password },
    tls: { rejectUnauthorized: true, minVersion: "TLSv1.2", servername: config.host },
    connectionTimeout: 15000, greetingTimeout: 15000, socketTimeout: 20000, dnsTimeout: 10000,
    logger: false, debug: false, disableFileAccess: true, disableUrlAccess: true,
  });
  return { transporter, config };
}

export async function verifySmtp(): Promise<void> {
  const { transporter } = createSmtpTransport();
  try { await smtpDeadline(transporter.verify(), true); }
  catch (error) { throw smtpFailure(error); }
  finally { transporter.close(); }
}

export async function sendEmail(email: Email): Promise<string> {
  const { transporter, config } = createSmtpTransport();
  try {
    const recipient = email.kind === "acknowledgement" ? z.email().parse(email.to) : config.to;
    const result = await smtpDeadline(transporter.sendMail({
      from: { name: "Mosi Media Solutions", address: config.from }, to: recipient,
      replyTo: email.kind === "acknowledgement" ? config.from : email.replyTo && z.email().safeParse(email.replyTo.email).success ? email.replyTo.email : undefined,
      subject: email.subject.replace(/[\r\n]/g, " "), text: email.text, html: email.html,
      // Stable for reconciliation; SMTP servers do not promise deduplication.
      messageId: `<mms-${email.kind === "acknowledgement" ? "ack" : "lead"}-${email.leadId.replace(/[^a-zA-Z0-9_-]/g, "")}@${config.from.split("@")[1]}>`,
    }), false);
    const accepted = result.accepted?.some((address) => address.toLowerCase() === recipient.toLowerCase());
    if (!accepted || result.rejected?.length || !/^250(?:[ -]|$)/.test(result.response || "") || !result.messageId) {
      throw new SmtpNotificationError("EACCEPTANCE", false);
    }
    return result.messageId;
  } catch (error) {
    const failure = smtpFailure(error);
    console.error("SMTP notification failed", { leadId: email.leadId, code: failure.code, responseCode: failure.responseCode, retrySafe: failure.retrySafe });
    throw failure;
  } finally { transporter.close(); }
}
