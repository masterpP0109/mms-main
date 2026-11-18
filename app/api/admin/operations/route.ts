import { z } from "zod";
import { db } from "@/lib/db";
import {
  getOperationsDashboardData,
  type LeadFunnelType,
  type OperationsQueryFilters,
} from "@/lib/admin-intelligence";
import { notifyLead, notifyLeadWhatsApp } from "@/lib/leads";
import { notifyCustomer } from "@/lib/acknowledgements";
import { eligibleEmail, recoverEmailWork } from "@/lib/email/outbox";
import { isWhatsAppOutboundConfigured } from "@/lib/env";
import { errorResponse, parseJson } from "@/lib/http";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const maxDuration = 60;

const actionSchema = z.discriminatedUnion("action", [
  z
    .object({
      action: z.literal("retry_lead"),
      leadId: z.string().min(1),
    })
    .strict(),
  z
    .object({
      action: z.literal("retry_all_pending"),
    })
    .strict(),
]);

const updateLeadSchema = z
  .object({
    leadId: z.string().min(1),
    status: z
      .enum(["new", "in_progress", "contacted", "converted", "closed"])
      .optional(),
    priority: z.enum(["urgent", "high", "normal", "low"]).optional(),
    notes: z.string().max(4000).nullable().optional(),
    assignedTo: z.string().max(120).nullable().optional(),
    markFollowedUp: z.boolean().optional(),
  })
  .strict();

const VALID_FUNNELS = new Set([
  "all",
  "conference",
  "package",
  "project_builder",
  "contact",
  "whatsapp",
]);
const VALID_DELIVERY = new Set(["all", "attention", "pending", "delivered"]);
const VALID_PERIOD = new Set(["all", "7d", "30d", "90d"]);

function parseFiltersFromUrl(url: URL): OperationsQueryFilters {
  const rawFunnel = url.searchParams.get("funnel") || "all";
  const rawDelivery = url.searchParams.get("delivery") || "all";
  const rawPeriod = url.searchParams.get("period") || "all";
  const rawSearch = url.searchParams.get("search") || "";

  return {
    funnel: VALID_FUNNELS.has(rawFunnel)
      ? (rawFunnel as LeadFunnelType | "all")
      : "all",
    delivery: VALID_DELIVERY.has(rawDelivery)
      ? (rawDelivery as OperationsQueryFilters["delivery"])
      : "all",
    period: VALID_PERIOD.has(rawPeriod)
      ? (rawPeriod as OperationsQueryFilters["period"])
      : "all",
    search: rawSearch.trim() || undefined,
  };
}

function escapeCsvCell(value: string | number | null | undefined): string {
  if (value === null || value === undefined) return "";
  const str = String(value).replace(/\r?\n/g, " ").trim();
  if (/[",]/.test(str)) {
    return `"${str.replace(/"/g, '""')}"`;
  }
  return str;
}

export async function GET(request: Request) {
  try {
    const url = new URL(request.url);
    const format = url.searchParams.get("format");
    const filters = parseFiltersFromUrl(url);
    const data = await getOperationsDashboardData(filters);

    if (format === "csv") {
      const headers = [
        "Reference",
        "Date (UTC)",
        "Funnel",
        "Client Name",
        "Organisation",
        "Org Type",
        "Email",
        "Phone",
        "Project / Package",
        "Event Date / Timeline",
        "Delegates",
        "Venue / Location",
        "Origin Path",
        "UTM Source",
        "UTM Campaign",
        "Staff Email Status",
        "Client Ack Status",
        "WhatsApp Status",
        "Message / Brief",
      ];

      const rows = data.leads.map((l) =>
        [
          l.reference,
          l.createdAt,
          l.funnelLabel,
          l.name,
          l.organisation,
          l.organisationType,
          l.email,
          l.phone,
          l.packageName || l.projectType,
          l.eventDate,
          l.delegates,
          l.venueOrLocation,
          l.originPath,
          l.utmSource,
          l.utmCampaign,
          l.emailStatus,
          l.acknowledgementStatus,
          l.whatsappStatus,
          l.message,
        ]
          .map(escapeCsvCell)
          .join(",")
      );

      const csv = [headers.join(","), ...rows].join("\n");
      return new Response(csv, {
        headers: {
          "Content-Type": "text/csv; charset=utf-8",
          "Content-Disposition": `attachment; filename="mms-enquiries-${new Date().toISOString().slice(0, 10)}.csv"`,
          "Cache-Control": "no-store",
        },
      });
    }

    return Response.json(
      {
        success: true,
        data,
      },
      {
        headers: { "Cache-Control": "no-store" },
      }
    );
  } catch (error) {
    return errorResponse(error);
  }
}

export async function POST(request: Request) {
  try {
    const body = await parseJson(request, actionSchema);
    const now = new Date();

    if (body.action === "retry_lead") {
      await recoverEmailWork(now, body.leadId);
      const outcomes = await Promise.allSettled([
        notifyLead(body.leadId),
        notifyCustomer(body.leadId),
        notifyLeadWhatsApp(body.leadId),
      ]);

      const dispatched = outcomes.filter(
        (o) => o.status === "fulfilled" && o.value === true
      ).length;

      const updatedData = await getOperationsDashboardData();
      return Response.json(
        {
          success: true,
          dispatched,
          data: updatedData,
        },
        { headers: { "Cache-Control": "no-store" } }
      );
    }

    // retry_all_pending
    await recoverEmailWork(now);
    const eligibleLeads = await db.lead.findMany({
      where: {
        source: { not: "whatsapp" },
        OR: [
          eligibleEmail("notification", now),
          eligibleEmail("acknowledgement", now),
          {
            whatsappStatus: {
              in: isWhatsAppOutboundConfigured()
                ? ["pending", "not_configured"]
                : ["pending"],
            },
          },
        ],
      },
      orderBy: { createdAt: "asc" },
      take: 5,
      select: { id: true },
    });

    let processed = 0;
    const startMs = Date.now();
    for (const lead of eligibleLeads) {
      if (Date.now() - startMs > 25_000) break;
      await Promise.allSettled([
        notifyLead(lead.id),
        notifyCustomer(lead.id),
        notifyLeadWhatsApp(lead.id),
      ]);
      processed += 1;
    }

    const updatedData = await getOperationsDashboardData();
    return Response.json(
      {
        success: true,
        processed,
        data: updatedData,
      },
      { headers: { "Cache-Control": "no-store" } }
    );
  } catch (error) {
    return errorResponse(error);
  }
}

export async function PATCH(request: Request) {
  try {
    const body = await parseJson(request, updateLeadSchema);
    const existing = await db.lead.findUnique({
      where: { id: body.leadId },
      select: { id: true },
    });

    if (!existing) {
      return Response.json(
        { success: false, error: "Lead not found in PostgreSQL" },
        { status: 404 }
      );
    }

    const updateData: {
      status?: string;
      priority?: string;
      notes?: string | null;
      assignedTo?: string | null;
      followedUpAt?: Date | null;
    } = {};

    if (body.status !== undefined) updateData.status = body.status;
    if (body.priority !== undefined) updateData.priority = body.priority;
    if (body.notes !== undefined) updateData.notes = body.notes;
    if (body.assignedTo !== undefined) updateData.assignedTo = body.assignedTo;
    if (body.markFollowedUp !== undefined) {
      updateData.followedUpAt = body.markFollowedUp ? new Date() : null;
    }

    await db.lead.update({
      where: { id: body.leadId },
      data: updateData,
    });

    const updatedData = await getOperationsDashboardData();
    return Response.json(
      {
        success: true,
        data: updatedData,
      },
      { headers: { "Cache-Control": "no-store" } }
    );
  } catch (error) {
    return errorResponse(error);
  }
}
