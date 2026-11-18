"use client";

import React, { useState } from "react";
import type {
  TrendBucket,
  ServiceDemandItem,
  OperationsDashboardData,
  LeadFunnelType,
} from "@/lib/admin-intelligence";
import { AlertCircle, CheckCircle2, RefreshCw } from "lucide-react";

const FUNNEL_COLORS: Record<
  LeadFunnelType,
  { bar: string; badge: string; label: string }
> = {
  conference: {
    bar: "bg-[#e11d48]",
    badge: "bg-[#e11d48]/15 text-[#fda4af] border-[#e11d48]/30",
    label: "Conference RFPs",
  },
  package: {
    bar: "bg-amber-400",
    badge: "bg-amber-400/15 text-amber-300 border-amber-400/30",
    label: "Signature Packages",
  },
  project_builder: {
    bar: "bg-sky-400",
    badge: "bg-sky-400/15 text-sky-300 border-sky-400/30",
    label: "Project Builder",
  },
  contact: {
    bar: "bg-indigo-400",
    badge: "bg-indigo-400/15 text-indigo-300 border-indigo-400/30",
    label: "Direct Enquiries",
  },
  whatsapp: {
    bar: "bg-emerald-400",
    badge: "bg-emerald-400/15 text-emerald-300 border-emerald-400/30",
    label: "WhatsApp Threads",
  },
};

export function EnquiryFunnelChart({
  trendSeries,
  funnelBreakdown,
  onSelectFunnel,
}: {
  trendSeries: TrendBucket[];
  funnelBreakdown: OperationsDashboardData["funnelBreakdown"];
  onSelectFunnel?: (funnel: LeadFunnelType) => void;
}) {
  const [activeBucketIndex, setActiveBucketIndex] = useState<number>(
    Math.max(trendSeries.length - 1, 0)
  );

  const maxBucketTotal = Math.max(...trendSeries.map((b) => b.total), 1);
  const selectedBucket =
    trendSeries[activeBucketIndex] ?? trendSeries[trendSeries.length - 1];

  return (
    <div className="bg-[#0e0e13] border border-zinc-800/80 rounded-xl p-5 flex flex-col justify-between space-y-5">
      {/* Header */}
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <span className="text-[10px] uppercase tracking-[0.2em] text-zinc-400 font-semibold block">
            Pipeline Intake & Conversion Channels
          </span>
          <h3 className="text-base font-semibold text-white font-heading mt-0.5">
            Enquiries by Site Funnel
          </h3>
        </div>

        <div className="flex flex-wrap items-center gap-2 text-[11px]">
          {(Object.keys(FUNNEL_COLORS) as LeadFunnelType[]).map((key) => (
            <span
              key={key}
              className="inline-flex items-center gap-1.5 text-zinc-400"
            >
              <span className={`w-2 h-2 rounded-xs ${FUNNEL_COLORS[key].bar}`} />
              <span>{FUNNEL_COLORS[key].label}</span>
            </span>
          ))}
        </div>
      </div>

      {/* Interactive Monthly Column Chart + Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-end">
        {/* Left: 6-Month Grouped / Stacked Bar Chart */}
        <div className="lg:col-span-7 bg-[#09090c] border border-zinc-800/70 rounded-xl p-4">
          <div className="flex items-center justify-between mb-3 text-xs">
            <span className="text-zinc-400 font-medium">
              Monthly Intake Volume (6M Database Window)
            </span>
            {selectedBucket && (
              <span className="font-mono text-zinc-300 bg-zinc-900 border border-zinc-800 px-2 py-0.5 rounded text-[11px]">
                {selectedBucket.label}: <strong>{selectedBucket.total}</strong>{" "}
                enquiries
              </span>
            )}
          </div>

          <div className="h-44 flex items-end justify-between gap-1 sm:gap-2.5 pt-4 pb-1 px-1 border-b border-zinc-800/80">
            {trendSeries.map((bucket, idx) => {
              const isSelected = idx === activeBucketIndex;
              const heightPct =
                bucket.total > 0
                  ? Math.max(
                      Math.round((bucket.total / maxBucketTotal) * 100),
                      12
                    )
                  : 4;

              return (
                <button
                  key={bucket.key}
                  type="button"
                  onClick={() => setActiveBucketIndex(idx)}
                  onMouseEnter={() => setActiveBucketIndex(idx)}
                  className="flex-1 flex flex-col items-center gap-2 h-full justify-end group cursor-pointer focus:outline-none"
                >
                  <span
                    className={`text-[10px] font-mono transition-colors ${
                      isSelected
                        ? "text-white font-semibold"
                        : "text-zinc-500 group-hover:text-zinc-300"
                    }`}
                  >
                    {bucket.total}
                  </span>

                  <div className="w-full max-w-[38px] h-32 bg-zinc-900/70 rounded-t-md flex items-end overflow-hidden p-0.5 border border-zinc-800/60 group-hover:border-zinc-700">
                    <div
                      style={{ height: `${heightPct}%` }}
                      className={`w-full rounded-t-xs transition-all duration-300 flex flex-col-reverse overflow-hidden ${
                        bucket.total === 0
                          ? "bg-zinc-800/50"
                          : isSelected
                          ? "ring-1 ring-white/30"
                          : "opacity-80 group-hover:opacity-100"
                      }`}
                    >
                      {bucket.total > 0 &&
                        (
                          [
                            "conference",
                            "package",
                            "project_builder",
                            "contact",
                            "whatsapp",
                          ] as LeadFunnelType[]
                        ).map((fKey) => {
                          const val = bucket[fKey];
                          if (!val) return null;
                          const segPct = (val / bucket.total) * 100;
                          return (
                            <div
                              key={fKey}
                              style={{ height: `${segPct}%` }}
                              className={`w-full ${FUNNEL_COLORS[fKey].bar}`}
                            />
                          );
                        })}
                    </div>
                  </div>

                  <span
                    className={`text-[10px] font-mono ${
                      isSelected
                        ? "text-brand-accent font-semibold"
                        : "text-zinc-500"
                    }`}
                  >
                    {bucket.label}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Right: Channel Share & Actionable Funnel Rows */}
        <div className="lg:col-span-5 space-y-2.5">
          {funnelBreakdown.map((item) => (
            <button
              key={item.funnel}
              type="button"
              onClick={() => onSelectFunnel?.(item.funnel)}
              className="w-full text-left bg-[#09090c] hover:bg-zinc-900/90 border border-zinc-800/70 hover:border-zinc-700 rounded-lg p-2.5 transition-colors cursor-pointer group"
            >
              <div className="flex items-center justify-between text-xs mb-1.5">
                <span className="font-medium text-zinc-200 group-hover:text-white flex items-center gap-2">
                  <span
                    className={`w-2 h-2 rounded-xs ${FUNNEL_COLORS[item.funnel].bar}`}
                  />
                  {item.label}
                </span>
                <span className="font-mono text-xs text-white font-semibold">
                  {item.count}{" "}
                  <span className="text-zinc-500 font-normal text-[11px]">
                    ({item.share}%)
                  </span>
                </span>
              </div>
              <div className="w-full h-1.5 bg-zinc-900 rounded-full overflow-hidden">
                <div
                  style={{
                    width: `${Math.max(item.share, item.count > 0 ? 4 : 0)}%`,
                  }}
                  className={`h-full rounded-full ${FUNNEL_COLORS[item.funnel].bar}`}
                />
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

export function ServiceDemandMatrix({
  items,
}: {
  items: ServiceDemandItem[];
}) {
  const maxVal = Math.max(
    ...items.map((i) => Math.max(i.enquiries, i.reviews)),
    1
  );

  return (
    <div className="bg-[#0e0e13] border border-zinc-800/80 rounded-xl p-5 flex flex-col justify-between space-y-4">
      <div className="flex flex-wrap items-start justify-between gap-2">
        <div>
          <span className="text-[10px] uppercase tracking-[0.2em] text-zinc-400 font-semibold block">
            Database Service Lines vs. Published Proof
          </span>
          <h3 className="text-base font-semibold text-white font-heading mt-0.5">
            Service Enquiries & Review Coverage
          </h3>
        </div>

        <div className="flex items-center gap-3 text-[11px] text-zinc-400">
          <span className="inline-flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-xs bg-[#e11d48]" />
            Enquiries
          </span>
          <span className="inline-flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-xs bg-emerald-400" />
            Live Reviews
          </span>
        </div>
      </div>

      {items.length === 0 ? (
        <div className="bg-[#09090c] border border-zinc-800/70 rounded-lg p-6 text-center text-xs text-zinc-500">
          No service records, enquiries, or reviews found in PostgreSQL.
        </div>
      ) : (
        <div className="space-y-3 pt-1">
          {items.slice(0, 8).map((srv) => {
            const enqPct = Math.round((srv.enquiries / maxVal) * 100);
            const revPct = Math.round((srv.approvedReviews / maxVal) * 100);

            return (
              <div key={srv.service} className="space-y-1.5">
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2 min-w-0">
                    <span className="text-zinc-200 font-medium truncate">
                      {srv.shortName}
                    </span>
                    {srv.proofGap && (
                      <span
                        title="Clients have enquired about this service, but 0 approved reviews are published for it."
                        className="text-[10px] px-1.5 py-0.2 rounded bg-amber-500/15 text-amber-300 border border-amber-500/30 font-medium whitespace-nowrap"
                      >
                        Needs Proof
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-3 font-mono text-[11px] shrink-0">
                    <span className="text-zinc-300">
                      <strong>{srv.enquiries}</strong> req
                    </span>
                    <span className="text-emerald-400">
                      <strong>{srv.approvedReviews}</strong> live
                    </span>
                    {srv.averageRating !== null && (
                      <span className="text-amber-300">
                        {srv.averageRating.toFixed(1)}★
                      </span>
                    )}
                  </div>
                </div>

                {/* Dual Horizontal Bars */}
                <div className="space-y-1">
                  <div className="w-full h-1.5 bg-zinc-900 rounded-full overflow-hidden flex">
                    <div
                      style={{
                        width: `${Math.max(enqPct, srv.enquiries > 0 ? 4 : 0)}%`,
                      }}
                      className="h-full bg-[#e11d48] rounded-full transition-all"
                    />
                  </div>
                  <div className="w-full h-1.5 bg-zinc-900 rounded-full overflow-hidden flex">
                    <div
                      style={{
                        width: `${Math.max(
                          revPct,
                          srv.approvedReviews > 0 ? 4 : 0
                        )}%`,
                      }}
                      className="h-full bg-emerald-400 rounded-full transition-all"
                    />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

export function OutboxHealthPanel({
  deliveryBreakdown,
  kpi,
  onDispatchAll,
  dispatching,
}: {
  deliveryBreakdown: OperationsDashboardData["deliveryBreakdown"];
  kpi: OperationsDashboardData["kpi"];
  onDispatchAll: () => Promise<void>;
  dispatching: boolean;
}) {
  const channels = [
    {
      title: "Staff Notification Email",
      subtitle: "Alerts MMS team on new enquiry",
      rate: kpi.deliverySuccessRate,
      stats: deliveryBreakdown.staffEmail,
    },
    {
      title: "Client Confirmation Email",
      subtitle: "Automated receipt to client inbox",
      rate: kpi.ackSuccessRate,
      stats: deliveryBreakdown.clientAck,
    },
    {
      title: "WhatsApp Cloud Channel",
      subtitle: "Meta webhook & outbound dispatch",
      rate: kpi.whatsappDeliveryRate,
      stats: deliveryBreakdown.whatsapp,
    },
  ];

  return (
    <div className="bg-[#0e0e13] border border-zinc-800/80 rounded-xl p-5 space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <span className="text-[10px] uppercase tracking-[0.2em] text-zinc-400 font-semibold block">
            Transactional Outbox Reliability
          </span>
          <h3 className="text-base font-semibold text-white font-heading mt-0.5">
            Notification & Acknowledgement Telemetry
          </h3>
        </div>

        <button
          type="button"
          onClick={onDispatchAll}
          disabled={dispatching}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-zinc-900 hover:bg-zinc-800 text-zinc-200 border border-zinc-700/80 text-xs font-medium transition-colors cursor-pointer disabled:opacity-50"
        >
          <RefreshCw
            className={`w-3.5 h-3.5 ${dispatching ? "animate-spin" : ""}`}
          />
          <span>
            {dispatching
              ? "Syncing Outbox..."
              : kpi.pendingDeliveryCount + kpi.needsAttentionCount > 0
              ? `Process Queue (${kpi.pendingDeliveryCount + kpi.needsAttentionCount})`
              : "Verify Outbox"}
          </span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5">
        {channels.map((ch) => (
          <div
            key={ch.title}
            className="bg-[#09090c] border border-zinc-800/80 rounded-lg p-3.5 space-y-3"
          >
            <div className="flex items-start justify-between gap-2">
              <div>
                <p className="text-xs font-semibold text-white">{ch.title}</p>
                <p className="text-[11px] text-zinc-500">{ch.subtitle}</p>
              </div>
              <span
                className={`text-lg font-bold font-mono ${
                  ch.rate === null
                    ? "text-zinc-500"
                    : ch.stats.attention > 0
                    ? "text-amber-300"
                    : "text-emerald-400"
                }`}
              >
                {ch.rate !== null ? `${ch.rate}%` : "—"}
              </span>
            </div>

            <div className="w-full h-1.5 bg-zinc-900 rounded-full overflow-hidden flex">
              <div
                style={{ width: `${ch.rate ?? 0}%` }}
                className={`h-full ${
                  ch.stats.attention > 0 ? "bg-amber-400" : "bg-emerald-400"
                }`}
              />
            </div>

            <div className="flex items-center justify-between text-[11px] font-mono pt-1 border-t border-zinc-800/60">
              <span className="text-emerald-400 flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3" />
                {ch.stats.delivered} sent
              </span>
              <span className="text-amber-300">{ch.stats.pending} queued</span>
              <span
                className={
                  ch.stats.attention > 0
                    ? "text-rose-400 font-semibold flex items-center gap-1"
                    : "text-zinc-500"
                }
              >
                {ch.stats.attention > 0 && <AlertCircle className="w-3 h-3" />}
                {ch.stats.attention} alert
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
