import type { PackageCategory } from "./packages";

declare global {
  interface Window {
    dataLayer?: Record<string, unknown>[];
    mmsAnalyticsConsent?: boolean;
  }
}

/** No contact details, message, click identifiers or user-entered text in events.
 * GTM/GA4 and future advertising adapters can use mms:conversion after consent. */
export function trackPackageEvent(event: "package_select" | "generate_lead", category: PackageCategory, packageId: string) {
  const detail = { event, service_category: category, package_id: packageId, lead_source: "package", method: "enquiry_form" };
  if (typeof window === "undefined" || window.mmsAnalyticsConsent !== true) return;
  try {
    (window.dataLayer ??= []).push(detail);
    window.dispatchEvent(new CustomEvent("mms:conversion", { detail }));
  } catch { /* Analytics never changes a successfully saved enquiry. */ }
}
