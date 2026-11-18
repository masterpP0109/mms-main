import "server-only";
import type { Prisma } from "@prisma/client";
import { db } from "@/lib/db";
import { enquiryReference } from "@/lib/enquiry-reference";
import { getReviewMetrics } from "@/lib/reviews";

export type LeadFunnelType =
  | "conference"
  | "package"
  | "project_builder"
  | "contact"
  | "whatsapp";

export interface OperationsQueryFilters {
  funnel?: LeadFunnelType | "all";
  delivery?: "all" | "attention" | "pending" | "delivered";
  period?: "all" | "7d" | "30d" | "90d";
  search?: string;
}

export interface SerializedLead {
  id: string;
  reference: string;
  source: string;
  funnel: LeadFunnelType;
  funnelLabel: string;
  status: string;
  priority: string;
  name: string;
  email: string | null;
  phone: string | null;
  organisation: string | null;
  projectType: string | null;
  message: string;
  metadata: Record<string, unknown>;
  emailStatus: string;
  emailAttempts: number;
  notificationError: string | null;
  acknowledgementStatus: string;
  acknowledgementAttempts: number;
  acknowledgementError: string | null;
  whatsappStatus: string;
  whatsappAttempts: number;
  needsAttention: boolean;
  isPendingDelivery: boolean;
  eventDate: string | null;
  delegates: number | null;
  venueOrLocation: string | null;
  organisationType: string | null;
  packageId: string | null;
  packageName: string | null;
  originPath: string | null;
  utmSource: string | null;
  utmCampaign: string | null;
  notes: string | null;
  assignedTo: string | null;
  followedUpAt: string | null;
  requestedServices: string[];
  createdAt: string;
  updatedAt: string;
}

export interface ServiceDemandItem {
  service: string;
  shortName: string;
  slug: string | null;
  publishedInDb: boolean | null;
  enquiries: number;
  reviews: number;
  approvedReviews: number;
  averageRating: number | null;
  proofGap: boolean;
}

export interface UpcomingEventItem {
  leadId: string;
  reference: string;
  clientName: string;
  organisation: string | null;
  organisationType: string | null;
  funnelLabel: string;
  projectOrPackage: string;
  eventDateRaw: string;
  parsedDate: string | null;
  daysUntil: number | null;
  delegates: number | null;
  venueOrLocation: string | null;
  createdAt: string;
}

export interface TrendBucket {
  label: string;
  key: string;
  total: number;
  conference: number;
  package: number;
  project_builder: number;
  contact: number;
  whatsapp: number;
}

export interface WhatsAppThreadSummary {
  id: string;
  contactName: string;
  phone: string;
  leadId: string | null;
  leadReference: string | null;
  messageCount: number;
  lastMessageText: string | null;
  lastMessageAt: string | null;
}

export interface ConstructiveFeedbackItem {
  id: string;
  name: string;
  organisation: string | null;
  service: string | null;
  rating: number;
  status: string;
  stoodOut: string | null;
  contribution: string | null;
  improvements: string | null;
  wouldRecommend: string | null;
  consent: boolean;
  createdAt: string;
}

export interface CatalogueItemStatus {
  id: string;
  slug: string;
  title: string;
  category: string;
  published: boolean;
  hasSeo: boolean;
  hasHeroAlt: boolean;
  galleryCount: number;
  updatedAt: string;
}

export interface CatalogueHealthSummary {
  dbServicesCount: number;
  publishedServicesCount: number;
  dbProjectsCount: number;
  publishedProjectsCount: number;
  servicesMissingSeo: number;
  projectsMissingSeo: number;
  servicesMissingAlt: number;
  projectsMissingAlt: number;
  services: CatalogueItemStatus[];
  projects: CatalogueItemStatus[];
}

export interface OperationsDashboardData {
  generatedAt: string;
  leads: SerializedLead[];
  kpi: {
    totalLeads: number;
    leadsLast30d: number;
    leadsPrev30d: number;
    leadsLast7d: number;
    highIntentCount: number;
    highIntentShare: number;
    totalDelegatesRequested: number;
    upcomingEventsCount: number;
    deliverySuccessRate: number | null;
    ackSuccessRate: number | null;
    whatsappDeliveryRate: number | null;
    needsAttentionCount: number;
    pendingDeliveryCount: number;
    recommendRate: number | null;
    recommendAnsweredCount: number;
    verifiedConsentedReviews: number;
    totalWebhookEvents: number;
    totalWhatsAppMessages: number;
  };
  funnelBreakdown: {
    funnel: LeadFunnelType;
    label: string;
    description: string;
    count: number;
    share: number;
  }[];
  deliveryBreakdown: {
    staffEmail: { delivered: number; pending: number; attention: number; notRequested: number };
    clientAck: { delivered: number; pending: number; attention: number; notRequested: number };
    whatsapp: { delivered: number; pending: number; attention: number; notRequested: number };
  };
  trendSeries: TrendBucket[];
  serviceDemand: ServiceDemandItem[];
  upcomingEvents: UpcomingEventItem[];
  organisationBreakdown: { type: string; count: number; delegates: number }[];
  packageDemand: { packageName: string; category: string; count: number }[];
  originBreakdown: { path: string; count: number }[];
  campaignBreakdown: { source: string; campaign: string; count: number }[];
  reviewMetrics: Awaited<ReturnType<typeof getReviewMetrics>>;
  feedbackDigest: ConstructiveFeedbackItem[];
  whatsappThreads: WhatsAppThreadSummary[];
  catalogueHealth: CatalogueHealthSummary;
}

function formatFunnelLabel(funnel: LeadFunnelType): string {
  switch (funnel) {
    case "conference":
      return "Conference RFP";
    case "package":
      return "Signature Package";
    case "project_builder":
      return "Project Brief Builder";
    case "whatsapp":
      return "WhatsApp Inbound";
    case "contact":
      return "Direct Enquiry";
    default:
      return "Direct Enquiry";
  }
}

function classifyFunnel(
  source: string,
  projectType: string | null,
  metadata: Record<string, unknown>,
  explicitFunnel?: string | null
): {
  funnel: LeadFunnelType;
  funnelLabel: string;
} {
  if (explicitFunnel) {
    const f = explicitFunnel as LeadFunnelType;
    if (
      f === "conference" ||
      f === "package" ||
      f === "project_builder" ||
      f === "whatsapp" ||
      f === "contact"
    ) {
      return { funnel: f, funnelLabel: formatFunnelLabel(f) };
    }
  }
  if (source === "conference") {
    return { funnel: "conference", funnelLabel: "Conference RFP" };
  }
  if (source === "project_builder") {
    return { funnel: "project_builder", funnelLabel: "Project Brief Builder" };
  }
  if (source === "whatsapp") {
    return { funnel: "whatsapp", funnelLabel: "WhatsApp Inbound" };
  }
  if (
    typeof metadata.packageId === "string" ||
    projectType === "weddings" ||
    projectType === "drone" ||
    projectType === "podcasts" ||
    (typeof metadata.origin === "string" && metadata.origin.startsWith("/packages"))
  ) {
    return { funnel: "package", funnelLabel: "Signature Package" };
  }
  return { funnel: "contact", funnelLabel: "Direct Enquiry" };
}

function parseEventDateInfo(rawDate: string | null): {
  parsedDate: string | null;
  daysUntil: number | null;
} {
  if (!rawDate) return { parsedDate: null, daysUntil: null };
  const trimmed = rawDate.trim();
  const parsed = new Date(trimmed);
  if (Number.isNaN(parsed.getTime())) {
    return { parsedDate: null, daysUntil: null };
  }
  const now = new Date();
  const diffMs = parsed.getTime() - now.getTime();
  const daysUntil = Math.ceil(diffMs / (1000 * 60 * 60 * 24));
  return {
    parsedDate: parsed.toISOString().slice(0, 10),
    daysUntil,
  };
}

function normalizeServiceKey(label: string): string {
  return label.trim().toLowerCase().replace(/[^a-z0-9]+/g, " ").trim();
}

export async function getOperationsDashboardData(
  filters?: OperationsQueryFilters
): Promise<OperationsDashboardData> {
  const now = new Date();
  const d7Ago = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
  const d30Ago = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
  const d60Ago = new Date(now.getTime() - 60 * 24 * 60 * 60 * 1000);
  const d90Ago = new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000);

  // Build optional Prisma where clause if backend filters are passed
  const leadWhere: Prisma.LeadWhereInput = {};
  if (filters?.period && filters.period !== "all") {
    const cutoff =
      filters.period === "7d" ? d7Ago : filters.period === "30d" ? d30Ago : d90Ago;
    leadWhere.createdAt = { gte: cutoff };
  }
  if (filters?.search && filters.search.trim()) {
    const q = filters.search.trim();
    leadWhere.OR = [
      { id: { contains: q, mode: "insensitive" } },
      { name: { contains: q, mode: "insensitive" } },
      { email: { contains: q, mode: "insensitive" } },
      { phone: { contains: q, mode: "insensitive" } },
      { organisation: { contains: q, mode: "insensitive" } },
      { projectType: { contains: q, mode: "insensitive" } },
      { message: { contains: q, mode: "insensitive" } },
    ];
  }

  const [
    totalLeadsInDb,
    leadsLast7dInDb,
    leadsLast30dInDb,
    leadsPrev30dInDb,
    emailStatusGroups,
    ackStatusGroups,
    waStatusGroups,
    allLeadsForAnalytics,
    filteredRawLeads,
    reviewMetrics,
    rawReviews,
    rawConversations,
    totalWebhookEvents,
    totalWhatsAppMessages,
    dbServices,
    dbProjects,
  ] = await Promise.all([
    db.lead.count(),
    db.lead.count({ where: { createdAt: { gte: d7Ago } } }),
    db.lead.count({ where: { createdAt: { gte: d30Ago } } }),
    db.lead.count({ where: { createdAt: { gte: d60Ago, lt: d30Ago } } }),
    db.lead.groupBy({ by: ["emailStatus"], _count: { _all: true } }),
    db.lead.groupBy({ by: ["acknowledgementStatus"], _count: { _all: true } }),
    db.lead.groupBy({ by: ["whatsappStatus"], _count: { _all: true } }),
    db.lead.findMany({
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        source: true,
        funnel: true,
        status: true,
        priority: true,
        name: true,
        organisation: true,
        organisationType: true,
        projectType: true,
        eventDate: true,
        venue: true,
        delegates: true,
        packageId: true,
        packageName: true,
        services: true,
        originPath: true,
        utmSource: true,
        utmMedium: true,
        utmCampaign: true,
        notes: true,
        assignedTo: true,
        followedUpAt: true,
        message: true,
        metadata: true,
        emailStatus: true,
        acknowledgementStatus: true,
        whatsappStatus: true,
        createdAt: true,
      },
    }),
    db.lead.findMany({
      where: leadWhere,
      orderBy: { createdAt: "desc" },
    }),
    getReviewMetrics(),
    db.review.findMany({
      orderBy: { createdAt: "desc" },
    }),
    db.conversation.findMany({
      include: {
        contact: true,
        messages: {
          orderBy: { receivedAt: "desc" },
          take: 1,
        },
        _count: {
          select: { messages: true },
        },
      },
      orderBy: { id: "desc" },
    }),
    db.webhookEvent.count(),
    db.message.count(),
    db.service.findMany({
      orderBy: [{ sortOrder: "asc" }, { title: "asc" }],
      select: {
        id: true,
        slug: true,
        title: true,
        category: true,
        published: true,
        seoTitle: true,
        seoDescription: true,
        heroAlt: true,
        gallery: true,
        updatedAt: true,
      },
    }),
    db.project.findMany({
      orderBy: [{ sortOrder: "asc" }, { title: "asc" }],
      select: {
        id: true,
        slug: true,
        title: true,
        category: true,
        published: true,
        seoTitle: true,
        seoDescription: true,
        heroAlt: true,
        gallery: true,
        updatedAt: true,
      },
    }),
  ]);

  // 1. Authoritative Outbox Status Breakdown from DB groupBy
  const staffEmailStats = { delivered: 0, pending: 0, attention: 0, notRequested: 0 };
  for (const g of emailStatusGroups) {
    const c = g._count._all;
    if (g.emailStatus === "not_requested") staffEmailStats.notRequested += c;
    else if (["accepted", "sent"].includes(g.emailStatus)) staffEmailStats.delivered += c;
    else if (["reconciliation_required", "failed"].includes(g.emailStatus))
      staffEmailStats.attention += c;
    else staffEmailStats.pending += c;
  }

  const clientAckStats = { delivered: 0, pending: 0, attention: 0, notRequested: 0 };
  for (const g of ackStatusGroups) {
    const c = g._count._all;
    if (g.acknowledgementStatus === "not_requested") clientAckStats.notRequested += c;
    else if (["accepted", "sent"].includes(g.acknowledgementStatus)) clientAckStats.delivered += c;
    else if (["reconciliation_required", "failed"].includes(g.acknowledgementStatus))
      clientAckStats.attention += c;
    else clientAckStats.pending += c;
  }

  const whatsappStats = { delivered: 0, pending: 0, attention: 0, notRequested: 0 };
  for (const g of waStatusGroups) {
    const c = g._count._all;
    if (g.whatsappStatus === "not_requested" || g.whatsappStatus === "not_configured") {
      whatsappStats.notRequested += c;
    } else if (["accepted", "sent", "delivered", "read", "received"].includes(g.whatsappStatus)) {
      whatsappStats.delivered += c;
    } else if (["reconciliation_required", "failed"].includes(g.whatsappStatus)) {
      whatsappStats.attention += c;
    } else {
      whatsappStats.pending += c;
    }
  }

  // 2. Build dynamic service registry from authoritative PostgreSQL `Service` rows
  // plus any actual services/projectTypes referenced in `Lead` and `Review` rows.
  const serviceMap = new Map<
    string,
    {
      service: string;
      shortName: string;
      slug: string | null;
      publishedInDb: boolean | null;
      enquiries: number;
      reviews: number;
      approvedReviews: number;
      ratingSum: number;
    }
  >();

  const ensureServiceBucket = (
    title: string,
    opts?: { slug?: string | null; published?: boolean | null }
  ) => {
    const cleanTitle = title.trim();
    const key = normalizeServiceKey(cleanTitle);
    if (!key) return null;

    // Check if an existing bucket matches closely
    for (const [existingKey, bucket] of serviceMap.entries()) {
      if (
        existingKey === key ||
        (existingKey.length > 5 && key.includes(existingKey)) ||
        (key.length > 5 && existingKey.includes(key))
      ) {
        return bucket;
      }
    }

    const newBucket = {
      service: cleanTitle,
      shortName: cleanTitle.length > 34 ? `${cleanTitle.slice(0, 32)}…` : cleanTitle,
      slug: opts?.slug ?? null,
      publishedInDb: opts?.published ?? null,
      enquiries: 0,
      reviews: 0,
      approvedReviews: 0,
      ratingSum: 0,
    };
    serviceMap.set(key, newBucket);
    return newBucket;
  };

  // Seed buckets from PostgreSQL `Service` table
  for (const s of dbServices) {
    ensureServiceBucket(s.title, { slug: s.slug, published: s.published });
  }

  // 3. Aggregate funnel counts, trends, upcoming events, organisations, packages, origins, and campaigns across all leads in DB
  const funnelCounts: Record<LeadFunnelType, number> = {
    conference: 0,
    package: 0,
    project_builder: 0,
    contact: 0,
    whatsapp: 0,
  };

  const orgMap = new Map<string, { count: number; delegates: number }>();
  const packageMap = new Map<string, { packageName: string; category: string; count: number }>();
  const originMap = new Map<string, number>();
  const campaignMap = new Map<string, { source: string; campaign: string; count: number }>();

  let totalDelegatesRequested = 0;
  let needsAttentionCount = 0;
  let pendingDeliveryCount = 0;
  const upcomingEvents: UpcomingEventItem[] = [];

  const trendMap = new Map<string, TrendBucket>();
  for (let i = 5; i >= 0; i--) {
    const d = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth() - i, 1));
    const key = `${d.getUTCFullYear()}-${String(d.getUTCMonth() + 1).padStart(2, "0")}`;
    const label = d.toLocaleDateString("en-US", {
      month: "short",
      year: "2-digit",
      timeZone: "UTC",
    });
    trendMap.set(key, {
      label,
      key,
      total: 0,
      conference: 0,
      package: 0,
      project_builder: 0,
      contact: 0,
      whatsapp: 0,
    });
  }

  for (const lead of allLeadsForAnalytics) {
    const meta =
      lead.metadata && typeof lead.metadata === "object" && !Array.isArray(lead.metadata)
        ? (lead.metadata as Record<string, unknown>)
        : {};

    const { funnel, funnelLabel } = classifyFunnel(
      lead.source,
      lead.projectType,
      meta,
      lead.funnel
    );
    funnelCounts[funnel] += 1;

    const d = new Date(lead.createdAt);
    const monthKey = `${d.getUTCFullYear()}-${String(d.getUTCMonth() + 1).padStart(2, "0")}`;
    const tBucket = trendMap.get(monthKey);
    if (tBucket) {
      tBucket.total += 1;
      tBucket[funnel] += 1;
    }

    const emailAttention = ["reconciliation_required", "failed"].includes(lead.emailStatus);
    const ackAttention = ["reconciliation_required", "failed"].includes(lead.acknowledgementStatus);
    const waAttention = ["reconciliation_required", "failed"].includes(lead.whatsappStatus);

    const emailPending = ["pending", "sending", "retry_required"].includes(lead.emailStatus);
    const ackPending = ["pending", "sending", "retry_required"].includes(lead.acknowledgementStatus);
    const waPending = ["pending", "sending"].includes(lead.whatsappStatus);

    if (emailAttention || ackAttention || waAttention) needsAttentionCount += 1;
    if (emailPending || ackPending || waPending) pendingDeliveryCount += 1;

    const eventDate =
      (lead.eventDate && lead.eventDate.trim()) ||
      (typeof meta.date === "string" && meta.date.trim()
        ? meta.date.trim()
        : typeof meta.timeline === "string" && meta.timeline.trim()
        ? meta.timeline.trim()
        : null);

    const delegates =
      typeof lead.delegates === "number" && lead.delegates > 0
        ? lead.delegates
        : typeof meta.delegates === "number" && meta.delegates > 0
        ? meta.delegates
        : typeof meta.delegates === "string" && Number(meta.delegates) > 0
        ? Number(meta.delegates)
        : null;

    if (delegates) totalDelegatesRequested += delegates;

    const venueOrLocation =
      (lead.venue && lead.venue.trim()) ||
      (typeof meta.venue === "string" && meta.venue.trim()
        ? meta.venue.trim()
        : typeof meta.location === "string" && meta.location.trim()
        ? meta.location.trim()
        : null);

    const organisationType =
      (lead.organisationType && lead.organisationType.trim()) ||
      (typeof meta.organisationType === "string" && meta.organisationType.trim()
        ? meta.organisationType.trim()
        : null);

    if (organisationType) {
      const existing = orgMap.get(organisationType) ?? { count: 0, delegates: 0 };
      existing.count += 1;
      existing.delegates += delegates ?? 0;
      orgMap.set(organisationType, existing);
    }

    const packageName =
      (lead.packageName && lead.packageName.trim()) ||
      (lead.packageId && lead.packageId.trim()) ||
      (typeof meta.packageName === "string" && meta.packageName.trim()
        ? meta.packageName.trim()
        : typeof meta.packageId === "string" && meta.packageId.trim()
        ? meta.packageId.trim()
        : null);

    if (funnel === "package" && packageName) {
      const cat = lead.projectType || "package";
      const key = `${cat}::${packageName}`;
      const existing = packageMap.get(key) ?? { packageName, category: cat, count: 0 };
      existing.count += 1;
      packageMap.set(key, existing);
    }

    const originPath =
      (lead.originPath && lead.originPath.trim()) ||
      (typeof meta.origin === "string" && meta.origin.trim()
        ? meta.origin.trim()
        : typeof meta.landingPage === "string" && meta.landingPage.trim()
        ? meta.landingPage.trim()
        : null);

    if (originPath) {
      originMap.set(originPath, (originMap.get(originPath) ?? 0) + 1);
    }

    const utmSource =
      (lead.utmSource && lead.utmSource.trim()) ||
      (typeof meta.utm_source === "string" && meta.utm_source.trim()
        ? meta.utm_source.trim()
        : null);
    const utmCampaign =
      (lead.utmCampaign && lead.utmCampaign.trim()) ||
      (typeof meta.utm_campaign === "string" && meta.utm_campaign.trim()
        ? meta.utm_campaign.trim()
        : null);

    if (utmSource || utmCampaign) {
      const src = utmSource || "(not set)";
      const cmp = utmCampaign || "(not set)";
      const cKey = `${src}::${cmp}`;
      const existing = campaignMap.get(cKey) ?? { source: src, campaign: cmp, count: 0 };
      existing.count += 1;
      campaignMap.set(cKey, existing);
    }

    // Attribute service demand strictly from real fields on the lead record
    const explicitServices: string[] = [];
    if (Array.isArray(lead.services) && lead.services.length > 0) {
      for (const s of lead.services) {
        if (typeof s === "string" && s.trim()) explicitServices.push(s.trim());
      }
    }
    if (explicitServices.length === 0) {
      if (typeof meta.service === "string" && meta.service.trim()) {
        explicitServices.push(meta.service.trim());
      }
      if (Array.isArray(meta.services)) {
        for (const s of meta.services) {
          if (typeof s === "string" && s.trim()) explicitServices.push(s.trim());
        }
      }
      if (explicitServices.length === 0 && lead.projectType?.trim()) {
        explicitServices.push(lead.projectType.trim());
      }
    }

    const creditedBuckets = new Set<string>();
    for (const srvName of explicitServices) {
      const bucket = ensureServiceBucket(srvName);
      if (bucket && !creditedBuckets.has(bucket.service)) {
        bucket.enquiries += 1;
        creditedBuckets.add(bucket.service);
      }
    }

    if (eventDate) {
      const { parsedDate, daysUntil } = parseEventDateInfo(eventDate);
      if (daysUntil === null || daysUntil >= -7) {
        upcomingEvents.push({
          leadId: lead.id,
          reference: enquiryReference(lead.id),
          clientName: lead.name,
          organisation: lead.organisation,
          organisationType,
          funnelLabel,
          projectOrPackage:
            packageName ||
            (typeof meta.service === "string" ? meta.service : null) ||
            lead.projectType ||
            funnelLabel,
          eventDateRaw: eventDate,
          parsedDate,
          daysUntil,
          delegates,
          venueOrLocation,
          createdAt: lead.createdAt.toISOString(),
        });
      }
    }
  }

  upcomingEvents.sort((a, b) => {
    if (a.daysUntil !== null && b.daysUntil !== null) {
      return a.daysUntil - b.daysUntil;
    }
    if (a.daysUntil !== null) return -1;
    if (b.daysUntil !== null) return 1;
    return b.createdAt.localeCompare(a.createdAt);
  });

  // 4. Serialize leads and apply any funnel/delivery filter
  const serializedLeads: SerializedLead[] = [];
  for (const lead of filteredRawLeads) {
    const meta =
      lead.metadata && typeof lead.metadata === "object" && !Array.isArray(lead.metadata)
        ? (lead.metadata as Record<string, unknown>)
        : {};

    const { funnel, funnelLabel } = classifyFunnel(
      lead.source,
      lead.projectType,
      meta,
      lead.funnel
    );

    if (filters?.funnel && filters.funnel !== "all" && funnel !== filters.funnel) {
      continue;
    }

    const emailAttention = ["reconciliation_required", "failed"].includes(lead.emailStatus);
    const ackAttention = ["reconciliation_required", "failed"].includes(lead.acknowledgementStatus);
    const waAttention = ["reconciliation_required", "failed"].includes(lead.whatsappStatus);

    const emailPending = ["pending", "sending", "retry_required"].includes(lead.emailStatus);
    const ackPending = ["pending", "sending", "retry_required"].includes(lead.acknowledgementStatus);
    const waPending = ["pending", "sending"].includes(lead.whatsappStatus);

    const needsAttention = emailAttention || ackAttention || waAttention;
    const isPendingDelivery = emailPending || ackPending || waPending;

    if (filters?.delivery === "attention" && !needsAttention) continue;
    if (filters?.delivery === "pending" && !isPendingDelivery) continue;
    if (filters?.delivery === "delivered" && (needsAttention || isPendingDelivery)) continue;

    const eventDate =
      (lead.eventDate && lead.eventDate.trim()) ||
      (typeof meta.date === "string" && meta.date.trim()
        ? meta.date.trim()
        : typeof meta.timeline === "string" && meta.timeline.trim()
        ? meta.timeline.trim()
        : null);

    const delegates =
      typeof lead.delegates === "number" && lead.delegates > 0
        ? lead.delegates
        : typeof meta.delegates === "number" && meta.delegates > 0
        ? meta.delegates
        : typeof meta.delegates === "string" && Number(meta.delegates) > 0
        ? Number(meta.delegates)
        : null;

    const venueOrLocation =
      (lead.venue && lead.venue.trim()) ||
      (typeof meta.venue === "string" && meta.venue.trim()
        ? meta.venue.trim()
        : typeof meta.location === "string" && meta.location.trim()
        ? meta.location.trim()
        : null);

    const organisationType =
      (lead.organisationType && lead.organisationType.trim()) ||
      (typeof meta.organisationType === "string" && meta.organisationType.trim()
        ? meta.organisationType.trim()
        : null);

    const packageName =
      (lead.packageName && lead.packageName.trim()) ||
      (lead.packageId && lead.packageId.trim()) ||
      (typeof meta.packageName === "string" && meta.packageName.trim()
        ? meta.packageName.trim()
        : typeof meta.packageId === "string" && meta.packageId.trim()
        ? meta.packageId.trim()
        : null);

    const originPath =
      (lead.originPath && lead.originPath.trim()) ||
      (typeof meta.origin === "string" && meta.origin.trim()
        ? meta.origin.trim()
        : typeof meta.landingPage === "string" && meta.landingPage.trim()
        ? meta.landingPage.trim()
        : null);

    const utmSource =
      (lead.utmSource && lead.utmSource.trim()) ||
      (typeof meta.utm_source === "string" && meta.utm_source.trim()
        ? meta.utm_source.trim()
        : null);
    const utmCampaign =
      (lead.utmCampaign && lead.utmCampaign.trim()) ||
      (typeof meta.utm_campaign === "string" && meta.utm_campaign.trim()
        ? meta.utm_campaign.trim()
        : null);

    const explicitServices: string[] = [];
    if (Array.isArray(lead.services) && lead.services.length > 0) {
      for (const s of lead.services) {
        if (typeof s === "string" && s.trim()) explicitServices.push(s.trim());
      }
    }
    if (explicitServices.length === 0) {
      if (typeof meta.service === "string" && meta.service.trim()) {
        explicitServices.push(meta.service.trim());
      }
      if (Array.isArray(meta.services)) {
        for (const s of meta.services) {
          if (typeof s === "string" && s.trim()) explicitServices.push(s.trim());
        }
      }
    }

    serializedLeads.push({
      id: lead.id,
      reference: enquiryReference(lead.id),
      source: lead.source,
      funnel,
      funnelLabel,
      status: lead.status || "new",
      priority: lead.priority || "normal",
      name: lead.name,
      email: lead.email,
      phone: lead.phone,
      organisation: lead.organisation,
      projectType: lead.projectType,
      message: lead.message,
      metadata: meta,
      emailStatus: lead.emailStatus,
      emailAttempts: lead.emailAttempts,
      notificationError: lead.notificationError,
      acknowledgementStatus: lead.acknowledgementStatus,
      acknowledgementAttempts: lead.acknowledgementAttempts,
      acknowledgementError: lead.acknowledgementError,
      whatsappStatus: lead.whatsappStatus,
      whatsappAttempts: lead.whatsappAttempts,
      needsAttention,
      isPendingDelivery,
      eventDate,
      delegates,
      venueOrLocation,
      organisationType,
      packageId: lead.packageId ?? (typeof meta.packageId === "string" ? meta.packageId : null),
      packageName,
      originPath,
      utmSource,
      utmCampaign,
      notes: lead.notes ?? null,
      assignedTo: lead.assignedTo ?? null,
      followedUpAt: lead.followedUpAt ? lead.followedUpAt.toISOString() : null,
      requestedServices:
        explicitServices.length > 0
          ? explicitServices
          : lead.projectType
          ? [lead.projectType]
          : [],
      createdAt: lead.createdAt.toISOString(),
      updatedAt: lead.updatedAt.toISOString(),
    });
  }

  // 5. Aggregate Reviews & Constructive Feedback from PostgreSQL `Review` rows
  let positiveRecommendCount = 0;
  let recommendAnsweredCount = 0;
  let verifiedConsentedReviews = 0;
  const feedbackDigest: ConstructiveFeedbackItem[] = [];

  for (const rev of rawReviews) {
    if (rev.verified && rev.consent && rev.status === "approved") {
      verifiedConsentedReviews += 1;
    }

    if (rev.wouldRecommend && rev.wouldRecommend.trim()) {
      recommendAnsweredCount += 1;
      const lower = rev.wouldRecommend.toLowerCase();
      if (lower.includes("yes") || lower.includes("definitely") || lower.includes("absolutely")) {
        positiveRecommendCount += 1;
      }
    }

    const revMeta =
      rev.metadata && typeof rev.metadata === "object" && !Array.isArray(rev.metadata)
        ? (rev.metadata as Record<string, unknown>)
        : {};

    const stoodOut =
      (rev.stoodOut && rev.stoodOut.trim()) ||
      (typeof revMeta.stoodOut === "string" && revMeta.stoodOut.trim()
        ? revMeta.stoodOut.trim()
        : null);
    const contribution =
      (rev.contribution && rev.contribution.trim()) ||
      (typeof revMeta.contribution === "string" && revMeta.contribution.trim()
        ? revMeta.contribution.trim()
        : null);
    const improvements =
      (rev.improvements && rev.improvements.trim()) ||
      (typeof revMeta.improvements === "string" && revMeta.improvements.trim()
        ? revMeta.improvements.trim()
        : null);

    if (improvements || stoodOut || contribution) {
      feedbackDigest.push({
        id: rev.id,
        name: rev.name,
        organisation: rev.organisation,
        service: rev.service,
        rating: rev.rating,
        status: rev.status,
        stoodOut,
        contribution,
        improvements,
        wouldRecommend: rev.wouldRecommend,
        consent: rev.consent,
        createdAt: rev.createdAt.toISOString(),
      });
    }

    const revServiceNames: string[] = [];
    if (Array.isArray(rev.services) && rev.services.length > 0) {
      for (const s of rev.services) {
        if (typeof s === "string" && s.trim()) revServiceNames.push(s.trim());
      }
    } else if (rev.service?.trim()) {
      for (const part of rev.service.split(",")) {
        if (part.trim()) revServiceNames.push(part.trim());
      }
    }

    const creditedRevBuckets = new Set<string>();
    for (const sName of revServiceNames) {
      const bucket = ensureServiceBucket(sName);
      if (bucket && !creditedRevBuckets.has(bucket.service)) {
        bucket.reviews += 1;
        if (rev.status === "approved") bucket.approvedReviews += 1;
        bucket.ratingSum += rev.rating;
        creditedRevBuckets.add(bucket.service);
      }
    }
  }

  const serviceDemand: ServiceDemandItem[] = Array.from(serviceMap.values())
    .map((b) => ({
      service: b.service,
      shortName: b.shortName,
      slug: b.slug,
      publishedInDb: b.publishedInDb,
      enquiries: b.enquiries,
      reviews: b.reviews,
      approvedReviews: b.approvedReviews,
      averageRating: b.reviews > 0 ? Number((b.ratingSum / b.reviews).toFixed(1)) : null,
      proofGap: b.enquiries > 0 && b.approvedReviews === 0,
    }))
    .sort((a, b) => b.enquiries + b.reviews - (a.enquiries + a.reviews));

  const highIntentCount =
    funnelCounts.conference + funnelCounts.package + funnelCounts.project_builder;
  const highIntentShare =
    totalLeadsInDb > 0 ? Math.round((highIntentCount / totalLeadsInDb) * 100) : 0;

  const eligibleStaffEmailTotal =
    staffEmailStats.delivered + staffEmailStats.pending + staffEmailStats.attention;
  const deliverySuccessRate =
    eligibleStaffEmailTotal > 0
      ? Math.round((staffEmailStats.delivered / eligibleStaffEmailTotal) * 100)
      : null;

  const eligibleAckTotal =
    clientAckStats.delivered + clientAckStats.pending + clientAckStats.attention;
  const ackSuccessRate =
    eligibleAckTotal > 0
      ? Math.round((clientAckStats.delivered / eligibleAckTotal) * 100)
      : null;

  const eligibleWaTotal =
    whatsappStats.delivered + whatsappStats.pending + whatsappStats.attention;
  const whatsappDeliveryRate =
    eligibleWaTotal > 0
      ? Math.round((whatsappStats.delivered / eligibleWaTotal) * 100)
      : null;

  const recommendRate =
    recommendAnsweredCount > 0
      ? Math.round((positiveRecommendCount / recommendAnsweredCount) * 100)
      : null;

  const funnelBreakdown: OperationsDashboardData["funnelBreakdown"] = [
    {
      funnel: "conference",
      label: "Conference Production RFPs",
      description: "Institutional, NGO, Government & corporate summit briefs (/conference-production)",
      count: funnelCounts.conference,
      share: totalLeadsInDb > 0 ? Math.round((funnelCounts.conference / totalLeadsInDb) * 100) : 0,
    },
    {
      funnel: "package",
      label: "Signature Package Enquiries",
      description: "Weddings, Drone Cinematography & Podcast production options (/packages/*)",
      count: funnelCounts.package,
      share: totalLeadsInDb > 0 ? Math.round((funnelCounts.package / totalLeadsInDb) * 100) : 0,
    },
    {
      funnel: "project_builder",
      label: "Project Brief Builder",
      description: "Interactive homepage multi-step project scope builder",
      count: funnelCounts.project_builder,
      share:
        totalLeadsInDb > 0
          ? Math.round((funnelCounts.project_builder / totalLeadsInDb) * 100)
          : 0,
    },
    {
      funnel: "contact",
      label: "Direct Contact & Services",
      description: "Service page referrals & general contact form submissions (/contact)",
      count: funnelCounts.contact,
      share: totalLeadsInDb > 0 ? Math.round((funnelCounts.contact / totalLeadsInDb) * 100) : 0,
    },
    {
      funnel: "whatsapp",
      label: "WhatsApp Business Threads",
      description: "Direct inbound WhatsApp messages via Meta webhook",
      count: funnelCounts.whatsapp,
      share: totalLeadsInDb > 0 ? Math.round((funnelCounts.whatsapp / totalLeadsInDb) * 100) : 0,
    },
  ];

  const whatsappThreads: WhatsAppThreadSummary[] = rawConversations
    .map((conv) => {
      const lastMsg = conv.messages[0];
      return {
        id: conv.id,
        contactName: conv.contact.name,
        phone: conv.contact.phone,
        leadId: conv.leadId,
        leadReference: conv.leadId ? enquiryReference(conv.leadId) : null,
        messageCount: conv._count.messages,
        lastMessageText: lastMsg?.text ?? null,
        lastMessageAt: lastMsg ? lastMsg.receivedAt.toISOString() : null,
      };
    })
    .sort((a, b) => (b.lastMessageAt ?? "").localeCompare(a.lastMessageAt ?? ""));

  const catalogueHealth: CatalogueHealthSummary = {
    dbServicesCount: dbServices.length,
    publishedServicesCount: dbServices.filter((s) => s.published).length,
    dbProjectsCount: dbProjects.length,
    publishedProjectsCount: dbProjects.filter((p) => p.published).length,
    servicesMissingSeo: dbServices.filter((s) => !s.seoTitle || !s.seoDescription).length,
    projectsMissingSeo: dbProjects.filter((p) => !p.seoTitle || !p.seoDescription).length,
    servicesMissingAlt: dbServices.filter((s) => !s.heroAlt).length,
    projectsMissingAlt: dbProjects.filter((p) => !p.heroAlt).length,
    services: dbServices.map((s) => ({
      id: s.id,
      slug: s.slug,
      title: s.title,
      category: s.category,
      published: s.published,
      hasSeo: Boolean(s.seoTitle && s.seoDescription),
      hasHeroAlt: Boolean(s.heroAlt),
      galleryCount: Array.isArray(s.gallery) ? s.gallery.length : 0,
      updatedAt: s.updatedAt.toISOString(),
    })),
    projects: dbProjects.map((p) => ({
      id: p.id,
      slug: p.slug,
      title: p.title,
      category: p.category,
      published: p.published,
      hasSeo: Boolean(p.seoTitle && p.seoDescription),
      hasHeroAlt: Boolean(p.heroAlt),
      galleryCount: Array.isArray(p.gallery) ? p.gallery.length : 0,
      updatedAt: p.updatedAt.toISOString(),
    })),
  };

  return {
    generatedAt: now.toISOString(),
    leads: serializedLeads,
    kpi: {
      totalLeads: totalLeadsInDb,
      leadsLast30d: leadsLast30dInDb,
      leadsPrev30d: leadsPrev30dInDb,
      leadsLast7d: leadsLast7dInDb,
      highIntentCount,
      highIntentShare,
      totalDelegatesRequested,
      upcomingEventsCount: upcomingEvents.length,
      deliverySuccessRate,
      ackSuccessRate,
      whatsappDeliveryRate,
      needsAttentionCount,
      pendingDeliveryCount,
      recommendRate,
      recommendAnsweredCount,
      verifiedConsentedReviews,
      totalWebhookEvents,
      totalWhatsAppMessages,
    },
    funnelBreakdown,
    deliveryBreakdown: {
      staffEmail: staffEmailStats,
      clientAck: clientAckStats,
      whatsapp: whatsappStats,
    },
    trendSeries: Array.from(trendMap.values()),
    serviceDemand,
    upcomingEvents: upcomingEvents.slice(0, 12),
    organisationBreakdown: Array.from(orgMap.entries())
      .map(([type, val]) => ({ type, ...val }))
      .sort((a, b) => b.count - a.count),
    packageDemand: Array.from(packageMap.values()).sort((a, b) => b.count - a.count),
    originBreakdown: Array.from(originMap.entries())
      .map(([path, count]) => ({ path, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 10),
    campaignBreakdown: Array.from(campaignMap.values()).sort((a, b) => b.count - a.count),
    reviewMetrics,
    feedbackDigest: feedbackDigest.slice(0, 20),
    whatsappThreads,
    catalogueHealth,
  };
}
