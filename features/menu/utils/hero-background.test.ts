import { describe, it, expect } from "vitest";
import { resolveHeroBackground } from "./hero-background";

describe("resolveHeroBackground", () => {
  it("uses the uploaded photo when heroBgKey is photo and an image is set", () => {
    const result = resolveHeroBackground({
      heroBgKey: "photo",
      heroImageUrl: "https://cdn.example.com/hero.jpg",
      accentColor: "#328C3D",
    });
    expect(result).toEqual({ type: "image", url: "https://cdn.example.com/hero.jpg" });
  });

  it("falls back to a solid color when heroBgKey is photo but no image is set", () => {
    const result = resolveHeroBackground({ heroBgKey: "photo", heroImageUrl: null, accentColor: "#328C3D" });
    expect(result).toEqual({ type: "css", css: "#2A2A2A" });
  });

  it("resolves a fixed gradient preset", () => {
    const result = resolveHeroBackground({ heroBgKey: "g1", heroImageUrl: null, accentColor: "#328C3D" });
    expect(result).toEqual({ type: "css", css: "linear-gradient(135deg,#3B2A20 0%,#7A4A2B 100%)" });
  });

  it("derives the brand gradient (g4) from the business's accent color", () => {
    const result = resolveHeroBackground({ heroBgKey: "g4", heroImageUrl: null, accentColor: "#2563EB" });
    expect(result).toEqual({
      type: "css",
      css: "linear-gradient(135deg,#2563EB 0%,rgba(37,99,235,0.55) 100%)",
    });
  });

  it("falls back to a solid color for an unknown key", () => {
    const result = resolveHeroBackground({ heroBgKey: "bogus", heroImageUrl: null, accentColor: "#328C3D" });
    expect(result).toEqual({ type: "css", css: "#2A2A2A" });
  });
});
