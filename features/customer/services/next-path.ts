/**
 * Resolves where to send a customer after logging in, when the login flow
 * was entered with a `next` deep link (e.g. receipt page's "پیگیری سفارش"
 * button, for a guest who isn't signed in yet — see
 * app/(public)/[cafeSlug]/receipt/[orderId]/page.tsx and
 * features/customer/routes/actions.ts's verifyCustomerOtpAction).
 *
 * `next` is client-supplied (threaded through hidden form fields across the
 * login → verify OTP redirect chain), so it's never redirected to as-is —
 * only a same-business relative path (`/${slug}` or `/${slug}/...`) is
 * trusted, anything else (an absolute URL, another business's slug, a
 * protocol-relative "//evil.com") falls back to the business's menu entry.
 * Pure — no I/O — so it's cheap to unit test (see next-path.test.ts).
 */
export function resolvePostLoginPath(slug: string, next: string | undefined | null): string {
  const entryPath = `/${slug}`;
  if (!next) return entryPath;
  if (next === entryPath || next.startsWith(`${entryPath}/`)) return next;
  return entryPath;
}

/**
 * Where the receipt page's "پیگیری سفارش" (track order) button should point.
 * Order tracking (getOrderDetail) is scoped to a logged-in customer
 * account, so a guest can't go straight there — send them to log in first,
 * with `next` wired to bring them back to this exact order afterward (see
 * resolvePostLoginPath above, which is what reads it back out).
 */
export function trackOrderHref(slug: string, orderId: string, isLoggedIn: boolean): string {
  const orderPath = `/${slug}/account/orders/${orderId}`;
  if (isLoggedIn) return orderPath;
  return `/${slug}/account/login?next=${encodeURIComponent(orderPath)}`;
}
