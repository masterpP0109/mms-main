import React from "react";
import Image from "next/image";
import type { Metadata } from "next";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import ReviewForm from "../components/reviews/ReviewForm";
import StarRating from "../components/reviews/StarRating";
import { getApprovedReviews, getReviewMetrics } from "@/lib/reviews";
import { Quote, Sparkles, CheckCircle2 } from "lucide-react";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Client Reviews & Testimonials | Mosi Media Solutions",
  description: "Read verified client experiences and submit your review for Mosi Media Solutions - premier media production, conference AV, and wedding cinematography in Victoria Falls.",
};

export default async function ReviewsPage() {
  const [reviews, metrics] = await Promise.all([
    getApprovedReviews({ limit: 12 }),
    getReviewMetrics(),
  ]);

  return (
    <div className="min-h-screen bg-[#050507] text-brand-foreground font-sans">
      <Navbar />

      {/* Hero Section */}
      <section className="relative min-h-[50vh] flex items-end overflow-hidden bg-black pt-28 pb-14 border-b border-brand-accent/15">
        <div className="absolute inset-0 z-0">
          <Image
            src="/mms/DSC_9244.jpg"
            alt="Mosi Media Solutions Events"
            fill
            sizes="100vw"
            className="object-cover object-center opacity-40"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#050507] via-[#050507]/60 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-r from-[#050507]/80 via-transparent to-transparent" />
        </div>

        <div className="relative z-10 max-w-[1400px] mx-auto mms-gutter w-full space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-brand-accent/10 border border-brand-accent/20 text-brand-accent text-xs font-semibold uppercase tracking-[0.25em] font-heading">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Client Stories & Feedback</span>
          </div>

          <h1 className="text-4xl sm:text-5xl md:text-6xl font-semibold text-white font-heading leading-tight max-w-3xl">
            Trusted by Leaders, Cherished by Couples
          </h1>

          <p className="text-sm md:text-base text-brand-foreground/75 font-light max-w-2xl leading-relaxed">
            Read authentic impressions from our global conferences, cinematic weddings, and brand productions across Southern Africa.
          </p>

          {/* Aggregate Rating Badge */}
          <div className="flex flex-wrap items-center gap-4 pt-2">
            <div className="flex items-center gap-2 bg-[#0b0b0f]/80 border border-brand-accent/20 rounded-2xl px-4 py-2.5 backdrop-blur-md">
              <span className="text-2xl font-bold text-white font-heading">
                {metrics.averageRating > 0 ? metrics.averageRating.toFixed(1) : "5.0"}
              </span>
              <div className="flex flex-col">
                <StarRating value={Math.round(metrics.averageRating || 5)} size="sm" />
                <span className="text-[10px] text-zinc-400 font-light">
                  {metrics.approved > 0 ? `${metrics.approved} verified reviews` : "5.0 / 5.0 excellence standard"}
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content: Form + Testimonials Feed */}
      <section className="py-16 md:py-24 max-w-[1400px] mx-auto mms-gutter">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
          {/* Submission Form Column */}
          <div className="lg:col-span-7">
            <ReviewForm />
          </div>

          {/* Testimonials Sidebar / Wall Column */}
          <div className="lg:col-span-5 space-y-6">
            <div className="space-y-2">
              <span className="text-[10px] uppercase tracking-[0.3em] text-brand-accent font-semibold block font-heading">
                Recent Feedback
              </span>
              <h2 className="text-2xl font-semibold text-white font-heading">
                What Clients Say About Us
              </h2>
            </div>

            {reviews.length === 0 ? (
              <div className="bg-[#0b0b0f] border border-brand-accent/15 rounded-3xl p-8 text-center space-y-3">
                <p className="text-sm text-zinc-400 font-light leading-relaxed">
                  Be among the first to leave a verified review. Your submission will appear here once confirmed.
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {reviews.map((rev) => (
                  <div
                    key={rev.id}
                    className="bg-[#0b0b0f] border border-brand-accent/15 rounded-2xl p-6 space-y-3.5 relative overflow-hidden transition-all hover:border-brand-accent/30"
                  >
                    <Quote className="absolute top-4 right-4 w-7 h-7 text-brand-accent/10" />

                    <div className="flex items-center justify-between">
                      <StarRating value={rev.rating} size="sm" />
                      {rev.service && (
                        <span className="text-[9px] uppercase tracking-[0.15em] bg-brand-accent/10 text-brand-accent px-2.5 py-1 rounded-full border border-brand-accent/20">
                          {rev.service}
                        </span>
                      )}
                    </div>

                    {rev.headline && (
                      <h3 className="text-sm font-semibold text-white font-heading">
                        {rev.headline}
                      </h3>
                    )}

                    <p className="text-xs sm:text-sm text-brand-foreground/80 font-light leading-relaxed italic">
                      &ldquo;{rev.content}&rdquo;
                    </p>

                    <div className="pt-2 border-t border-brand-accent/10 flex items-center justify-between">
                      <div>
                        <p className="text-xs font-semibold text-white flex items-center gap-1.5">
                          {rev.name}
                          {rev.verified && (
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 inline" />
                          )}
                        </p>
                        {(rev.role || rev.organisation) && (
                          <p className="text-[10px] text-zinc-400 font-light">
                            {[rev.role, rev.organisation].filter(Boolean).join(" • ")}
                          </p>
                        )}
                      </div>

                      {rev.eventDate && (
                        <span className="text-[10px] text-zinc-500 font-mono">
                          {rev.eventDate}
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
