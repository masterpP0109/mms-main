"use client";

import React from "react";
import StarRating from "@/app/components/reviews/StarRating";

export interface ReviewMetricsData {
  total: number;
  pending: number;
  approved: number;
  rejected: number;
  featured: number;
  verified?: number;
  consented?: number;
  averageRating: number;
  distribution: Record<number, number>;
  availableServices?: string[];
}

interface ReviewMetricsProps {
  metrics: ReviewMetricsData;
  onFilterStatus?: (status: string) => void;
  onFilterRating?: (rating: number) => void;
}

export default function ReviewMetrics({
  metrics,
  onFilterStatus,
  onFilterRating,
}: ReviewMetricsProps) {
  const positiveShare =
    metrics.total > 0
      ? Math.round(
          (((metrics.distribution[5] || 0) + (metrics.distribution[4] || 0)) /
            metrics.total) *
            100
        )
      : null;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {/* 1. Moderation Queue */}
      <button
        type="button"
        onClick={() => onFilterStatus?.("pending")}
        className="bg-[#0e0e13] hover:bg-[#121218] border border-zinc-800/80 hover:border-zinc-700 rounded-xl p-4 text-left transition-all cursor-pointer group flex flex-col justify-between"
      >
        <div>
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] uppercase tracking-wider text-zinc-400 font-semibold">
              Moderation Queue
            </span>
            <span
              className={`text-[10px] font-mono px-2 py-0.5 rounded border ${
                metrics.pending > 0
                  ? "bg-amber-400/15 text-amber-300 border-amber-400/30"
                  : "bg-zinc-900 text-zinc-400 border-zinc-800"
              }`}
            >
              {metrics.pending > 0 ? "Action Required" : "0 Pending"}
            </span>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-bold text-white font-mono">
              {metrics.pending}
            </span>
            <span className="text-xs text-zinc-400">awaiting decision</span>
          </div>
        </div>
        <div className="mt-4 pt-3 border-t border-zinc-800/70 flex items-center justify-between text-[11px]">
          <span className="text-zinc-400">
            {metrics.rejected} rejected in DB
          </span>
          <span className="text-brand-accent font-medium">Filter queue →</span>
        </div>
      </button>

      {/* 2. Published Site Testimonials */}
      <button
        type="button"
        onClick={() => onFilterStatus?.("approved")}
        className="bg-[#0e0e13] hover:bg-[#121218] border border-zinc-800/80 hover:border-zinc-700 rounded-xl p-4 text-left transition-all cursor-pointer group flex flex-col justify-between"
      >
        <div>
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] uppercase tracking-wider text-zinc-400 font-semibold">
              Published Proof
            </span>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/15 text-emerald-300 border border-emerald-500/30">
              Live on Site
            </span>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-bold text-white font-mono">
              {metrics.approved}
            </span>
            <span className="text-xs text-zinc-400">
              of {metrics.total} in DB
            </span>
          </div>
        </div>
        <div className="mt-4 pt-3 border-t border-zinc-800/70 flex items-center justify-between text-[11px]">
          <span className="text-zinc-400">
            <strong>{metrics.featured}</strong> featured •{" "}
            <strong>{metrics.verified ?? 0}</strong> verified
          </span>
          <span className="text-emerald-400 font-medium">View live →</span>
        </div>
      </button>

      {/* 3. Recorded Client Rating (Strictly from DB; never defaults to 5.0 when 0 reviews exist) */}
      <button
        type="button"
        onClick={() => onFilterRating?.(5)}
        className="bg-[#0e0e13] hover:bg-[#121218] border border-zinc-800/80 hover:border-zinc-700 rounded-xl p-4 text-left transition-all cursor-pointer group flex flex-col justify-between"
      >
        <div>
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] uppercase tracking-wider text-zinc-400 font-semibold">
              Recorded Rating
            </span>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-zinc-900 text-zinc-300 border border-zinc-800">
              {positiveShare !== null ? `${positiveShare}% 4–5★` : "0 reviews"}
            </span>
          </div>
          <div className="flex items-baseline gap-3">
            <span className="text-3xl font-bold text-white font-mono">
              {metrics.total > 0 && metrics.averageRating > 0
                ? metrics.averageRating.toFixed(1)
                : "—"}
            </span>
            {metrics.total > 0 && metrics.averageRating > 0 && (
              <StarRating
                value={Math.round(metrics.averageRating)}
                size="sm"
              />
            )}
          </div>
        </div>
        <div className="mt-4 pt-3 border-t border-zinc-800/70 flex items-center justify-between text-[11px]">
          <span className="text-zinc-400">
            {metrics.distribution[5] || 0} five-star evaluations
          </span>
          <span className="text-zinc-300 font-mono">Filter 5★ →</span>
        </div>
      </button>

      {/* 4. Rating Distribution Mini-Chart */}
      <div className="bg-[#0e0e13] border border-zinc-800/80 rounded-xl p-4 flex flex-col justify-between">
        <div className="flex items-center justify-between mb-2">
          <span className="text-[11px] uppercase tracking-wider text-zinc-400 font-semibold">
            Score Distribution
          </span>
          <span className="text-[10px] font-mono text-zinc-500">
            {metrics.total} total
          </span>
        </div>

        <div className="space-y-1.5">
          {[5, 4, 3, 2, 1].map((star) => {
            const count = metrics.distribution[star] || 0;
            const pct =
              metrics.total > 0
                ? Math.round((count / metrics.total) * 100)
                : 0;
            return (
              <div
                key={star}
                className="flex items-center gap-2 text-[10px] font-mono"
              >
                <span className="w-5 text-zinc-400">{star}★</span>
                <div className="flex-1 h-1.5 bg-zinc-900 rounded-full overflow-hidden">
                  <div
                    style={{ width: `${pct}%` }}
                    className={`h-full rounded-full ${
                      star >= 4
                        ? "bg-emerald-400"
                        : star === 3
                        ? "bg-amber-400"
                        : "bg-rose-400"
                    }`}
                  />
                </div>
                <span className="w-7 text-right text-zinc-300">{count}</span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
