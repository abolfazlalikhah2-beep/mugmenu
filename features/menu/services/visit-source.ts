/**
 * Pure — no I/O. Resolves which of the three traffic sources shown in the
 * "منابع ورودی" analytics card a menu-entry visit came from:
 *  - QR: table QR codes are printed with a `?src=qr` suffix baked into the
 *    generated link (see the Menu Analytics design's QR-source convention).
 *  - LINK: an external referer without `?src=qr` — someone clicked a shared
 *    link (social, chat, etc).
 *  - DIRECT: no referer and no `?src=qr` — typed the URL or opened a
 *    bookmark/PWA shortcut.
 * A referer from the app's own origin (in-app navigation, e.g. back button)
 * is treated as DIRECT rather than LINK since it isn't an external referral.
 */
export type VisitSource = "QR" | "LINK" | "DIRECT";

export function resolveVisitSource(input: {
  srcParam?: string | null;
  referer?: string | null;
  ownOrigin?: string | null;
}): VisitSource {
  if (input.srcParam === "qr") return "QR";

  if (input.referer) {
    try {
      const refererOrigin = new URL(input.referer).origin;
      if (!input.ownOrigin || refererOrigin !== input.ownOrigin) return "LINK";
    } catch {
      // Malformed referer header — fall through to DIRECT.
    }
  }

  return "DIRECT";
}
