import { describe, it, expect } from "vitest";
import { businessInfoSchema } from "./dashboard-schemas";

const validInput = {
  name: "رستوران تست",
  phone: "09120000000",
  address: "تهران",
};

describe("businessInfoSchema customDomain", () => {
  it("normalizes a non-empty value (scheme/www/trailing-slash stripped, lowercased)", () => {
    const result = businessInfoSchema.safeParse({ ...validInput, customDomain: "https://WWW.Jalal.ir/" });
    expect(result.success).toBe(true);
    if (result.success) expect(result.data.customDomain).toBe("jalal.ir");
  });

  it("transforms an empty submission to null, not undefined — prisma.update() treats undefined as 'leave unchanged', so this is what lets clearing a previously-set customDomain actually persist", () => {
    const result = businessInfoSchema.safeParse({ ...validInput, customDomain: "" });
    expect(result.success).toBe(true);
    if (result.success) expect(result.data.customDomain).toBeNull();
  });

  it("transforms an omitted customDomain to null as well", () => {
    const result = businessInfoSchema.safeParse({ ...validInput });
    expect(result.success).toBe(true);
    if (result.success) expect(result.data.customDomain).toBeNull();
  });
});
