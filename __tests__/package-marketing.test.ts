import { attributionFromParams, captureCampaign } from "@/lib/campaign-attribution";
import { trackPackageEvent } from "@/lib/package-analytics";

beforeEach(() => { sessionStorage.clear(); window.history.replaceState({}, "", "/"); delete window.mmsAnalyticsConsent; delete window.dataLayer; });
it("captures only bounded campaign fields and retains them across internal navigation", () => {
  window.history.replaceState({}, "", "/?utm_source=campaign&utm_campaign=signature&email=private@example.com");
  expect(captureCampaign()).toEqual({ utm_source: "campaign", utm_campaign: "signature", landingPage: "/" });
  window.history.replaceState({}, "", "/packages/podcasts");
  expect(captureCampaign()).toMatchObject({ utm_source: "campaign", landingPage: "/" });
  expect(JSON.stringify(Object.entries(sessionStorage))).not.toContain("private@example.com");
  expect(attributionFromParams(new URLSearchParams({ utm_content: "x".repeat(400) })).utm_content).toHaveLength(200);
});
it("expires campaign attribution after 30 minutes", () => {
  window.history.replaceState({}, "", "/?utm_source=old");
  const now = Date.now();
  jest.spyOn(Date, "now").mockReturnValue(now);
  captureCampaign();
  window.history.replaceState({}, "", "/packages");
  jest.spyOn(Date, "now").mockReturnValue(now + 31 * 60 * 1000);
  expect(captureCampaign()).toEqual({});
  jest.restoreAllMocks();
});
it("ignores malformed storage and works when storage is blocked", () => {
  sessionStorage.setItem("mms:campaign:v1", "bad json");
  expect(captureCampaign()).toEqual({});
  jest.spyOn(Storage.prototype, "getItem").mockImplementation(() => { throw new Error("Blocked"); });
  expect(captureCampaign()).toEqual({});
  jest.restoreAllMocks();
});
it("emits GA4-compatible events after consent with no personal form data", () => {
  trackPackageEvent("generate_lead", "drone", "aerial-stills");
  expect(window.dataLayer).toBeUndefined();
  window.mmsAnalyticsConsent = true;
  const listener = jest.fn();
  window.addEventListener("mms:conversion", listener);
  trackPackageEvent("generate_lead", "drone", "aerial-stills");
  expect(window.dataLayer).toEqual([{ event: "generate_lead", service_category: "drone", package_id: "aerial-stills", lead_source: "package", method: "enquiry_form" }]);
  expect(listener).toHaveBeenCalledTimes(1);
  window.removeEventListener("mms:conversion", listener);
});

it("does not refresh expiry while campaign parameters remain on the landing URL", () => {
  sessionStorage.clear();
  window.history.replaceState({}, "", "/?utm_source=lasting");
  const now = jest.spyOn(Date, "now").mockReturnValue(1000000);
  expect(captureCampaign()).toMatchObject({ utm_source: "lasting" });
  now.mockReturnValue(1000000 + 31 * 60 * 1000);
  expect(captureCampaign()).toEqual({});
  expect(captureCampaign()).toEqual({});
  now.mockRestore();
});
