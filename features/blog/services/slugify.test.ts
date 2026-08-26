import { describe, expect, it } from "vitest";
import { slugify } from "@/features/blog/services/slugify";

describe("slugify", () => {
  it("replaces spaces with dashes and keeps Persian letters", () => {
    expect(slugify("چرا رستوران شما به منوی QR نیاز دارد؟")).toBe("چرا-رستوران-شما-به-منوی-qr-نیاز-دارد");
  });

  it("drops ZWNJ instead of treating it as a word separator", () => {
    expect(slugify("می‌شود")).toBe("میشود");
  });

  it("collapses repeated separators and trims leading/trailing dashes", () => {
    expect(slugify("  چند   فاصله!!  ")).toBe("چند-فاصله");
  });

  it("lowercases Latin letters", () => {
    expect(slugify("Digital Menu QR")).toBe("digital-menu-qr");
  });

  it("returns an empty string for input with no keepable characters", () => {
    expect(slugify("???!!!")).toBe("");
  });
});
