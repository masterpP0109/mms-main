"use client";

import React from "react";
import { Search } from "lucide-react";

const SERVICES_LIST = [
  "All Services",
  "Videography",
  "Live Streaming",
  "Photography",
  "Drone Services",
  "Podcast Production",
  "DJ & Lighting",
  "360 Photo Booth",
  "Special Effects",
  "LED Screens & Display",
  "Conference & Interpretation Systems",
  "Audio Solutions",
  "Other",
];

interface ReviewFilterBarProps {
  search: string;
  onSearchChange: (search: string) => void;
  status: string;
  onStatusChange: (status: string) => void;
  service: string;
  onServiceChange: (service: string) => void;
  rating: number;
  onRatingChange: (rating: number) => void;
  onReset: () => void;
  pendingCount: number;
}

export default function ReviewFilterBar({
  search,
  onSearchChange,
  status,
  onStatusChange,
  service,
  onServiceChange,
  rating,
  onRatingChange,
  onReset,
  pendingCount,
}: ReviewFilterBarProps) {
  const hasActiveFilters = search || status !== "all" || service !== "all" || rating > 0;

  return (
    <div className="bg-[#0b0b0f] border border-brand-accent/15 rounded-2xl p-4 md:p-5 space-y-4 backdrop-blur-md shadow-xl">
      {/* Top Row: Search and Status Tabs */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
        {/* Search Input with standard search affordance */}
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
          <input
            type="text"
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search by client name, email, organisation, headline..."
            className="w-full bg-[#050507] border border-brand-accent/20 rounded-xl pl-10 pr-4 py-2.5 text-xs sm:text-sm text-white placeholder:text-zinc-600 focus:outline-none focus:border-brand-accent/60 transition-colors"
          />
        </div>

        {/* Status Tabs */}
        <div className="flex flex-wrap items-center gap-1.5 p-1 bg-[#050507] border border-brand-accent/15 rounded-xl">
          {[
            { id: "all", label: "All" },
            { id: "pending", label: "Pending", count: pendingCount },
            { id: "approved", label: "Approved" },
            { id: "rejected", label: "Rejected" },
          ].map((tab) => {
            const isActive = status === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => onStatusChange(tab.id)}
                className={`px-3.5 py-1.5 text-xs font-medium rounded-lg transition-all cursor-pointer flex items-center gap-1.5 ${
                  isActive
                    ? "bg-brand-primary text-white shadow-md shadow-brand-primary/30"
                    : "text-zinc-400 hover:text-white hover:bg-white/5"
                }`}
              >
                <span>{tab.label}</span>
                {typeof tab.count === "number" && tab.count > 0 && (
                  <span
                    className={`px-1.5 py-0.2 rounded-full text-[10px] font-mono ${
                      isActive ? "bg-white/20 text-white" : "bg-amber-400/20 text-amber-300"
                    }`}
                  >
                    {tab.count}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Bottom Row: Dropdown Filters & Reset */}
      <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-brand-accent/10">
        <div className="flex flex-wrap items-center gap-3">
          <span className="text-zinc-400 text-xs font-heading">
            Filter:
          </span>

          {/* Service Dropdown */}
          <select
            value={service}
            onChange={(e) => onServiceChange(e.target.value)}
            className="bg-[#050507] border border-brand-accent/20 rounded-xl px-3 py-1.5 text-xs text-white focus:outline-none focus:border-brand-accent/50 cursor-pointer"
          >
            {SERVICES_LIST.map((srv) => (
              <option key={srv} value={srv === "All Services" ? "all" : srv}>
                {srv}
              </option>
            ))}
          </select>

          {/* Rating Dropdown */}
          <select
            value={rating}
            onChange={(e) => onRatingChange(Number(e.target.value))}
            className="bg-[#050507] border border-brand-accent/20 rounded-xl px-3 py-1.5 text-xs text-white focus:outline-none focus:border-brand-accent/50 cursor-pointer"
          >
            <option value={0}>All Ratings</option>
            <option value={5}>5 Stars ★★★★★</option>
            <option value={4}>4 Stars ★★★★</option>
            <option value={3}>3 Stars ★★★</option>
            <option value={2}>2 Stars ★★</option>
            <option value={1}>1 Star ★</option>
          </select>
        </div>

        {hasActiveFilters && (
          <button
            type="button"
            onClick={onReset}
            className="text-xs text-zinc-400 hover:text-brand-accent transition-colors cursor-pointer"
          >
            Reset Filters
          </button>
        )}
      </div>
    </div>
  );
}
