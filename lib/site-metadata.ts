import type { Metadata } from "next";

const productionOrigin = "https://www.mosimediasolutions.com";

/** One origin for canonicals, sharing metadata, robots and sitemap URLs. */
export function siteOrigin() {
  const configured = process.env.SITE_URL?.trim();
  if (!configured) return productionOrigin;
  try {
    const url = new URL(configured);
    if (!["https:", "http:"].includes(url.protocol)) return productionOrigin;
    if (["mosimediasolutions.com", "www.mosimediasolutions.com"].includes(url.hostname)) return productionOrigin;
    return url.origin;
  } catch { return productionOrigin; }
}

export function pageMetadata(path: string, title: string, description: string, image = "/victoria_falls_banner.png", imageAlt = "Victoria Falls, Zimbabwe"): Metadata {
  return {
    title, description, alternates: { canonical: path },
    openGraph: { title, description, url: path, type: "website", siteName: "Mosi Media Solutions", images: [{ url: image, alt: imageAlt }] },
    twitter: { card: "summary_large_image", title, description, images: [image] },
  };
}
