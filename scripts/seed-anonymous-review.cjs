/* eslint-disable @typescript-eslint/no-require-imports */
require("./server-bootstrap.cjs");
const { PrismaClient } = require("@prisma/client");
const { securePostgresUrl } = require("../lib/postgres-url.ts");

async function main() {
  if (!process.env.DATABASE_URL) {
    throw new Error("DATABASE_URL is not configured");
  }

  const url = securePostgresUrl(process.env.DATABASE_URL);
  const db = new PrismaClient({ datasources: { db: { url } } });

  try {
    const existing = await db.review.findFirst({
      where: { email: "ttmapfudza@gmail.com" },
    });

    const reviewData = {
      name: "Anonymous Client",
      email: "ttmapfudza@gmail.com",
      role: "Conference Organizer",
      organisation: null,
      service: "Videography, DJ & Lighting, Audio Solutions",
      services: ["Videography", "DJ & Lighting", "Audio Solutions"],
      eventDate: "2026",
      rating: 5,
      headline: "Professional and second to none",
      content:
        "Professional and second to none. Our conference was transformed totally. What stood out most: professional team, technically sound, and good communicators.",
      status: "approved",
      featured: true,
      verified: true,
      consent: true,
      wouldRecommend: "Yes",
      attribution: "Anonymous client",
      avatar: null,
      notes:
        "Client feedback submission from Tinashe Terence Mapfudza (SAPUG Zimbabwe, ttmapfudza@gmail.com). Client selected private feedback in form; approved and featured as anonymous client per team direction.",
      metadata: {
        stoodOut: "Professional team\nTechnically sound\nGood communicators",
        contribution: "Our conference was transformed totally",
        improvements: "Maybe next time we do live stream and have the photobooths",
        servicesList: ["Videography", "DJ & Lighting", "Audio Solutions"],
        submissionSource: "Tally Form (Your Experience Matters | Mosi Media Solutions)",
        originalSubmission: {
          fullName: "Tinashe Terence Mapfudza",
          organisation: "SAPUG Zimbabwe",
          email: "ttmapfudza@gmail.com",
          services: ["Videography", "DJ & Lighting", "Audio Solutions"],
          overallRating: 5,
          permissionChoice: "No, please keep my feedback private.",
        },
        featuredAnonymously: true,
      },
      moderatedAt: new Date(),
      moderatedBy: "Operations Team",
    };

    let result;
    if (existing) {
      result = await db.review.update({
        where: { id: existing.id },
        data: reviewData,
      });
      console.log(JSON.stringify({ action: "updated", id: result.id, name: result.name, status: result.status, featured: result.featured }));
    } else {
      result = await db.review.create({
        data: reviewData,
      });
      console.log(JSON.stringify({ action: "created", id: result.id, name: result.name, status: result.status, featured: result.featured }));
    }
  } finally {
    await db.$disconnect();
  }
}

main().catch((err) => {
  console.error("Failed to seed review:", err);
  process.exitCode = 1;
});
