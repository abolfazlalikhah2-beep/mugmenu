export interface SmsLength {
  segments: number;
  charsPerSegment: number;
  length: number;
}

const SINGLE_SEGMENT_LIMIT = 70;
const MULTI_SEGMENT_LIMIT = 67;

/**
 * Segment count for a Unicode (Persian) SMS: 70 chars for a single
 * segment, 67 per segment once concatenated across multiple parts.
 */
export function countSmsSegments(text: string): SmsLength {
  const length = text.length;
  if (length <= SINGLE_SEGMENT_LIMIT) {
    return { segments: 1, charsPerSegment: SINGLE_SEGMENT_LIMIT, length };
  }
  return {
    segments: Math.ceil(length / MULTI_SEGMENT_LIMIT),
    charsPerSegment: MULTI_SEGMENT_LIMIT,
    length,
  };
}
