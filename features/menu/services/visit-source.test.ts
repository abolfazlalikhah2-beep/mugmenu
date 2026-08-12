import { describe, it, expect } from "vitest";
import { resolveVisitSource } from "./visit-source";

describe("resolveVisitSource", () => {
  it("classifies ?src=qr as QR regardless of referer", () => {
    expect(resolveVisitSource({ srcParam: "qr", referer: "https://instagram.com" })).toBe("QR");
    expect(resolveVisitSource({ srcParam: "qr" })).toBe("QR");
  });

  it("classifies an external referer without ?src=qr as LINK", () => {
    expect(
      resolveVisitSource({ referer: "https://instagram.com/p/123", ownOrigin: "https://app.magmenu.com" })
    ).toBe("LINK");
  });

  it("classifies no referer and no param as DIRECT", () => {
    expect(resolveVisitSource({})).toBe("DIRECT");
    expect(resolveVisitSource({ referer: null })).toBe("DIRECT");
  });

  it("classifies a same-origin referer (in-app navigation) as DIRECT, not LINK", () => {
    expect(
      resolveVisitSource({
        referer: "https://app.magmenu.com/demo/menu",
        ownOrigin: "https://app.magmenu.com",
      })
    ).toBe("DIRECT");
  });

  it("falls back to DIRECT on a malformed referer header", () => {
    expect(resolveVisitSource({ referer: "not-a-url" })).toBe("DIRECT");
  });
});
