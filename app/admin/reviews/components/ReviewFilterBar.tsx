"use client";

import React from "react";
import { Search, Filter } from "lucide-react";

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
  availableServices: string[];
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
  availableServices,
}: ReviewFilterBarProps) {
  const hasActiveFilters =
    search || status !== "all" || service !== "all" || rating > 0;

  return (
    <div className="bg-[#0e0e13] border border-zinc-800/80 rounded-xl p-4 space-y-3.5">
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
        {/* Search Input */}
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-zinc-500" />
          <input
            type="text"
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search client name, email, organisation, feedback..."
            className="w-full bg-[#07070a] border border-zinc-800 focus:border-zinc-600 rounded-lg pl-9 pr-3 py-2 text-xs text-white placeholder:text-zinc-500 focus:outline-none transition-colors"
          />
        </div>

        {/* Status Tabs */}
        <div className="flex flex-wrap items-center gap-1 p-1 bg-[#07070a] border border-zinc-800 rounded-lg">
          {[
            { id: "all", label: "All Submissions" },
            { id: "pending", label: "Pending Queue", count: pendingCount },
            { id: "approved", label: "Approved" },
            { id: "rejected", label: "Rejected" },
          ].map((tab) => {
            const isActive = status === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => onStatusChange(tab.id)}
                className={`px-3 py-1.5 text-xs font-medium rounded-md transition-all cursor-pointer flex items-center gap-1.5 ${
                  isActive
                    ? "bg-brand-primary text-white"
                    : "text-zinc-400 hover:text-white hover:bg-zinc-900"
                }`}
              >
                <span>{tab.label}</span>
                {typeof tab.count === "number" && tab.count > 0 && (
                  <span
                    className={`px-1.5 py-0.2 rounded text-[10px] font-mono ${
                      isActive
                        ? "bg-black/30 text-white"
                        : "bg-amber-400/20 text-amber-300"
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
      <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-zinc-800/70">
        <div className="flex flex-wrap items-center gap-2.5">
          <span className="text-zinc-400 text-xs flex items-center gap-1.5">
            <Filter className="w-3.5 h-3.5" />
            Database Segment:
          </span>

          <select
            aria-label="Filter by service"
            value={service}
            onChange={(e) => onServiceChange(e.target.value)}
            className="bg-[#07070a] border border-zinc-800 rounded-lg px-3 py-1.5 text-xs text-zinc-200 focus:outline-none focus:border-zinc-600 cursor-pointer"
          >
            <option value="all">All Database Services</option>
            {availableServices.map((srv) => (
              <option key={srv} value={srv}>
                {srv}
              </option>
            ))}
          </select>

          <select
            aria-label="Filter by rating"
            value={rating}
            onChange={(e) => onRatingChange(Number(e.target.value))}
            className="bg-[#07070a] border border-zinc-800 rounded-lg px-3 py-1.5 text-xs text-zinc-200 focus:outline-none focus:border-zinc-600 cursor-pointer"
          >
            <option value={0}>All Ratings</option>
            <option value={5}>5 Stars (5.0)</option>
            <option value={4}>4 Stars (4.0)</option>
            <option value={3}>3 Stars (3.0)</option>
            <option value={2}>2 Stars (2.0)</option>
            <option value={1}>1 Star (1.0)</option>
          </select>
        </div>

        {hasActiveFilters && (
          <button
            type="button"
            onClick={onReset}
            className="text-xs text-zinc-400 hover:text-white transition-colors cursor-pointer"
          >
            Reset Filters
          </button>
        )}
      </div>
    </div>
  );
}
