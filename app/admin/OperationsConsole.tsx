"use client";

import React, { useState, useEffect, useCallback, useRef } from "react";
import Link from "next/link";
import {
  Inbox,
  MessageSquareQuote,
  Calendar,
  AlertTriangle,
  CheckCircle2,
  Search,
  Download,
  RefreshCw,
  Home,
  ArrowUpRight,
  Building2,
  Users,
  MapPin,
  Mail,
  Phone,
  Filter,
  Layers,
  MessageCircle,
  ShieldCheck,
  Sparkles,
  Compass,
  Check,
} from "lucide-react";
import type {
  OperationsDashboardData,
  SerializedLead,
  LeadFunnelType,
} from "@/lib/admin-intelligence";
import LeadInspectorModal from "./components/LeadInspectorModal";
import {
  EnquiryFunnelChart,
  ServiceDemandMatrix,
  OutboxHealthPanel,
} from "./components/OperationsCharts";

type ConsoleTab =
  | "overview"
  | "enquiries"
  | "feedback"
  | "channels"
  | "readiness";

type PeriodFilter = "all" | "7d" | "30d" | "90d";
type DeliveryFilter = "all" | "attention" | "pending" | "delivered";

interface OperationsConsoleProps {
  initialData: OperationsDashboardData;
}

export default function OperationsConsole({
  initialData,
}: OperationsConsoleProps) {
  const [data, setData] = useState<OperationsDashboardData>(initialData);
  const [activeTab, setActiveTab] = useState<ConsoleTab>("overview");
  const [selectedLead, setSelectedLead] = useState<SerializedLead | null>(null);

  // Backend filter states
  const [searchQuery, setSearchQuery] = useState("");
  const [funnelFilter, setFunnelFilter] = useState<LeadFunnelType | "all">(
    "all"
  );
  const [deliveryFilter, setDeliveryFilter] = useState<DeliveryFilter>("all");
  const [periodFilter, setPeriodFilter] = useState<PeriodFilter>("all");

  // Network action states
  const [refreshing, setRefreshing] = useState(false);
  const [dispatchingOutbox, setDispatchingOutbox] = useState(false);
  const [toast, setToast] = useState<string | null>(null);
  const isFirstRender = useRef(true);

  const notify = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3500);
  };

  const buildFilterQueryString = useCallback(
    (extra?: Record<string, string>) => {
      const params = new URLSearchParams();
      if (funnelFilter !== "all") params.set("funnel", funnelFilter);
      if (deliveryFilter !== "all") params.set("delivery", deliveryFilter);
      if (periodFilter !== "all") params.set("period", periodFilter);
      if (searchQuery.trim()) params.set("search", searchQuery.trim());
      if (extra) {
        for (const [k, v] of Object.entries(extra)) {
          params.set(k, v);
        }
      }
      return params.toString();
    },
    [funnelFilter, deliveryFilter, periodFilter, searchQuery]
  );

  const fetchFromBackend = useCallback(
    async (showNotice = false) => {
      setRefreshing(true);
      try {
        const qs = buildFilterQueryString();
        const url = qs
          ? `/api/admin/operations?${qs}`
          : "/api/admin/operations";
        const res = await fetch(url, { cache: "no-store" });
        if (!res.ok) throw new Error("Backend fetch failed");
        const json = await res.json();
        if (json.data) {
          setData(json.data);
          setSelectedLead((prev) => {
            if (!prev) return null;
            return (
              json.data.leads.find((l: SerializedLead) => l.id === prev.id) ??
              prev
            );
          });
        }
        if (showNotice) notify("Synchronized with PostgreSQL backend");
      } catch {
        if (showNotice) notify("Unable to fetch latest backend data");
      } finally {
        setRefreshing(false);
      }
    },
    [buildFilterQueryString]
  );

  // Automatically query the backend when filters change
  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }
    const timer = setTimeout(() => {
      fetchFromBackend(false);
    }, 180);
    return () => clearTimeout(timer);
  }, [fetchFromBackend]);

  const handleRefresh = () => {
    fetchFromBackend(true);
  };

  const handleRetrySingleLead = async (leadId: string) => {
    try {
      const res = await fetch("/api/admin/operations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "retry_lead", leadId }),
      });
      if (!res.ok) throw new Error("Retry failed");
      const json = await res.json();
      if (json.data) {
        setData(json.data);
        const updated = json.data.leads.find(
          (l: SerializedLead) => l.id === leadId
        );
        if (updated) setSelectedLead(updated);
      }
      notify("Outbox channels processed for enquiry");
    } catch {
      notify("Channel retry encountered an error");
    }
  };

  const handleUpdateLead = async (
    leadId: string,
    updates: {
      status?: string;
      priority?: string;
      notes?: string | null;
      assignedTo?: string | null;
      markFollowedUp?: boolean;
    }
  ) => {
    try {
      const res = await fetch("/api/admin/operations", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ leadId, ...updates }),
      });
      if (!res.ok) throw new Error("Update failed");
      const json = await res.json();
      if (json.data) {
        setData(json.data);
        const updated = json.data.leads.find(
          (l: SerializedLead) => l.id === leadId
        );
        if (updated) setSelectedLead(updated);
      }
      notify("Lead status and notes saved to PostgreSQL");
    } catch {
      notify("Failed to save lead updates");
      throw new Error("Update failed");
    }
  };

  const handleDispatchAllPending = async () => {
    setDispatchingOutbox(true);
    try {
      const res = await fetch("/api/admin/operations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "retry_all_pending" }),
      });
      if (!res.ok) throw new Error("Outbox sync failed");
      const json = await res.json();
      if (json.data) {
        setData(json.data);
      }
      notify(`Processed ${json.processed ?? 0} queued outbox records`);
    } catch {
      notify("Outbox dispatch encountered an error");
    } finally {
      setDispatchingOutbox(false);
    }
  };

  const jumpToEnquiriesFilter = (options: {
    funnel?: LeadFunnelType | "all";
    delivery?: DeliveryFilter;
  }) => {
    if (options.funnel !== undefined) setFunnelFilter(options.funnel);
    if (options.delivery !== undefined) setDeliveryFilter(options.delivery);
    setActiveTab("enquiries");
  };

  const { kpi, reviewMetrics } = data;
  const proofGapCount = data.serviceDemand.filter((s) => s.proofGap).length;
  const csvExportHref = `/api/admin/operations?${buildFilterQueryString({
    format: "csv",
  })}`;

  return (
    <div className="min-h-screen bg-[#07070a] text-zinc-100 font-sans selection:bg-brand-primary selection:text-white">
      {/* Toast Notification */}
      {toast && (
        <div className="fixed bottom-5 right-5 z-50 bg-[#121217] border border-zinc-700 text-white text-xs px-4 py-3 rounded-xl shadow-2xl flex items-center gap-2">
          <Check className="w-4 h-4 text-emerald-400" />
          <span>{toast}</span>
        </div>
      )}

      {/* Top Executive Navigation Bar */}
      <header className="sticky top-0 z-30 bg-[#07070a]/95 backdrop-blur-md border-b border-zinc-800/80 px-4 sm:px-8 py-3">
        <div className="max-w-[1440px] mx-auto flex flex-wrap items-center justify-between gap-4">
          {/* Brand & Console Identity */}
          <div className="flex items-center gap-6">
            <Link href="/" className="flex items-center gap-2.5 group">
              <div className="w-2.5 h-2.5 rounded-xs bg-[#e11d48]" />
              <span className="text-sm font-bold text-white font-heading tracking-wider group-hover:text-brand-accent transition-colors">
                MOSI MEDIA
              </span>
              <span className="text-[10px] font-mono uppercase tracking-widest px-2 py-0.5 rounded bg-zinc-900 border border-zinc-700/80 text-zinc-300">
                Operations CRM
              </span>
            </Link>

            {/* Primary Pill Navigation */}
            <nav
              aria-label="Operations sections"
              className="hidden lg:flex items-center gap-1 p-1 bg-[#0e0e13] border border-zinc-800/80 rounded-xl text-xs"
            >
              {[
                {
                  id: "overview" as const,
                  label: "Overview & Intelligence",
                  badge: undefined,
                  alert: false,
                },
                {
                  id: "enquiries" as const,
                  label: "Enquiries & Pipeline",
                  badge: kpi.totalLeads,
                  alert: false,
                },
                {
                  id: "feedback" as const,
                  label: "Service Quality & Reviews",
                  badge:
                    reviewMetrics.pending > 0
                      ? reviewMetrics.pending
                      : undefined,
                  alert: reviewMetrics.pending > 0,
                },
                {
                  id: "channels" as const,
                  label: "WhatsApp & Outbox",
                  badge:
                    kpi.needsAttentionCount > 0
                      ? kpi.needsAttentionCount
                      : undefined,
                  alert: kpi.needsAttentionCount > 0,
                },
                {
                  id: "readiness" as const,
                  label: "Database Catalogue & Attribution",
                  badge: undefined,
                  alert: false,
                },
              ].map((tab) => {
                const isActive = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    type="button"
                    onClick={() => setActiveTab(tab.id)}
                    className={`px-3 py-1.5 rounded-lg font-medium transition-all flex items-center gap-1.5 cursor-pointer ${
                      isActive
                        ? "bg-brand-primary text-white shadow-xs"
                        : "text-zinc-400 hover:text-white hover:bg-zinc-800/50"
                    }`}
                  >
                    <span>{tab.label}</span>
                    {tab.badge !== undefined && (
                      <span
                        className={`px-1.5 py-0.2 rounded text-[10px] font-mono ${
                          isActive
                            ? "bg-black/30 text-white"
                            : tab.alert
                            ? "bg-amber-400/20 text-amber-300"
                            : "bg-zinc-800 text-zinc-400"
                        }`}
                      >
                        {tab.badge}
                      </span>
                    )}
                  </button>
                );
              })}
            </nav>
          </div>

          {/* Right Quick Links */}
          <div className="flex items-center gap-2.5 text-xs">
            <Link
              href="/admin/reviews"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#0e0e13] hover:bg-zinc-800 text-zinc-300 hover:text-white border border-zinc-800 transition-colors"
            >
              <MessageSquareQuote className="w-3.5 h-3.5 text-brand-accent" />
              <span>Moderation Desk</span>
              {reviewMetrics.pending > 0 && (
                <span className="px-1.5 py-0.2 rounded bg-amber-400/20 text-amber-300 font-mono text-[10px]">
                  {reviewMetrics.pending}
                </span>
              )}
            </Link>

            <Link
              href="/"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-900 transition-colors"
            >
              <Home className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Live Site</span>
            </Link>
          </div>
        </div>

        {/* Mobile / Tablet Section Switcher */}
        <div className="flex lg:hidden overflow-x-auto gap-1.5 pt-3 pb-1">
          {(
            [
              { id: "overview", label: "Overview" },
              { id: "enquiries", label: `Pipeline (${kpi.totalLeads})` },
              {
                id: "feedback",
                label: `Quality & Reviews (${reviewMetrics.total})`,
              },
              { id: "channels", label: "WhatsApp & Outbox" },
              { id: "readiness", label: "Catalogue & Attribution" },
            ] as const
          ).map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap cursor-pointer ${
                activeTab === tab.id
                  ? "bg-brand-primary text-white"
                  : "bg-[#0e0e13] text-zinc-400 border border-zinc-800"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </header>

      {/* Main Workspace Container */}
      <main className="max-w-[1440px] mx-auto px-4 sm:px-8 py-6 sm:py-8 space-y-6">
        {/* Top Executive Control & Filter Bar */}
        <div className="bg-[#0e0e13] border border-zinc-800/80 rounded-xl p-4 flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="space-y-0.5">
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-brand-accent font-semibold">
                Live PostgreSQL Backend Telemetry
              </span>
              <span className="text-zinc-700">•</span>
              <span className="text-[11px] font-mono text-zinc-500">
                Queried{" "}
                {new Date(data.generatedAt).toLocaleTimeString("en-GB", {
                  hour: "2-digit",
                  minute: "2-digit",
                  second: "2-digit",
                })}
              </span>
            </div>
            <h1 className="text-xl sm:text-2xl font-bold text-white font-heading">
              MMS Operations & Pipeline Console
            </h1>
          </div>

          {/* Actionable Controls: Time Window, Search, Export CSV, Refresh */}
          <div className="flex flex-wrap items-center gap-2.5">
            {/* Period Selector */}
            <div className="inline-flex items-center bg-[#07070a] border border-zinc-800 rounded-lg p-0.5 text-xs">
              {(
                [
                  { id: "all", label: "All Time" },
                  { id: "90d", label: "90D" },
                  { id: "30d", label: "30D" },
                  { id: "7d", label: "7D" },
                ] as const
              ).map((p) => (
                <button
                  key={p.id}
                  type="button"
                  onClick={() => setPeriodFilter(p.id)}
                  className={`px-2.5 py-1 rounded-md font-mono text-[11px] transition-colors cursor-pointer ${
                    periodFilter === p.id
                      ? "bg-zinc-800 text-white font-semibold"
                      : "text-zinc-400 hover:text-zinc-200"
                  }`}
                >
                  {p.label}
                </button>
              ))}
            </div>

            {/* Quick Search */}
            <div className="relative flex-1 sm:flex-initial sm:w-64">
              <Search className="w-3.5 h-3.5 text-zinc-500 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  if (activeTab === "overview" && e.target.value.trim()) {
                    setActiveTab("enquiries");
                  }
                }}
                placeholder="Search client, org, ref, message..."
                className="w-full bg-[#07070a] border border-zinc-800 focus:border-zinc-600 rounded-lg pl-8 pr-3 py-1.5 text-xs text-white placeholder:text-zinc-500 focus:outline-none"
              />
            </div>

            {/* Export CSV */}
            <a
              href={csvExportHref}
              download
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#07070a] hover:bg-zinc-800 text-zinc-200 border border-zinc-800 text-xs font-medium transition-colors"
            >
              <Download className="w-3.5 h-3.5 text-zinc-400" />
              <span>Export CSV</span>
            </a>

            {/* Refresh Button */}
            <button
              type="button"
              onClick={handleRefresh}
              disabled={refreshing}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-brand-primary hover:bg-brand-red text-white text-xs font-medium transition-colors cursor-pointer disabled:opacity-50"
            >
              <RefreshCw
                className={`w-3.5 h-3.5 ${refreshing ? "animate-spin" : ""}`}
              />
              <span>{refreshing ? "Syncing..." : "Refresh"}</span>
            </button>
          </div>
        </div>

        {/* Operational KPI Row (4 Authoritative Backend Cards) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* KPI 1: Pipeline Intake & High-Intent Mix */}
          <button
            type="button"
            onClick={() =>
              jumpToEnquiriesFilter({ funnel: "all", delivery: "all" })
            }
            className="text-left bg-[#0e0e13] hover:bg-[#121218] border border-zinc-800/80 hover:border-zinc-700 rounded-xl p-4 transition-all cursor-pointer group flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-[11px] uppercase tracking-wider text-zinc-400 font-semibold">
                  Enquiry Pipeline Intake
                </span>
                <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-zinc-900 border border-zinc-800 text-zinc-300">
                  +{kpi.leadsLast30d} in 30d
                </span>
              </div>
              <div className="flex items-baseline gap-2.5">
                <span className="text-3xl font-bold text-white font-mono">
                  {kpi.totalLeads}
                </span>
                <span className="text-xs text-zinc-400">
                  {kpi.totalLeads > 0
                    ? `(${kpi.highIntentShare}% scoped briefs/packages)`
                    : "recorded in DB"}
                </span>
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-zinc-800/70 flex items-center justify-between text-[11px]">
              <span className="text-zinc-400">
                <strong>{data.funnelBreakdown[0]?.count ?? 0}</strong>{" "}
                Conference •{" "}
                <strong>{data.funnelBreakdown[1]?.count ?? 0}</strong> Packages
              </span>
              <span className="text-brand-accent group-hover:translate-x-0.5 transition-transform font-medium">
                Pipeline →
              </span>
            </div>
          </button>

          {/* KPI 2: Production Horizon & Event Scale */}
          <button
            type="button"
            onClick={() => setActiveTab("overview")}
            className="text-left bg-[#0e0e13] hover:bg-[#121218] border border-zinc-800/80 hover:border-zinc-700 rounded-xl p-4 transition-all cursor-pointer group flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-[11px] uppercase tracking-wider text-zinc-400 font-semibold">
                  Scheduled Event Horizon
                </span>
                <Calendar className="w-4 h-4 text-brand-accent" />
              </div>
              <div className="flex items-baseline gap-2.5">
                <span className="text-3xl font-bold text-white font-mono">
                  {kpi.upcomingEventsCount}
                </span>
                <span className="text-xs text-zinc-400">
                  dated briefs in DB
                </span>
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-zinc-800/70 flex items-center justify-between text-[11px]">
              <span className="text-zinc-400">
                <strong>{kpi.totalDelegatesRequested.toLocaleString()}</strong>{" "}
                total delegates requested
              </span>
              <span className="text-zinc-300 font-mono">Dates ↓</span>
            </div>
          </button>

          {/* KPI 3: Outbox & Notification SLA */}
          <button
            type="button"
            onClick={() =>
              jumpToEnquiriesFilter({
                delivery: kpi.needsAttentionCount > 0 ? "attention" : "all",
              })
            }
            className="text-left bg-[#0e0e13] hover:bg-[#121218] border border-zinc-800/80 hover:border-zinc-700 rounded-xl p-4 transition-all cursor-pointer group flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-[11px] uppercase tracking-wider text-zinc-400 font-semibold">
                  Notification & Ack SLA
                </span>
                {kpi.needsAttentionCount > 0 ? (
                  <span className="inline-flex items-center gap-1 text-[10px] font-mono px-2 py-0.5 rounded bg-rose-500/15 text-rose-300 border border-rose-500/30">
                    <AlertTriangle className="w-3 h-3" />
                    {kpi.needsAttentionCount} alert
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/15 text-emerald-300 border border-emerald-500/30">
                    <CheckCircle2 className="w-3 h-3" />0 alerts
                  </span>
                )}
              </div>
              <div className="flex items-baseline gap-2.5">
                <span className="text-3xl font-bold text-white font-mono">
                  {kpi.deliverySuccessRate !== null
                    ? `${kpi.deliverySuccessRate}%`
                    : "—"}
                </span>
                <span className="text-xs text-zinc-400">
                  staff alert •{" "}
                  {kpi.ackSuccessRate !== null
                    ? `${kpi.ackSuccessRate}%`
                    : "—"}{" "}
                  ack
                </span>
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-zinc-800/70 flex items-center justify-between text-[11px]">
              <span className="text-zinc-400">
                <strong>{kpi.pendingDeliveryCount}</strong> pending •{" "}
                <strong>{kpi.needsAttentionCount}</strong> reconciliation
              </span>
              <span className="text-brand-accent group-hover:translate-x-0.5 transition-transform font-medium">
                Inspect →
              </span>
            </div>
          </button>

          {/* KPI 4: Client Proof & Moderation Action Queue */}
          <button
            type="button"
            onClick={() => setActiveTab("feedback")}
            className="text-left bg-[#0e0e13] hover:bg-[#121218] border border-zinc-800/80 hover:border-zinc-700 rounded-xl p-4 transition-all cursor-pointer group flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-[11px] uppercase tracking-wider text-zinc-400 font-semibold">
                  Client Reviews in DB
                </span>
                {reviewMetrics.pending > 0 ? (
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-amber-400/15 text-amber-300 border border-amber-400/30">
                    {reviewMetrics.pending} pending
                  </span>
                ) : (
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-zinc-900 border border-zinc-800 text-zinc-400">
                    0 pending
                  </span>
                )}
              </div>
              <div className="flex items-baseline gap-2.5">
                <span className="text-3xl font-bold text-white font-mono">
                  {reviewMetrics.total > 0
                    ? `${reviewMetrics.averageRating.toFixed(1)}★`
                    : "0"}
                </span>
                <span className="text-xs text-zinc-400">
                  ({reviewMetrics.approved} approved / {reviewMetrics.total} total)
                </span>
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-zinc-800/70 flex items-center justify-between text-[11px]">
              <span className="text-zinc-400">
                <strong>{proofGapCount}</strong> demanded services lack proof
              </span>
              <span className="text-brand-accent group-hover:translate-x-0.5 transition-transform font-medium">
                Insights →
              </span>
            </div>
          </button>
        </div>

        {/* ==================== TAB 1: OVERVIEW & INTELLIGENCE ==================== */}
        {activeTab === "overview" && (
          <div className="space-y-6">
            {/* Row 1: Funnel Intake Chart + Service Demand vs Proof Matrix */}
            <div className="grid grid-cols-1 xl:grid-cols-12 gap-5">
              <div className="xl:col-span-7">
                <EnquiryFunnelChart
                  trendSeries={data.trendSeries}
                  funnelBreakdown={data.funnelBreakdown}
                  onSelectFunnel={(f) => jumpToEnquiriesFilter({ funnel: f })}
                />
              </div>
              <div className="xl:col-span-5">
                <ServiceDemandMatrix items={data.serviceDemand} />
              </div>
            </div>

            {/* Row 2: Upcoming Production Horizon + Institutional & Package Intelligence */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
              {/* Upcoming Production Horizon (Dated Enquiries & Conferences) */}
              <div className="lg:col-span-7 bg-[#0e0e13] border border-zinc-800/80 rounded-xl p-5 flex flex-col justify-between space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-[10px] uppercase tracking-[0.2em] text-zinc-400 font-semibold block">
                      Event & Production Horizon
                    </span>
                    <h3 className="text-base font-semibold text-white font-heading mt-0.5">
                      Enquiries with Target Event Dates & Timelines
                    </h3>
                  </div>
                  <button
                    type="button"
                    onClick={() => setActiveTab("enquiries")}
                    className="text-xs text-brand-accent hover:underline cursor-pointer"
                  >
                    Full pipeline →
                  </button>
                </div>

                {data.upcomingEvents.length === 0 ? (
                  <div className="bg-[#09090c] border border-zinc-800/70 rounded-lg p-6 text-center text-xs text-zinc-500">
                    No target event dates recorded in database enquiries yet.
                  </div>
                ) : (
                  <div className="divide-y divide-zinc-800/70 bg-[#09090c] border border-zinc-800/70 rounded-xl overflow-hidden">
                    {data.upcomingEvents.slice(0, 5).map((ev) => {
                      const matchedLead = data.leads.find(
                        (l) => l.id === ev.leadId
                      );
                      return (
                        <div
                          key={ev.leadId}
                          onClick={() =>
                            matchedLead && setSelectedLead(matchedLead)
                          }
                          className="p-3.5 hover:bg-zinc-900/80 transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-2 cursor-pointer"
                        >
                          <div className="space-y-1 min-w-0">
                            <div className="flex flex-wrap items-center gap-2">
                              <span className="text-xs font-semibold text-white">
                                {ev.clientName}
                              </span>
                              {ev.organisation && (
                                <span className="text-xs text-zinc-400">
                                  • {ev.organisation}
                                </span>
                              )}
                              <span className="text-[10px] px-2 py-0.2 rounded bg-zinc-800 text-zinc-300 border border-zinc-700 font-mono">
                                {ev.funnelLabel}
                              </span>
                            </div>
                            <div className="flex flex-wrap items-center gap-3 text-[11px] text-zinc-400">
                              <span>{ev.projectOrPackage}</span>
                              {ev.venueOrLocation && (
                                <span className="inline-flex items-center gap-1 text-zinc-400">
                                  <MapPin className="w-3 h-3 text-zinc-500" />
                                  {ev.venueOrLocation}
                                </span>
                              )}
                              {ev.delegates && (
                                <span className="inline-flex items-center gap-1 text-zinc-300 font-mono">
                                  <Users className="w-3 h-3 text-zinc-500" />
                                  {ev.delegates} delegates
                                </span>
                              )}
                            </div>
                          </div>

                          <div className="flex sm:flex-col items-center sm:items-end justify-between gap-1 shrink-0">
                            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-brand-primary/15 text-brand-accent border border-brand-accent/25 text-xs font-mono font-medium">
                              <Calendar className="w-3 h-3" />
                              {ev.eventDateRaw}
                            </span>
                            {ev.daysUntil !== null && (
                              <span
                                className={`text-[10px] font-mono ${
                                  ev.daysUntil <= 14
                                    ? "text-amber-300 font-semibold"
                                    : "text-zinc-500"
                                }`}
                              >
                                {ev.daysUntil === 0
                                  ? "Today"
                                  : ev.daysUntil > 0
                                  ? `In ${ev.daysUntil} days`
                                  : `${Math.abs(ev.daysUntil)}d ago`}
                              </span>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* Right Column: Institutional Conference Sectors & Package Tier Preferences */}
              <div className="lg:col-span-5 bg-[#0e0e13] border border-zinc-800/80 rounded-xl p-5 flex flex-col justify-between space-y-4">
                <div>
                  <span className="text-[10px] uppercase tracking-[0.2em] text-zinc-400 font-semibold block">
                    Commercial Segment Mix
                  </span>
                  <h3 className="text-base font-semibold text-white font-heading mt-0.5">
                    Institutional Sectors & Package Selections
                  </h3>
                </div>

                <div className="space-y-4">
                  {/* Conference Sectors */}
                  <div className="bg-[#09090c] border border-zinc-800/70 rounded-xl p-3.5 space-y-2.5">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-semibold text-zinc-300 flex items-center gap-1.5">
                        <Building2 className="w-3.5 h-3.5 text-brand-accent" />
                        Conference Organisation Sectors
                      </span>
                      <span className="text-[11px] font-mono text-zinc-500">
                        {kpi.totalDelegatesRequested.toLocaleString()} delegates
                      </span>
                    </div>

                    {data.organisationBreakdown.length === 0 ? (
                      <p className="text-xs text-zinc-500 py-1">
                        0 conference sector classifications recorded in DB.
                      </p>
                    ) : (
                      <div className="grid grid-cols-2 gap-2">
                        {data.organisationBreakdown.slice(0, 4).map((org) => (
                          <div
                            key={org.type}
                            className="bg-[#0e0e13] border border-zinc-800/80 rounded-lg p-2.5 flex items-center justify-between"
                          >
                            <div>
                              <p className="text-xs font-medium text-white">
                                {org.type}
                              </p>
                              <p className="text-[10px] font-mono text-zinc-500">
                                {org.delegates > 0
                                  ? `${org.delegates} delegates`
                                  : "0 delegates"}
                              </p>
                            </div>
                            <span className="text-sm font-bold font-mono text-brand-accent">
                              {org.count}
                            </span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Signature Package Tiers */}
                  <div className="bg-[#09090c] border border-zinc-800/70 rounded-xl p-3.5 space-y-2.5">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-semibold text-zinc-300 flex items-center gap-1.5">
                        <Layers className="w-3.5 h-3.5 text-amber-400" />
                        Requested Package Tiers
                      </span>
                      <span className="text-[11px] font-mono text-zinc-500">
                        /packages/*
                      </span>
                    </div>

                    {data.packageDemand.length === 0 ? (
                      <p className="text-xs text-zinc-500 py-1">
                        0 package enquiries recorded in DB.
                      </p>
                    ) : (
                      <div className="space-y-1.5">
                        {data.packageDemand.slice(0, 4).map((pkg) => (
                          <div
                            key={`${pkg.category}-${pkg.packageName}`}
                            className="flex items-center justify-between text-xs py-1 border-b border-zinc-800/50 last:border-b-0"
                          >
                            <div className="flex items-center gap-2 min-w-0">
                              <span className="text-[10px] uppercase font-mono px-1.5 py-0.2 rounded bg-zinc-800 text-zinc-300">
                                {pkg.category}
                              </span>
                              <span className="text-zinc-200 truncate">
                                {pkg.packageName}
                              </span>
                            </div>
                            <span className="font-mono font-semibold text-white">
                              {pkg.count}
                            </span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Row 3: Transactional Outbox Telemetry */}
            <OutboxHealthPanel
              deliveryBreakdown={data.deliveryBreakdown}
              kpi={kpi}
              onDispatchAll={handleDispatchAllPending}
              dispatching={dispatchingOutbox}
            />

            {/* Row 4: Recent Enquiries Preview Table */}
            <div className="bg-[#0e0e13] border border-zinc-800/80 rounded-xl overflow-hidden">
              <div className="px-5 py-4 border-b border-zinc-800/80 flex flex-wrap items-center justify-between gap-3">
                <div>
                  <span className="text-[10px] uppercase tracking-[0.2em] text-zinc-400 font-semibold block">
                    Live PostgreSQL Lead Stream
                  </span>
                  <h3 className="text-base font-semibold text-white font-heading">
                    Recent Client Enquiries & Project Briefs
                  </h3>
                </div>
                <button
                  type="button"
                  onClick={() => setActiveTab("enquiries")}
                  className="px-3 py-1.5 rounded-lg bg-zinc-900 hover:bg-zinc-800 text-zinc-200 border border-zinc-700/80 text-xs font-medium transition-colors cursor-pointer"
                >
                  Open Full CRM Table ({data.leads.length}) →
                </button>
              </div>

              <LeadsTable
                leads={data.leads.slice(0, 8)}
                onSelectLead={setSelectedLead}
                onRetryLead={handleRetrySingleLead}
              />
            </div>
          </div>
        )}

        {/* ==================== TAB 2: ENQUIRIES & PIPELINE CRM ==================== */}
        {activeTab === "enquiries" && (
          <div className="space-y-4">
            {/* CRM Filter Bar */}
            <div className="bg-[#0e0e13] border border-zinc-800/80 rounded-xl p-4 flex flex-wrap items-center justify-between gap-3">
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-xs text-zinc-400 flex items-center gap-1.5 mr-1">
                  <Filter className="w-3.5 h-3.5" />
                  Funnel:
                </span>
                {(
                  [
                    { id: "all", label: "All Funnels" },
                    { id: "conference", label: "Conference RFPs" },
                    { id: "package", label: "Signature Packages" },
                    { id: "project_builder", label: "Project Builder" },
                    { id: "contact", label: "Direct Enquiries" },
                    { id: "whatsapp", label: "WhatsApp" },
                  ] as const
                ).map((f) => (
                  <button
                    key={f.id}
                    type="button"
                    onClick={() => setFunnelFilter(f.id)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
                      funnelFilter === f.id
                        ? "bg-brand-primary text-white"
                        : "bg-[#09090c] text-zinc-400 hover:text-white border border-zinc-800"
                    }`}
                  >
                    {f.label}
                  </button>
                ))}
              </div>

              <div className="flex flex-wrap items-center gap-2">
                <select
                  aria-label="Filter by delivery status"
                  value={deliveryFilter}
                  onChange={(e) =>
                    setDeliveryFilter(e.target.value as DeliveryFilter)
                  }
                  className="bg-[#09090c] border border-zinc-800 rounded-lg px-3 py-1.5 text-xs text-zinc-200 focus:outline-none focus:border-zinc-600 cursor-pointer"
                >
                  <option value="all">All Outbox Statuses</option>
                  <option value="attention">
                    Needs Reconciliation ({kpi.needsAttentionCount})
                  </option>
                  <option value="pending">
                    Pending Delivery ({kpi.pendingDeliveryCount})
                  </option>
                  <option value="delivered">Delivered / Accepted</option>
                </select>

                {(funnelFilter !== "all" ||
                  deliveryFilter !== "all" ||
                  periodFilter !== "all" ||
                  searchQuery) && (
                  <button
                    type="button"
                    onClick={() => {
                      setFunnelFilter("all");
                      setDeliveryFilter("all");
                      setPeriodFilter("all");
                      setSearchQuery("");
                    }}
                    className="px-2.5 py-1.5 text-xs text-zinc-400 hover:text-white cursor-pointer"
                  >
                    Reset
                  </button>
                )}
              </div>
            </div>

            <div className="bg-[#0e0e13] border border-zinc-800/80 rounded-xl overflow-hidden">
              <div className="px-5 py-3.5 border-b border-zinc-800/80 flex items-center justify-between text-xs text-zinc-400">
                <span>
                  Showing <strong className="text-white">{data.leads.length}</strong>{" "}
                  matching records (of {kpi.totalLeads} total in PostgreSQL)
                </span>
                <span className="font-mono text-[11px]">
                  Click any row to open full project brief & outbox dossier
                </span>
              </div>

              <LeadsTable
                leads={data.leads}
                onSelectLead={setSelectedLead}
                onRetryLead={handleRetrySingleLead}
              />
            </div>
          </div>
        )}

        {/* ==================== TAB 3: SERVICE QUALITY & REVIEWS ==================== */}
        {activeTab === "feedback" && (
          <div className="space-y-6">
            {/* Quality Header Banner */}
            <div className="bg-[#0e0e13] border border-zinc-800/80 rounded-xl p-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="space-y-1">
                <span className="text-[10px] uppercase tracking-[0.2em] text-brand-accent font-semibold block">
                  Actionable Client Feedback & Proof Coverage
                </span>
                <h2 className="text-lg font-semibold text-white font-heading">
                  Operational Quality Digest & Testimonial Pipeline
                </h2>
                <p className="text-xs text-zinc-400 max-w-2xl">
                  Displays real post-event questionnaire responses (`stoodOut`, `contribution`, `improvements`) and testimonial moderation status from PostgreSQL.
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-2.5 shrink-0">
                <Link
                  href="/reviews"
                  target="_blank"
                  className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-zinc-900 hover:bg-zinc-800 text-zinc-200 border border-zinc-700 text-xs font-medium transition-colors"
                >
                  <span>Client Review Form</span>
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </Link>
                <Link
                  href="/admin/reviews"
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-brand-primary hover:bg-brand-red text-white text-xs font-semibold transition-colors"
                >
                  <span>
                    Open Full Review Moderation ({reviewMetrics.pending} pending)
                  </span>
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>

            {/* Proof Coverage Gaps vs Star Distribution */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
              <div className="lg:col-span-7">
                <ServiceDemandMatrix items={data.serviceDemand} />
              </div>

              <div className="lg:col-span-5 bg-[#0e0e13] border border-zinc-800/80 rounded-xl p-5 space-y-4">
                <div>
                  <span className="text-[10px] uppercase tracking-[0.2em] text-zinc-400 font-semibold block">
                    Testimonial Status & Rating Breakdown
                  </span>
                  <h3 className="text-base font-semibold text-white font-heading mt-0.5">
                    Moderation & Consent Summary
                  </h3>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-[#09090c] border border-zinc-800/70 rounded-lg p-3">
                    <span className="text-[10px] uppercase text-zinc-500 block">
                      Pending Moderation
                    </span>
                    <span className="text-2xl font-bold font-mono text-amber-300">
                      {reviewMetrics.pending}
                    </span>
                  </div>
                  <div className="bg-[#09090c] border border-zinc-800/70 rounded-lg p-3">
                    <span className="text-[10px] uppercase text-zinc-500 block">
                      Approved & Live
                    </span>
                    <span className="text-2xl font-bold font-mono text-emerald-400">
                      {reviewMetrics.approved}
                    </span>
                  </div>
                  <div className="bg-[#09090c] border border-zinc-800/70 rounded-lg p-3">
                    <span className="text-[10px] uppercase text-zinc-500 block">
                      Featured on Home
                    </span>
                    <span className="text-2xl font-bold font-mono text-white">
                      {reviewMetrics.featured}
                    </span>
                  </div>
                  <div className="bg-[#09090c] border border-zinc-800/70 rounded-lg p-3">
                    <span className="text-[10px] uppercase text-zinc-500 block">
                      Verified & Consented
                    </span>
                    <span className="text-2xl font-bold font-mono text-sky-400">
                      {kpi.verifiedConsentedReviews}
                    </span>
                  </div>
                </div>

                {/* Rating Distribution Bars */}
                <div className="space-y-2 pt-2 border-t border-zinc-800/70">
                  {[5, 4, 3, 2, 1].map((star) => {
                    const count = reviewMetrics.distribution[star] || 0;
                    const pct =
                      reviewMetrics.total > 0
                        ? Math.round((count / reviewMetrics.total) * 100)
                        : 0;
                    return (
                      <div
                        key={star}
                        className="flex items-center gap-3 text-xs font-mono"
                      >
                        <span className="w-12 text-zinc-400">{star} Star</span>
                        <div className="flex-1 h-2 bg-zinc-900 rounded-full overflow-hidden">
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
                        <span className="w-14 text-right text-zinc-300">
                          {count} ({pct}%)
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Constructive Feedback & Post-Event Insights Digest */}
            <div className="bg-[#0e0e13] border border-zinc-800/80 rounded-xl p-5 space-y-4">
              <div>
                <span className="text-[10px] uppercase tracking-[0.2em] text-zinc-400 font-semibold block">
                  Post-Event Questionnaire Intelligence
                </span>
                <h3 className="text-base font-semibold text-white font-heading mt-0.5">
                  What Stood Out & Constructive Improvement Notes
                </h3>
              </div>

              {data.feedbackDigest.length === 0 ? (
                <p className="text-xs text-zinc-500 py-4">
                  0 questionnaire insights (`stoodOut`, `contribution`, `improvements`) recorded in PostgreSQL.
                </p>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {data.feedbackDigest.slice(0, 8).map((fb) => (
                    <div
                      key={fb.id}
                      className="bg-[#09090c] border border-zinc-800/80 rounded-xl p-4 space-y-3"
                    >
                      <div className="flex items-start justify-between gap-2 border-b border-zinc-800/70 pb-2.5">
                        <div>
                          <p className="text-xs font-semibold text-white">
                            {fb.name}
                            {fb.organisation ? (
                              <span className="text-zinc-400 font-normal">
                                {" "}
                                • {fb.organisation}
                              </span>
                            ) : null}
                          </p>
                          {fb.service && (
                            <span className="text-[11px] text-brand-accent">
                              {fb.service}
                            </span>
                          )}
                        </div>
                        <div className="flex items-center gap-2 font-mono text-xs">
                          <span className="text-amber-300">{fb.rating}.0★</span>
                          <span className="text-[10px] uppercase px-2 py-0.5 rounded bg-zinc-900 border border-zinc-800 text-zinc-400">
                            {fb.status}
                          </span>
                        </div>
                      </div>

                      {fb.stoodOut && (
                        <div>
                          <span className="text-[10px] uppercase tracking-wider text-emerald-400 font-semibold block">
                            What Stood Out
                          </span>
                          <p className="text-xs text-zinc-300 mt-0.5 leading-relaxed">
                            {fb.stoodOut}
                          </p>
                        </div>
                      )}

                      {fb.contribution && (
                        <div>
                          <span className="text-[10px] uppercase tracking-wider text-sky-400 font-semibold block">
                            Impact on Event
                          </span>
                          <p className="text-xs text-zinc-300 mt-0.5 leading-relaxed">
                            {fb.contribution}
                          </p>
                        </div>
                      )}

                      {fb.improvements && (
                        <div className="bg-amber-500/5 border border-amber-500/20 rounded-lg p-2.5">
                          <span className="text-[10px] uppercase tracking-wider text-amber-300 font-semibold block">
                            Constructive Improvement Area
                          </span>
                          <p className="text-xs text-zinc-200 mt-0.5 leading-relaxed">
                            {fb.improvements}
                          </p>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* ==================== TAB 4: WHATSAPP & OUTBOX CHANNELS ==================== */}
        {activeTab === "channels" && (
          <div className="space-y-6">
            <OutboxHealthPanel
              deliveryBreakdown={data.deliveryBreakdown}
              kpi={kpi}
              onDispatchAll={handleDispatchAllPending}
              dispatching={dispatchingOutbox}
            />

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
              {/* WhatsApp Business Threads */}
              <div className="lg:col-span-6 bg-[#0e0e13] border border-zinc-800/80 rounded-xl p-5 space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-[10px] uppercase tracking-[0.2em] text-zinc-400 font-semibold block">
                      Meta Cloud Webhook ({kpi.totalWebhookEvents} webhook events •{" "}
                      {kpi.totalWhatsAppMessages} messages)
                    </span>
                    <h3 className="text-base font-semibold text-white font-heading mt-0.5">
                      Inbound WhatsApp Conversations ({data.whatsappThreads.length})
                    </h3>
                  </div>
                  <MessageCircle className="w-4 h-4 text-emerald-400" />
                </div>

                {data.whatsappThreads.length === 0 ? (
                  <div className="bg-[#09090c] border border-zinc-800/70 rounded-lg p-6 text-center text-xs text-zinc-500">
                    0 inbound WhatsApp conversations in PostgreSQL (`Conversation` table).
                  </div>
                ) : (
                  <div className="divide-y divide-zinc-800/70 bg-[#09090c] border border-zinc-800/70 rounded-xl overflow-hidden">
                    {data.whatsappThreads.map((th) => {
                      const matchedLead = th.leadId
                        ? data.leads.find((l) => l.id === th.leadId)
                        : null;
                      return (
                        <div
                          key={th.id}
                          onClick={() =>
                            matchedLead && setSelectedLead(matchedLead)
                          }
                          className="p-3.5 hover:bg-zinc-900/70 transition-colors flex items-start justify-between gap-3 cursor-pointer"
                        >
                          <div className="space-y-1 min-w-0">
                            <div className="flex items-center gap-2">
                              <span className="text-xs font-semibold text-white">
                                {th.contactName}
                              </span>
                              <span className="text-[11px] font-mono text-zinc-400">
                                +{th.phone}
                              </span>
                              {th.leadReference && (
                                <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-zinc-800 text-zinc-300">
                                  {th.leadReference}
                                </span>
                              )}
                            </div>
                            <p className="text-xs text-zinc-400 line-clamp-1">
                              {th.lastMessageText ?? "No message text"}
                            </p>
                          </div>

                          <div className="text-right shrink-0 space-y-1">
                            <span className="text-[10px] font-mono text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded block">
                              {th.messageCount} msg
                            </span>
                            {th.lastMessageAt && (
                              <span className="text-[10px] font-mono text-zinc-500 block">
                                {new Date(th.lastMessageAt).toLocaleDateString(
                                  "en-GB",
                                  {
                                    day: "2-digit",
                                    month: "short",
                                  }
                                )}
                              </span>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* Leads Requiring Reconciliation or Pending Outbox */}
              <div className="lg:col-span-6 bg-[#0e0e13] border border-zinc-800/80 rounded-xl p-5 space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-[10px] uppercase tracking-[0.2em] text-zinc-400 font-semibold block">
                      Outbox Action Queue
                    </span>
                    <h3 className="text-base font-semibold text-white font-heading mt-0.5">
                      Enquiries Pending Delivery or Reconciliation
                    </h3>
                  </div>
                  <span className="text-xs font-mono text-amber-300">
                    {kpi.needsAttentionCount + kpi.pendingDeliveryCount} items
                  </span>
                </div>

                {data.leads.filter((l) => l.needsAttention || l.isPendingDelivery)
                  .length === 0 ? (
                  <div className="bg-[#09090c] border border-zinc-800/70 rounded-lg p-6 text-center space-y-1">
                    <CheckCircle2 className="w-5 h-5 text-emerald-400 mx-auto" />
                    <p className="text-xs font-medium text-white">
                      All notification channels are synchronized
                    </p>
                    <p className="text-[11px] text-zinc-500">
                      0 enquiries awaiting email or WhatsApp reconciliation in PostgreSQL.
                    </p>
                  </div>
                ) : (
                  <div className="divide-y divide-zinc-800/70 bg-[#09090c] border border-zinc-800/70 rounded-xl overflow-hidden">
                    {data.leads
                      .filter((l) => l.needsAttention || l.isPendingDelivery)
                      .slice(0, 8)
                      .map((l) => (
                        <div
                          key={l.id}
                          className="p-3.5 flex items-center justify-between gap-3"
                        >
                          <div
                            onClick={() => setSelectedLead(l)}
                            className="space-y-1 min-w-0 cursor-pointer flex-1"
                          >
                            <div className="flex items-center gap-2">
                              <span className="text-[11px] font-mono text-zinc-300">
                                {l.reference}
                              </span>
                              <span className="text-xs font-semibold text-white truncate">
                                {l.name}
                              </span>
                            </div>
                            <div className="flex flex-wrap items-center gap-2 text-[10px] font-mono text-zinc-400">
                              <span>Staff: {l.emailStatus}</span>
                              <span>•</span>
                              <span>Ack: {l.acknowledgementStatus}</span>
                              <span>•</span>
                              <span>WA: {l.whatsappStatus}</span>
                            </div>
                          </div>

                          <button
                            type="button"
                            onClick={() => handleRetrySingleLead(l.id)}
                            className="px-2.5 py-1 rounded-md bg-brand-primary/20 hover:bg-brand-primary text-brand-accent hover:text-white border border-brand-accent/30 text-xs font-medium transition-colors cursor-pointer shrink-0"
                          >
                            Dispatch
                          </button>
                        </div>
                      ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* ==================== TAB 5: DATABASE CATALOGUE & ATTRIBUTION ==================== */}
        {activeTab === "readiness" && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
              {/* Site Conversion Origins & UTM Attribution */}
              <div className="lg:col-span-6 bg-[#0e0e13] border border-zinc-800/80 rounded-xl p-5 space-y-4">
                <div>
                  <span className="text-[10px] uppercase tracking-[0.2em] text-zinc-400 font-semibold block">
                    Recorded Lead Attribution
                  </span>
                  <h3 className="text-base font-semibold text-white font-heading mt-0.5">
                    Converting Website Pages & Campaigns
                  </h3>
                </div>

                <div className="space-y-4">
                  <div className="bg-[#09090c] border border-zinc-800/70 rounded-xl p-4 space-y-2.5">
                    <span className="text-xs font-semibold text-zinc-300 flex items-center gap-1.5">
                      <Compass className="w-3.5 h-3.5 text-brand-accent" />
                      Recorded Origin Paths (`metadata.origin` / `landingPage`)
                    </span>
                    {data.originBreakdown.length === 0 ? (
                      <p className="text-xs text-zinc-500">
                        0 origin paths recorded on leads in PostgreSQL.
                      </p>
                    ) : (
                      <div className="space-y-2">
                        {data.originBreakdown.map((item) => (
                          <div
                            key={item.path}
                            className="flex items-center justify-between text-xs py-1 border-b border-zinc-800/50 last:border-b-0"
                          >
                            <span className="font-mono text-zinc-300">
                              {item.path}
                            </span>
                            <span className="font-mono font-semibold text-white">
                              {item.count} leads
                            </span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  <div className="bg-[#09090c] border border-zinc-800/70 rounded-xl p-4 space-y-2.5">
                    <span className="text-xs font-semibold text-zinc-300 flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                      Recorded UTM Campaigns (`metadata.utm_*`)
                    </span>
                    {data.campaignBreakdown.length === 0 ? (
                      <p className="text-xs text-zinc-500">
                        0 UTM campaign tags recorded on leads in PostgreSQL.
                      </p>
                    ) : (
                      <div className="space-y-2">
                        {data.campaignBreakdown.map((c) => (
                          <div
                            key={`${c.source}-${c.campaign}`}
                            className="flex items-center justify-between text-xs py-1 border-b border-zinc-800/50 last:border-b-0"
                          >
                            <span className="font-mono text-zinc-300">
                              {c.source} / {c.campaign}
                            </span>
                            <span className="font-mono font-semibold text-white">
                              {c.count}
                            </span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Catalogue & SEO Readiness Audit (Strictly from PostgreSQL `Service` and `Project` tables) */}
              <div className="lg:col-span-6 bg-[#0e0e13] border border-zinc-800/80 rounded-xl p-5 space-y-4">
                <div>
                  <span className="text-[10px] uppercase tracking-[0.2em] text-zinc-400 font-semibold block">
                    PostgreSQL Content Governance
                  </span>
                  <h3 className="text-base font-semibold text-white font-heading mt-0.5">
                    Database `Service` & `Project` Audit
                  </h3>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  <div className="bg-[#09090c] border border-zinc-800/70 rounded-xl p-4 space-y-2">
                    <span className="text-[10px] uppercase tracking-wider text-zinc-400 font-semibold block">
                      `Service` Table Rows
                    </span>
                    <div className="flex items-baseline gap-2">
                      <span className="text-2xl font-bold font-mono text-white">
                        {data.catalogueHealth.publishedServicesCount}
                      </span>
                      <span className="text-xs text-zinc-400">
                        published / {data.catalogueHealth.dbServicesCount} total
                      </span>
                    </div>
                    <p className="text-[11px] text-zinc-500 font-mono">
                      {data.catalogueHealth.servicesMissingSeo} missing SEO •{" "}
                      {data.catalogueHealth.servicesMissingAlt} missing heroAlt
                    </p>
                  </div>

                  <div className="bg-[#09090c] border border-zinc-800/70 rounded-xl p-4 space-y-2">
                    <span className="text-[10px] uppercase tracking-wider text-zinc-400 font-semibold block">
                      `Project` Table Rows
                    </span>
                    <div className="flex items-baseline gap-2">
                      <span className="text-2xl font-bold font-mono text-white">
                        {data.catalogueHealth.publishedProjectsCount}
                      </span>
                      <span className="text-xs text-zinc-400">
                        published / {data.catalogueHealth.dbProjectsCount} total
                      </span>
                    </div>
                    <p className="text-[11px] text-zinc-500 font-mono">
                      {data.catalogueHealth.projectsMissingSeo} missing SEO •{" "}
                      {data.catalogueHealth.projectsMissingAlt} missing heroAlt
                    </p>
                  </div>
                </div>

                {/* Live Database Services List */}
                <div className="bg-[#09090c] border border-zinc-800/70 rounded-xl p-4 space-y-2.5">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-white flex items-center gap-2">
                      <ShieldCheck className="w-4 h-4 text-emerald-400" />
                      Database Services (`db.service`)
                    </span>
                    <Link
                      href="/services"
                      target="_blank"
                      className="text-[11px] text-brand-accent hover:underline inline-flex items-center gap-1"
                    >
                      /services <ArrowUpRight className="w-3 h-3" />
                    </Link>
                  </div>

                  {data.catalogueHealth.services.length === 0 ? (
                    <p className="text-xs text-zinc-500">
                      0 rows in PostgreSQL `Service` table.
                    </p>
                  ) : (
                    <div className="max-h-48 overflow-y-auto divide-y divide-zinc-800/60 pr-1">
                      {data.catalogueHealth.services.map((s) => (
                        <div
                          key={s.id}
                          className="py-2 flex items-center justify-between gap-2 text-xs"
                        >
                          <div className="min-w-0">
                            <p className="font-medium text-zinc-200 truncate">
                              {s.title}
                            </p>
                            <p className="text-[10px] font-mono text-zinc-500">
                              /{s.slug} • {s.galleryCount} gallery assets
                            </p>
                          </div>
                          <div className="flex items-center gap-1.5 shrink-0 font-mono text-[10px]">
                            <span
                              className={`px-1.5 py-0.5 rounded ${
                                s.published
                                  ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                                  : "bg-zinc-800 text-zinc-400"
                              }`}
                            >
                              {s.published ? "published" : "draft"}
                            </span>
                            {!s.hasSeo && (
                              <span className="px-1.5 py-0.5 rounded bg-amber-500/15 text-amber-300">
                                no-seo
                              </span>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Lead & Brief Dossier Modal */}
      <LeadInspectorModal
        lead={selectedLead}
        onClose={() => setSelectedLead(null)}
        onRetryDelivery={handleRetrySingleLead}
        onUpdateLead={handleUpdateLead}
      />
    </div>
  );
}

function LeadStatusPill({ status }: { status: string }) {
  switch (status) {
    case "new":
      return (
        <span className="inline-block px-2 py-0.5 rounded text-[10px] font-medium bg-sky-500/15 text-sky-300 border border-sky-500/25">
          New
        </span>
      );
    case "in_progress":
      return (
        <span className="inline-block px-2 py-0.5 rounded text-[10px] font-medium bg-amber-500/15 text-amber-300 border border-amber-500/25">
          In Progress
        </span>
      );
    case "contacted":
      return (
        <span className="inline-block px-2 py-0.5 rounded text-[10px] font-medium bg-purple-500/15 text-purple-300 border border-purple-500/25">
          Contacted
        </span>
      );
    case "converted":
      return (
        <span className="inline-block px-2 py-0.5 rounded text-[10px] font-medium bg-emerald-500/15 text-emerald-300 border border-emerald-500/25">
          Converted
        </span>
      );
    case "closed":
      return (
        <span className="inline-block px-2 py-0.5 rounded text-[10px] font-medium bg-zinc-800 text-zinc-400 border border-zinc-700">
          Closed
        </span>
      );
    default:
      return (
        <span className="inline-block px-2 py-0.5 rounded text-[10px] font-medium bg-zinc-800 text-zinc-400 border border-zinc-700">
          {status}
        </span>
      );
  }
}

function LeadPriorityPill({ priority }: { priority: string }) {
  if (priority === "urgent") {
    return (
      <span className="inline-block px-1.5 py-0.2 rounded text-[9px] uppercase font-mono font-semibold bg-rose-500/20 text-rose-300 border border-rose-500/35">
        Urgent
      </span>
    );
  }
  if (priority === "high") {
    return (
      <span className="inline-block px-1.5 py-0.2 rounded text-[9px] uppercase font-mono font-semibold bg-amber-500/20 text-amber-300 border border-amber-500/35">
        High
      </span>
    );
  }
  return null;
}

/* ==================== SUB-COMPONENT: LEADS CRM TABLE ==================== */
function LeadsTable({
  leads,
  onSelectLead,
  onRetryLead,
}: {
  leads: SerializedLead[];
  onSelectLead: (lead: SerializedLead) => void;
  onRetryLead: (leadId: string) => Promise<void>;
}) {
  if (leads.length === 0) {
    return (
      <div className="p-12 text-center space-y-2">
        <Inbox className="w-6 h-6 text-zinc-500 mx-auto" />
        <p className="text-sm font-medium text-white font-heading">
          0 matching enquiries in PostgreSQL
        </p>
        <p className="text-xs text-zinc-500 font-sans">
          No records match the current filter criteria.
        </p>
      </div>
    );
  }

  return (
    <div>
      {/* Mobile Responsive Cards (< 768px) */}
      <div className="block md:hidden divide-y divide-zinc-800/70">
        {leads.map((lead) => (
          <div
            key={lead.id}
            onClick={() => onSelectLead(lead)}
            className="p-4 space-y-3 hover:bg-zinc-900/60 transition-colors cursor-pointer"
          >
            <div className="flex items-start justify-between gap-2">
              <div className="space-y-1 min-w-0">
                <div className="flex flex-wrap items-center gap-1.5">
                  <span className="font-mono text-[11px] font-semibold text-zinc-200">
                    {lead.reference}
                  </span>
                  <LeadStatusPill status={lead.status} />
                  <LeadPriorityPill priority={lead.priority} />
                </div>
                <h4 className="text-sm font-semibold text-white truncate font-heading">
                  {lead.name}
                </h4>
              </div>
              <span className="text-[10px] font-mono text-zinc-500 shrink-0">
                {new Date(lead.createdAt).toLocaleDateString("en-GB", {
                  day: "2-digit",
                  month: "short",
                })}
              </span>
            </div>

            {lead.organisation && (
              <p className="text-xs text-zinc-300 flex items-center gap-1.5">
                <Building2 className="w-3.5 h-3.5 text-zinc-500 shrink-0" />
                <span className="truncate">{lead.organisation}</span>
                {lead.organisationType && (
                  <span className="text-[10px] px-1.5 py-0.2 rounded bg-zinc-800 text-zinc-400 shrink-0">
                    {lead.organisationType}
                  </span>
                )}
              </p>
            )}

            <div className="flex flex-wrap items-center gap-1.5 text-xs">
              <span className="px-2 py-0.5 rounded text-[10px] font-medium bg-brand-primary/20 text-brand-accent border border-brand-accent/25">
                {lead.funnelLabel}
              </span>
              {(lead.packageName || lead.projectType) && (
                <span className="text-zinc-300 text-xs truncate max-w-[200px]">
                  {lead.packageName || lead.projectType}
                </span>
              )}
            </div>

            {(lead.eventDate || lead.venueOrLocation || lead.delegates) && (
              <div className="flex flex-wrap items-center gap-3 text-[11px] text-zinc-400 pt-0.5">
                {lead.eventDate && (
                  <span className="inline-flex items-center gap-1 font-mono text-zinc-300">
                    <Calendar className="w-3 h-3 text-brand-accent" />
                    {lead.eventDate}
                  </span>
                )}
                {lead.venueOrLocation && (
                  <span className="inline-flex items-center gap-1 truncate max-w-[140px]">
                    <MapPin className="w-3 h-3 text-zinc-500" />
                    {lead.venueOrLocation}
                  </span>
                )}
                {lead.delegates && (
                  <span className="inline-flex items-center gap-1 font-mono text-zinc-300">
                    <Users className="w-3 h-3 text-zinc-500" />
                    {lead.delegates}
                  </span>
                )}
              </div>
            )}

            <div className="flex items-center justify-between gap-2 pt-2 border-t border-zinc-800/60">
              <div className="flex flex-wrap items-center gap-1.5 text-[10px] font-mono">
                <span
                  className={`px-1.5 py-0.5 rounded ${
                    ["accepted", "sent"].includes(lead.emailStatus)
                      ? "text-emerald-400 bg-emerald-500/10"
                      : ["reconciliation_required", "failed"].includes(lead.emailStatus)
                      ? "text-rose-400 bg-rose-500/10"
                      : "text-zinc-400 bg-zinc-900"
                  }`}
                >
                  Staff: {lead.emailStatus}
                </span>
                <span className="text-zinc-500">•</span>
                <span className="text-zinc-400">Ack: {lead.acknowledgementStatus}</span>
              </div>

              <div className="flex items-center gap-2" onClick={(e) => e.stopPropagation()}>
                {(lead.needsAttention || lead.isPendingDelivery) && (
                  <button
                    type="button"
                    onClick={() => onRetryLead(lead.id)}
                    className="px-2.5 py-1 rounded bg-amber-500/15 hover:bg-amber-500/25 text-amber-300 border border-amber-500/30 text-[11px] font-medium cursor-pointer"
                  >
                    Retry
                  </button>
                )}
                <button
                  type="button"
                  onClick={() => onSelectLead(lead)}
                  className="px-3 py-1 rounded bg-zinc-900 hover:bg-zinc-800 text-zinc-200 border border-zinc-700/80 text-[11px] font-medium cursor-pointer"
                >
                  Dossier
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Desktop / Tablet Table View (>= 768px) */}
      <div className="hidden md:block overflow-x-auto">
        <table className="w-full text-left text-xs font-sans">
          <thead className="bg-[#09090c] border-b border-zinc-800/80 text-[10px] uppercase tracking-wider text-zinc-400 font-semibold font-heading">
            <tr>
              <th className="py-3 px-4">Ref & Status</th>
              <th className="py-3 px-4">Client & Organisation</th>
              <th className="py-3 px-4">Funnel & Scope</th>
              <th className="py-3 px-4">Event / Venue / Scale</th>
              <th className="py-3 px-4">Delivery Outbox</th>
              <th className="py-3 px-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-800/60 font-sans">
            {leads.map((lead) => (
              <tr
                key={lead.id}
                onClick={() => onSelectLead(lead)}
                className="hover:bg-zinc-900/60 transition-colors cursor-pointer group"
              >
                {/* Reference, Status & Date */}
                <td className="py-3.5 px-4 align-top whitespace-nowrap">
                  <span className="font-mono text-[11px] font-semibold text-zinc-200 block group-hover:text-brand-accent transition-colors">
                    {lead.reference.slice(0, 14)}
                  </span>
                  <div className="flex items-center gap-1.5 mt-1">
                    <LeadStatusPill status={lead.status} />
                    <LeadPriorityPill priority={lead.priority} />
                  </div>
                  <span className="font-mono text-[10px] text-zinc-500 block mt-1">
                    {new Date(lead.createdAt).toLocaleDateString("en-GB", {
                      day: "2-digit",
                      month: "short",
                      year: "numeric",
                    })}
                  </span>
                </td>

                {/* Client & Organisation */}
                <td className="py-3.5 px-4 align-top">
                  <p className="font-semibold text-white font-heading">{lead.name}</p>
                  {lead.organisation && (
                    <p className="text-[11px] text-zinc-300 flex items-center gap-1 mt-0.5">
                      <Building2 className="w-3 h-3 text-zinc-500 shrink-0" />
                      <span>{lead.organisation}</span>
                      {lead.organisationType && (
                        <span className="text-[10px] px-1.5 py-0.1 rounded bg-zinc-800 text-zinc-400">
                          {lead.organisationType}
                        </span>
                      )}
                    </p>
                  )}
                  <div className="flex flex-wrap items-center gap-2.5 text-[11px] text-zinc-400 font-mono mt-1">
                    {lead.email && (
                      <span className="inline-flex items-center gap-1">
                        <Mail className="w-3 h-3 text-zinc-500" />
                        {lead.email}
                      </span>
                    )}
                    {lead.phone && (
                      <span className="inline-flex items-center gap-1">
                        <Phone className="w-3 h-3 text-zinc-500" />
                        {lead.phone}
                      </span>
                    )}
                  </div>
                </td>

                {/* Funnel & Project Scope */}
                <td className="py-3.5 px-4 align-top max-w-[260px]">
                  <div className="flex items-center gap-1.5 mb-1">
                    <span className="inline-block px-2 py-0.5 rounded text-[10px] font-medium bg-brand-primary/20 text-brand-accent border border-brand-accent/25">
                      {lead.funnelLabel}
                    </span>
                    {lead.originPath && (
                      <span className="text-[10px] font-mono text-zinc-500 truncate max-w-[120px]">
                        {lead.originPath}
                      </span>
                    )}
                  </div>
                  {(lead.packageName || lead.projectType) && (
                    <p className="text-xs font-medium text-zinc-200 truncate">
                      {lead.packageName || lead.projectType}
                    </p>
                  )}
                  <p className="text-[11px] text-zinc-500 line-clamp-1 mt-0.5">
                    {lead.message}
                  </p>
                </td>

                {/* Event / Venue / Scale */}
                <td className="py-3.5 px-4 align-top whitespace-nowrap">
                  {lead.eventDate || lead.venueOrLocation || lead.delegates ? (
                    <div className="space-y-1 text-[11px]">
                      {lead.eventDate && (
                        <p className="font-mono text-zinc-200 flex items-center gap-1">
                          <Calendar className="w-3 h-3 text-brand-accent" />
                          {lead.eventDate}
                        </p>
                      )}
                      {lead.venueOrLocation && (
                        <p className="text-zinc-400 flex items-center gap-1 truncate max-w-[160px]">
                          <MapPin className="w-3 h-3 text-zinc-500" />
                          {lead.venueOrLocation}
                        </p>
                      )}
                      {lead.delegates && (
                        <p className="font-mono text-zinc-300 flex items-center gap-1">
                          <Users className="w-3 h-3 text-zinc-500" />
                          {lead.delegates} delegates
                        </p>
                      )}
                    </div>
                  ) : (
                    <span className="text-[11px] text-zinc-500">—</span>
                  )}
                </td>

                {/* Delivery Outbox Status */}
                <td className="py-3.5 px-4 align-top whitespace-nowrap">
                  <div className="space-y-1">
                    <div className="flex items-center gap-1.5">
                      <span
                        className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-mono font-medium ${
                          ["accepted", "sent"].includes(lead.emailStatus)
                            ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/25"
                            : ["reconciliation_required", "failed"].includes(
                                lead.emailStatus
                              )
                            ? "bg-rose-500/10 text-rose-400 border border-rose-500/25"
                            : lead.emailStatus === "not_requested"
                            ? "bg-zinc-900 text-zinc-400 border border-zinc-800"
                            : "bg-amber-500/10 text-amber-300 border border-amber-500/25"
                        }`}
                      >
                        Staff: {lead.emailStatus}
                      </span>
                    </div>
                    <div className="text-[10px] font-mono text-zinc-500">
                      Ack: {lead.acknowledgementStatus} • WA:{" "}
                      {lead.whatsappStatus}
                    </div>
                  </div>
                </td>

                {/* Actions */}
                <td
                  className="py-3.5 px-4 align-top text-right whitespace-nowrap"
                  onClick={(e) => e.stopPropagation()}
                >
                  <div className="inline-flex items-center gap-1.5">
                    {(lead.needsAttention || lead.isPendingDelivery) && (
                      <button
                        type="button"
                        onClick={() => onRetryLead(lead.id)}
                        className="px-2.5 py-1 rounded bg-amber-500/15 hover:bg-amber-500/25 text-amber-300 border border-amber-500/30 text-[11px] font-medium transition-colors cursor-pointer"
                      >
                        Retry
                      </button>
                    )}
                    <button
                      type="button"
                      onClick={() => onSelectLead(lead)}
                      className="px-2.5 py-1 rounded bg-zinc-900 hover:bg-zinc-800 text-zinc-200 border border-zinc-700/80 text-[11px] font-medium transition-colors cursor-pointer"
                    >
                      Dossier
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
