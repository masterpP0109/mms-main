"use client";
import Link from "next/link";
import { packageEnquiryHref, type PackageCategory } from "@/lib/packages";
import { trackPackageEvent } from "@/lib/package-analytics";
import styles from "./packages.module.css";

export default function PackageChoice({ category, id, name }: { category: PackageCategory; id: string; name: string }) {
  return <Link className={styles.optionCta} href={packageEnquiryHref(category, id)} onClick={() => trackPackageEvent("package_select", category, id)} aria-label={`Enquire about ${name}`}>Discuss this option <span aria-hidden="true">↗</span></Link>;
}
