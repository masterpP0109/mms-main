"use client";

import React, { useState } from "react";
import { X, CheckCircle2, XCircle, Star, Trash2, Calendar, Mail, Building, Briefcase, Save, ThumbsUp, UserCheck } from "lucide-react";
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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
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
              Submission Details
            </span>
            <h2 id="modal-title" className="text-xl font-semibold text-white font-heading">
              {review.name}
            </h2>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-full text-zinc-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-6 flex-1">
          {/* Top Status & Flags Bar */}
          <div className="flex flex-wrap items-center justify-between gap-3 p-4 bg-[#121218] border border-brand-accent/15 rounded-2xl">
            <div className="flex items-center gap-3">
              <span
                className={`px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider ${
                  review.status === "approved"
                    ? "bg-emerald-500/15 text-emerald-300 border border-emerald-500/30"
                    : review.status === "rejected"
                    ? "bg-rose-500/15 text-rose-300 border border-rose-500/30"
                    : "bg-amber-500/15 text-amber-300 border border-amber-500/30"
                }`}
              >
                Status: {review.status}
              </span>

              <button
                type="button"
                onClick={() => onToggleFeatured(review.id, !review.featured)}
                className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium border transition-all cursor-pointer ${
                  review.featured
                    ? "bg-amber-400/20 text-amber-300 border-amber-400/50"
                    : "text-zinc-500 border-zinc-700 hover:border-amber-400/30"
                }`}
              >
                <Star className={`w-3.5 h-3.5 ${review.featured ? "fill-amber-400 text-amber-400" : ""}`} />
                <span>{review.featured ? "Featured on Site" : "Not Featured"}</span>
              </button>
            </div>

            <button
              type="button"
              onClick={() => onToggleVerified(review.id, !review.verified)}
              className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium border transition-all cursor-pointer ${
                review.verified
                  ? "bg-emerald-500/15 text-emerald-300 border-emerald-500/30"
                  : "text-zinc-500 border-zinc-700 hover:border-emerald-400/30"
              }`}
            >
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>{review.verified ? "Verified Client" : "Unverified"}</span>
            </button>
          </div>

          {/* Review Content & Headline */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <StarRating value={review.rating} size="md" />
              <span className="text-xs text-zinc-500 font-mono">
                ID: {review.id}
              </span>
            </div>

            {review.headline && (
              <h3 className="text-lg font-semibold text-white font-heading">
                {review.headline}
              </h3>
            )}

            <div className="p-4 bg-[#050507] border border-brand-accent/15 rounded-2xl">
              <p className="text-sm text-brand-foreground/90 leading-relaxed font-light whitespace-pre-wrap">
                {review.content}
              </p>
            </div>
          </div>

          {/* Questionnaire Breakdown (Tally Responses) */}
          {(meta.stoodOut || meta.contribution || meta.improvements || review.wouldRecommend || review.attribution) && (
            <div className="space-y-3 p-4 bg-[#121218] border border-brand-accent/15 rounded-2xl">
              <span className="text-[10px] uppercase tracking-[0.2em] text-brand-accent font-semibold block font-heading">
                Detailed Questionnaire Responses
              </span>

              {review.wouldRecommend && (
                <div className="flex items-center gap-2 text-xs">
                  <ThumbsUp className="w-3.5 h-3.5 text-brand-accent" />
                  <span className="text-zinc-400">Would recommend MMS:</span>
                  <span className="font-semibold text-white">{review.wouldRecommend}</span>
                </div>
              )}

              {review.attribution && (
                <div className="flex items-center gap-2 text-xs">
                  <UserCheck className="w-3.5 h-3.5 text-brand-accent" />
                  <span className="text-zinc-400">Attribution Preference:</span>
                  <span className="font-semibold text-brand-accent">{review.attribution}</span>
                </div>
              )}

              {meta.stoodOut && (
                <div className="pt-2 border-t border-brand-accent/10 space-y-1">
                  <p className="text-[11px] text-zinc-400 font-medium">What stood out most:</p>
                  <p className="text-xs text-zinc-200 leading-relaxed">{meta.stoodOut}</p>
                </div>
              )}

              {meta.contribution && (
                <div className="pt-2 border-t border-brand-accent/10 space-y-1">
                  <p className="text-[11px] text-zinc-400 font-medium">Impact on event/project:</p>
                  <p className="text-xs text-zinc-200 leading-relaxed">{meta.contribution}</p>
                </div>
              )}

              {meta.improvements && (
                <div className="pt-2 border-t border-brand-accent/10 space-y-1">
                  <p className="text-[11px] text-zinc-400 font-medium">Suggestions for improvement:</p>
                  <p className="text-xs text-zinc-200 leading-relaxed">{meta.improvements}</p>
                </div>
              )}
            </div>
          )}

          {/* Reviewer Metadata Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            <div className="p-3 bg-[#121218] border border-brand-accent/10 rounded-xl flex items-center gap-2.5">
              <Mail className="w-4 h-4 text-brand-accent shrink-0" />
              <div className="truncate">
                <span className="text-[10px] uppercase text-zinc-500 block font-heading">Email Address</span>
                <span className="text-white font-medium select-all">{review.email}</span>
              </div>
            </div>

            <div className="p-3 bg-[#121218] border border-brand-accent/10 rounded-xl flex items-center gap-2.5">
              <Briefcase className="w-4 h-4 text-brand-accent shrink-0" />
              <div className="truncate">
                <span className="text-[10px] uppercase text-zinc-500 block font-heading">Service(s)</span>
                <span className="text-white font-medium">
                  {review.services && review.services.length > 0
                    ? review.services.join(", ")
                    : review.service || "General / Unspecified"}
                </span>
              </div>
            </div>

            <div className="p-3 bg-[#121218] border border-brand-accent/10 rounded-xl flex items-center gap-2.5">
              <Building className="w-4 h-4 text-brand-accent shrink-0" />
              <div className="truncate">
                <span className="text-[10px] uppercase text-zinc-500 block font-heading">Organisation</span>
                <span className="text-white font-medium">
                  {review.organisation || "Private Client"}
                </span>
              </div>
            </div>

            <div className="p-3 bg-[#121218] border border-brand-accent/10 rounded-xl flex items-center gap-2.5">
              <Calendar className="w-4 h-4 text-brand-accent shrink-0" />
              <div className="truncate">
                <span className="text-[10px] uppercase text-zinc-500 block font-heading">Submission Date</span>
                <span className="text-white font-medium">
                  {new Date(review.createdAt).toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                  })}
                </span>
              </div>
            </div>
          </div>

          {/* Internal Staff Moderation Notes */}
          <div className="space-y-2">
            <label htmlFor="moderation-notes" className="text-[10px] uppercase tracking-[0.2em] text-brand-accent font-semibold block font-heading">
              Internal Staff Notes
            </label>
            <div className="flex gap-2">
              <textarea
                id="moderation-notes"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Add private staff notes (e.g. 'Confirmed with wedding coordinator', 'Spoke to conference director')..."
                rows={2}
                className="flex-1 bg-[#050507] border border-brand-accent/20 rounded-xl p-3 text-xs text-white placeholder:text-zinc-600 focus:outline-none focus:border-brand-accent/50 resize-y"
              />
              <button
                type="button"
                onClick={handleSaveNotes}
                disabled={savingNotes}
                className="px-4 bg-brand-primary/40 hover:bg-brand-primary text-white text-xs font-semibold rounded-xl border border-brand-accent/30 flex items-center gap-1.5 transition-colors cursor-pointer disabled:opacity-50"
              >
                <Save className="w-3.5 h-3.5" />
                <span>{savingNotes ? "Saving..." : "Save"}</span>
              </button>
            </div>
          </div>
        </div>

        {/* Modal Footer Actions */}
        <div className="p-6 border-t border-brand-accent/15 bg-[#050507] rounded-b-3xl flex flex-wrap items-center justify-between gap-3">
          <button
            type="button"
            onClick={() => onDelete(review.id)}
            disabled={actionLoading}
            className="flex items-center gap-1.5 text-xs text-red-400 hover:text-red-300 px-3 py-2 rounded-xl hover:bg-red-950/30 transition-colors cursor-pointer"
          >
            <Trash2 className="w-4 h-4" />
            <span>Delete Review</span>
          </button>

          <div className="flex items-center gap-2">
            {review.status !== "approved" && (
              <button
                type="button"
                disabled={actionLoading}
                onClick={() => handleStatusChange("approved")}
                className="flex items-center gap-1.5 px-5 py-2.5 rounded-full bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold transition-colors cursor-pointer shadow-lg shadow-emerald-950"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>Approve for Website</span>
              </button>
            )}

            {review.status !== "rejected" && (
              <button
                type="button"
                disabled={actionLoading}
                onClick={() => handleStatusChange("rejected")}
                className="flex items-center gap-1.5 px-4 py-2.5 rounded-full bg-rose-950/60 hover:bg-rose-900 border border-rose-500/40 text-rose-300 text-xs font-semibold transition-colors cursor-pointer"
              >
                <XCircle className="w-4 h-4" />
                <span>Reject</span>
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
