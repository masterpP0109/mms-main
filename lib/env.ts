import { z } from "zod";

const optionalSecret = z.string().trim().min(1).optional();
const serverEnvSchema = z.object({
  DATABASE_URL: z.string().trim().min(1),
  SENDLAYER_API_KEY: optionalSecret,
  MMS_FROM_EMAIL: z.string().trim().email().optional(),
  MMS_NOTIFICATION_EMAIL: z.string().email().optional(),
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

export function requireEmailEnv(env = getServerEnv()) {
  if (!env.SENDLAYER_API_KEY || !env.MMS_FROM_EMAIL || !env.MMS_NOTIFICATION_EMAIL) {
    throw new Error("Email provider is not configured");
  }
  return {
    apiKey: env.SENDLAYER_API_KEY,
    from: env.MMS_FROM_EMAIL,
    to: env.MMS_NOTIFICATION_EMAIL,
  };
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
