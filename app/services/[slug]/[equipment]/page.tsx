import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Navbar from "@/app/components/Navbar";
import Footer from "@/app/components/Footer";
import EquipmentDetailView from "@/app/components/services/EquipmentDetailView";
import { getAllPublishedEquipment, getEquipmentItem } from "@/lib/technology-catalog";

type Props = { params: Promise<{ slug: string; equipment: string }> };

export function generateStaticParams() {
  return getAllPublishedEquipment().map((item) => ({
    slug: item.parentCategorySlug,
    equipment: item.slug,
  }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug, equipment } = await params;
  const item = getEquipmentItem(slug, equipment);
  if (!item) return { title: "Equipment not found | MMS" };
  return {
    title: item.seoTitle,
    description: item.seoDescription,
    alternates: { canonical: `/services/${encodeURIComponent(slug)}/${encodeURIComponent(equipment)}` },
  };
}

export default async function EquipmentDetailPage({ params }: Props) {
  const { slug, equipment } = await params;
  const item = getEquipmentItem(slug, equipment);
  if (!item) notFound();

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Service",
    name: item.name,
    description: item.shortDescription,
    serviceType: item.parentCategoryTitle,
    provider: {
      "@type": "Organization",
      name: "Mosi Media Solutions",
      url: "https://www.mosimediasolutions.com",
    },
  };

  return (
    <div className="min-h-screen bg-[#e4e4e4] text-[#050507]">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <Navbar />
      <EquipmentDetailView item={item} />
      <Footer />
    </div>
  );
}
