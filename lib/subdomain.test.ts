import { describe, it, expect } from "vitest";
import { extractSlugFromHost, isAppHost, buildSlugPathname } from "./subdomain";

describe("extractSlugFromHost", () => {
  it("extracts the slug from a production subdomain", () => {
    expect(extractSlugFromHost("demo.serwapp.ir", "serwapp.ir")).toBe("demo");
  });

  it("extracts the slug from a dev subdomain with a port", () => {
    expect(extractSlugFromHost("demo.localhost:3000", "localhost")).toBe("demo");
  });

  it("is case-insensitive", () => {
    expect(extractSlugFromHost("DEMO.SERWAPP.IR", "serwapp.ir")).toBe("demo");
  });

  it("returns null for the bare root domain", () => {
    expect(extractSlugFromHost("serwapp.ir", "serwapp.ir")).toBeNull();
  });

  it("returns null for the bare root domain with a port", () => {
    expect(extractSlugFromHost("serwapp.ir:3000", "serwapp.ir")).toBeNull();
  });

  it("returns null for the www alias", () => {
    expect(extractSlugFromHost("www.serwapp.ir", "serwapp.ir")).toBeNull();
  });

  it("returns null for a host that isn't a subdomain of rootDomain", () => {
    expect(extractSlugFromHost("example.com", "serwapp.ir")).toBeNull();
    expect(extractSlugFromHost("app-name.liara.run", "serwapp.ir")).toBeNull();
  });

  it("returns null for a multi-level subdomain", () => {
    expect(extractSlugFromHost("a.b.serwapp.ir", "serwapp.ir")).toBeNull();
  });

  it("returns null for empty input", () => {
    expect(extractSlugFromHost("", "serwapp.ir")).toBeNull();
  });
});

describe("isAppHost", () => {
  it("is true for the bare root domain and its www alias", () => {
    expect(isAppHost("serwapp.ir", "serwapp.ir")).toBe(true);
    expect(isAppHost("www.serwapp.ir", "serwapp.ir")).toBe(true);
  });

  it("is true for Liara's default subdomain", () => {
    expect(isAppHost("mugmenu-abc123.liara.run", "serwapp.ir")).toBe(true);
  });

  it("is true for bare localhost, with or without a port", () => {
    expect(isAppHost("localhost", "serwapp.ir")).toBe(true);
    expect(isAppHost("localhost:3000", "serwapp.ir")).toBe(true);
  });

  it("is false for a business subdomain", () => {
    expect(isAppHost("demo.serwapp.ir", "serwapp.ir")).toBe(false);
  });

  it("is false for an unrelated/custom domain", () => {
    expect(isAppHost("mycafe.com", "serwapp.ir")).toBe(false);
  });
});

describe("buildSlugPathname", () => {
  it("prefixes the root path with the slug", () => {
    expect(buildSlugPathname("/", "demo")).toBe("/demo");
  });

  it("prefixes a sub-path with the slug", () => {
    expect(buildSlugPathname("/menu", "demo")).toBe("/demo/menu");
    expect(buildSlugPathname("/item/abc123", "demo")).toBe("/demo/item/abc123");
  });

  it("passes an already slug-prefixed path through unchanged", () => {
    expect(buildSlugPathname("/demo", "demo")).toBe("/demo");
    expect(buildSlugPathname("/demo/menu", "demo")).toBe("/demo/menu");
  });

  it("does not treat a path merely starting with the slug string as prefixed", () => {
    // "/demo2" must still get prefixed to "/demo/demo2", not mistaken for "/demo" + "2"
    expect(buildSlugPathname("/demo2", "demo")).toBe("/demo/demo2");
  });
});
