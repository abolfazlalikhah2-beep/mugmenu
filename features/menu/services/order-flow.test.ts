import { describe, it, expect } from "vitest";
import {
  requiredFieldsFor,
  validateOrderDraft,
  computeTotal,
  estimatedTimeFor,
  computeOptionsExtra,
  computeServiceFee,
  computeTax,
  computeAutoDiscountAmount,
  pickBestAutoDiscount,
  clampRedeemAmount,
  type AutoDiscountDef,
} from "./order-flow";

describe("requiredFieldsFor", () => {
  it("dine-in needs a table number", () => {
    expect(requiredFieldsFor("DINE_IN")).toEqual([
      "customerName",
      "customerPhone",
      "tableNumber",
    ]);
  });

  it("takeaway needs only name + phone", () => {
    expect(requiredFieldsFor("TAKEAWAY")).toEqual(["customerName", "customerPhone"]);
  });

  it("delivery needs an address instead of a table number", () => {
    expect(requiredFieldsFor("DELIVERY")).toEqual([
      "customerName",
      "customerPhone",
      "address",
    ]);
  });
});

describe("validateOrderDraft", () => {
  it("passes a complete dine-in draft", () => {
    expect(
      validateOrderDraft("DINE_IN", {
        customerName: "رضا",
        customerPhone: "0912",
        tableNumber: "7",
      })
    ).toBeNull();
  });

  it("rejects dine-in without a table number", () => {
    expect(
      validateOrderDraft("DINE_IN", { customerName: "رضا", customerPhone: "0912" })
    ).toBe("شماره میز را وارد کنید.");
  });

  it("does not require a table number for takeaway", () => {
    expect(
      validateOrderDraft("TAKEAWAY", { customerName: "رضا", customerPhone: "0912" })
    ).toBeNull();
  });

  it("rejects delivery without an address", () => {
    expect(
      validateOrderDraft("DELIVERY", { customerName: "رضا", customerPhone: "0912" })
    ).toBe("آدرس تحویل را وارد کنید.");
  });

  it("passes a complete delivery draft", () => {
    expect(
      validateOrderDraft("DELIVERY", {
        customerName: "رضا",
        customerPhone: "0912",
        address: "تهران، خیابان...",
      })
    ).toBeNull();
  });

  it("treats a whitespace-only value as missing", () => {
    expect(
      validateOrderDraft("DINE_IN", {
        customerName: "رضا",
        customerPhone: "0912",
        tableNumber: "   ",
      })
    ).toBe("شماره میز را وارد کنید.");
  });

  it("reports the first missing field when several are absent", () => {
    expect(validateOrderDraft("DINE_IN", { customerName: "", customerPhone: "" })).toBe(
      "نام و نام خانوادگی را وارد کنید."
    );
  });
});

describe("computeTotal", () => {
  it("sums price × quantity across lines", () => {
    const prices = new Map([
      ["a", 100],
      ["b", 250],
    ]);
    const total = computeTotal(
      [
        { productId: "a", quantity: 2 },
        { productId: "b", quantity: 1 },
      ],
      prices
    );
    expect(total).toBe(100 * 2 + 250);
  });

  it("treats an unknown product id as zero price instead of throwing", () => {
    const total = computeTotal([{ productId: "missing", quantity: 3 }], new Map());
    expect(total).toBe(0);
  });

  it("returns 0 for an empty cart", () => {
    expect(computeTotal([], new Map())).toBe(0);
  });
});

describe("computeOptionsExtra", () => {
  it("sums extraPrice across selected options", () => {
    expect(
      computeOptionsExtra([
        { groupName: "سایز", optionName: "بزرگ", extraPrice: 45000 },
        { groupName: "نوع نان", optionName: "سنگک", extraPrice: 8000 },
      ])
    ).toBe(53000);
  });

  it("returns 0 when nothing was selected", () => {
    expect(computeOptionsExtra([])).toBe(0);
  });
});

describe("computeServiceFee / computeTax", () => {
  it("rounds percent of subtotal to the nearest toman", () => {
    expect(computeServiceFee(100000, 9)).toBe(9000);
    expect(computeTax(100000, 6)).toBe(6000);
    expect(computeServiceFee(10001, 9)).toBe(Math.round(10001 * 0.09));
  });

  it("returns 0 when the percent is 0", () => {
    expect(computeServiceFee(100000, 0)).toBe(0);
    expect(computeTax(100000, 0)).toBe(0);
  });
});

describe("computeAutoDiscountAmount / pickBestAutoDiscount", () => {
  const lines = [
    { productId: "kabab", categoryId: "kababs", lineTotal: 400000 },
    { productId: "doogh", categoryId: "drinks", lineTotal: 60000 },
  ];

  it("ALL_MENU applies to every line", () => {
    const d: AutoDiscountDef = { id: "1", name: "همه منو", percent: 10, scope: "ALL_MENU", categoryIds: [] };
    expect(computeAutoDiscountAmount(lines, d)).toBe(Math.round(460000 * 0.1));
  });

  it("CATEGORY only applies to matching category lines", () => {
    const d: AutoDiscountDef = {
      id: "2",
      name: "کباب‌ها",
      percent: 10,
      scope: "CATEGORY",
      categoryIds: ["kababs"],
    };
    expect(computeAutoDiscountAmount(lines, d)).toBe(Math.round(400000 * 0.1));
  });

  it("PRODUCT only applies to the matching product's line", () => {
    const d: AutoDiscountDef = {
      id: "3",
      name: "دوغ",
      percent: 20,
      scope: "PRODUCT",
      categoryIds: [],
      productId: "doogh",
    };
    expect(computeAutoDiscountAmount(lines, d)).toBe(Math.round(60000 * 0.2));
  });

  it("pickBestAutoDiscount picks the largest-amount match and ignores non-matches", () => {
    const small: AutoDiscountDef = {
      id: "small",
      name: "small",
      percent: 5,
      scope: "ALL_MENU",
      categoryIds: [],
    };
    const big: AutoDiscountDef = {
      id: "big",
      name: "big",
      percent: 10,
      scope: "CATEGORY",
      categoryIds: ["kababs"],
    };
    const irrelevant: AutoDiscountDef = {
      id: "none",
      name: "none",
      percent: 50,
      scope: "PRODUCT",
      categoryIds: [],
      productId: "not-in-cart",
    };
    const best = pickBestAutoDiscount(lines, [small, big, irrelevant]);
    expect(best?.discount.id).toBe("big");
    expect(best?.amount).toBe(Math.round(400000 * 0.1));
  });

  it("returns null when nothing matches", () => {
    const d: AutoDiscountDef = {
      id: "1",
      name: "x",
      percent: 10,
      scope: "PRODUCT",
      categoryIds: [],
      productId: "not-in-cart",
    };
    expect(pickBestAutoDiscount(lines, [d])).toBeNull();
  });
});

describe("clampRedeemAmount", () => {
  it("caps to the lowest of requested/balance/payable", () => {
    expect(clampRedeemAmount(50000, 100000, 30000)).toBe(30000);
    expect(clampRedeemAmount(50000, 20000, 100000)).toBe(20000);
    expect(clampRedeemAmount(10000, 100000, 100000)).toBe(10000);
  });

  it("treats a non-positive request as 0", () => {
    expect(clampRedeemAmount(0, 100000, 100000)).toBe(0);
    expect(clampRedeemAmount(-500, 100000, 100000)).toBe(0);
  });
});

describe("estimatedTimeFor", () => {
  it("dine-in has no estimate (served immediately)", () => {
    expect(estimatedTimeFor("DINE_IN")).toBeUndefined();
  });

  it("takeaway and delivery each get a distinct estimate", () => {
    expect(estimatedTimeFor("TAKEAWAY")).toMatch(/دقیقه/);
    expect(estimatedTimeFor("DELIVERY")).toMatch(/دقیقه/);
    expect(estimatedTimeFor("TAKEAWAY")).not.toBe(estimatedTimeFor("DELIVERY"));
  });
});
