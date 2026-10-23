import type { Metadata } from "next";
import { packagePath, type PackageExperience } from "./packages";

export const siteOrigin = () => process.env.SITE_URL || "https://www.mosimediasolutions.com";
export function packageMetadata(experience: PackageExperience): Metadata {
  const title = `${experience.title} | Mosi Media Solutions`;
  const url = packagePath(experience.slug);
  return {
    title, description: experience.description, alternates: { canonical: url },
    openGraph: { title, description: experience.description, url, type: "website", images: [{ url: experience.image, alt: experience.imageAlt }] },
    twitter: { card: "summary_large_image", title, description: experience.description, images: [experience.image] },
  };
}

export function packageStructuredData(experience: PackageExperience) {
  const origin = siteOrigin();
  const url = new URL(packagePath(experience.slug), origin).href;
  return {
    "@context": "https://schema.org", "@graph": [
      { "@type": "Service", "@id": `${url}#service`, name: experience.service, description: experience.description, url,
        image: new URL(experience.image, origin).href,
        provider: { "@type": "Organization", name: "Mosi Media Solutions", url: new URL("/", origin).href } },
      { "@type": "BreadcrumbList", itemListElement: [
        { "@type": "ListItem", position: 1, name: "Home", item: new URL("/", origin).href },
        { "@type": "ListItem", position: 2, name: "Packages", item: new URL("/packages", origin).href },
        { "@type": "ListItem", position: 3, name: experience.title, item: url },
      ] },
    ],
  };
}
