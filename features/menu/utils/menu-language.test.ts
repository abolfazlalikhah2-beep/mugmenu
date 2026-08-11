import { describe, it, expect } from "vitest";
import {
  isMenuLang,
  localizedName,
  localizedText,
  localizedNumber,
  menuCopy,
  orderTypeLabel,
  discountLabel,
  basedOnReviewsLabel,
  answeredOfLabel,
  earnPointsBanner,
  pointsAddedNote,
  cashbackNoteLabel,
  pointsToGoldLabel,
  orderNumberLabel,
  quantityLabel,
  confirmDeleteAddressLabel,
  verifySubtitleLabel,
  resendCountdownLabel,
  rateLabel,
  tagLabel,
  rewardLabel,
  walletTransactionTypeLabel,
  orderStatusLabel,
} from "./menu-language";

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

describe("localizedNumber", () => {
  it("uses Persian digits for fa and Western digits for en", () => {
    expect(localizedNumber("fa", 1234)).toBe("۱٬۲۳۴");
    expect(localizedNumber("en", 1234)).toBe("1,234");
  });
});

describe("orderTypeLabel", () => {
  it("returns the generic label for takeaway/delivery in both languages", () => {
    expect(orderTypeLabel("fa", "TAKEAWAY")).toBe("بیرون‌بر");
    expect(orderTypeLabel("en", "TAKEAWAY")).toBe("Takeaway");
    expect(orderTypeLabel("fa", "DELIVERY")).toBe("ارسال با پیک");
    expect(orderTypeLabel("en", "DELIVERY")).toBe("Delivery");
  });

  it("includes the table number for dine-in when given", () => {
    expect(orderTypeLabel("fa", "DINE_IN", "7")).toBe("روی میز 7");
    expect(orderTypeLabel("en", "DINE_IN", "7")).toBe("Table 7");
  });

  it("falls back to the generic dine-in label without a table number", () => {
    expect(orderTypeLabel("fa", "DINE_IN")).toBe("روی میز");
    expect(orderTypeLabel("en", "DINE_IN")).toBe("Dine in");
  });
});

describe("template helpers", () => {
  it("discountLabel", () => {
    expect(discountLabel("fa", 20)).toBe("۲۰٪ تخفیف");
    expect(discountLabel("en", 20)).toBe("20% off");
  });

  it("basedOnReviewsLabel", () => {
    expect(basedOnReviewsLabel("en", 12)).toBe("Based on 12 reviews");
  });

  it("answeredOfLabel", () => {
    expect(answeredOfLabel("en", 2)).toBe("2 of 3");
  });

  it("earnPointsBanner", () => {
    expect(earnPointsBanner("en", 50)).toBe("Earn 50 loyalty club points by submitting a review");
  });

  it("pointsAddedNote", () => {
    expect(pointsAddedNote("en", 50)).toBe("50 points were added to your account");
  });

  it("cashbackNoteLabel", () => {
    expect(cashbackNoteLabel("en", 5)).toBe("5% of every order is returned to your wallet as cashback");
  });

  it("pointsToGoldLabel", () => {
    expect(pointsToGoldLabel("en", 760)).toBe("760 points to Gold tier");
  });

  it("orderNumberLabel", () => {
    expect(orderNumberLabel("en", "abcd1234")).toBe("Order #abcd1234");
  });

  it("quantityLabel", () => {
    expect(quantityLabel("en", 3)).toBe("Qty: 3");
  });

  it("confirmDeleteAddressLabel", () => {
    expect(confirmDeleteAddressLabel("en", "Home")).toBe('Delete address "Home"?');
  });

  it("verifySubtitleLabel", () => {
    expect(verifySubtitleLabel("en", "0912...")).toBe("Verification code sent to 0912...");
  });

  it("resendCountdownLabel", () => {
    expect(resendCountdownLabel("en", 45)).toBe("Resend code (45)");
  });
});

describe("rateLabel", () => {
  it("maps 1-5 to a word in each language", () => {
    expect(rateLabel("fa", 5)).toBe("عالی بود!");
    expect(rateLabel("en", 5)).toBe("Excellent!");
    expect(rateLabel("en", 1)).toBe("Very bad");
  });
});

describe("tagLabel", () => {
  it("translates known review tags in en, passes fa through unchanged", () => {
    expect(tagLabel("fa", "خوش‌طعم")).toBe("خوش‌طعم");
    expect(tagLabel("en", "خوش‌طعم")).toBe("Great taste");
  });

  it("falls back to the Persian tag if no translation is mapped", () => {
    expect(tagLabel("en", "برچسب ناشناخته")).toBe("برچسب ناشناخته");
  });
});

describe("rewardLabel", () => {
  it("translates known loyalty rewards in en", () => {
    expect(rewardLabel("en", "دسر رایگان")).toBe("Free dessert");
    expect(rewardLabel("fa", "دسر رایگان")).toBe("دسر رایگان");
  });
});

describe("walletTransactionTypeLabel", () => {
  it("maps both transaction types", () => {
    expect(walletTransactionTypeLabel("en", "CASHBACK_EARNED")).toBe("Order cashback");
    expect(walletTransactionTypeLabel("en", "ADJUSTMENT")).toBe("Balance adjustment");
  });
});

describe("orderStatusLabel", () => {
  it("maps every OrderStatus value in both languages", () => {
    expect(orderStatusLabel("fa", "NEW")).toBe("جدید");
    expect(orderStatusLabel("en", "NEW")).toBe("New");
    expect(orderStatusLabel("en", "CANCELED")).toBe("Canceled");
  });
});
