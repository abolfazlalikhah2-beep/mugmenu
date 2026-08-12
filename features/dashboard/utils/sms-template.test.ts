import { describe, it, expect } from "vitest";
import { renderSmsTemplate } from "./sms-template";

describe("renderSmsTemplate", () => {
  it("substitutes all known variables", () => {
    expect(
      renderSmsTemplate("سلام {نام مشتری}، از طرف {نام مجموعه} کد {کد پیگیری}", {
        customerName: "علی",
        businessName: "باختر",
        trackingCode: "AB12",
      })
    ).toBe("سلام علی، از طرف باختر کد AB12");
  });

  it("replaces a repeated variable at every occurrence", () => {
    expect(renderSmsTemplate("{نام مشتری} و باز هم {نام مشتری}", { customerName: "مریم" })).toBe(
      "مریم و باز هم مریم"
    );
  });

  it("falls back to an empty string for a missing variable", () => {
    expect(renderSmsTemplate("سلام {نام مشتری}", {})).toBe("سلام ");
  });

  it("leaves text without any tokens untouched", () => {
    expect(renderSmsTemplate("پیام ساده بدون متغیر", { customerName: "علی" })).toBe("پیام ساده بدون متغیر");
  });

  it("substitutes the credit amount with fa-IR grouping", () => {
    expect(renderSmsTemplate("{مبلغ اعتبار} تومان هدیه گرفتید", { creditAmount: 50000 })).toBe("۵۰٬۰۰۰ تومان هدیه گرفتید");
  });
});
