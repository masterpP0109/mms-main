"use client";

import React, { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { RefreshCw, ExternalLink, ShieldAlert, Check } from "lucide-react";
import ReviewMetrics, { type ReviewMetricsData } from "./components/ReviewMetrics";
import ReviewFilterBar from "./components/ReviewFilterBar";
import ReviewTable from "./components/ReviewTable";
import ReviewDetailModal, { type ReviewItem } from "./components/ReviewDetailModal";

const DEFAULT_METRICS: ReviewMetricsData = {
  total: 0,
  pending: 0,
  approved: 0,
  rejected: 0,
  featured: 0,
  averageRating: 5.0,
  distribution: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 },
};

export default function ReviewsDashboard() {
  const [reviews, setReviews] = useState<ReviewItem[]>([]);
  const [metrics, setMetrics] = useState<ReviewMetricsData>(DEFAULT_METRICS);
  const [loading, setLoading] = useState<boolean>(true);
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const [selectedReview, setSelectedReview] = useState<ReviewItem | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Filters
  const [search, setSearch] = useState<string>("");
  const [status, setStatus] = useState<string>("all");
  const [service, setService] = useState<string>("all");
  const [rating, setRating] = useState<number>(0);

  const showToast = (message: string) => {
    setToastMessage(message);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const fetchReviews = useCallback(async () => {
    try {
      const params = new URLSearchParams();
      if (status !== "all") params.set("status", status);
      if (service !== "all") params.set("service", service);
      if (rating > 0) params.set("rating", String(rating));
      if (search.trim()) params.set("search", search.trim());

      const res = await fetch(`/api/admin/reviews?${params.toString()}`);
      if (!res.ok) throw new Error("Failed to fetch reviews");
      const data = await res.json();

      setReviews(data.items || []);
      if (data.metrics) {
        setMetrics(data.metrics);
      }
    } catch (err) {
      console.error("Dashboard fetch error:", err);
      showToast("Unable to refresh reviews");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [status, service, rating, search]);

  useEffect(() => {
    fetchReviews();
  }, [fetchReviews]);

  const handleRefresh = () => {
    setRefreshing(true);
    fetchReviews();
  };

  const handleUpdateStatus = async (id: string, newStatus: string) => {
    try {
      const res = await fetch("/api/admin/reviews", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id,
          updates: { status: newStatus },
        }),
      });

      if (!res.ok) throw new Error("Status update failed");
      const data = await res.json();

      setReviews((prev) =>
        prev.map((r) => (r.id === id ? { ...r, ...data.review } : r))
      );

      if (selectedReview?.id === id) {
        setSelectedReview((prev) => (prev ? { ...prev, ...data.review } : null));
      }

      showToast(`Review status updated to ${newStatus}`);
      fetchReviews();
    } catch {
      showToast("Failed to update status");
    }
  };

  const handleToggleFeatured = async (id: string, featured: boolean) => {
    try {
      const res = await fetch("/api/admin/reviews", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id,
          updates: { featured },
        }),
      });

      if (!res.ok) throw new Error("Failed to toggle featured");
      const data = await res.json();

      setReviews((prev) =>
        prev.map((r) => (r.id === id ? { ...r, ...data.review } : r))
      );

      if (selectedReview?.id === id) {
        setSelectedReview((prev) => (prev ? { ...prev, ...data.review } : null));
      }

      showToast(featured ? "Review pinned as featured" : "Removed from featured");
      fetchReviews();
    } catch {
      showToast("Failed to toggle featured state");
    }
  };

  const handleToggleVerified = async (id: string, verified: boolean) => {
    try {
      const res = await fetch("/api/admin/reviews", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id,
          updates: { verified },
        }),
      });

      if (!res.ok) throw new Error("Failed to toggle verified");
      const data = await res.json();

      setReviews((prev) =>
        prev.map((r) => (r.id === id ? { ...r, ...data.review } : r))
      );

      if (selectedReview?.id === id) {
        setSelectedReview((prev) => (prev ? { ...prev, ...data.review } : null));
      }

      showToast(verified ? "Client marked as verified" : "Client verification removed");
    } catch {
      showToast("Failed to toggle verification");
    }
  };

  const handleSaveNotes = async (id: string, notes: string) => {
    try {
      const res = await fetch("/api/admin/reviews", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id,
          updates: { notes },
        }),
      });

      if (!res.ok) throw new Error("Failed to save notes");
      const data = await res.json();

      setReviews((prev) =>
        prev.map((r) => (r.id === id ? { ...r, ...data.review } : r))
      );

      if (selectedReview?.id === id) {
        setSelectedReview((prev) => (prev ? { ...prev, ...data.review } : null));
      }

      showToast("Moderation notes saved");
    } catch {
      showToast("Failed to save notes");
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm("Are you sure you want to permanently delete this review submission?")) {
      return;
    }

    try {
      const res = await fetch("/api/admin/reviews", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });

      if (!res.ok) throw new Error("Delete failed");

      setReviews((prev) => prev.filter((r) => r.id !== id));
      setSelectedReview(null);
      showToast("Review deleted");
      fetchReviews();
    } catch {
      showToast("Failed to delete review");
    }
  };

  const handleResetFilters = () => {
    setSearch("");
    setStatus("all");
    setService("all");
    setRating(0);
  };

  return (
    <div className="space-y-8">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#121218] border border-brand-accent/40 text-white text-xs px-4 py-3 rounded-2xl shadow-2xl flex items-center gap-2 animate-in fade-in slide-in-from-bottom-3 duration-200">
          <Check className="w-4 h-4 text-emerald-400" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Dashboard Top Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-brand-accent/15">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="w-2 h-2 rounded-full bg-emerald-400" />
            <span className="text-[10px] uppercase tracking-[0.3em] text-brand-accent font-semibold font-heading">
              MMS Operations Console
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-white font-heading">
            Review & Testimonial Submissions
          </h1>
          <p className="text-xs sm:text-sm text-zinc-400 font-light mt-1">
            Monitor, moderate, verify and publish client feedback across all production channels.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <button
            type="button"
            onClick={handleRefresh}
            disabled={refreshing}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-zinc-300 hover:text-white border border-zinc-700 text-xs font-medium transition-colors cursor-pointer disabled:opacity-50"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${refreshing ? "animate-spin text-brand-accent" : ""}`} />
            <span>{refreshing ? "Refreshing..." : "Refresh"}</span>
          </button>

          <Link
            href="/reviews"
            target="_blank"
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-brand-primary/20 hover:bg-brand-primary/30 text-brand-accent border border-brand-accent/30 text-xs font-semibold transition-colors"
          >
            <span>Live Reviews Page</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>

      {/* Metrics Row */}
      <ReviewMetrics
        metrics={metrics}
        onFilterStatus={(s) => setStatus(s)}
        onFilterRating={(r) => setRating(r)}
      />

      {/* Filter Toolbar */}
      <ReviewFilterBar
        search={search}
        onSearchChange={setSearch}
        status={status}
        onStatusChange={setStatus}
        service={service}
        onServiceChange={setService}
        rating={rating}
        onRatingChange={setRating}
        onReset={handleResetFilters}
        pendingCount={metrics.pending}
      />

      {/* Submissions Table / Grid */}
      <ReviewTable
        reviews={reviews}
        loading={loading}
        onSelectReview={(r) => setSelectedReview(r)}
        onQuickApprove={(id) => handleUpdateStatus(id, "approved")}
        onQuickReject={(id) => handleUpdateStatus(id, "rejected")}
        onToggleFeatured={handleToggleFeatured}
      />

      {/* Modal Detail View */}
      {selectedReview && (
        <ReviewDetailModal
          review={selectedReview}
          onClose={() => setSelectedReview(null)}
          onUpdateStatus={handleUpdateStatus}
          onToggleFeatured={handleToggleFeatured}
          onToggleVerified={handleToggleVerified}
          onSaveNotes={handleSaveNotes}
          onDelete={handleDelete}
        />
      )}
    </div>
  );
}
