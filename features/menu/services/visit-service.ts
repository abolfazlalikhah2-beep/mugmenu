import "server-only";
import * as repo from "@/features/menu/repositories/menu-repository";
import { resolveVisitSource } from "@/features/menu/services/visit-source";
import { logger } from "@/lib/logger";

/**
 * Logs a menu-entry landing (the `/{slug}` page) for the "آمار بازدید منو"
 * dashboard tab. Best-effort: analytics must never break the customer menu,
 * so failures are logged and swallowed rather than thrown. Call from a
 * `next/server` `after()` callback so it doesn't delay the page response.
 */
export async function logMenuVisit(
  businessId: string,
  input: { srcParam?: string | null; referer?: string | null; ownOrigin?: string | null }
) {
  try {
    const source = resolveVisitSource(input);
    await repo.createMenuEntryVisit(businessId, source);
  } catch (err) {
    logger.error("menu_visit_log_failed", { businessId, error: String(err) });
  }
}

/** Logs an item detail-page view for the "پرطرفدارترین آیتم‌ها" table. Same best-effort contract as logMenuVisit. */
export async function logItemView(businessId: string, productId: string) {
  try {
    await repo.createItemView(businessId, productId);
  } catch (err) {
    logger.error("item_view_log_failed", { businessId, productId, error: String(err) });
  }
}
