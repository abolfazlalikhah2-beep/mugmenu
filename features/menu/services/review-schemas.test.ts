import { describe, it, expect } from "vitest";
import { submitReviewSchema, submitSurveySchema } from "./review-schemas";

describe("submitReviewSchema", () => {
  const base = { orderId: "o1", rating: 4 };

  it("accepts a minimal review (rating only)", () => {
    expect(submitReviewSchema.safeParse(base).success).toBe(true);
  });

  it("defaults productIds/tags to [] and anonymous to false", () => {
    const result = submitReviewSchema.safeParse(base);
    expect(result.success && result.data).toMatchObject({
      productIds: [],
      tags: [],
      anonymous: false,
    });
  });

  it("rejects a rating of 0", () => {
    expect(submitReviewSchema.safeParse({ ...base, rating: 0 }).success).toBe(false);
  });

  it("rejects a rating above 5", () => {
    expect(submitReviewSchema.safeParse({ ...base, rating: 6 }).success).toBe(false);
  });

  it("accepts a known tag", () => {
    expect(submitReviewSchema.safeParse({ ...base, tags: ["خوش‌طعم"] }).success).toBe(true);
  });

  it("rejects a tag outside the fixed list", () => {
    expect(submitReviewSchema.safeParse({ ...base, tags: ["not a real tag"] }).success).toBe(false);
  });

  it("rejects a comment over 500 characters", () => {
    expect(submitReviewSchema.safeParse({ ...base, comment: "a".repeat(501) }).success).toBe(false);
  });
});

describe("submitSurveySchema", () => {
  const base = { orderId: "o1", taste: "GOOD", speed: "ON_TIME", packaging: "NEAT" };

  it("accepts a complete, valid answer set", () => {
    expect(submitSurveySchema.safeParse(base).success).toBe(true);
  });

  it("rejects an unknown taste value", () => {
    expect(submitSurveySchema.safeParse({ ...base, taste: "AMAZING" }).success).toBe(false);
  });

  it("requires all three questions answered", () => {
    const { packaging, ...partial } = base;
    void packaging;
    expect(submitSurveySchema.safeParse(partial).success).toBe(false);
  });
});
