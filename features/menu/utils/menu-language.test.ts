import { describe, it, expect } from "vitest";
import { isMenuLang, localizedName, localizedText, menuCopy } from "./menu-language";

describe("isMenuLang", () => {
  it("accepts fa/en and rejects anything else", () => {
    expect(isMenuLang("fa")).toBe(true);
    expect(isMenuLang("en")).toBe(true);
    expect(isMenuLang("de")).toBe(false);
    expect(isMenuLang(undefined)).toBe(false);
    expect(isMenuLang(null)).toBe(false);
  });
});

describe("localizedName", () => {
  it("uses the Persian name in fa", () => {
    expect(localizedName("fa", "چلوکباب", "Chelo Kabab")).toBe("چلوکباب");
  });

  it("uses the English name in en when translated", () => {
    expect(localizedName("en", "چلوکباب", "Chelo Kabab")).toBe("Chelo Kabab");
  });

  it("falls back to the Persian name in en when untranslated", () => {
    expect(localizedName("en", "چلوکباب", null)).toBe("چلوکباب");
    expect(localizedName("en", "چلوکباب", "")).toBe("چلوکباب");
  });
});

describe("localizedText", () => {
  it("falls back to Persian, and to null when both are missing", () => {
    expect(localizedText("en", "توضیح", null)).toBe("توضیح");
    expect(localizedText("en", null, null)).toBe(null);
    expect(localizedText("en", "توضیح", "Description")).toBe("Description");
  });
});

describe("menuCopy", () => {
  it("returns matching dir per language", () => {
    expect(menuCopy("fa").dir).toBe("rtl");
    expect(menuCopy("en").dir).toBe("ltr");
  });
});
