import { describe, it, expect } from "vitest";
import { countSmsSegments } from "./sms-length";

describe("countSmsSegments", () => {
  it("counts an empty message as one segment of 70", () => {
    expect(countSmsSegments("")).toEqual({ segments: 1, charsPerSegment: 70, length: 0 });
  });

  it("stays a single segment at exactly 70 characters", () => {
    expect(countSmsSegments("ا".repeat(70))).toEqual({ segments: 1, charsPerSegment: 70, length: 70 });
  });

  it("splits into two 67-char segments just past the single-segment limit", () => {
    expect(countSmsSegments("ا".repeat(71))).toEqual({ segments: 2, charsPerSegment: 67, length: 71 });
  });

  it("stays two segments at exactly 134 characters", () => {
    expect(countSmsSegments("ا".repeat(134)).segments).toBe(2);
  });

  it("rolls over to a third segment at 135 characters", () => {
    expect(countSmsSegments("ا".repeat(135)).segments).toBe(3);
  });
});
