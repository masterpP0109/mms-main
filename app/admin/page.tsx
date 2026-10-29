import React from "react";
import type { Metadata } from "next";
import Link from "next/link";
import { db } from "@/lib/db";
import { getReviewMetrics } from "@/lib/reviews";
import {
  MessageSquareQuote,
  Inbox,
  ArrowRight,
  Star,
  Clock,
  CheckCircle2,
  Home,
  ShieldCheck,
  Mail,
  Phone,
} from "lucide-react";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Operations Console | Mosi Media Solutions",
  description: "Administrative console for managing enquiries, leads, and client reviews.",
};

export default async function AdminOverviewPage() {
  const [totalLeads, pendingLeads, recentLeads, reviewMetrics] = await Promise.all([
    db.lead.count(),
    db.lead.count({
      where: {
        OR: [
          { emailStatus: "pending" },
          { acknowledgementStatus: "pending" },
          { whatsappStatus: "pending" },
        ],
      },
    }),
    db.lead.findMany({
      orderBy: { createdAt: "desc" },
      take: 6,
      select: {
        id: true,
        source: true,
        name: true,
        email: true,
        phone: true,
        organisation: true,
        projectType: true,
        message: true,
        emailStatus: true,
        whatsappStatus: true,
        createdAt: true,
      },
    }),
    getReviewMetrics(),
  ]);

  return (
    <div className="min-h-screen bg-[#050507] text-brand-foreground font-sans selection:bg-brand-primary selection:text-white">
      {/* Top Header */}
      <header className="sticky top-0 z-30 bg-[#050507]/90 backdrop-blur-xl border-b border-brand-accent/15 px-4 sm:px-8 py-3.5 flex items-center justify-between">
        <div className="flex items-center gap-6">
          <Link href="/" className="flex items-center gap-2 group">
            <span className="text-sm font-bold text-white font-heading tracking-wider group-hover:text-brand-accent transition-colors">
              MOSI MEDIA SOLUTIONS
            </span>
            <span className="text-[9px] uppercase tracking-widest px-2 py-0.5 rounded-full bg-brand-primary/30 border border-brand-accent/30 text-brand-accent font-semibold">
              Operations
            </span>
          </Link>

          <nav className="hidden sm:flex items-center gap-1 text-xs">
            <Link
              href="/admin"
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-brand-primary/20 text-brand-accent font-medium border border-brand-accent/25"
            >
              <Inbox className="w-3.5 h-3.5" />
              <span>Enquiries & Leads</span>
            </Link>

            <Link
              href="/admin/reviews"
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-zinc-400 hover:text-white hover:bg-white/5 transition-colors"
            >
              <MessageSquareQuote className="w-3.5 h-3.5" />
              <span>Reviews & Testimonials</span>
              {reviewMetrics.pending > 0 && (
                <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-amber-400/20 text-amber-300 font-mono">
                  {reviewMetrics.pending}
                </span>
              )}
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

      {/* Main Content */}
      <main className="max-w-[1400px] mx-auto px-4 sm:px-8 py-8 md:py-10 space-y-10">
        {/* Page Title */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-brand-accent/15">
          <div>
            <span className="text-[10px] uppercase tracking-[0.3em] text-brand-accent font-semibold font-heading block mb-1">
              Management Portal
            </span>
            <h1 className="text-3xl font-bold text-white font-heading">
              MMS Operations & Submissions
            </h1>
            <p className="text-xs sm:text-sm text-zinc-400 font-light mt-1">
              Unified control panel for client enquiries, leads pipeline, and testimonial moderation.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/admin/reviews"
              className="mms-button px-5 py-2.5 text-xs uppercase tracking-[0.18em] font-semibold"
            >
              <span className="relative z-10 flex items-center gap-2">
                Manage Reviews ({reviewMetrics.pending} pending)
                <ArrowRight className="w-3.5 h-3.5" />
              </span>
            </Link>
          </div>
        </div>

        {/* Unified Quick Metrics */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-5">
          {/* Total Leads */}
          <div className="bg-[#0b0b0f] border border-brand-accent/15 rounded-2xl p-5 backdrop-blur-md">
            <div className="flex items-center justify-between mb-3">
              <span className="text-[10px] uppercase tracking-[0.2em] text-zinc-400 font-semibold font-heading">
                Client Enquiries
              </span>
              <div className="w-8 h-8 rounded-full bg-brand-primary/20 border border-brand-accent/20 flex items-center justify-center text-brand-accent">
                <Inbox className="w-4 h-4" />
              </div>
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-bold text-white font-heading">{totalLeads}</span>
              <span className="text-xs text-zinc-500 font-light">recorded</span>
            </div>
            <p className="mt-2 text-[11px] text-zinc-400">
              {pendingLeads} awaiting notification delivery
            </p>
          </div>

          {/* Reviews Average */}
          <Link
            href="/admin/reviews"
            className="bg-[#0b0b0f] border border-brand-accent/15 hover:border-brand-accent/40 rounded-2xl p-5 backdrop-blur-md transition-all block group"
          >
            <div className="flex items-center justify-between mb-3">
              <span className="text-[10px] uppercase tracking-[0.2em] text-amber-300 font-semibold font-heading">
                Reviews Rating
              </span>
              <div className="w-8 h-8 rounded-full bg-amber-400/10 border border-amber-400/20 flex items-center justify-center text-amber-400">
                <Star className="w-4 h-4 fill-current" />
              </div>
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-bold text-white font-heading">
                {reviewMetrics.averageRating > 0 ? reviewMetrics.averageRating.toFixed(1) : "5.0"}
              </span>
              <span className="text-xs text-amber-400">★ ★ ★ ★ ★</span>
            </div>
            <p className="mt-2 text-[11px] text-zinc-400 group-hover:text-brand-accent transition-colors">
              {reviewMetrics.total} total reviews • Open dashboard →
            </p>
          </Link>

          {/* Pending Reviews Queue */}
          <Link
            href="/admin/reviews"
            className="bg-[#0b0b0f] border border-brand-accent/15 hover:border-amber-400/40 rounded-2xl p-5 backdrop-blur-md transition-all block group"
          >
            <div className="flex items-center justify-between mb-3">
              <span className="text-[10px] uppercase tracking-[0.2em] text-amber-300 font-semibold font-heading flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
                Review Moderation
              </span>
              <div className="w-8 h-8 rounded-full bg-amber-400/10 border border-amber-400/20 flex items-center justify-center text-amber-400">
                <Clock className="w-4 h-4" />
              </div>
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-bold text-amber-300 font-heading">
                {reviewMetrics.pending}
              </span>
              <span className="text-xs text-zinc-400 font-light">pending reviews</span>
            </div>
            <p className="mt-2 text-[11px] text-amber-300/80 group-hover:underline">
              Moderate incoming testimonials →
            </p>
          </Link>

          {/* Published Reviews */}
          <div className="bg-[#0b0b0f] border border-brand-accent/15 rounded-2xl p-5 backdrop-blur-md">
            <div className="flex items-center justify-between mb-3">
              <span className="text-[10px] uppercase tracking-[0.2em] text-emerald-300 font-semibold font-heading">
                Live Testimonials
              </span>
              <div className="w-8 h-8 rounded-full bg-emerald-400/10 border border-emerald-400/20 flex items-center justify-center text-emerald-400">
                <CheckCircle2 className="w-4 h-4" />
              </div>
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-bold text-emerald-300 font-heading">
                {reviewMetrics.approved}
              </span>
              <span className="text-xs text-zinc-500 font-light">live on site</span>
            </div>
            <p className="mt-2 text-[11px] text-emerald-300/80">
              {reviewMetrics.featured} highlighted in signature carousel
            </p>
          </div>
        </div>

        {/* Recent Client Enquiries Feed */}
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <span className="text-[10px] uppercase tracking-[0.25em] text-brand-accent font-semibold font-heading">
                Enquiries Pipeline
              </span>
              <h2 className="text-xl font-semibold text-white font-heading">
                Recent Leads & Project Briefs
              </h2>
            </div>
          </div>

          <div className="bg-[#0b0b0f] border border-brand-accent/15 rounded-2xl overflow-hidden backdrop-blur-md">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-[#121218] border-b border-brand-accent/15 text-[10px] uppercase tracking-[0.2em] text-zinc-400 font-heading">
                  <tr>
                    <th className="py-3.5 px-4">Contact</th>
                    <th className="py-3.5 px-4">Source & Project</th>
                    <th className="py-3.5 px-4">Message Snippet</th>
                    <th className="py-3.5 px-4">Email Status</th>
                    <th className="py-3.5 px-4">WhatsApp</th>
                    <th className="py-3.5 px-4">Date</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-brand-accent/10">
                  {recentLeads.map((lead) => (
                    <tr key={lead.id} className="hover:bg-white/[0.02] transition-colors">
                      <td className="py-3.5 px-4 align-top">
                        <div className="space-y-0.5">
                          <p className="font-semibold text-white">{lead.name}</p>
                          {lead.email && (
                            <p className="text-[11px] text-zinc-400 flex items-center gap-1">
                              <Mail className="w-3 h-3 text-brand-accent/60" />
                              <span className="select-all">{lead.email}</span>
                            </p>
                          )}
                          {lead.phone && (
                            <p className="text-[11px] text-zinc-500 flex items-center gap-1">
                              <Phone className="w-3 h-3 text-brand-accent/60" />
                              <span className="select-all">{lead.phone}</span>
                            </p>
                          )}
                        </div>
                      </td>

                      <td className="py-3.5 px-4 align-top">
                        <span className="inline-block px-2 py-0.5 rounded-full text-[10px] bg-brand-accent/10 text-brand-accent border border-brand-accent/15 uppercase tracking-wider mb-1 font-heading">
                          {lead.source}
                        </span>
                        <p className="text-xs text-zinc-300">
                          {lead.projectType || lead.organisation || "General enquiry"}
                        </p>
                      </td>

                      <td className="py-3.5 px-4 align-top max-w-xs">
                        <p className="text-xs text-zinc-400 line-clamp-2 leading-relaxed">
                          {lead.message}
                        </p>
                      </td>

                      <td className="py-3.5 px-4 align-top">
                        <span
                          className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] uppercase font-semibold ${
                            lead.emailStatus === "accepted" || lead.emailStatus === "sent"
                              ? "bg-emerald-500/15 text-emerald-300 border border-emerald-500/30"
                              : lead.emailStatus === "pending"
                              ? "bg-amber-500/15 text-amber-300 border border-amber-500/30"
                              : "bg-rose-500/15 text-rose-300 border border-rose-500/30"
                          }`}
                        >
                          {lead.emailStatus}
                        </span>
                      </td>

                      <td className="py-3.5 px-4 align-top">
                        <span className="text-[11px] text-zinc-400 font-mono">
                          {lead.whatsappStatus}
                        </span>
                      </td>

                      <td className="py-3.5 px-4 align-top text-zinc-400 text-[11px] whitespace-nowrap">
                        {new Date(lead.createdAt).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                        })}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
