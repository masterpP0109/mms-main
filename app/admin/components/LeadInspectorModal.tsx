"use client";

import React, { useState } from "react";
import {
  X,
  Mail,
  Phone,
  Building2,
  Calendar,
  MapPin,
  Users,
  RefreshCw,
  Copy,
  Check,
  AlertTriangle,
  CheckCircle2,
  Clock,
  ExternalLink,
  Layers,
  Compass,
  Tag,
  ShieldAlert,
  UserCheck,
  FileEdit,
  Save,
} from "lucide-react";
import type { SerializedLead } from "@/lib/admin-intelligence";

interface LeadInspectorModalProps {
  lead: SerializedLead | null;
  onClose: () => void;
  onRetryDelivery: (leadId: string) => Promise<void>;
  onUpdateLead?: (
    leadId: string,
    updates: {
      status?: string;
      priority?: string;
      notes?: string | null;
      assignedTo?: string | null;
      markFollowedUp?: boolean;
    }
  ) => Promise<void>;
}

function OutboxBadge({ status }: { status: string }) {
  const isSuccess = ["accepted", "sent", "delivered", "read", "received"].includes(status);
  const isError = ["reconciliation_required", "failed"].includes(status);
  const isPending = ["pending", "sending", "retry_required"].includes(status);

  if (isSuccess) {
    return (
      <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md text-[11px] font-mono font-medium bg-emerald-500/10 text-emerald-400 border border-emerald-500/25">
        <CheckCircle2 className="w-3 h-3 shrink-0" />
        {status.replace(/_/g, " ")}
      </span>
    );
  }
  if (isError) {
    return (
      <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md text-[11px] font-mono font-medium bg-rose-500/10 text-rose-400 border border-rose-500/25">
        <AlertTriangle className="w-3 h-3 shrink-0" />
        {status.replace(/_/g, " ")}
      </span>
    );
  }
  if (isPending) {
    return (
      <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md text-[11px] font-mono font-medium bg-amber-500/10 text-amber-300 border border-amber-500/25">
        <Clock className="w-3 h-3 shrink-0" />
        {status.replace(/_/g, " ")}
      </span>
    );
  }
  return (
    <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md text-[11px] font-mono font-medium bg-zinc-800/80 text-zinc-400 border border-zinc-700/60">
      {status.replace(/_/g, " ")}
    </span>
  );
}

const STATUS_OPTIONS = [
  { value: "new", label: "New", color: "bg-sky-500/15 text-sky-300 border-sky-500/30" },
  { value: "in_progress", label: "In Progress", color: "bg-amber-500/15 text-amber-300 border-amber-500/30" },
  { value: "contacted", label: "Contacted", color: "bg-purple-500/15 text-purple-300 border-purple-500/30" },
  { value: "converted", label: "Converted", color: "bg-emerald-500/15 text-emerald-300 border-emerald-500/30" },
  { value: "closed", label: "Closed", color: "bg-zinc-800 text-zinc-400 border-zinc-700" },
] as const;

const PRIORITY_OPTIONS = [
  { value: "urgent", label: "Urgent", color: "bg-rose-500/20 text-rose-400 border-rose-500/40" },
  { value: "high", label: "High", color: "bg-amber-500/20 text-amber-300 border-amber-500/40" },
  { value: "normal", label: "Normal", color: "bg-sky-500/20 text-sky-300 border-sky-500/40" },
  { value: "low", label: "Low", color: "bg-zinc-800 text-zinc-400 border-zinc-700" },
] as const;

export default function LeadInspectorModal({
  lead,
  onClose,
  onRetryDelivery,
  onUpdateLead,
}: LeadInspectorModalProps) {
  if (!lead) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/85 backdrop-blur-sm animate-in fade-in duration-150 font-sans"
      onClick={onClose}
    >
      <LeadInspectorDialog
        key={lead.id}
        lead={lead}
        onClose={onClose}
        onRetryDelivery={onRetryDelivery}
        onUpdateLead={onUpdateLead}
      />
    </div>
  );
}

function LeadInspectorDialog({
  lead,
  onClose,
  onRetryDelivery,
  onUpdateLead,
}: {
  lead: SerializedLead;
  onClose: () => void;
  onRetryDelivery: (leadId: string) => Promise<void>;
  onUpdateLead?: LeadInspectorModalProps["onUpdateLead"];
}) {
  const [copiedRef, setCopiedRef] = useState(false);
  const [retrying, setRetrying] = useState(false);

  // Editable Pipeline State directly initialized from props
  const [status, setStatus] = useState(lead.status || "new");
  const [priority, setPriority] = useState(lead.priority || "normal");
  const [assignedTo, setAssignedTo] = useState(lead.assignedTo || "");
  const [notes, setNotes] = useState(lead.notes || "");
  const [savingLead, setSavingLead] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  const handleCopyRef = () => {
    navigator.clipboard.writeText(lead.reference);
    setCopiedRef(true);
    setTimeout(() => setCopiedRef(false), 2000);
  };

  const handleRetry = async () => {
    setRetrying(true);
    try {
      await onRetryDelivery(lead.id);
    } finally {
      setRetrying(false);
    }
  };

  const handleSavePipeline = async () => {
    if (!onUpdateLead) return;
    setSavingLead(true);
    try {
      await onUpdateLead(lead.id, {
        status,
        priority,
        assignedTo: assignedTo.trim() || null,
        notes: notes.trim() || null,
      });
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 2500);
    } finally {
      setSavingLead(false);
    }
  };

  const audience =
    typeof lead.metadata.audience === "string" ? lead.metadata.audience : null;
  const timeline =
    typeof lead.metadata.timeline === "string" ? lead.metadata.timeline : null;

  const cleanPhoneForWa = lead.phone ? lead.phone.replace(/[^0-9]/g, "") : null;

  return (
    <div
      className="bg-[#0c0c10] border border-zinc-800 rounded-2xl w-full max-w-3xl max-h-[92vh] overflow-y-auto shadow-2xl flex flex-col"
      role="dialog"
      aria-modal="true"
      aria-labelledby="lead-dossier-title"
      onClick={(e) => e.stopPropagation()}
    >
      {/* Top Header */}
      <div className="px-4 sm:px-6 py-4 border-b border-zinc-800/80 flex items-center justify-between sticky top-0 bg-[#0c0c10]/95 backdrop-blur-md z-10">
        <div className="space-y-1 min-w-0 pr-2">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-[11px] font-mono font-semibold text-zinc-200 bg-zinc-900 border border-zinc-700/80 px-2 py-0.5 rounded">
              {lead.reference}
            </span>
            <span className="text-[11px] font-medium font-sans px-2.5 py-0.5 rounded bg-brand-primary/20 text-brand-accent border border-brand-accent/25">
              {lead.funnelLabel}
            </span>
            <span className="text-[11px] text-zinc-500 font-mono">
              {new Date(lead.createdAt).toLocaleString("en-GB", {
                day: "2-digit",
                month: "short",
                year: "numeric",
                hour: "2-digit",
                minute: "2-digit",
              })}
            </span>
          </div>
          <h2
            id="lead-dossier-title"
            className="text-base sm:text-xl font-semibold text-white font-heading truncate"
          >
            {lead.name}
            {lead.organisation ? (
              <span className="text-zinc-400 font-normal">
                {" "}
                — {lead.organisation}
              </span>
            ) : null}
          </h2>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button
            type="button"
            onClick={handleCopyRef}
            className="inline-flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-lg bg-zinc-900 hover:bg-zinc-800 text-zinc-300 border border-zinc-700/80 text-xs font-medium transition-colors cursor-pointer"
          >
            {copiedRef ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-400" />
                <span className="hidden sm:inline">Copied</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Copy ID</span>
              </>
            )}
          </button>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 sm:p-2 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800/80 transition-colors cursor-pointer"
            aria-label="Close modal"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Body */}
      <div className="p-4 sm:p-6 space-y-6">
        {/* Pipeline Status & CRM Assignment Section */}
        <div className="bg-[#101016] border border-zinc-800/90 rounded-xl p-4 sm:p-5 space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-2 border-b border-zinc-800/80 pb-3">
            <span className="text-xs font-semibold uppercase tracking-wider text-zinc-300 font-heading flex items-center gap-2">
              <Tag className="w-3.5 h-3.5 text-brand-accent" />
              Pipeline Disposition & Operational Ownership
            </span>
            {saveSuccess && (
              <span className="inline-flex items-center gap-1 text-xs text-emerald-400 font-medium">
                <Check className="w-3.5 h-3.5" />
                Changes synchronized to PostgreSQL
              </span>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Status Selector */}
            <div className="space-y-1.5">
              <label className="text-[11px] uppercase tracking-wider text-zinc-400 font-semibold block">
                Lead Status
              </label>
              <div className="flex flex-wrap gap-1.5">
                {STATUS_OPTIONS.map((opt) => (
                  <button
                    key={opt.value}
                    type="button"
                    onClick={() => setStatus(opt.value)}
                    className={`px-2.5 py-1 rounded-md text-xs font-medium border transition-colors cursor-pointer ${
                      status === opt.value
                        ? `${opt.color} ring-1 ring-white/20 font-semibold`
                        : "bg-zinc-900/60 text-zinc-400 border-zinc-800 hover:bg-zinc-800"
                    }`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Priority Selector */}
            <div className="space-y-1.5">
              <label className="text-[11px] uppercase tracking-wider text-zinc-400 font-semibold flex items-center gap-1">
                <ShieldAlert className="w-3 h-3 text-zinc-400" />
                Priority Level
              </label>
              <div className="flex flex-wrap gap-1.5">
                {PRIORITY_OPTIONS.map((opt) => (
                  <button
                    key={opt.value}
                    type="button"
                    onClick={() => setPriority(opt.value)}
                    className={`px-2.5 py-1 rounded-md text-xs font-medium border transition-colors cursor-pointer ${
                      priority === opt.value
                        ? `${opt.color} ring-1 ring-white/20 font-semibold`
                        : "bg-zinc-900/60 text-zinc-400 border-zinc-800 hover:bg-zinc-800"
                    }`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-1">
            {/* Assigned Staff Member */}
            <div className="sm:col-span-1 space-y-1">
              <label className="text-[11px] uppercase tracking-wider text-zinc-400 font-semibold flex items-center gap-1">
                <UserCheck className="w-3 h-3 text-zinc-400" />
                Assigned Team Member
              </label>
              <input
                type="text"
                value={assignedTo}
                onChange={(e) => setAssignedTo(e.target.value)}
                placeholder="e.g. Lead Producer, T. Mosi"
                className="w-full bg-[#08080c] border border-zinc-800 rounded-lg px-3 py-1.5 text-xs text-white placeholder:text-zinc-600 focus:outline-none focus:border-zinc-600"
              />
            </div>

            {/* Internal Operations Notes */}
            <div className="sm:col-span-2 space-y-1">
              <label className="text-[11px] uppercase tracking-wider text-zinc-400 font-semibold flex items-center gap-1">
                <FileEdit className="w-3 h-3 text-zinc-400" />
                Internal Operational Notes & Follow-up Log
              </label>
              <textarea
                rows={2}
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Add private production notes, quotation details, or meeting outcomes..."
                className="w-full bg-[#08080c] border border-zinc-800 rounded-lg px-3 py-1.5 text-xs text-white placeholder:text-zinc-600 focus:outline-none focus:border-zinc-600 resize-none font-sans"
              />
            </div>
          </div>

          {onUpdateLead && (
            <div className="flex justify-end pt-1">
              <button
                type="button"
                onClick={handleSavePipeline}
                disabled={savingLead}
                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-white text-xs font-medium transition-colors cursor-pointer disabled:opacity-50"
              >
                <Save className="w-3.5 h-3.5" />
                <span>{savingLead ? "Saving..." : "Save Pipeline Status"}</span>
              </button>
            </div>
          )}
        </div>

        {/* Contact & Organization Row */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div className="bg-[#121217] border border-zinc-800/80 rounded-xl p-3.5 space-y-1">
            <span className="text-[10px] uppercase tracking-wider text-zinc-500 font-semibold flex items-center gap-1.5">
              <Mail className="w-3 h-3 text-zinc-400" />
              Email Address
            </span>
            {lead.email ? (
              <a
                href={`mailto:${lead.email}?subject=${encodeURIComponent(`Re: MMS Enquiry (${lead.reference})`)}`}
                className="text-xs font-mono text-white hover:text-brand-accent break-all block transition-colors"
              >
                {lead.email}
              </a>
            ) : (
              <p className="text-xs text-zinc-500 italic">Not provided</p>
            )}
          </div>

          <div className="bg-[#121217] border border-zinc-800/80 rounded-xl p-3.5 space-y-1">
            <span className="text-[10px] uppercase tracking-wider text-zinc-500 font-semibold flex items-center gap-1.5">
              <Phone className="w-3 h-3 text-zinc-400" />
              Telephone / WhatsApp
            </span>
            {lead.phone ? (
              <p className="text-xs font-mono text-white select-all">
                {lead.phone}
              </p>
            ) : (
              <p className="text-xs text-zinc-500 italic">Not provided</p>
            )}
          </div>

          <div className="bg-[#121217] border border-zinc-800/80 rounded-xl p-3.5 space-y-1">
            <span className="text-[10px] uppercase tracking-wider text-zinc-500 font-semibold flex items-center gap-1.5">
              <Building2 className="w-3 h-3 text-zinc-400" />
              Organisation & Sector
            </span>
            {lead.organisation ? (
              <p className="text-xs font-medium text-white">
                {lead.organisation}
              </p>
            ) : null}
            {lead.organisationType && (
              <span className="inline-block text-[10px] px-2 py-0.5 rounded bg-zinc-800 text-zinc-300 border border-zinc-700">
                {lead.organisationType}
              </span>
            )}
          </div>
        </div>

        {/* Structured Production Specifications */}
        <div className="bg-[#121217] border border-zinc-800/80 rounded-xl p-4 space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-2 border-b border-zinc-800/80 pb-2.5">
            <span className="text-xs font-semibold uppercase tracking-wider text-zinc-300 font-heading flex items-center gap-2">
              <Layers className="w-3.5 h-3.5 text-brand-accent" />
              Production Scope & Parameters
            </span>
            {lead.originPath && (
              <span className="text-[11px] font-mono text-zinc-400 flex items-center gap-1">
                <Compass className="w-3 h-3 text-zinc-500" />
                Origin: {lead.originPath}
              </span>
            )}
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
            <div>
              <span className="text-[10px] uppercase tracking-wider text-zinc-500 block mb-1">
                Project / Package
              </span>
              <p className="font-medium text-white">
                {lead.packageName || lead.projectType || "Not specified"}
              </p>
            </div>

            <div>
              <span className="text-[10px] uppercase tracking-wider text-zinc-500 flex items-center gap-1 mb-1">
                <Calendar className="w-3 h-3" />
                Target Date / Timeline
              </span>
              <p className="font-medium text-white font-mono">
                {lead.eventDate || timeline || "Not specified"}
              </p>
            </div>

            <div>
              <span className="text-[10px] uppercase tracking-wider text-zinc-500 flex items-center gap-1 mb-1">
                <MapPin className="w-3 h-3" />
                Venue / Location
              </span>
              <p className="font-medium text-white">
                {lead.venueOrLocation || "Not specified"}
              </p>
            </div>

            <div>
              <span className="text-[10px] uppercase tracking-wider text-zinc-500 flex items-center gap-1 mb-1">
                <Users className="w-3 h-3" />
                Scale / Audience
              </span>
              <p className="font-medium text-white font-mono">
                {lead.delegates
                  ? `${lead.delegates.toLocaleString()} delegates`
                  : audience || "Not specified"}
              </p>
            </div>
          </div>

          {lead.requestedServices.length > 0 && (
            <div className="pt-2 border-t border-zinc-800/60">
              <span className="text-[10px] uppercase tracking-wider text-zinc-500 block mb-2">
                Requested Production Services & Equipment
              </span>
              <div className="flex flex-wrap gap-1.5">
                {lead.requestedServices.map((srv) => (
                  <span
                    key={srv}
                    className="px-2.5 py-1 rounded-md text-xs bg-zinc-900 text-zinc-200 border border-zinc-700/80"
                  >
                    {srv}
                  </span>
                ))}
              </div>
            </div>
          )}

          {(lead.utmSource || lead.utmCampaign) && (
            <div className="pt-2 border-t border-zinc-800/60 flex flex-wrap items-center gap-4 text-[11px] text-zinc-400">
              <span>
                <strong className="text-zinc-300">Campaign Source:</strong>{" "}
                {lead.utmSource || "—"}
              </span>
              <span>
                <strong className="text-zinc-300">UTM Campaign:</strong>{" "}
                {lead.utmCampaign || "—"}
              </span>
            </div>
          )}
        </div>

        {/* Full Client Message / Brief */}
        <div className="space-y-2">
          <span className="text-xs font-semibold uppercase tracking-wider text-zinc-400 font-heading block">
            Client Message & Project Brief
          </span>
          <div className="bg-[#08080b] border border-zinc-800 rounded-xl p-4 text-xs sm:text-sm text-zinc-200 leading-relaxed whitespace-pre-wrap font-sans">
            {lead.message}
          </div>
        </div>

        {/* Outbox & Notification Telemetry */}
        <div className="bg-[#121217] border border-zinc-800/80 rounded-xl p-4 space-y-3.5">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div>
              <h3 className="text-xs font-semibold uppercase tracking-wider text-zinc-300 font-heading">
                Transactional Outbox & Notification Delivery
              </h3>
              <p className="text-[11px] text-zinc-500">
                Tracks staff alert email, automated client confirmation, and WhatsApp dispatch.
              </p>
            </div>

            <button
              type="button"
              onClick={handleRetry}
              disabled={retrying}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-brand-primary hover:bg-brand-red text-white text-xs font-medium transition-colors cursor-pointer disabled:opacity-50"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${retrying ? "animate-spin" : ""}`} />
              <span>{retrying ? "Dispatching..." : "Retry / Dispatch Channels"}</span>
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {/* Staff Notification */}
            <div className="bg-[#0c0c10] border border-zinc-800 rounded-lg p-3 space-y-1.5">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-medium text-zinc-400">
                  Staff Email Alert
                </span>
                <span className="text-[10px] font-mono text-zinc-500">
                  {lead.emailAttempts} {lead.emailAttempts === 1 ? "attempt" : "attempts"}
                </span>
              </div>
              <OutboxBadge status={lead.emailStatus} />
              {lead.notificationError && (
                <p className="text-[11px] text-rose-400 font-mono break-words pt-1">
                  {lead.notificationError}
                </p>
              )}
            </div>

            {/* Client Acknowledgement */}
            <div className="bg-[#0c0c10] border border-zinc-800 rounded-lg p-3 space-y-1.5">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-medium text-zinc-400">
                  Client Ack Email
                </span>
                <span className="text-[10px] font-mono text-zinc-500">
                  {lead.acknowledgementAttempts}{" "}
                  {lead.acknowledgementAttempts === 1 ? "attempt" : "attempts"}
                </span>
              </div>
              <OutboxBadge status={lead.acknowledgementStatus} />
              {lead.acknowledgementError && (
                <p className="text-[11px] text-rose-400 font-mono break-words pt-1">
                  {lead.acknowledgementError}
                </p>
              )}
            </div>

            {/* WhatsApp Status */}
            <div className="bg-[#0c0c10] border border-zinc-800 rounded-lg p-3 space-y-1.5">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-medium text-zinc-400">
                  WhatsApp Alert
                </span>
                <span className="text-[10px] font-mono text-zinc-500">
                  {lead.whatsappAttempts}{" "}
                  {lead.whatsappAttempts === 1 ? "attempt" : "attempts"}
                </span>
              </div>
              <OutboxBadge status={lead.whatsappStatus} />
            </div>
          </div>
        </div>
      </div>

      {/* Footer Actions */}
      <div className="px-4 sm:px-6 py-4 border-t border-zinc-800/80 bg-[#09090c] rounded-b-2xl flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-2">
          {lead.email && (
            <a
              href={`mailto:${lead.email}?subject=${encodeURIComponent(`Mosi Media Solutions — Enquiry ${lead.reference}`)}`}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-white text-xs font-medium transition-colors"
            >
              <Mail className="w-3.5 h-3.5" />
              <span>Reply by Email</span>
            </a>
          )}
          {cleanPhoneForWa && (
            <a
              href={`https://wa.me/${cleanPhoneForWa}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-300 border border-emerald-500/30 text-xs font-medium transition-colors"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              <span>Message on WhatsApp</span>
            </a>
          )}
        </div>

        <button
          type="button"
          onClick={onClose}
          className="px-4 py-2 rounded-lg border border-zinc-700 text-zinc-300 hover:text-white hover:bg-zinc-800 text-xs font-medium transition-colors cursor-pointer"
        >
          Close Dossier
        </button>
      </div>
    </div>
  );
}
