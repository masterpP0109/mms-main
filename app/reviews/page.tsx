import React from "react";
import Link from "next/link";
import type { Metadata } from "next";
import ReviewForm from "../components/reviews/ReviewForm";
import StarRating from "../components/reviews/StarRating";
import { getApprovedReviews, getReviewMetrics } from "@/lib/reviews";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Your Experience Matters | Mosi Media Solutions",
  description: "Share your client feedback and experience with Mosi Media Solutions - premier media production, conference AV, live streaming and cinematography in Victoria Falls.",
};

export default async function ReviewsPage() {
  const [reviews, metrics] = await Promise.all([
    getApprovedReviews({ limit: 12 }),
    getReviewMetrics(),
  ]);

  return (
    <div className="min-h-screen bg-[#e4e4e4] text-[#050507] font-sans flex flex-col justify-between selection:bg-[#7f141f]/20 selection:text-[#050507]">
      {/* Minimal Focused Navigation Header (Distraction-Free) */}
      <header className="w-full border-b border-[#050507]/12 bg-[#e4e4e4]/95 backdrop-blur-xl sticky top-0 z-30">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 h-16 sm:h-20 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#7f141f] to-[#981b28] p-[1px] transition-transform group-hover:scale-105">
              <div className="w-full h-full bg-[#efefef] rounded-[11px] flex items-center justify-center">
                <span className="text-sm font-bold text-[#7f141f] font-heading">M</span>
              </div>
            </div>
            <div className="flex flex-col">
              <span className="text-xs sm:text-sm font-bold tracking-[0.2em] uppercase text-[#050507] font-heading">
                Mosi Media Solutions
              </span>
              <span className="text-[10px] text-[#050507]/70 font-medium tracking-wider">
                Victoria Falls • Event & Media Production
              </span>
            </div>
          </Link>

          <div className="flex items-center gap-4">
            <a
              href="#client-stories"
              className="hidden sm:inline-block text-xs text-[#050507]/80 hover:text-[#7f141f] transition-colors font-semibold font-heading tracking-wider uppercase"
            >
              Client Stories ({metrics.approved})
            </a>
            <Link
              href="/"
              className="text-xs font-semibold uppercase tracking-[0.15em] px-4 py-2 rounded-full border border-[#7f141f]/35 text-[#050507] hover:bg-[#7f141f] hover:text-white transition-colors"
            >
              Back to Website
            </Link>
          </div>
        </div>
      </header>

      {/* Full-Page Questionnaire Container (Centered, Focused & Expansive like Tally) */}
      <main className="flex-1 flex flex-col justify-center items-center py-8 sm:py-14 px-4 sm:px-6 lg:px-8 w-full max-w-4xl mx-auto">
        <div className="w-full">
          <ReviewForm />
        </div>

        {/* Subtle Anchor to Verified Reviews */}
        {reviews.length > 0 && (
          <div className="text-center pt-8 pb-4">
            <a
              href="#client-stories"
              className="text-xs text-[#050507]/80 hover:text-[#7f141f] transition-colors tracking-wide"
            >
              Looking to read feedback from past events? <span className="underline decoration-[#7f141f]/50 underline-offset-4 text-[#7f141f] font-semibold">Browse {reviews.length} verified client stories ↓</span>
            </a>
          </div>
        )}
      </main>

      {/* Verified Client Reviews Section (Below the Form fold) */}
      {reviews.length > 0 && (
        <section id="client-stories" className="border-t border-[#050507]/12 bg-[#e4e4e4] py-16 sm:py-24">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 space-y-10">
            <div className="text-center space-y-3 max-w-2xl mx-auto">
              <span className="text-[11px] uppercase tracking-[0.3em] text-[#7f141f] font-semibold font-heading block">
                Verified Testimonials
              </span>
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-[#050507] font-heading">
                Trusted by Leaders, Cherished by Couples
              </h2>
              <p className="text-xs sm:text-sm text-[#050507]/80 font-normal leading-relaxed">
                Authentic reflections from international conferences, gala dinners, and private weddings across Victoria Falls.
              </p>
            </div>

            {/* Testimonials Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {reviews.map((rev) => (
                <div
                  key={rev.id}
                  className="bg-[#efefef] border border-[#050507]/12 rounded-3xl p-6 sm:p-7 space-y-4 hover:border-[#7f141f]/40 transition-all shadow-sm"
                >
                  <div className="flex items-center justify-between">
                    <StarRating value={rev.rating} size="sm" lightSurface />
                    {rev.service && (
                      <span className="text-[10px] uppercase tracking-[0.15em] bg-[#7f141f]/10 text-[#7f141f] px-3 py-1 rounded-full border border-[#7f141f]/25 font-semibold">
                        {rev.service}
                      </span>
                    )}
                  </div>

                  {rev.headline && (
                    <h3 className="text-sm sm:text-base font-semibold text-[#050507] font-heading leading-snug">
                      &ldquo;{rev.headline}&rdquo;
                    </h3>
                  )}

                  <p className="text-xs sm:text-sm text-[#050507]/85 font-normal leading-relaxed italic">
                    {rev.content}
                  </p>

                  <div className="pt-3 border-t border-[#050507]/12 flex items-center justify-between">
                    <div>
                      <p className="text-xs font-semibold text-[#050507] flex items-center gap-1.5">
                        <span>{rev.name}</span>
                        {rev.verified && (
                          <span className="text-[9px] uppercase tracking-wider font-semibold px-2 py-0.5 rounded-full bg-emerald-600/15 text-emerald-800 border border-emerald-700/30">
                            Verified
                          </span>
                        )}
                      </p>
                      {(rev.role || rev.organisation) && (
                        <p className="text-[10px] text-[#050507]/70 font-medium pt-0.5">
                          {[rev.role, rev.organisation].filter(Boolean).join(" • ")}
                        </p>
                      )}
                    </div>

                    {rev.eventDate && (
                      <span className="text-[10px] text-[#050507]/70 font-mono">
                        {rev.eventDate}
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Minimal Footer */}
      <footer className="border-t border-[#050507]/12 bg-[#e4e4e4] py-8 text-center text-xs text-[#050507]/75 font-normal">
        <div className="max-w-5xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p>© {new Date().getFullYear()} Mosi Media Solutions. All rights reserved.</p>
          <div className="flex items-center gap-6 text-[#050507]/85">
            <Link href="/" className="hover:text-[#7f141f] transition-colors">
              Home
            </Link>
            <Link href="/contact" className="hover:text-[#7f141f] transition-colors">
              Contact Us
            </Link>
            <Link href="/admin/reviews" className="hover:text-[#7f141f] transition-colors">
              Operations Login
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
