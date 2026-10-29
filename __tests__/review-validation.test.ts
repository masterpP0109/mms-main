import { reviewSubmissionSchema, reviewModerationSchema } from "@/lib/validation/reviews";

describe("Review Validation Schema (Tally Structure)", () => {
  const validReview = {
    name: "Sarah Jenkins",
    email: "sarah.j@example.com",
    role: "Bride",
    organisation: "Jenkins Family Celebration",
    services: ["Videography", "Live Streaming", "Photography"],
    eventDate: "October 2026",
    rating: 5,
    stoodOut: "The incredible professionalism and how invisible yet attentive the crew was throughout our wedding ceremony.",
    contribution: "Gave us an emotional, cinematic archive that our entire family will treasure forever.",
    improvements: "None, it was flawless.",
    wouldRecommend: "Yes" as const,
    headline: "Unrivalled cinematography and warm, professional crew at Victoria Falls.",
    consent: true,
    attribution: "My name and organisation" as const,
  };

  it("accepts a completely valid review submission matching Tally structure", () => {
    const result = reviewSubmissionSchema.safeParse(validReview);
    expect(result.success).toBe(true);
  });

  it("accepts a review with only required fields", () => {
    const minimalReview = {
      name: "Tafadzwa Moyo",
      organisation: "Ministry of Tourism",
      email: "tafadzwa@example.org",
      services: ["Conference & Interpretation Systems"],
      rating: 4,
      stoodOut: "Sound clarity and responsive stage setup during presidential keynote.",
      headline: "Excellent AV production and dependable team.",
    };
    const result = reviewSubmissionSchema.safeParse(minimalReview);
    expect(result.success).toBe(true);
  });

  it.each([0, -1, 6, 2.5, 99])("rejects rating outside 1-5 range: %s", (rating) => {
    const result = reviewSubmissionSchema.safeParse({ ...validReview, rating });
    expect(result.success).toBe(false);
  });

  it("rejects review if services list is empty", () => {
    const result = reviewSubmissionSchema.safeParse({ ...validReview, services: [] });
    expect(result.success).toBe(false);
  });

  it("rejects review if stoodOut is missing or empty", () => {
    const result = reviewSubmissionSchema.safeParse({ ...validReview, stoodOut: "" });
    expect(result.success).toBe(false);
  });

  it("rejects review if headline is missing or empty", () => {
    const result = reviewSubmissionSchema.safeParse({ ...validReview, headline: "" });
    expect(result.success).toBe(false);
  });

  it("rejects review if honeypot website field is populated", () => {
    const result = reviewSubmissionSchema.safeParse({ ...validReview, website: "http://spambot.com" });
    expect(result.success).toBe(false);
  });

  it("rejects invalid email formats", () => {
    const result = reviewSubmissionSchema.safeParse({ ...validReview, email: "not-an-email" });
    expect(result.success).toBe(false);
  });

  it("rejects strings containing control characters", () => {
    const result = reviewSubmissionSchema.safeParse({ ...validReview, name: "Bad\x00Name" });
    expect(result.success).toBe(false);
  });

  describe("Review Moderation Schema", () => {
    it("accepts valid moderation status updates", () => {
      expect(reviewModerationSchema.safeParse({ status: "approved" }).success).toBe(true);
      expect(reviewModerationSchema.safeParse({ status: "rejected" }).success).toBe(true);
      expect(reviewModerationSchema.safeParse({ featured: true }).success).toBe(true);
      expect(reviewModerationSchema.safeParse({ verified: true, notes: "Verified against contract" }).success).toBe(true);
    });

    it("rejects invalid status", () => {
      expect(reviewModerationSchema.safeParse({ status: "unknown" }).success).toBe(false);
    });

    it("rejects empty moderation payload", () => {
      expect(reviewModerationSchema.safeParse({}).success).toBe(false);
    });
  });
});
