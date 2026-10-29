"use client";

import React from "react";
import { Star, MessageSquareQuote, Clock, CheckCircle2, TrendingUp } from "lucide-react";

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
      <div className="bg-[#0b0b0f] border border-brand-accent/15 rounded-2xl p-5 relative overflow-hidden backdrop-blur-md">
        <div className="flex items-center justify-between mb-3">
          <span className="text-[10px] uppercase tracking-[0.2em] text-zinc-400 font-semibold font-heading">
            Total Submissions
          </span>
          <div className="w-8 h-8 rounded-full bg-brand-accent/10 border border-brand-accent/20 flex items-center justify-center text-brand-accent">
            <MessageSquareQuote className="w-4 h-4" />
          </div>
        </div>
        <div className="flex items-baseline gap-2">
          <span className="text-3xl font-bold text-white font-heading">{metrics.total}</span>
          <span className="text-xs text-zinc-500 font-light">all-time</span>
        </div>
        <div className="mt-3 flex items-center gap-1.5 text-[11px] text-brand-accent font-medium">
          <TrendingUp className="w-3.5 h-3.5" />
          <span>{metrics.featured} featured on homepage</span>
        </div>
      </div>

      {/* 2. Average Rating */}
      <div className="bg-[#0b0b0f] border border-brand-accent/15 rounded-2xl p-5 relative overflow-hidden backdrop-blur-md">
        <div className="flex items-center justify-between mb-3">
          <span className="text-[10px] uppercase tracking-[0.2em] text-zinc-400 font-semibold font-heading">
            Average Rating
          </span>
          <div className="w-8 h-8 rounded-full bg-amber-400/10 border border-amber-400/20 flex items-center justify-center text-amber-400">
            <Star className="w-4 h-4 fill-current" />
          </div>
        </div>
        <div className="flex items-baseline gap-2">
          <span className="text-3xl font-bold text-white font-heading">
            {metrics.averageRating > 0 ? metrics.averageRating.toFixed(1) : "5.0"}
          </span>
          <span className="text-xs text-amber-400/80">★ ★ ★ ★ ★</span>
        </div>
        <div className="mt-3 text-[11px] text-zinc-400 font-light">
          {metrics.distribution[5] || 0} five-star ratings ({Math.round(((metrics.distribution[5] || 0) / totalCount) * 100)}%)
        </div>
      </div>

      {/* 3. Pending Moderation Queue */}
      <button
        type="button"
        onClick={() => onFilterStatus?.("pending")}
        className="bg-[#0b0b0f] border border-brand-accent/15 hover:border-amber-400/40 rounded-2xl p-5 relative overflow-hidden backdrop-blur-md text-left transition-all cursor-pointer group"
      >
        <div className="flex items-center justify-between mb-3">
          <span className="text-[10px] uppercase tracking-[0.2em] text-amber-300 font-semibold font-heading flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
            Pending Moderation
          </span>
          <div className="w-8 h-8 rounded-full bg-amber-400/10 border border-amber-400/20 flex items-center justify-center text-amber-400">
            <Clock className="w-4 h-4" />
          </div>
        </div>
        <div className="flex items-baseline gap-2">
          <span className="text-3xl font-bold text-amber-300 font-heading">{metrics.pending}</span>
          <span className="text-xs text-zinc-400 font-light">awaiting action</span>
        </div>
        <div className="mt-3 text-[11px] text-amber-300/80 font-medium group-hover:underline">
          Filter pending reviews →
        </div>
      </button>

      {/* 4. Published Testimonials */}
      <button
        type="button"
        onClick={() => onFilterStatus?.("approved")}
        className="bg-[#0b0b0f] border border-brand-accent/15 hover:border-emerald-400/40 rounded-2xl p-5 relative overflow-hidden backdrop-blur-md text-left transition-all cursor-pointer group"
      >
        <div className="flex items-center justify-between mb-3">
          <span className="text-[10px] uppercase tracking-[0.2em] text-emerald-300 font-semibold font-heading">
            Live On Website
          </span>
          <div className="w-8 h-8 rounded-full bg-emerald-400/10 border border-emerald-400/20 flex items-center justify-center text-emerald-400">
            <CheckCircle2 className="w-4 h-4" />
          </div>
        </div>
        <div className="flex items-baseline gap-2">
          <span className="text-3xl font-bold text-emerald-300 font-heading">{metrics.approved}</span>
          <span className="text-xs text-zinc-400 font-light">approved & published</span>
        </div>
        <div className="mt-3 text-[11px] text-emerald-300/80 font-medium group-hover:underline">
          View approved reviews →
        </div>
      </button>

      {/* Star Distribution Histogram Bar */}
      <div className="sm:col-span-2 lg:col-span-4 bg-[#0b0b0f] border border-brand-accent/15 rounded-2xl p-5 backdrop-blur-md">
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs uppercase tracking-[0.2em] text-brand-accent font-semibold font-heading">
            Rating Distribution
          </span>
          <span className="text-xs text-zinc-400 font-light">
            {metrics.total} client ratings recorded
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-5 gap-3 pt-1">
          {[5, 4, 3, 2, 1].map((stars) => {
            const count = metrics.distribution[stars] || 0;
            const pct = Math.round((count / totalCount) * 100);

            return (
              <button
                key={stars}
                type="button"
                onClick={() => onFilterRating?.(stars)}
                className="flex items-center gap-2.5 p-2 rounded-xl hover:bg-white/5 transition-colors cursor-pointer text-left"
              >
                <span className="text-xs font-semibold text-white flex items-center gap-1 w-12">
                  {stars} <Star className="w-3 h-3 text-amber-400 fill-current inline" />
                </span>
                <div className="flex-1 h-2 bg-zinc-800 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-amber-400 rounded-full transition-all duration-500"
                    style={{ width: `${pct}%` }}
                  />
                </div>
                <span className="text-[11px] text-zinc-400 font-mono w-8 text-right">
                  {count}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
