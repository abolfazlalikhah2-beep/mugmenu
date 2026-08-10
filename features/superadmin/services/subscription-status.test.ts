import { describe, expect, it } from "vitest";
import { computeSubscriptionStatus } from "./subscription-status";

const NOW = new Date("2026-08-10T00:00:00Z");

describe("computeSubscriptionStatus", () => {
  it("is EXPIRED once planExpiresAt has passed", () => {
    const status = computeSubscriptionStatus(
      { planExpiresAt: new Date("2026-08-09T00:00:00Z"), hasPaidTransaction: true },
      NOW
    );
    expect(status).toBe("EXPIRED");
  });

  it("is EXPIRING within the last 7 days of the cycle", () => {
    const status = computeSubscriptionStatus(
      { planExpiresAt: new Date("2026-08-14T00:00:00Z"), hasPaidTransaction: true },
      NOW
    );
    expect(status).toBe("EXPIRING");
  });

  it("is TRIAL when not expiring soon and never paid", () => {
    const status = computeSubscriptionStatus(
      { planExpiresAt: new Date("2026-09-10T00:00:00Z"), hasPaidTransaction: false },
      NOW
    );
    expect(status).toBe("TRIAL");
  });

  it("is ACTIVE when not expiring soon and has a paid transaction", () => {
    const status = computeSubscriptionStatus(
      { planExpiresAt: new Date("2026-09-10T00:00:00Z"), hasPaidTransaction: true },
      NOW
    );
    expect(status).toBe("ACTIVE");
  });

  it("treats the exact boundary (remainingMs === 0) as EXPIRED, not EXPIRING", () => {
    const status = computeSubscriptionStatus(
      { planExpiresAt: NOW, hasPaidTransaction: true },
      NOW
    );
    expect(status).toBe("EXPIRED");
  });
});
