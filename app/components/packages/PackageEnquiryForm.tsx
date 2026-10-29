"use client";

import { Suspense, useEffect, useState, useSyncExternalStore, type FormEvent } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { captureCampaign } from "@/lib/campaign-attribution";
import { trackPackageEvent } from "@/lib/package-analytics";
import { submitEnquiry, enquiryErrorMessage } from "@/lib/submit-enquiry";
import { resolvePackageSelection, isLegacyWeddingPackage, type PackageExperience } from "@/lib/packages";
import styles from "./packages.module.css";

type FormExperience = Pick<PackageExperience, "slug" | "service" | "note"> & {
  options: { id: string; name: string; location?: string }[];
};

const subscribe = () => () => {};
const browserReady = () => true;
const serverReady = () => false;

function EnquiryFields({ experience }: { experience: FormExperience }) {
  const params = useSearchParams();
  const pathname = usePathname();
  const router = useRouter();
  // A native pre-hydration submission must never place contact details in a URL.
  const hydrated = useSyncExternalStore(subscribe, browserReady, serverReady);
  const requested = params.get("package");
  const rawLocation = params.get("location");
  const packageId = resolvePackageSelection(experience.slug, requested, rawLocation);
  const [selectedPackage, setSelectedPackage] = useState(packageId);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [reference, setReference] = useState<string | null>(null);
  const date = params.get("preferred_date") || "";
  const initialDate = /^\d{4}-\d{2}-\d{2}$/.test(date) && !Number.isNaN(Date.parse(date)) ? date : "";

  const initialLocation = rawLocation || experience.options.find(opt => opt.id === packageId)?.location || "";
  const [location, setLocation] = useState(initialLocation);

  const [prevParams, setPrevParams] = useState(params);
  if (params !== prevParams) {
    setPrevParams(params);
    const curRequested = params.get("package");
    const curLoc = params.get("location");
    const resolved = resolvePackageSelection(experience.slug, curRequested, curLoc);
    setSelectedPackage(resolved);
    const targetLoc = curLoc ?? experience.options.find(opt => opt.id === resolved)?.location ?? "";
    setLocation(targetLoc);
  }

  useEffect(() => {
    if (requested && isLegacyWeddingPackage(experience.slug, requested)) {
      const next = new URLSearchParams(params.toString());
      next.set("package", "tailored");
      router.replace(`${pathname}?${next.toString()}#package-enquiry`, { scroll: false });
      return;
    }

    if (typeof window !== "undefined" && window.location.hash.includes("&")) {
      const [hash, ...rest] = window.location.hash.split("&");
      const extra = new URLSearchParams(rest.join("&"));
      const next = new URLSearchParams(window.location.search);
      let changed = false;
      extra.forEach((val, key) => {
        if (!next.has(key)) {
          next.set(key, val);
          changed = true;
        }
      });
      if (changed) {
        const nextLoc = next.get("location");
        const resolved = resolvePackageSelection(experience.slug, next.get("package"), nextLoc);
        next.set("package", resolved);
        router.replace(`${window.location.pathname}?${next.toString()}${hash}`, { scroll: false });
      }
    }
  }, [requested, experience.slug, params, pathname, router]);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (loading || reference) return;
    setLoading(true);
    setError(null);
    const data = new FormData(event.currentTarget);
    const selected = String(data.get("packageId") || selectedPackage || "tailored");
    const submittedPackageId = experience.options.some(option => option.id === selected) ? selected : "tailored";
    try {
      const result = await submitEnquiry("/api/leads", {
        kind: "package", category: experience.slug, packageId: submittedPackageId,
        name: String(data.get("name") || ""), email: String(data.get("email") || ""),
        phone: String(data.get("phone") || ""), date: String(data.get("date") || "") || undefined,
        location: location || undefined,
        details: String(data.get("details") || ""), website: String(data.get("website") || ""),
        attribution: captureCampaign(),
      });
      setReference(result.reference || `MMS-${result.submissionId}`);
      trackPackageEvent("generate_lead", experience.slug, submittedPackageId);
    } catch (cause) {
      setError(enquiryErrorMessage(cause));
    } finally { setLoading(false); }
  }

  if (reference) return <div className={styles.form} role="status" tabIndex={-1}>
    <h3>Your enquiry has been saved.</h3>
    <p>Thank you for sharing your plans. MMS will review your requirements and respond using your contact details.</p>
    <p>Enquiry reference: <strong>{reference}</strong></p>
    <p>This is an enquiry, not a confirmed booking. Availability and scope still need to be agreed.</p>
    <Link href="/packages" className={styles.lightLink}>Explore other packages</Link>
  </div>;

  return <form method="post" className={styles.form} onSubmit={handleSubmit} aria-busy={loading}>
    <p className={styles.formService}>Enquiring about: <strong>{experience.service}</strong></p>
    <fieldset disabled={!hydrated || loading} className={styles.fields}>
      <legend className="sr-only">Your package enquiry</legend>
      <div className={styles.formGrid}>
        <label>Your name<input name="name" autoComplete="name" required maxLength={120} /></label>
        <label>Email address<input name="email" type="email" autoComplete="email" required maxLength={254} /></label>
      </div>
      <div className={styles.formGrid}>
        <label>Phone (optional)<input name="phone" type="tel" autoComplete="tel" maxLength={32} pattern={String.raw`\+?[0-9 \(\)\-]{7,32}`} /></label>
        <label>Preferred date (optional)<input name="date" type="date" defaultValue={initialDate} aria-describedby="package-date-help" /></label>
      </div>
      <p id="package-date-help" className={styles.formHelp}>Still planning? Leave the date open. Sending an enquiry does not reserve a date.</p>
      <label>Package preference<select name="packageId" value={selectedPackage} onChange={event => {
        const nextId = event.target.value;
        setSelectedPackage(nextId);
        const optLocation = experience.options.find(option => option.id === nextId)?.location;
        const newLocation = optLocation ?? (nextId === "tailored" ? "" : location);
        setLocation(newLocation);
        const next = new URLSearchParams(params.toString());
        next.set("package", nextId);
        if (newLocation) {
          next.set("location", newLocation);
        } else {
          next.delete("location");
        }
        router.replace(`${pathname}?${next.toString()}#package-enquiry`, { scroll: false });
        trackPackageEvent("package_select", experience.slug, nextId);
      }}>
        <option value="tailored">Help me tailor a package</option>
        {experience.options.map(option => <option key={option.id} value={option.id}>{option.name}</option>)}
      </select></label>
      {(experience.slug === "weddings" || experience.options.some(opt => opt.location)) && (
        <label>Preferred location<input name="location" value={location} onChange={event => setLocation(event.target.value)} maxLength={200} placeholder="e.g. The Victoria Falls Hotel or Zambezi River" /></label>
      )}
      <label>Project details<textarea name="details" rows={5} required maxLength={5000}
        defaultValue={params.get("details")?.slice(0, 5000) || `I’d like to discuss ${experience.service.toLowerCase()}.\nLocation: \nMy priorities: `} /></label>
      {experience.note && <p className={styles.formHelp}>{experience.note}</p>}
      <input name="website" type="text" className="hidden" tabIndex={-1} autoComplete="off" aria-hidden="true" />
      <button type="submit" className={styles.submit}>{loading ? "Saving your enquiry…" : "Send my package enquiry"}</button>
    </fieldset>
    {error && <p role="alert" className={styles.error}>{error} Your details are still here so you can retry.</p>}
    <p className={styles.formHelp}>We use your details to respond to your enquiry. <Link href="/privacy">Enquiry privacy</Link></p>
    <noscript><p>Enable JavaScript to use the form, or email <a href="mailto:info@mosimediasolutions.com">info@mosimediasolutions.com</a> with your package enquiry.</p></noscript>
  </form>;
}

export default function PackageEnquiryForm({ experience }: { experience: FormExperience }) {
  return <Suspense fallback={<div className={styles.form}>
    <p role="status">Preparing your package enquiry…</p>
    <noscript><p>Enable JavaScript to use the form, or email <a href="mailto:info@mosimediasolutions.com">info@mosimediasolutions.com</a> with your package enquiry.</p></noscript>
  </div>}><EnquiryFields experience={experience} /></Suspense>;
}
