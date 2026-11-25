import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowRight, CheckCircle, ChevronRight } from "lucide-react";
import { getService } from "@/lib/get-service";
import Navbar from "@/app/components/Navbar";
import Footer from "@/app/components/Footer";
import FitImage from "@/app/components/FitImage";
import TechnologyDemo from "@/app/components/services/TechnologyDemo";
import CategoryCatalogueClient from "@/app/components/services/CategoryCatalogueClient";
import { getCategoryPresentation, getEquipmentForCategory } from "@/lib/technology-catalog";

export const dynamic = "force-dynamic";
type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const item = await getService(slug);
  const presentation = getCategoryPresentation(slug);
  const title = item?.seoTitle || (presentation ? `${presentation.displayTitle} | MMS` : item ? `${item.title} | MMS` : "Service not found | MMS");
  const description = item?.seoDescription || presentation?.categoryIntro || item?.description;
  return item
    ? {
        title,
        description,
        alternates: { canonical: `/services/${encodeURIComponent(slug)}` },
      }
    : { title: "Service not found | MMS" };
}

export default async function ServiceDetail({ params }: Props) {
  const { slug } = await params;
  const service = await getService(slug);
  if (!service) notFound();

  const presentation = getCategoryPresentation(slug);
  const displayTitle = presentation?.displayTitle ?? service.title;
  const intro = presentation?.categoryIntro ?? service.description;
  const equipmentList = getEquipmentForCategory(slug);
  const contactHref = `/contact?service=${encodeURIComponent(service.title)}&origin=${encodeURIComponent(`/services/${service.slug}`)}`;

  return (
    <div className="min-h-screen bg-[#e4e4e4] text-[#050507] font-sans">
      <Navbar />
      <main>
        {/* Hero with Breadcrumb */}
        <section className="relative min-h-[54vh] overflow-hidden pt-28 pb-14 bg-black flex items-end">
          <Image
            src={service.heroImage}
            alt={service.heroAlt || displayTitle}
            fill
            sizes="100vw"
            preload
            className="object-cover opacity-50"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#050507] via-[#050507]/55 to-black/35" />
          <div className="relative z-10 mx-auto w-full max-w-[1400px] mms-gutter">
            <nav aria-label="Breadcrumb" className="mb-6 flex flex-wrap items-center gap-2 text-xs uppercase tracking-[0.2em] text-brand-accent">
              <Link href="/services" className="inline-flex items-center gap-1.5 hover:text-white transition-colors">
                <ArrowLeft className="h-3.5 w-3.5" aria-hidden="true" />
                Services &amp; Technology
              </Link>
              <ChevronRight className="h-3.5 w-3.5 text-white/50" aria-hidden="true" />
              <span className="text-white/90">{displayTitle}</span>
            </nav>

            <span className="text-xs uppercase tracking-[0.35em] text-brand-accent block">
              {service.category}
            </span>
            <h1 className="mt-3 max-w-4xl text-4xl font-semibold text-white sm:text-5xl lg:text-6xl font-heading">
              {displayTitle}
            </h1>
            <p className="mt-4 max-w-2xl text-base leading-relaxed text-brand-foreground/85">
              {intro}
            </p>
            <div className="mt-6 flex flex-wrap items-center gap-3">
              <Link
                data-lead-cta
                href={contactHref}
                className="mms-button inline-flex items-center px-7 py-3 text-xs uppercase tracking-[0.16em] font-semibold"
              >
                {service.ctaLabel}
                <ArrowRight className="ml-2 h-4 w-4" aria-hidden="true" />
              </Link>
              <Link
                href="/contact"
                className="inline-flex items-center px-6 py-3 rounded-full border border-white/25 text-white text-xs uppercase tracking-[0.16em] font-semibold hover:bg-white/10 transition-colors"
              >
                Talk to our production team
              </Link>
            </div>
          </div>
        </section>

        {/* Equipment & Capability Catalogue */}
        {equipmentList.length > 0 && (
          <section className="mx-auto max-w-[1400px] mms-gutter py-16">
            <div className="max-w-2xl mb-10 space-y-2">
              <p className="text-xs uppercase tracking-[0.3em] text-[#7f141f] font-semibold">
                Equipment &amp; Capabilities
              </p>
              <h2 className="text-3xl sm:text-4xl font-semibold text-[#050507] font-heading">
                Explore the equipment
              </h2>
              <p className="text-sm sm:text-base text-[#050507]/80">
                Select any item below to see what it does, how it looks at real events and how to include it in your brief.
              </p>
            </div>

            <CategoryCatalogueClient
              items={equipmentList}
              pixelPitchNote={presentation?.pixelPitchNote}
            />
          </section>
        )}

        {/* Interactive Demonstration / System Diagram */}
        {presentation?.demonstrationType && (
          <section className="mx-auto max-w-[1400px] mms-gutter pb-16">
            <TechnologyDemo type={presentation.demonstrationType} />
          </section>
        )}

        {/* What's Included + Gallery */}
        <section className="mx-auto grid max-w-[1400px] gap-12 mms-gutter pb-20 lg:grid-cols-[.85fr_1.15fr]">
          <div className="space-y-6">
            <div>
              <p className="text-xs uppercase tracking-[0.3em] text-[#7f141f] font-semibold">
                What&apos;s Included
              </p>
              <div className="mt-4 space-y-3">
                {service.features.map((feature) => (
                  <div
                    key={feature}
                    className="flex items-center gap-3 rounded-xl border border-[#050507]/12 bg-[#efefef] p-4 text-sm text-[#050507] font-medium"
                  >
                    <CheckCircle className="h-4 w-4 text-[#7f141f] shrink-0" aria-hidden="true" />
                    <span>{feature}</span>
                  </div>
                ))}
              </div>
            </div>

            {presentation?.eventApplications && presentation.eventApplications.length > 0 && (
              <div>
                <p className="text-xs uppercase tracking-[0.3em] text-[#7f141f] font-semibold mb-3">
                  Ideal For
                </p>
                <div className="flex flex-wrap gap-2">
                  {presentation.eventApplications.map((app) => (
                    <span
                      key={app}
                      className="rounded-full bg-[#efefef] border border-[#050507]/12 px-3.5 py-1.5 text-xs font-medium text-[#050507]"
                    >
                      {app}
                    </span>
                  ))}
                </div>
              </div>
            )}

            <div className="pt-2 flex flex-wrap gap-3">
              <Link
                data-lead-cta
                href={contactHref}
                className="mms-button inline-flex items-center px-7 py-3 text-xs uppercase tracking-[0.16em] font-semibold"
              >
                {service.ctaLabel}
                <ArrowRight className="ml-2 h-4 w-4" aria-hidden="true" />
              </Link>
              <Link
                href="/conference-production"
                className="inline-flex items-center px-6 py-3 rounded-full border border-[#050507]/20 text-xs uppercase tracking-[0.16em] font-semibold text-[#050507] hover:border-[#7f141f] hover:text-[#7f141f] transition-colors"
              >
                Conference Production
              </Link>
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            {service.gallery.map((src, index) => (
              <div
                key={src}
                className={`relative overflow-hidden rounded-2xl border border-[#050507]/12 bg-[#efefef] ${
                  index === 0 ? "aspect-[16/10] sm:col-span-2" : "aspect-[4/3]"
                }`}
              >
                <FitImage
                  src={src}
                  alt={service.galleryAlts[index] || `${displayTitle} ${index + 1}`}
                  sizes={
                    index === 0
                      ? "(max-width:1023px) 100vw, 60vw"
                      : "(max-width:639px) 100vw, (max-width:1023px) 50vw, 30vw"
                  }
                />
              </div>
            ))}
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
