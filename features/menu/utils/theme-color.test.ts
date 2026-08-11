import { describe, it, expect } from "vitest";
import { isValidHexColor, tintColor, darkenColor } from "./theme-color";

describe("isValidHexColor", () => {
  it("accepts a 6-digit hex color", () => {
    expect(isValidHexColor("#328C3D")).toBe(true);
  });

  it("rejects short hex, missing #, and non-hex input", () => {
    expect(isValidHexColor("#fff")).toBe(false);
    expect(isValidHexColor("328C3D")).toBe(false);
    expect(isValidHexColor("#GGGGGG")).toBe(false);
  });
});

describe("tintColor", () => {
  it("converts hex to an rgba string at the given alpha", () => {
    expect(tintColor("#328C3D", 0.1)).toBe("rgba(50,140,61,0.1)");
  });
});

describe("darkenColor", () => {
  it("scales each channel down by the given amount", () => {
    expect(darkenColor("#328C3D", 0.22)).toBe("#276d30");
  });

  it("never goes below #000000", () => {
    expect(darkenColor("#010101", 5)).toBe("#000000");
  });
});
