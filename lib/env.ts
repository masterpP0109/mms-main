import "server-only";
import { z } from "zod";

const optionalSecret = z.preprocess((value) => value === "" ? undefined : value, z.string().trim().min(1).optional());
const serverEnvSchema = z.object({
  DATABASE_URL: z.string().trim().min(1).refine(value => {
    try { const url = new URL(value); return ["postgres:", "postgresql:"].includes(url.protocol) && Boolean(url.hostname) && url.pathname.length > 1; }
    catch { return false; }
  }, "Use a PostgreSQL connection URL with a database name"),
  RESEND_API_KEY: optionalSecret,
  MMS_FROM_EMAIL: optionalSecret,
  MMS_NOTIFICATION_EMAIL: optionalSecret,
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
    RESEND_API_KEY: z.string().trim().min(1),
    MMS_FROM_EMAIL: z.string().trim().email(),
    MMS_NOTIFICATION_EMAIL: z.string().trim().email(),
  }).safeParse(env);
  if (!result.success) throw new Error("Email provider is not configured");
  return { apiKey: result.data.RESEND_API_KEY, from: result.data.MMS_FROM_EMAIL, to: result.data.MMS_NOTIFICATION_EMAIL };
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
