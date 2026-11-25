import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowRight, ChevronRight } from "lucide-react";
import Navbar from "@/app/components/Navbar";
import Footer from "@/app/components/Footer";
import FitImage from "@/app/components/FitImage";
import {
  CONFERENCE_LAYOUTS,
  CONFERENCE_SOLUTIONS,
  getEventSolution,
  getSolutionEquipment,
} from "@/lib/conference-solutions";
import { getPackageExperience } from "@/lib/packages";

type Props = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return CONFERENCE_SOLUTIONS.map((item) => ({ slug: item.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const solution = getEventSolution(slug);
  if (!solution) return { title: "Event Solution not found | MMS" };
  return {
    title: solution.seoTitle,
    description: solution.seoDescription,
    alternates: { canonical: `/conference-production/${encodeURIComponent(slug)}` },
  };
}

export default async function EventSolutionPage({ params }: Props) {
  const { slug } = await params;
  const solution = getEventSolution(slug);
  if (!solution) notFound();

  const equipmentItems = getSolutionEquipment(solution);
  const recommendedLayouts = CONFERENCE_LAYOUTS.filter((l) =>
    solution.recommendedLayoutIds.includes(l.id)
  );
  const conferencePackages = getPackageExperience("conferences");

  return (
    <div className="min-h-screen bg-[#e4e4e4] text-[#050507] font-sans">
      <Navbar />
      <main>
        {/* Hero */}
        <section className="relative min-h-[54vh] overflow-hidden pt-28 pb-14 bg-black flex items-end">
          <Image
            src={solution.coverImage}
            alt={solution.coverAlt}
            fill
            sizes="100vw"
            preload
            className="object-cover opacity-50"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#050507] via-[#050507]/55 to-black/35" />
          <div className="relative z-10 mx-auto w-full max-w-[1400px] mms-gutter">
            <nav aria-label="Breadcrumb" className="mb-6 flex flex-wrap items-center gap-2 text-xs uppercase tracking-[0.2em] text-brand-accent">
              <Link href="/conference-production" className="inline-flex items-center gap-1.5 hover:text-white transition-colors">
                <ArrowLeft className="h-3.5 w-3.5" aria-hidden="true" />
                Conferences &amp; Events
              </Link>
              <ChevronRight className="h-3.5 w-3.5 text-white/50" aria-hidden="true" />
              <span className="text-white/90">{solution.shortTitle}</span>
            </nav>

            <span className="text-xs uppercase tracking-[0.35em] text-brand-accent block">
              Event Solution
            </span>
            <h1 className="mt-3 max-w-4xl text-4xl font-semibold text-white sm:text-5xl lg:text-6xl font-heading">
              {solution.title}
            </h1>
            <p className="mt-4 max-w-2xl text-base leading-relaxed text-brand-foreground/85">
              {solution.description}
            </p>
            <div className="mt-6 flex flex-wrap items-center gap-3">
              <Link
                data-lead-cta
                href="/conference-production#enquiry"
                className="mms-button inline-flex items-center px-7 py-3 text-xs uppercase tracking-[0.16em] font-semibold"
              >
                Plan This Event
                <ArrowRight className="ml-2 h-4 w-4" aria-hidden="true" />
              </Link>
              <Link
                href="/services"
                className="inline-flex items-center px-6 py-3 rounded-full border border-white/25 text-white text-xs uppercase tracking-[0.16em] font-semibold hover:bg-white/10 transition-colors"
              >
                Explore Equipment
              </Link>
            </div>
          </div>
        </section>

        {/* What We Coordinate */}
        <section className="mx-auto max-w-[1400px] mms-gutter py-16 space-y-8">
          <div className="max-w-2xl space-y-2">
            <p className="text-xs uppercase tracking-[0.3em] text-[#7f141f] font-semibold">
              What We Can Coordinate
            </p>
            <h2 className="text-3xl font-semibold text-[#050507] font-heading">
              Build your {solution.shortTitle.toLowerCase()} experience
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {solution.whatWeCoordinate.map((card) => (
              <div
                key={card.title}
                className="rounded-2xl overflow-hidden bg-[#efefef] border border-[#050507]/12 flex flex-col"
              >
                <div className="relative aspect-[16/10] w-full bg-[#dcdcdc]">
                  <FitImage src={card.image} alt={card.title} sizes="(max-width:639px) 100vw, (max-width:1023px) 50vw, 33vw" />
                </div>
                <div className="p-5 space-y-1.5">
                  <h3 className="text-lg font-semibold text-[#050507] font-heading">{card.title}</h3>
                  <p className="text-sm text-[#050507]/80 leading-relaxed">{card.detail}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Suggested Arrangements */}
        {recommendedLayouts.length > 0 && (
          <section className="bg-[#efefef] border-y border-[#050507]/12 py-16">
            <div className="mx-auto max-w-[1400px] mms-gutter space-y-8">
              <div className="max-w-2xl space-y-2">
                <p className="text-xs uppercase tracking-[0.3em] text-[#7f141f] font-semibold">
                  Suggested Arrangements
                </p>
                <h2 className="text-3xl font-semibold text-[#050507] font-heading">
                  Recommended room layouts
                </h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {recommendedLayouts.map((layout) => (
                  <div key={layout.id} className="rounded-2xl bg-white border border-[#050507]/12 overflow-hidden">
                    <div className="relative aspect-[16/10] w-full bg-[#dcdcdc]">
                      <FitImage src={layout.image} alt={layout.imageAlt} sizes="(max-width:767px) 100vw, 33vw" />
                    </div>
                    <div className="p-5 space-y-2">
                      <h3 className="text-lg font-semibold text-[#050507] font-heading">{layout.name} layout</h3>
                      <p className="text-sm text-[#050507]/80">{layout.shortDescription}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* Technology for This Event (shared from Equipment Catalogue) */}
        {equipmentItems.length > 0 && (
          <section className="mx-auto max-w-[1400px] mms-gutter py-16 space-y-8">
            <div className="flex flex-wrap items-end justify-between gap-4">
              <div className="max-w-2xl space-y-2">
                <p className="text-xs uppercase tracking-[0.3em] text-[#7f141f] font-semibold">
                  Verified Equipment Catalogue
                </p>
                <h2 className="text-3xl font-semibold text-[#050507] font-heading">
                  Technology for this event
                </h2>
              </div>
              <Link
                href="/services"
                className="inline-flex items-center gap-1.5 text-xs uppercase tracking-[0.16em] font-semibold text-[#7f141f] hover:underline"
              >
                Browse full equipment catalogue
                <ArrowRight className="w-3.5 h-3.5" aria-hidden="true" />
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {equipmentItems.map((eq) => (
                <Link
                  key={eq.id}
                  href={`/services/${eq.parentCategorySlug}/${eq.slug}`}
                  className="group flex flex-col rounded-2xl overflow-hidden bg-[#efefef] border border-[#050507]/12 hover:border-[#7f141f]/50 transition-colors"
                >
                  <div className="relative aspect-[16/10] w-full bg-[#dcdcdc]">
                    <FitImage src={eq.primaryImage} alt={eq.primaryImageAlt} sizes="(max-width:767px) 100vw, 33vw" />
                  </div>
                  <div className="p-5 flex flex-col flex-1 justify-between gap-3">
                    <div className="space-y-1.5">
                      <span className="text-[11px] uppercase tracking-[0.18em] text-[#7f141f] font-semibold block">
                        {eq.equipmentTypeName}
                      </span>
                      <h3 className="text-lg font-semibold text-[#050507] group-hover:text-[#7f141f] transition-colors">
                        {eq.name}
                      </h3>
                      <p className="text-sm text-[#050507]/80">{eq.shortDescription}</p>
                    </div>
                    <span className="inline-flex items-center gap-1.5 text-xs uppercase tracking-[0.16em] font-semibold text-[#7f141f]">
                      View equipment
                      <ArrowRight className="w-3.5 h-3.5" aria-hidden="true" />
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}

        {/* Suitable Packages + CTA */}
        <section className="mx-auto max-w-[1400px] mms-gutter pb-20">
          <div className="rounded-3xl bg-[#efefef] border border-[#050507]/12 p-6 sm:p-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div className="space-y-2 max-w-2xl">
              <span className="text-xs uppercase tracking-[0.28em] text-[#7f141f] font-semibold block">
                Packages &amp; Tailored Proposals
              </span>
              <h2 className="text-2xl sm:text-3xl font-semibold text-[#050507] font-heading">
                Ready to plan your {solution.shortTitle.toLowerCase()}?
              </h2>
              <p className="text-sm sm:text-base text-[#050507]/80">
                Explore {conferencePackages?.title ?? "Conference & Corporate Event Packages"} or request a custom production proposal tailored to your venue and delegate count.
              </p>
            </div>
            <div className="flex flex-wrap gap-3 shrink-0">
              <Link
                href="/conference-production#enquiry"
                className="mms-button inline-flex items-center gap-2 px-7 py-3 text-xs uppercase tracking-[0.16em] font-semibold"
              >
                Request a Proposal
                <ArrowRight className="w-4 h-4" aria-hidden="true" />
              </Link>
              <Link
                href="/packages/conferences"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-full border border-[#7f141f] text-xs uppercase tracking-[0.16em] font-semibold text-[#7f141f] hover:bg-[#7f141f] hover:text-white transition-colors"
              >
                View Packages
              </Link>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
