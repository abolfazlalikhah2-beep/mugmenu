import { describe, it, expect } from "vitest";
import {
  requiredFieldsFor,
  validateOrderDraft,
  computeTotal,
  estimatedTimeFor,
  computeOptionsExtra,
  summarizeSelectedOptions,
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

describe("summarizeSelectedOptions", () => {
  it("joins group/option pairs into a single readable string", () => {
    expect(
      summarizeSelectedOptions([
        { groupName: "سایز", optionName: "بزرگ", extraPrice: 45000 },
        { groupName: "نوع نان", optionName: "سنگک", extraPrice: 8000 },
      ])
    ).toBe("سایز: بزرگ، نوع نان: سنگک");
  });

  it("returns undefined when nothing was selected", () => {
    expect(summarizeSelectedOptions([])).toBeUndefined();
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
