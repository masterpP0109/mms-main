import "server-only";
import { z } from "zod";

const optionalSecret = z.preprocess((value) => value === "" ? undefined : value, z.string().trim().min(1).optional());
const serverEnvSchema = z.object({
  DATABASE_URL: z.string().trim().min(1).refine(value => {
    try { const url = new URL(value); return ["postgres:", "postgresql:"].includes(url.protocol) && Boolean(url.hostname) && url.pathname.length > 1; }
    catch { return false; }
  }, "Use a PostgreSQL connection URL with a database name"),
  SMTP_HOST: optionalSecret,
  SMTP_PORT: optionalSecret,
  SMTP_SECURE: optionalSecret,
  SMTP_USER: optionalSecret,
  SMTP_PASSWORD: z.preprocess(value => value === "" ? undefined : value, z.string().min(1).optional()),
  CONTACT_EMAIL_TO: optionalSecret,
  WHATSAPP_ACCESS_TOKEN: optionalSecret,
  WHATSAPP_PHONE_NUMBER_ID: optionalSecret,
  WHATSAPP_BUSINESS_ACCOUNT_ID: optionalSecret,
  WHATSAPP_APP_SECRET: optionalSecret,
  WHATSAPP_VERIFY_TOKEN: optionalSecret,
  WHATSAPP_NOTIFICATION_TO: z.string().trim().min(1).default("263788111391"),
  WHATSAPP_NOTIFICATION_TEMPLATE: z.string().trim().min(1).default("new_lead_notification"),
  WHATSAPP_API_VERSION: z.string().regex(/^v\d+\.\d+$/).default("v23.0"),
});

export type ServerEnv = z.infer<typeof serverEnvSchema>;

export function getServerEnv(): ServerEnv {
  const result = serverEnvSchema.safeParse(process.env);
  if (!result.success) {
    throw new Error(`Invalid server configuration: ${result.error.issues.map((i) => i.path.join(".")).join(", ")}`);
  }
  return result.data;
}

export function requireEmailEnv(env = process.env) {
  const result = z.object({
    SMTP_HOST: z.string().trim().min(1).regex(/^[a-zA-Z0-9.-]+$/),
    SMTP_PORT: z.coerce.number().pipe(z.literal(465)),
    SMTP_SECURE: z.literal("true").default("true"),
    SMTP_USER: z.string().trim().email(),
    // Do not trim or otherwise transform passwords.
    SMTP_PASSWORD: z.string().min(1),
    CONTACT_EMAIL_TO: z.string().trim().email(),
  }).safeParse(env);
  if (!result.success) throw new Error(`SMTP is not configured: ${result.error.issues.map(issue => issue.path.join(".")).join(", ")}`);
  return { host: result.data.SMTP_HOST, port: result.data.SMTP_PORT, user: result.data.SMTP_USER, password: result.data.SMTP_PASSWORD, from: result.data.SMTP_USER, to: result.data.CONTACT_EMAIL_TO };
}

export function requireWhatsAppOutboundEnv(env = getServerEnv()) {
  if (!env.WHATSAPP_ACCESS_TOKEN || !env.WHATSAPP_PHONE_NUMBER_ID || !env.WHATSAPP_NOTIFICATION_TO) {
    throw new Error("WhatsApp outbound provider is not configured");
  }
  return {
    accessToken: env.WHATSAPP_ACCESS_TOKEN,
    phoneNumberId: env.WHATSAPP_PHONE_NUMBER_ID,
    recipient: env.WHATSAPP_NOTIFICATION_TO,
    template: env.WHATSAPP_NOTIFICATION_TEMPLATE,
    apiVersion: env.WHATSAPP_API_VERSION,
  };
}

export function isWhatsAppOutboundConfigured() {
  try { requireWhatsAppOutboundEnv(); return true; }
  catch { return false; }
}
