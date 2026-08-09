import { describe, it, expect } from "vitest";
import { formatTicketCode } from "./ticket-code";

describe("formatTicketCode", () => {
  it("formats a low ticket number", () => {
    expect(formatTicketCode(1)).toBe("#TK-۲۰۰۱");
  });

  it("uses Persian digits with no thousands separator", () => {
    expect(formatTicketCode(204)).toBe("#TK-۲۲۰۴");
  });

  it("keeps increasing with the ticket number", () => {
    expect(formatTicketCode(1500)).toBe("#TK-۳۵۰۰");
  });
});
