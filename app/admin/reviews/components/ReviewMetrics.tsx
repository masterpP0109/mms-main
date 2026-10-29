"use client";

import React from "react";
import StarRating from "@/app/components/reviews/StarRating";

export interface ReviewMetricsData {
  total: number;
  pending: number;
  approved: number;
  rejected: number;
  featured: number;
  averageRating: number;
  distribution: Record<number, number>;
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
  const totalCount = metrics.total || 1; // avoid division by zero

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-5">
      {/* 1. Total Submissions */}
      <div className="bg-[#0b0b0f] border border-brand-accent/15 rounded-2xl p-5 relative overflow-hidden backdrop-blur-md shadow-xl">
        <div className="flex items-center justify-between mb-3">
          <span className="text-[10px] uppercase tracking-[0.2em] text-zinc-400 font-semibold font-heading">
            Total Submissions
          </span>
          <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded bg-white/5 text-zinc-400 border border-zinc-800">
            All-time
          </span>
        </div>
        <div className="flex items-baseline gap-2">
          <span className="text-3xl font-bold text-white font-heading">{metrics.total}</span>
          <span className="text-xs text-zinc-500 font-light">reviews</span>
        </div>
        <div className="mt-3 text-[11px] text-brand-accent font-medium">
          {metrics.featured} featured on website
        </div>
      </div>

      {/* 2. Average Rating with Realistic Stars */}
      <button
        type="button"
        onClick={() => onFilterRating?.(5)}
        className="bg-[#0b0b0f] border border-brand-accent/15 hover:border-amber-400/40 rounded-2xl p-5 relative overflow-hidden backdrop-blur-md text-left transition-all cursor-pointer group shadow-xl"
      >
        <div className="flex items-center justify-between mb-3">
          <span className="text-[10px] uppercase tracking-[0.2em] text-zinc-400 font-semibold font-heading">
            Average Rating
          </span>
          <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded bg-amber-400/10 text-amber-300 border border-amber-400/20">
            5.0 Scale
          </span>
        </div>
        <div className="flex items-baseline gap-3">
          <span className="text-3xl font-bold text-white font-heading">
            {metrics.averageRating > 0 ? metrics.averageRating.toFixed(1) : "5.0"}
          </span>
          <StarRating value={Math.round(metrics.averageRating || 5)} size="sm" />
        </div>
        <div className="mt-3 text-[11px] text-zinc-400 font-light group-hover:text-amber-300 group-hover:underline">
          {metrics.distribution[5] || 0} five-star ratings ({Math.round(((metrics.distribution[5] || 0) / totalCount) * 100)}%) →
        </div>
      </button>

      {/* 3. Pending Moderation Queue */}
      <button
        type="button"
        onClick={() => onFilterStatus?.("pending")}
        className="bg-[#0b0b0f] border border-brand-accent/15 hover:border-amber-400/40 rounded-2xl p-5 relative overflow-hidden backdrop-blur-md text-left transition-all cursor-pointer group shadow-xl"
      >
        <div className="flex items-center justify-between mb-3">
          <span className="text-[10px] uppercase tracking-[0.2em] text-amber-300 font-semibold font-heading flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-amber-400 shadow-[0_0_8px_rgba(251,191,36,0.8)] animate-pulse" />
            Pending Action
          </span>
          <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded bg-amber-400/15 text-amber-300 border border-amber-400/25">
            Queue
          </span>
        </div>
        <div className="flex items-baseline gap-2">
          <span className="text-3xl font-bold text-amber-300 font-heading">{metrics.pending}</span>
          <span className="text-xs text-zinc-400 font-light">awaiting review</span>
        </div>
        <div className="mt-3 text-[11px] text-amber-300/90 font-medium group-hover:underline">
          Filter pending reviews →
        </div>
      </button>

      {/* 4. Published Testimonials */}
      <button
        type="button"
        onClick={() => onFilterStatus?.("approved")}
        className="bg-[#0b0b0f] border border-brand-accent/15 hover:border-emerald-400/40 rounded-2xl p-5 relative overflow-hidden backdrop-blur-md text-left transition-all cursor-pointer group shadow-xl"
      >
        <div className="flex items-center justify-between mb-3">
          <span className="text-[10px] uppercase tracking-[0.2em] text-emerald-300 font-semibold font-heading flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.8)]" />
            Approved
          </span>
          <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded bg-emerald-500/15 text-emerald-300 border border-emerald-500/25">
            Live
          </span>
        </div>
        <div className="flex items-baseline gap-2">
          <span className="text-3xl font-bold text-emerald-300 font-heading">{metrics.approved}</span>
          <span className="text-xs text-zinc-400 font-light">live on website</span>
        </div>
        <div className="mt-3 text-[11px] text-emerald-300/90 font-medium group-hover:underline">
          Filter live reviews →
        </div>
      </button>
    </div>
  );
}
