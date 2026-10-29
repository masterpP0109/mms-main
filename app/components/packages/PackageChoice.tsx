"use client";
import Link from "next/link";
import { packageEnquiryHref, type PackageCategory } from "@/lib/packages";
import { trackPackageEvent } from "@/lib/package-analytics";

export default function PackageChoice({ category, id, name }: { category: PackageCategory; id: string; name: string }) {
  return <Link className="mms-button inline-flex items-center justify-center gap-2 px-6 py-2.5 text-xs uppercase tracking-widest" href={packageEnquiryHref(category, id)} onClick={() => trackPackageEvent("package_select", category, id)} aria-label={`Enquire about ${name}`}>Discuss this option <span aria-hidden="true">↗</span></Link>;
}
