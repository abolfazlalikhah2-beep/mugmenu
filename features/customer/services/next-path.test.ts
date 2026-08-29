import { describe, it, expect } from "vitest";
import { resolvePostLoginPath, trackOrderHref } from "./next-path";

describe("resolvePostLoginPath", () => {
  it("returns the menu entry when next is absent", () => {
    expect(resolvePostLoginPath("demo", undefined)).toBe("/demo");
    expect(resolvePostLoginPath("demo", null)).toBe("/demo");
    expect(resolvePostLoginPath("demo", "")).toBe("/demo");
  });

  it("allows a same-business sub-path, e.g. the order tracking page", () => {
    expect(resolvePostLoginPath("demo", "/demo/account/orders/abc123")).toBe(
      "/demo/account/orders/abc123"
    );
  });

  it("allows the bare business entry path itself", () => {
    expect(resolvePostLoginPath("demo", "/demo")).toBe("/demo");
  });

  it("rejects a path scoped to a different business slug", () => {
    expect(resolvePostLoginPath("demo", "/other-business/account/orders/abc123")).toBe("/demo");
  });

  it("rejects a slug that merely starts with the same prefix (not an exact segment match)", () => {
    expect(resolvePostLoginPath("demo", "/demo-evil/account/orders/abc123")).toBe("/demo");
  });

  it("rejects an absolute/external URL (open-redirect attempt)", () => {
    expect(resolvePostLoginPath("demo", "https://evil.com")).toBe("/demo");
  });

  it("rejects a protocol-relative URL (open-redirect attempt)", () => {
    expect(resolvePostLoginPath("demo", "//evil.com")).toBe("/demo");
  });
});

describe("trackOrderHref", () => {
  it("logged-in: links straight to the order tracking page", () => {
    expect(trackOrderHref("demo", "order123", true)).toBe("/demo/account/orders/order123");
  });

  it("guest: sends to login first, with next pointing back to this exact order", () => {
    expect(trackOrderHref("demo", "order123", false)).toBe(
      "/demo/account/login?next=%2Fdemo%2Faccount%2Forders%2Forder123"
    );
  });

  it("guest: login redirect round-trips through resolvePostLoginPath back to the same order", () => {
    const href = trackOrderHref("demo", "order123", false);
    const nextParam = new URL(href, "http://example.com").searchParams.get("next");
    expect(resolvePostLoginPath("demo", nextParam)).toBe("/demo/account/orders/order123");
  });
});
