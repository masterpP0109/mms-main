import React from "react";
import type { Metadata } from "next";
import Link from "next/link";
import ReviewsDashboard from "./ReviewsDashboard";
import { MessageSquareQuote, Inbox, Home, ShieldCheck } from "lucide-react";

export const metadata: Metadata = {
  title: "Review Submissions Management | MMS Operations",
  description: "Administrative dashboard for moderating and visualizing client reviews and feedback submissions.",
};

export default function AdminReviewsPage() {
  return (
    <div className="min-h-screen bg-[#050507] text-brand-foreground font-sans selection:bg-brand-primary selection:text-white">
      {/* Top Admin Navigation Header */}
      <header className="sticky top-0 z-30 bg-[#050507]/90 backdrop-blur-xl border-b border-brand-accent/15 px-4 sm:px-8 py-3.5 flex items-center justify-between">
        <div className="flex items-center gap-6">
          <Link href="/" className="flex items-center gap-2 group">
            <span className="text-sm font-bold text-white font-heading tracking-wider group-hover:text-brand-accent transition-colors">
              MOSI MEDIA SOLUTIONS
            </span>
            <span className="text-[9px] uppercase tracking-widest px-2 py-0.5 rounded-full bg-brand-primary/30 border border-brand-accent/30 text-brand-accent font-semibold">
              Admin
            </span>
          </Link>

          {/* Navigation Tabs between Sections */}
          <nav className="hidden sm:flex items-center gap-1 text-xs">
            <Link
              href="/admin/reviews"
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-brand-primary/20 text-brand-accent font-medium border border-brand-accent/25"
            >
              <MessageSquareQuote className="w-3.5 h-3.5" />
              <span>Reviews & Testimonials</span>
            </Link>

            <Link
              href="/admin"
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-zinc-400 hover:text-white hover:bg-white/5 transition-colors"
            >
              <Inbox className="w-3.5 h-3.5" />
              <span>Enquiries & Leads</span>
            </Link>
          </nav>
        </div>

        <div className="flex items-center gap-3 text-xs">
          <Link
            href="/"
            className="flex items-center gap-1 text-zinc-400 hover:text-white transition-colors"
          >
            <Home className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Main Website</span>
          </Link>

          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-[11px]">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Secure Console</span>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="max-w-[1400px] mx-auto px-4 sm:px-8 py-8 md:py-10">
        <ReviewsDashboard />
      </main>
    </div>
  );
}
