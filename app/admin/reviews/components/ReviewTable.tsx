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
      <div className="bg-[#0e0e13] border border-zinc-800/80 rounded-xl p-12 text-center">
        <div className="w-6 h-6 rounded-full border-2 border-brand-accent border-t-transparent animate-spin mx-auto mb-3" />
        <p className="text-xs text-zinc-400 font-sans">Loading review submissions...</p>
      </div>
    );
  }

  if (reviews.length === 0) {
    return (
      <div className="bg-[#0e0e13] border border-zinc-800/80 rounded-xl p-12 text-center space-y-2">
        <h3 className="text-sm font-semibold text-white font-heading">
          No matching reviews found
        </h3>
        <p className="text-xs text-zinc-500 max-w-sm mx-auto font-sans">
          No submissions match your active filter criteria.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-[#0e0e13] border border-zinc-800/80 rounded-xl overflow-hidden">
      {/* Mobile Responsive Cards (< 768px) */}
      <div className="block md:hidden divide-y divide-zinc-800/70 font-sans">
        {reviews.map((rev) => {
          const hasImprovements = Boolean((rev.improvements || rev.metadata?.improvements)?.trim());
          return (
            <div
              key={rev.id}
              onClick={() => onSelectReview(rev)}
              className="p-4 space-y-3 hover:bg-zinc-900/60 transition-colors cursor-pointer"
            >
              <div className="flex items-start justify-between gap-2">
                <div className="space-y-0.5 min-w-0">
                  <div className="flex items-center gap-2">
                    <StarRating value={rev.rating} size="sm" />
                    <span
                      className={`inline-flex items-center px-2 py-0.2 rounded text-[10px] font-mono uppercase font-semibold ${
                        rev.status === "approved"
                          ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/25"
                          : rev.status === "rejected"
                          ? "bg-rose-500/10 text-rose-400 border border-rose-500/25"
                          : "bg-amber-500/10 text-amber-300 border border-amber-500/25"
                      }`}
                    >
                      {rev.status}
                    </span>
                    {rev.featured && (
                      <span className="text-[10px] font-mono uppercase px-1.5 py-0.2 rounded bg-amber-400/20 text-amber-300 border border-amber-400/40">
                        Featured
                      </span>
                    )}
                  </div>
                  <h4 className="text-sm font-semibold text-white truncate font-heading mt-1">
                    {rev.name}
                    {rev.organisation ? (
                      <span className="text-zinc-400 font-normal"> • {rev.organisation}</span>
                    ) : null}
                  </h4>
                </div>
                <span className="text-[10px] font-mono text-zinc-500 shrink-0">
                  {new Date(rev.createdAt).toLocaleDateString("en-GB", {
                    day: "2-digit",
                    month: "short",
                  })}
                </span>
              </div>

              {rev.headline && (
                <p className="text-xs font-semibold text-zinc-200 line-clamp-1">
                  &ldquo;{rev.headline}&rdquo;
                </p>
              )}

              <p className="text-xs text-zinc-400 line-clamp-2 leading-relaxed">
                {rev.content}
              </p>

              <div className="flex flex-wrap items-center gap-2 text-[11px] pt-1 border-t border-zinc-800/60">
                <span className="inline-block text-[10px] font-medium px-2 py-0.5 rounded bg-zinc-900 text-zinc-300 border border-zinc-800">
                  {rev.service || "General"}
                </span>
                <span
                  className={`inline-block px-2 py-0.5 rounded text-[10px] font-mono ${
                    rev.consent
                      ? "bg-sky-500/10 text-sky-300 border border-sky-500/25"
                      : "bg-zinc-900 text-zinc-500 border border-zinc-800"
                  }`}
                >
                  {rev.consent ? "Marketing Consent" : "Internal Only"}
                </span>
                {hasImprovements && (
                  <span className="text-[10px] font-mono text-amber-300">
                    + Improvement Note
                  </span>
                )}
              </div>

              <div
                className="flex items-center justify-end gap-2 pt-2 border-t border-zinc-800/60"
                onClick={(e) => e.stopPropagation()}
              >
                {rev.status !== "approved" && (
                  <button
                    type="button"
                    onClick={() => onQuickApprove(rev.id)}
                    className="px-2.5 py-1 rounded bg-emerald-500/15 text-emerald-300 hover:bg-emerald-500/25 border border-emerald-500/30 text-[11px] font-medium transition-colors cursor-pointer"
                  >
                    Approve
                  </button>
                )}

                {rev.status !== "rejected" && (
                  <button
                    type="button"
                    onClick={() => onQuickReject(rev.id)}
                    className="px-2.5 py-1 rounded bg-rose-500/15 text-rose-300 hover:bg-rose-500/25 border border-rose-500/30 text-[11px] font-medium transition-colors cursor-pointer"
                  >
                    Reject
                  </button>
                )}

                <button
                  type="button"
                  onClick={() => onSelectReview(rev)}
                  className="px-3 py-1 rounded bg-zinc-900 text-zinc-300 hover:text-white hover:bg-zinc-800 border border-zinc-700/80 text-[11px] font-medium transition-colors cursor-pointer"
                >
                  Inspect
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Desktop / Tablet Table View (>= 768px) */}
      <div className="hidden md:block overflow-x-auto">
        <table className="w-full text-left text-xs font-sans">
          <thead className="bg-[#09090c] border-b border-zinc-800/80 text-[10px] uppercase tracking-wider text-zinc-400 font-semibold font-heading">
            <tr>
              <th className="py-3 px-4">Client & Organisation</th>
              <th className="py-3 px-4">Evaluation & Feedback</th>
              <th className="py-3 px-4">Service Line</th>
              <th className="py-3 px-4">Consent & Insights</th>
              <th className="py-3 px-4">Status</th>
              <th className="py-3 px-4">Date</th>
              <th className="py-3 px-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-800/60 font-sans">
            {reviews.map((rev) => {
              const hasImprovements = Boolean((rev.improvements || rev.metadata?.improvements)?.trim());
              return (
                <tr
                  key={rev.id}
                  onClick={() => onSelectReview(rev)}
                  className="hover:bg-zinc-900/60 transition-colors cursor-pointer group"
                >
                  {/* Client */}
                  <td className="py-3.5 px-4 align-top">
                    <div className="space-y-0.5">
                      <p className="font-semibold text-white flex items-center gap-1.5 font-heading">
                        <span>{rev.name}</span>
                        {rev.verified && (
                          <span className="text-[9px] font-mono uppercase px-1.5 py-0.2 rounded bg-emerald-500/15 text-emerald-300 border border-emerald-500/30">
                            Verified
                          </span>
                        )}
                      </p>
                      <p className="text-[11px] text-zinc-400 font-mono truncate max-w-[180px]">
                        {rev.email}
                      </p>
                      {(rev.role || rev.organisation) && (
                        <p className="text-[11px] text-zinc-500 truncate max-w-[180px]">
                          {[rev.role, rev.organisation].filter(Boolean).join(" • ")}
                        </p>
                      )}
                    </div>
                  </td>

                  {/* Evaluation & Story */}
                  <td className="py-3.5 px-4 align-top max-w-xs">
                    <div className="space-y-1">
                      <div
                        className="flex items-center gap-2"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <StarRating value={rev.rating} size="sm" />
                        <button
                          type="button"
                          onClick={() => onToggleFeatured(rev.id, !rev.featured)}
                          className={`text-[10px] font-mono uppercase px-2 py-0.5 rounded border transition-colors cursor-pointer ${
                            rev.featured
                              ? "bg-amber-400/20 text-amber-300 border-amber-400/40"
                              : "text-zinc-500 border-zinc-800 hover:border-zinc-600 hover:text-zinc-300"
                          }`}
                        >
                          {rev.featured ? "Featured" : "Pin"}
                        </button>
                      </div>
                      {rev.headline && (
                        <p className="text-xs font-semibold text-zinc-200 truncate">
                          {rev.headline}
                        </p>
                      )}
                      <p className="text-[11px] text-zinc-400 line-clamp-2 leading-relaxed">
                        {rev.content}
                      </p>
                    </div>
                  </td>

                  {/* Service */}
                  <td className="py-3.5 px-4 align-top">
                    <span className="inline-block text-[11px] font-medium px-2 py-0.5 rounded bg-zinc-900 text-zinc-300 border border-zinc-800">
                      {rev.service || "General"}
                    </span>
                  </td>

                  {/* Consent & Operational Insights */}
                  <td className="py-3.5 px-4 align-top whitespace-nowrap">
                    <div className="space-y-1 text-[11px]">
                      <span
                        className={`inline-block px-2 py-0.5 rounded text-[10px] font-mono ${
                          rev.consent
                            ? "bg-sky-500/10 text-sky-300 border border-sky-500/25"
                            : "bg-zinc-900 text-zinc-500 border border-zinc-800"
                        }`}
                      >
                        {rev.consent ? "Marketing Consent" : "Internal Only"}
                      </span>
                      {hasImprovements && (
                        <span className="block text-[10px] font-mono text-amber-300">
                          + Improvement Note
                        </span>
                      )}
                    </div>
                  </td>

                  {/* Status */}
                  <td className="py-3.5 px-4 align-top whitespace-nowrap">
                    <span
                      className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-[10px] font-mono uppercase font-semibold ${
                        rev.status === "approved"
                          ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/25"
                          : rev.status === "rejected"
                          ? "bg-rose-500/10 text-rose-400 border border-rose-500/25"
                          : "bg-amber-500/10 text-amber-300 border border-amber-500/25"
                      }`}
                    >
                      {rev.status}
                    </span>
                  </td>

                  {/* Date */}
                  <td className="py-3.5 px-4 align-top text-zinc-400 text-[11px] whitespace-nowrap font-mono">
                    {new Date(rev.createdAt).toLocaleDateString("en-GB", {
                      day: "2-digit",
                      month: "short",
                      year: "numeric",
                    })}
                  </td>

                  {/* Actions */}
                  <td
                    className="py-3.5 px-4 align-top text-right whitespace-nowrap"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <div className="inline-flex items-center justify-end gap-1.5">
                      {rev.status !== "approved" && (
                        <button
                          type="button"
                          onClick={() => onQuickApprove(rev.id)}
                          className="px-2.5 py-1 rounded bg-emerald-500/15 text-emerald-300 hover:bg-emerald-500/25 border border-emerald-500/30 text-[11px] font-medium transition-colors cursor-pointer"
                        >
                          Approve
                        </button>
                      )}

                      {rev.status !== "rejected" && (
                        <button
                          type="button"
                          onClick={() => onQuickReject(rev.id)}
                          className="px-2.5 py-1 rounded bg-rose-500/15 text-rose-300 hover:bg-rose-500/25 border border-rose-500/30 text-[11px] font-medium transition-colors cursor-pointer"
                        >
                          Reject
                        </button>
                      )}

                      <button
                        type="button"
                        onClick={() => onSelectReview(rev)}
                        className="px-2.5 py-1 rounded bg-zinc-900 text-zinc-300 hover:text-white hover:bg-zinc-800 border border-zinc-700/80 text-[11px] font-medium transition-colors cursor-pointer"
                      >
                        Inspect
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
