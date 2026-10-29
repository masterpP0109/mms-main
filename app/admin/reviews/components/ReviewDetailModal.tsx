"use client";

import React, { useState } from "react";
import { X } from "lucide-react";
import StarRating from "@/app/components/reviews/StarRating";

export interface ReviewItem {
  id: string;
  name: string;
  email: string;
  role: string | null;
  organisation: string | null;
  service: string | null;
  services?: string[];
  eventDate: string | null;
  rating: number;
  headline: string | null;
  content: string;
  status: string;
  featured: boolean;
  verified: boolean;
  consent: boolean;
  wouldRecommend?: string | null;
  attribution?: string | null;
  notes: string | null;
  metadata?: {
    stoodOut?: string;
    contribution?: string;
    improvements?: string;
    servicesList?: string[];
  } | null;
  moderatedAt: string | null;
  moderatedBy: string | null;
  createdAt: string;
}

interface ReviewDetailModalProps {
  review: ReviewItem | null;
  onClose: () => void;
  onUpdateStatus: (id: string, status: string) => Promise<void>;
  onToggleFeatured: (id: string, featured: boolean) => Promise<void>;
  onToggleVerified: (id: string, verified: boolean) => Promise<void>;
  onSaveNotes: (id: string, notes: string) => Promise<void>;
  onDelete: (id: string) => Promise<void>;
}

export default function ReviewDetailModal({
  review,
  onClose,
  onUpdateStatus,
  onToggleFeatured,
  onToggleVerified,
  onSaveNotes,
  onDelete,
}: ReviewDetailModalProps) {
  const [notes, setNotes] = useState<string>(review?.notes || "");
  const [savingNotes, setSavingNotes] = useState<boolean>(false);
  const [actionLoading, setActionLoading] = useState<boolean>(false);

  if (!review) return null;

  const handleSaveNotes = async () => {
    setSavingNotes(true);
    try {
      await onSaveNotes(review.id, notes);
    } finally {
      setSavingNotes(false);
    }
  };

  const handleStatusChange = async (newStatus: string) => {
    setActionLoading(true);
    try {
      await onUpdateStatus(review.id, newStatus);
    } finally {
      setActionLoading(false);
    }
  };

  const meta = review.metadata || {};

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
      <div
        className="bg-[#0b0b0f] border border-brand-accent/25 rounded-3xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl relative flex flex-col"
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
      >
        {/* Modal Header */}
        <div className="p-6 border-b border-brand-accent/15 flex items-center justify-between sticky top-0 bg-[#0b0b0f]/95 backdrop-blur-md z-10">
          <div className="space-y-1">
            <span className="text-[10px] uppercase tracking-[0.25em] text-brand-accent font-semibold font-heading">
              Client Feedback Review
            </span>
            <h2 id="modal-title" className="text-xl font-semibold text-white font-heading">
              {review.name}
            </h2>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-full text-zinc-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-6 flex-1">
          {/* Top Status & Moderation Controls */}
          <div className="flex flex-wrap items-center justify-between gap-3 p-4 bg-[#121218] border border-brand-accent/15 rounded-2xl">
            <div className="flex items-center gap-3">
              <span
                className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider ${
                  review.status === "approved"
                    ? "bg-emerald-500/15 text-emerald-300 border border-emerald-500/30"
                    : review.status === "rejected"
                    ? "bg-rose-500/15 text-rose-300 border border-rose-500/30"
                    : "bg-amber-500/15 text-amber-300 border border-amber-500/30"
                }`}
              >
                <span
                  className={`w-1.5 h-1.5 rounded-full ${
                    review.status === "approved"
                      ? "bg-emerald-400"
                      : review.status === "rejected"
                      ? "bg-rose-400"
                      : "bg-amber-400 animate-pulse"
                  }`}
                />
                Status: {review.status}
              </span>

              <button
                type="button"
                onClick={() => onToggleFeatured(review.id, !review.featured)}
                className={`px-3 py-1 rounded-full text-xs font-medium border transition-all cursor-pointer ${
                  review.featured
                    ? "bg-amber-400/20 text-amber-300 border-amber-400/50"
                    : "text-zinc-400 border-zinc-700 hover:border-amber-400/40 hover:text-white"
                }`}
              >
                {review.featured ? "Featured on Site" : "Make Featured"}
              </button>
            </div>

            <button
              type="button"
              onClick={() => onToggleVerified(review.id, !review.verified)}
              className={`px-3 py-1 rounded-full text-xs font-medium border transition-all cursor-pointer ${
                review.verified
                  ? "bg-emerald-500/15 text-emerald-300 border border-emerald-500/30"
                  : "text-zinc-400 border-zinc-700 hover:border-emerald-400/40 hover:text-white"
              }`}
            >
              {review.verified ? "Verified Client" : "Mark Verified"}
            </button>
          </div>

          {/* Review Headline & Rating */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <StarRating value={review.rating} size="md" />
              <span className="text-xs text-zinc-500 font-mono">
                {new Date(review.createdAt).toLocaleString()}
              </span>
            </div>

            {review.headline && (
              <h3 className="text-lg font-bold text-white font-heading">
                &ldquo;{review.headline}&rdquo;
              </h3>
            )}

            <div className="bg-[#050507] border border-brand-accent/20 rounded-2xl p-4 text-sm text-brand-foreground/90 leading-relaxed font-light whitespace-pre-wrap">
              {review.content}
            </div>
          </div>

          {/* Questionnaire Answers Breakdown (Tally X5xb0e) */}
          <div className="space-y-4 pt-2">
            <h4 className="text-xs uppercase tracking-[0.2em] text-brand-accent font-semibold font-heading">
              Detailed Questionnaire Insights
            </h4>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
              {/* Would Recommend */}
              <div className="bg-[#121218] border border-brand-accent/10 rounded-xl p-3.5 space-y-1">
                <span className="text-[10px] uppercase tracking-wider text-zinc-400 font-medium block">
                  Would Recommend to Others
                </span>
                <p className="text-sm font-semibold text-white">
                  {review.wouldRecommend || "Yes"}
                </p>
              </div>

              {/* Attribution Preference */}
              <div className="bg-[#121218] border border-brand-accent/10 rounded-xl p-3.5 space-y-1">
                <span className="text-[10px] uppercase tracking-wider text-zinc-400 font-medium block">
                  Attribution Authorisation
                </span>
                <p className="text-sm font-semibold text-white">
                  {review.attribution || (review.consent ? "Authorised for marketing" : "Private feedback")}
                </p>
              </div>

              {/* What Stood Out */}
              {meta.stoodOut && (
                <div className="md:col-span-2 bg-[#121218] border border-brand-accent/10 rounded-xl p-3.5 space-y-1">
                  <span className="text-[10px] uppercase tracking-wider text-zinc-400 font-medium block">
                    What Stood Out Most
                  </span>
                  <p className="text-xs text-white/90 leading-relaxed font-light">
                    {meta.stoodOut}
                  </p>
                </div>
              )}

              {/* Contribution to Success */}
              {meta.contribution && (
                <div className="md:col-span-2 bg-[#121218] border border-brand-accent/10 rounded-xl p-3.5 space-y-1">
                  <span className="text-[10px] uppercase tracking-wider text-zinc-400 font-medium block">
                    Contribution to Project Success
                  </span>
                  <p className="text-xs text-white/90 leading-relaxed font-light">
                    {meta.contribution}
                  </p>
                </div>
              )}

              {/* Improvements */}
              {meta.improvements && (
                <div className="md:col-span-2 bg-[#121218] border border-brand-accent/10 rounded-xl p-3.5 space-y-1">
                  <span className="text-[10px] uppercase tracking-wider text-zinc-400 font-medium block">
                    Constructive Feedback / Improvements
                  </span>
                  <p className="text-xs text-white/90 leading-relaxed font-light">
                    {meta.improvements}
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Client Details Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 text-xs">
            <div className="p-3 bg-[#121218] border border-brand-accent/10 rounded-xl">
              <span className="text-[10px] uppercase tracking-wider text-zinc-400 font-medium block mb-1">
                Client Contact
              </span>
              <p className="font-semibold text-white">{review.name}</p>
              <p className="text-zinc-400 select-all font-mono text-[11px] mt-0.5">{review.email}</p>
            </div>

            <div className="p-3 bg-[#121218] border border-brand-accent/10 rounded-xl">
              <span className="text-[10px] uppercase tracking-wider text-zinc-400 font-medium block mb-1">
                Organisation / Role
              </span>
              <p className="font-semibold text-white">{review.organisation || "Individual Client"}</p>
              <p className="text-zinc-400 text-[11px] mt-0.5">{review.role || "Executive / Organiser"}</p>
            </div>
          </div>

          {/* Private Staff Notes */}
          <div className="space-y-2 pt-2 border-t border-brand-accent/10">
            <label className="text-[11px] uppercase tracking-wider text-zinc-400 font-semibold block font-heading">
              Internal Moderation Notes
            </label>
            <div className="flex gap-2">
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Add private staff notes (e.g. 'Confirmed with event coordinator', 'Spoke to conference director')..."
                rows={2}
                className="flex-1 bg-[#050507] border border-brand-accent/20 rounded-xl p-3 text-xs text-white placeholder:text-zinc-600 focus:outline-none focus:border-brand-accent/50 resize-y"
              />
              <button
                type="button"
                onClick={handleSaveNotes}
                disabled={savingNotes}
                className="px-4 bg-brand-primary/40 hover:bg-brand-primary text-white text-xs font-semibold rounded-xl border border-brand-accent/30 transition-colors cursor-pointer disabled:opacity-50"
              >
                {savingNotes ? "Saving..." : "Save Notes"}
              </button>
            </div>
          </div>
        </div>

        {/* Modal Footer Actions (Clean Typographic Buttons) */}
        <div className="p-6 border-t border-brand-accent/15 bg-[#050507] rounded-b-3xl flex flex-wrap items-center justify-between gap-3">
          <button
            type="button"
            onClick={() => onDelete(review.id)}
            disabled={actionLoading}
            className="text-xs text-red-400 hover:text-red-300 px-3 py-2 rounded-xl hover:bg-red-950/30 transition-colors cursor-pointer"
          >
            Delete Review
          </button>

          <div className="flex items-center gap-2">
            {review.status !== "approved" && (
              <button
                type="button"
                disabled={actionLoading}
                onClick={() => handleStatusChange("approved")}
                className="px-5 py-2.5 rounded-full bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold transition-colors cursor-pointer shadow-lg shadow-emerald-950"
              >
                Approve for Website
              </button>
            )}

            {review.status !== "rejected" && (
              <button
                type="button"
                disabled={actionLoading}
                onClick={() => handleStatusChange("rejected")}
                className="px-4 py-2.5 rounded-full bg-rose-950/60 hover:bg-rose-900 border border-rose-500/40 text-rose-300 text-xs font-semibold transition-colors cursor-pointer"
              >
                Reject
              </button>
            )}

            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-full border border-zinc-700 text-zinc-300 hover:text-white text-xs font-medium hover:bg-white/5 transition-colors cursor-pointer"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
