import { describe, it, expect } from "vitest";
import { loginSchema, registerSchema, changePasswordSchema } from "./auth-schemas";

describe("loginSchema", () => {
  it("accepts a well-formed login", () => {
    expect(loginSchema.safeParse({ phone: "0912 000 0000", password: "x" }).success).toBe(true);
  });

  it("rejects a too-short phone", () => {
    expect(loginSchema.safeParse({ phone: "0912", password: "x" }).success).toBe(false);
  });

  it("rejects an empty password", () => {
    expect(loginSchema.safeParse({ phone: "0912 000 0000", password: "" }).success).toBe(false);
  });
});

describe("registerSchema", () => {
  const base = {
    phone: "0912 000 0000",
    fullName: "علی رضایی",
    password: "abcdef",
    confirmPassword: "abcdef",
  };

  it("accepts matching passwords", () => {
    expect(registerSchema.safeParse(base).success).toBe(true);
  });

  it("rejects mismatched passwords", () => {
    const result = registerSchema.safeParse({ ...base, confirmPassword: "different" });
    expect(result.success).toBe(false);
  });

  it("rejects a password under 6 characters", () => {
    expect(
      registerSchema.safeParse({ ...base, password: "abc", confirmPassword: "abc" }).success
    ).toBe(false);
  });

  it("rejects a one-character name", () => {
    expect(registerSchema.safeParse({ ...base, fullName: "ع" }).success).toBe(false);
  });
});

describe("changePasswordSchema", () => {
  it("requires matching password + confirmation", () => {
    const result = changePasswordSchema.safeParse({
      phone: "0912 000 0000",
      password: "abcdef",
      confirmPassword: "abcdef",
    });
    expect(result.success).toBe(true);
  });

  it("rejects a mismatch", () => {
    const result = changePasswordSchema.safeParse({
      phone: "0912 000 0000",
      password: "abcdef",
      confirmPassword: "abcxyz",
    });
    expect(result.success).toBe(false);
  });
});
