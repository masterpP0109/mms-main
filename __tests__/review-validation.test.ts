import { reviewSubmissionSchema, reviewModerationSchema } from "@/lib/validation/reviews";

describe("Review Validation Schema", () => {
  const validReview = {
    name: "Sarah Jenkins",
    email: "sarah.j@example.com",
    role: "Bride",
    organisation: "Private",
    service: "Weddings & Elopements",
    eventDate: "October 2026",
    rating: 5,
    headline: "Unforgettable Wedding in Victoria Falls",
    content: "The cinematic production team captured our entire wedding celebration with absolute brilliance and elegance.",
    consent: true,
  };

  it("accepts a completely valid review submission", () => {
    const result = reviewSubmissionSchema.safeParse(validReview);
    expect(result.success).toBe(true);
  });

  it("accepts a review with only required fields", () => {
    const minimalReview = {
      name: "Tafadzwa Moyo",
      email: "tafadzwa@example.org",
      rating: 4,
      content: "Excellent sound system and responsive stage setup for our forum.",
      consent: true,
    };
    const result = reviewSubmissionSchema.safeParse(minimalReview);
    expect(result.success).toBe(true);
  });

  it.each([0, -1, 6, 2.5, 99])("rejects rating outside 1-5 range: %s", (rating) => {
    const result = reviewSubmissionSchema.safeParse({ ...validReview, rating });
    expect(result.success).toBe(false);
  });

  it("rejects review if content is too short (< 10 chars)", () => {
    const result = reviewSubmissionSchema.safeParse({ ...validReview, content: "Great!" });
    expect(result.success).toBe(false);
  });

  it("rejects review if consent is false or missing", () => {
    const result = reviewSubmissionSchema.safeParse({ ...validReview, consent: false });
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
