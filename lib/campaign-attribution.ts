import { CONTACT_ORIGIN_PATTERN } from "./contact-referral";

export const campaignKeys = ["utm_source", "utm_medium", "utm_campaign", "utm_term", "utm_content", "utm_id", "gclid", "gbraid", "wbraid", "fbclid"] as const;
export type CampaignAttribution = Partial<Record<typeof campaignKeys[number], string>> & { landingPage?: string };
const storageKey = "mms:campaign:v1";
const maxAge = 30 * 60 * 1000;

export function attributionFromParams(params: URLSearchParams): CampaignAttribution {
  const result: CampaignAttribution = {};
  for (const key of campaignKeys) {
    const value = params.get(key)?.trim().slice(0, 200).replace(/[\x00-\x1f\x7f]/g, "");
    if (value) result[key] = value;
  }
  return result;
}

/** Session-only last campaign touch; never store the full URL or personal form data. */
export function captureCampaign(): CampaignAttribution {
  if (typeof window === "undefined") return {};
  const current = attributionFromParams(new URLSearchParams(window.location.search));
  if (Object.keys(current).length) {
    const path = window.location.pathname;
    const campaign = { ...current, ...(path.length <= 300 && CONTACT_ORIGIN_PATTERN.test(path) ? { landingPage: path } : {}) };
    try { sessionStorage.setItem(storageKey, JSON.stringify({ at: Date.now(), campaign })); } catch { /* Storage may be disabled. */ }
    return campaign;
  }
  try {
    const saved = JSON.parse(sessionStorage.getItem(storageKey) || "null");
    if (saved && typeof saved.at === "number" && saved.at <= Date.now() && Date.now() - saved.at < maxAge && saved.campaign && typeof saved.campaign === "object") {
      const clean = attributionFromParams(new URLSearchParams(saved.campaign));
      if (typeof saved.campaign.landingPage === "string" && saved.campaign.landingPage.length <= 300 && CONTACT_ORIGIN_PATTERN.test(saved.campaign.landingPage)) clean.landingPage = saved.campaign.landingPage;
      return clean;
    }
    sessionStorage.removeItem(storageKey);
  } catch { /* An unavailable or invalid session must not block an enquiry. */ }
  return {};
}
