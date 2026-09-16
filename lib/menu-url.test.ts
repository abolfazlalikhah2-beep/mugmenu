import { describe, it, expect } from "vitest";
import { getDefaultMenuUrl, getQrUrls } from "./menu-url";

describe("getDefaultMenuUrl", () => {
  it("builds the root-domain path URL for a slug", () => {
    expect(getDefaultMenuUrl("demo")).toBe("https://serwapp.ir/demo");
  });
});

describe("getQrUrls", () => {
  it("returns a single unlabeled entry when there's no customDomain", () => {
    expect(getQrUrls({ slug: "demo", customDomain: null })).toEqual([
      { url: "https://serwapp.ir/demo", label: null },
    ]);
  });

  it("returns a single unlabeled entry when customDomain is omitted", () => {
    expect(getQrUrls({ slug: "demo" })).toEqual([{ url: "https://serwapp.ir/demo", label: null }]);
  });

  it("adds a labeled second entry for the customDomain, and labels the default one too", () => {
    expect(getQrUrls({ slug: "demo", customDomain: "jalal.ir" })).toEqual([
      { url: "https://serwapp.ir/demo", label: "لینک پیش‌فرض" },
      { url: "https://jalal.ir", label: "دامنه اختصاصی" },
    ]);
  });
});
