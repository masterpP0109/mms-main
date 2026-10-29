import "server-only";
import { Prisma } from "@prisma/client";
import { db } from "@/lib/db";
import { enforceIdentityLimit } from "@/lib/rate-limit";
import type { ReviewSubmissionInput, ReviewModerationInput } from "@/lib/validation/reviews";

export async function submitReview(input: ReviewSubmissionInput) {
  // Guard abuse via shared database rate limit bucket
  await enforceIdentityLimit(input.email);

  const review = await db.review.create({
    data: {
      name: input.name,
      email: input.email,
      role: input.role,
      organisation: input.organisation,
      service: input.service,
      eventDate: input.eventDate,
      rating: input.rating,
      headline: input.headline,
      content: input.content,
      consent: input.consent,
      status: "pending",
      featured: false,
      verified: false,
    },
  });

  return {
    id: review.id,
    reference: `REV-${review.id.slice(-6).toUpperCase()}`,
    status: review.status,
  };
}

export async function getApprovedReviews(options?: {
  service?: string;
  featuredOnly?: boolean;
  limit?: number;
}) {
  const where: Prisma.ReviewWhereInput = {
    status: "approved",
    ...(options?.service ? { service: options.service } : {}),
    ...(options?.featuredOnly ? { featured: true } : {}),
  };

  const reviews = await db.review.findMany({
    where,
    orderBy: [{ featured: "desc" }, { createdAt: "desc" }],
    take: options?.limit ?? 20,
    select: {
      id: true,
      name: true,
      role: true,
      organisation: true,
      service: true,
      eventDate: true,
      rating: true,
      headline: true,
      content: true,
      featured: true,
      verified: true,
      avatar: true,
      createdAt: true,
    },
  });

  return reviews;
}

export async function getAdminReviews(options?: {
  status?: string;
  rating?: number;
  service?: string;
  search?: string;
  take?: number;
  skip?: number;
}) {
  const where: Prisma.ReviewWhereInput = {};

  if (options?.status && options.status !== "all") {
    where.status = options.status;
  }

  if (options?.rating && options.rating > 0) {
    where.rating = options.rating;
  }

  if (options?.service && options.service !== "all") {
    where.service = options.service;
  }

  if (options?.search && options.search.trim()) {
    const query = options.search.trim();
    where.OR = [
      { name: { contains: query, mode: "insensitive" } },
      { email: { contains: query, mode: "insensitive" } },
      { organisation: { contains: query, mode: "insensitive" } },
      { headline: { contains: query, mode: "insensitive" } },
      { content: { contains: query, mode: "insensitive" } },
    ];
  }

  const take = options?.take ?? 50;
  const skip = options?.skip ?? 0;

  const [items, total] = await Promise.all([
    db.review.findMany({
      where,
      orderBy: { createdAt: "desc" },
      take,
      skip,
    }),
    db.review.count({ where }),
  ]);

  return { items, total, take, skip };
}

export async function updateReview(id: string, updates: ReviewModerationInput) {
  return db.review.update({
    where: { id },
    data: {
      ...updates,
      moderatedAt: new Date(),
    },
  });
}

export async function deleteReview(id: string) {
  return db.review.delete({
    where: { id },
  });
}

export async function getReviewMetrics() {
  const [total, pending, approved, rejected, featured, ratingStats] = await Promise.all([
    db.review.count(),
    db.review.count({ where: { status: "pending" } }),
    db.review.count({ where: { status: "approved" } }),
    db.review.count({ where: { status: "rejected" } }),
    db.review.count({ where: { featured: true } }),
    db.review.groupBy({
      by: ["rating"],
      _count: { rating: true },
    }),
  ]);

  const distribution: Record<number, number> = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
  let ratingSum = 0;
  let ratedCount = 0;

  for (const stat of ratingStats) {
    distribution[stat.rating] = stat._count.rating;
    ratingSum += stat.rating * stat._count.rating;
    ratedCount += stat._count.rating;
  }

  const averageRating = ratedCount > 0 ? Number((ratingSum / ratedCount).toFixed(1)) : 5.0;

  return {
    total,
    pending,
    approved,
    rejected,
    featured,
    averageRating,
    distribution,
  };
}
