import "server-only";

export class SmtpNotificationError extends Error {
  constructor(public readonly code: string, public readonly retrySafe: boolean, public readonly responseCode?: number) {
    super(`SMTP notification not accepted (${code}${responseCode ? `, ${responseCode}` : ""})`);
    this.name = "SmtpNotificationError";
  }
}

// Never forward raw provider messages, commands, addresses or credentials to logs.
export function smtpFailure(error: unknown): SmtpNotificationError {
  if (error instanceof SmtpNotificationError) return error;
  const candidate = error && typeof error === "object" ? error as Record<string, unknown> : {};
  const allowedCodes = ["EAUTH", "EDNS", "ECONNECTION", "ECONNREFUSED", "ETIMEDOUT", "ESOCKET", "ETLS", "EENVELOPE", "EMESSAGE", "EPROTOCOL", "ECONNRESET", "ENOENT", "ECONFIG"];
  const code = typeof candidate.code === "string" && allowedCodes.includes(candidate.code) ? candidate.code : "EUNKNOWN";
  const responseCode = typeof candidate.responseCode === "number" && candidate.responseCode >= 400 && candidate.responseCode <= 599 ? candidate.responseCode : undefined;
  // An explicit negative SMTP reply means no acceptance. A lost connection or
  // timeout during/after DATA is ambiguous and must never be retried blindly.
  // Nodemailer can also label a post-DATA disconnect as CONN. The command
  // label alone cannot prove that no message was accepted.
  const retrySafe = Boolean(responseCode) || ["EAUTH", "EDNS", "ECONNREFUSED", "ECONFIG"].includes(code);
  return new SmtpNotificationError(code, retrySafe, responseCode);
}
