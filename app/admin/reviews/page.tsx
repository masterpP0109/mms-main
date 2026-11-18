import React from "react";
import type { Metadata } from "next";
import Link from "next/link";
import ReviewsDashboard from "./ReviewsDashboard";
import { getAdminReviews, getReviewMetrics } from "@/lib/reviews";
import type { ReviewItem } from "./components/ReviewDetailModal";
import { MessageSquareQuote, Inbox, Home } from "lucide-react";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Review Moderation & Service Quality | MMS Operations",
  description:
    "Administrative moderation desk for client testimonials, service quality feedback, and marketing attribution consent.",
};

export default async function AdminReviewsPage() {
  const [reviewsData, initialMetrics] = await Promise.all([
    getAdminReviews({ take: 50 }),
    getReviewMetrics(),
  ]);

  const initialReviews: ReviewItem[] = reviewsData.items.map((r) => ({
    id: r.id,
    name: r.name,
    email: r.email,
    role: r.role,
    organisation: r.organisation,
    service: r.service,
    services: r.services,
    eventDate: r.eventDate,
    rating: r.rating,
    headline: r.headline,
    content: r.content,
    status: r.status,
    featured: r.featured,
    verified: r.verified,
    consent: r.consent,
    wouldRecommend: r.wouldRecommend,
    attribution: r.attribution,
    stoodOut: r.stoodOut ?? (r.metadata && typeof r.metadata === "object" && !Array.isArray(r.metadata) ? (r.metadata as Record<string, unknown>).stoodOut as string : null),
    contribution: r.contribution ?? (r.metadata && typeof r.metadata === "object" && !Array.isArray(r.metadata) ? (r.metadata as Record<string, unknown>).contribution as string : null),
    improvements: r.improvements ?? (r.metadata && typeof r.metadata === "object" && !Array.isArray(r.metadata) ? (r.metadata as Record<string, unknown>).improvements as string : null),
    notes: r.notes,
    metadata:
      r.metadata && typeof r.metadata === "object" && !Array.isArray(r.metadata)
        ? (r.metadata as ReviewItem["metadata"])
        : null,
    moderatedAt: r.moderatedAt ? r.moderatedAt.toISOString() : null,
    moderatedBy: r.moderatedBy,
    createdAt: r.createdAt.toISOString(),
  }));

  return (
    <div className="min-h-screen bg-[#07070a] text-zinc-100 font-sans selection:bg-brand-primary selection:text-white">
      {/* Unified Executive Top Navigation Bar */}
      <header className="sticky top-0 z-30 bg-[#07070a]/95 backdrop-blur-md border-b border-zinc-800/80 px-4 sm:px-8 py-3">
        <div className="max-w-[1440px] mx-auto flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-6">
            <Link href="/" className="flex items-center gap-2.5 group">
              <div className="w-2.5 h-2.5 rounded-xs bg-[#e11d48]" />
              <span className="text-sm font-bold text-white font-heading tracking-wider group-hover:text-brand-accent transition-colors">
                MOSI MEDIA
              </span>
              <span className="text-[10px] font-mono uppercase tracking-widest px-2 py-0.5 rounded bg-zinc-900 border border-zinc-700/80 text-zinc-300">
                Operations CRM
              </span>
            </Link>

            <nav
              aria-label="Admin sections"
              className="hidden sm:flex items-center gap-1 p-1 bg-[#0e0e13] border border-zinc-800/80 rounded-xl text-xs"
            >
              <Link
                href="/admin"
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800/50 transition-colors"
              >
                <Inbox className="w-3.5 h-3.5" />
                <span>Operations & Pipeline</span>
              </Link>

              <Link
                href="/admin/reviews"
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-brand-primary text-white font-medium shadow-xs"
              >
                <MessageSquareQuote className="w-3.5 h-3.5" />
                <span>Review Moderation Desk</span>
              </Link>
            </nav>
          </div>

          <div className="flex items-center gap-2.5 text-xs">
            <Link
              href="/admin"
              className="sm:hidden inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#0e0e13] text-zinc-300 border border-zinc-800"
            >
              <Inbox className="w-3.5 h-3.5" />
              <span>Pipeline</span>
            </Link>

            <Link
              href="/"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-900 transition-colors"
            >
              <Home className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Live Site</span>
            </Link>
          </div>
        </div>
      </header>

      <main className="max-w-[1440px] mx-auto px-4 sm:px-8 py-6 sm:py-8">
        <ReviewsDashboard
          initialReviews={initialReviews}
          initialMetrics={initialMetrics}
        />
      </main>
    </div>
  );
}
