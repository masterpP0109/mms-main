"use client";

import React from "react";
import StarRating from "@/app/components/reviews/StarRating";
import type { ReviewItem } from "./ReviewDetailModal";

interface ReviewTableProps {
  reviews: ReviewItem[];
  loading: boolean;
  onSelectReview: (review: ReviewItem) => void;
  onQuickApprove: (id: string) => Promise<void>;
  onQuickReject: (id: string) => Promise<void>;
  onToggleFeatured: (id: string, featured: boolean) => Promise<void>;
}

export default function ReviewTable({
  reviews,
  loading,
  onSelectReview,
  onQuickApprove,
  onQuickReject,
  onToggleFeatured,
}: ReviewTableProps) {
  if (loading) {
    return (
      <div className="bg-[#0b0b0f] border border-brand-accent/15 rounded-2xl p-12 text-center backdrop-blur-md">
        <div className="w-8 h-8 rounded-full border-2 border-brand-accent border-t-transparent animate-spin mx-auto mb-4" />
        <p className="text-sm text-zinc-400 font-light">Loading review submissions...</p>
      </div>
    );
  }

  if (reviews.length === 0) {
    return (
      <div className="bg-[#0b0b0f] border border-brand-accent/15 rounded-2xl p-12 text-center space-y-3 backdrop-blur-md">
        <h3 className="text-base font-semibold text-white font-heading">No review submissions found</h3>
        <p className="text-xs text-zinc-400 font-light max-w-sm mx-auto">
          No reviews match your selected filters. Try searching with different terms or resetting the filter options.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-[#0b0b0f] border border-brand-accent/15 rounded-2xl overflow-hidden backdrop-blur-md shadow-xl">
      {/* Desktop / Tablet Table View */}
      <div className="hidden lg:block overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead className="bg-[#121218] border-b border-brand-accent/15 text-[10px] uppercase tracking-[0.2em] text-zinc-400 font-heading">
            <tr>
              <th className="py-3.5 px-4">Reviewer</th>
              <th className="py-3.5 px-4">Rating & Story</th>
              <th className="py-3.5 px-4">Service</th>
              <th className="py-3.5 px-4">Status</th>
              <th className="py-3.5 px-4">Date</th>
              <th className="py-3.5 px-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-brand-accent/10">
            {reviews.map((rev) => (
              <tr
                key={rev.id}
                className="hover:bg-white/[0.02] transition-colors group"
              >
                {/* Reviewer column */}
                <td className="py-4 px-4 align-top">
                  <div className="space-y-1">
                    <p className="text-sm font-semibold text-white flex items-center gap-1.5">
                      <span>{rev.name}</span>
                      {rev.verified && (
                        <span className="text-[9px] uppercase tracking-wider font-semibold px-1.5 py-0.2 rounded bg-emerald-500/15 text-emerald-300 border border-emerald-500/30">
                          Verified
                        </span>
                      )}
                    </p>
                    <p className="text-[11px] text-zinc-400 truncate max-w-[180px] select-all font-mono">
                      {rev.email}
                    </p>
                    {(rev.role || rev.organisation) && (
                      <p className="text-[10px] text-zinc-500 truncate max-w-[180px]">
                        {[rev.role, rev.organisation].filter(Boolean).join(" • ")}
                      </p>
                    )}
                  </div>
                </td>

                {/* Rating & Content Snippet */}
                <td className="py-4 px-4 align-top max-w-xs">
                  <div className="space-y-1.5">
                    <div className="flex items-center gap-2">
                      <StarRating value={rev.rating} size="sm" />
                      <button
                        type="button"
                        onClick={() => onToggleFeatured(rev.id, !rev.featured)}
                        className={`text-[10px] uppercase tracking-wider px-2 py-0.5 rounded border transition-colors cursor-pointer ${
                          rev.featured
                            ? "bg-amber-400/20 text-amber-300 border-amber-400/50"
                            : "text-zinc-500 border-zinc-800 hover:border-zinc-600 hover:text-zinc-300"
                        }`}
                      >
                        {rev.featured ? "Featured" : "Standard"}
                      </button>
                    </div>

                    {rev.headline && (
                      <p className="text-xs font-semibold text-brand-foreground font-heading truncate">
                        {rev.headline}
                      </p>
                    )}

                    <p className="text-[11px] text-zinc-400 line-clamp-2 leading-relaxed">
                      {rev.content}
                    </p>
                  </div>
                </td>

                {/* Service Tag */}
                <td className="py-4 px-4 align-top">
                  <span className="inline-block text-[10px] font-medium px-2.5 py-1 rounded-full bg-brand-accent/10 text-brand-accent border border-brand-accent/15">
                    {rev.service || "General"}
                  </span>
                </td>

                {/* Status Pill with Realistic Indicator Dot */}
                <td className="py-4 px-4 align-top">
                  <span
                    className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-semibold uppercase tracking-wider ${
                      rev.status === "approved"
                        ? "bg-emerald-500/15 text-emerald-300 border border-emerald-500/30"
                        : rev.status === "rejected"
                        ? "bg-rose-500/15 text-rose-300 border border-rose-500/30"
                        : "bg-amber-500/15 text-amber-300 border border-amber-500/30"
                    }`}
                  >
                    <span
                      className={`w-1.5 h-1.5 rounded-full ${
                        rev.status === "approved"
                          ? "bg-emerald-400 shadow-[0_0_6px_rgba(52,211,153,0.8)]"
                          : rev.status === "rejected"
                          ? "bg-rose-400 shadow-[0_0_6px_rgba(251,113,133,0.8)]"
                          : "bg-amber-400 shadow-[0_0_6px_rgba(251,191,36,0.8)] animate-pulse"
                      }`}
                    />
                    {rev.status}
                  </span>
                </td>

                {/* Date */}
                <td className="py-4 px-4 align-top text-zinc-400 text-[11px] whitespace-nowrap font-mono">
                  {new Date(rev.createdAt).toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                  })}
                </td>

                {/* Clean Typographic Action Buttons (No Icon Clutter) */}
                <td className="py-4 px-4 align-top text-right">
                  <div className="flex items-center justify-end gap-1.5">
                    {rev.status !== "approved" && (
                      <button
                        type="button"
                        onClick={() => onQuickApprove(rev.id)}
                        className="px-2.5 py-1 rounded-lg bg-emerald-500/10 text-emerald-300 hover:bg-emerald-500/25 border border-emerald-500/30 text-[11px] font-medium transition-colors cursor-pointer"
                      >
                        Approve
                      </button>
                    )}

                    {rev.status !== "rejected" && (
                      <button
                        type="button"
                        onClick={() => onQuickReject(rev.id)}
                        className="px-2.5 py-1 rounded-lg bg-rose-500/10 text-rose-300 hover:bg-rose-500/25 border border-rose-500/30 text-[11px] font-medium transition-colors cursor-pointer"
                      >
                        Reject
                      </button>
                    )}

                    <button
                      type="button"
                      onClick={() => onSelectReview(rev)}
                      className="px-2.5 py-1 rounded-lg bg-white/5 text-zinc-300 hover:text-white hover:bg-white/10 border border-zinc-700 text-[11px] font-medium transition-colors cursor-pointer"
                    >
                      Inspect
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile / Small Screen Card Grid View */}
      <div className="lg:hidden divide-y divide-brand-accent/10">
        {reviews.map((rev) => (
          <div key={rev.id} className="p-4 space-y-3">
            <div className="flex items-start justify-between gap-2">
              <div>
                <h4 className="text-sm font-semibold text-white flex items-center gap-1.5">
                  <span>{rev.name}</span>
                  {rev.verified && (
                    <span className="text-[9px] uppercase tracking-wider font-semibold px-1.5 py-0.2 rounded bg-emerald-500/15 text-emerald-300 border border-emerald-500/30">
                      Verified
                    </span>
                  )}
                </h4>
                <p className="text-xs text-zinc-400 select-all font-mono">{rev.email}</p>
                {(rev.role || rev.organisation) && (
                  <p className="text-[10px] text-zinc-500">
                    {[rev.role, rev.organisation].filter(Boolean).join(" • ")}
                  </p>
                )}
              </div>

              <span
                className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold uppercase tracking-wider ${
                  rev.status === "approved"
                    ? "bg-emerald-500/15 text-emerald-300 border border-emerald-500/30"
                    : rev.status === "rejected"
                    ? "bg-rose-500/15 text-rose-300 border border-rose-500/30"
                    : "bg-amber-500/15 text-amber-300 border border-amber-500/30"
                }`}
              >
                <span
                  className={`w-1.5 h-1.5 rounded-full ${
                    rev.status === "approved"
                      ? "bg-emerald-400"
                      : rev.status === "rejected"
                      ? "bg-rose-400"
                      : "bg-amber-400 animate-pulse"
                  }`}
                />
                {rev.status}
              </span>
            </div>

            <div className="flex items-center justify-between">
              <StarRating value={rev.rating} size="sm" />
              <span className="text-[10px] text-brand-accent bg-brand-accent/10 px-2 py-0.5 rounded-full border border-brand-accent/20">
                {rev.service || "General"}
              </span>
            </div>

            {rev.headline && (
              <p className="text-xs font-semibold text-white font-heading">{rev.headline}</p>
            )}

            <p className="text-xs text-zinc-400 line-clamp-2 leading-relaxed">{rev.content}</p>

            {/* Mobile Action Buttons (Clean Text) */}
            <div className="flex items-center justify-between pt-2 border-t border-brand-accent/10">
              <span className="text-[10px] text-zinc-500 font-mono">
                {new Date(rev.createdAt).toLocaleDateString()}
              </span>

              <div className="flex items-center gap-1.5">
                {rev.status !== "approved" && (
                  <button
                    type="button"
                    onClick={() => onQuickApprove(rev.id)}
                    className="px-2.5 py-1 rounded bg-emerald-500/15 text-emerald-300 border border-emerald-500/30 text-xs font-medium cursor-pointer"
                  >
                    Approve
                  </button>
                )}

                {rev.status !== "rejected" && (
                  <button
                    type="button"
                    onClick={() => onQuickReject(rev.id)}
                    className="px-2.5 py-1 rounded bg-rose-500/15 text-rose-300 border border-rose-500/30 text-xs font-medium cursor-pointer"
                  >
                    Reject
                  </button>
                )}

                <button
                  type="button"
                  onClick={() => onSelectReview(rev)}
                  className="px-2.5 py-1 rounded bg-white/10 text-white text-xs font-medium cursor-pointer"
                >
                  Inspect
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
