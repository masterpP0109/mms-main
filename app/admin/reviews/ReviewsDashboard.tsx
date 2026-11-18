"use client";

import React, { useState, useEffect, useCallback, useRef } from "react";
import Link from "next/link";
import { Check, RefreshCw, ArrowUpRight, ArrowLeft } from "lucide-react";
import ReviewMetrics, { type ReviewMetricsData } from "./components/ReviewMetrics";
import ReviewFilterBar from "./components/ReviewFilterBar";
import ReviewTable from "./components/ReviewTable";
import ReviewDetailModal, { type ReviewItem } from "./components/ReviewDetailModal";

const EMPTY_METRICS: ReviewMetricsData = {
  total: 0,
  pending: 0,
  approved: 0,
  rejected: 0,
  featured: 0,
  averageRating: 0,
  distribution: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 },
  availableServices: [],
};

interface ReviewsDashboardProps {
  initialReviews?: ReviewItem[];
  initialMetrics?: ReviewMetricsData;
}

export default function ReviewsDashboard({
  initialReviews = [],
  initialMetrics = EMPTY_METRICS,
}: ReviewsDashboardProps) {
  const [reviews, setReviews] = useState<ReviewItem[]>(initialReviews);
  const [metrics, setMetrics] = useState<ReviewMetricsData>(initialMetrics);
  const [loading, setLoading] = useState<boolean>(false);
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const [selectedReview, setSelectedReview] = useState<ReviewItem | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const isFirstRender = useRef(true);

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

      const res = await fetch(`/api/admin/reviews?${params.toString()}`, {
        cache: "no-store",
      });
      if (!res.ok) throw new Error("Failed to fetch reviews");
      const data = await res.json();

      setReviews(data.items || []);
      if (data.metrics) {
        setMetrics(data.metrics);
      }
    } catch (err) {
      console.error("Dashboard fetch error:", err);
      showToast("Unable to refresh reviews from backend");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [status, service, rating, search]);

  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }
    setLoading(true);
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
    <div className="space-y-6">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-5 right-5 z-50 bg-[#121217] border border-zinc-700 text-white text-xs px-4 py-3 rounded-xl shadow-2xl flex items-center gap-2">
          <Check className="w-4 h-4 text-emerald-400" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Top Executive Control Bar */}
      <div className="bg-[#0e0e13] border border-zinc-800/80 rounded-xl p-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-0.5">
          <div className="flex items-center gap-2">
            <Link
              href="/admin"
              className="text-[11px] font-mono text-zinc-400 hover:text-white inline-flex items-center gap-1"
            >
              <ArrowLeft className="w-3 h-3" />
              Operations Console
            </Link>
            <span className="text-zinc-700">•</span>
            <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-brand-accent font-semibold">
              Live PostgreSQL Review Store
            </span>
          </div>
          <h1 className="text-xl sm:text-2xl font-bold text-white font-heading">
            Client Review Moderation & Feedback Desk
          </h1>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <Link
            href="/reviews"
            target="_blank"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#07070a] hover:bg-zinc-800 text-zinc-200 border border-zinc-800 text-xs font-medium transition-colors"
          >
            <span>Questionnaire Page</span>
            <ArrowUpRight className="w-3.5 h-3.5 text-zinc-400" />
          </Link>

          <button
            type="button"
            onClick={handleRefresh}
            disabled={refreshing}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-brand-primary hover:bg-brand-red text-white text-xs font-medium transition-colors cursor-pointer disabled:opacity-50"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${refreshing ? "animate-spin" : ""}`} />
            <span>{refreshing ? "Syncing..." : "Refresh"}</span>
          </button>
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
        availableServices={metrics.availableServices ?? []}
      />

      {/* Submissions Table */}
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
