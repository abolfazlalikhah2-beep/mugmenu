# Menu (customer-facing)

The public, unauthenticated flow at `/[cafeSlug]`: browse categories →
item detail → 3-state cart → order → receipt. From `project/Menu Flow.dc.html`.

Post-order feedback (star review + short survey) is from `Customer Feedback.dc.html`
— see the dedicated section below.

## Layers

- `repositories/menu-repository.ts` — the only file that touches `Business`/`Category`/`Product`/`Order`/`Review`/`OrderSurvey` via Prisma.
- `services/`
  - `order-flow.ts` — **the three-state order state machine.** Pure, no I/O: required fields per order type, total computation, the system-shown delivery-time estimate. Unit tested in `order-flow.test.ts`.
  - `order-schemas.ts` — zod schema for `createOrder` input.
  - `order-service.ts` — validates (schema + `order-flow`), prices the order from current product data, writes it via the repository, logs the outcome.
  - `menu-service.ts` — read side: assembles what each page needs (business + rating, category + product lists, item + rating, reviews + count, receipt, review-form data).
  - `review-schemas.ts` — zod schemas + fixed option lists (`TAG_OPTIONS`, `TASTE_OPTIONS`, `SPEED_OPTIONS`, `PACKAGING_OPTIONS`) for the review form and the 3-question survey. Unit tested in `review-schemas.test.ts`.
  - `review-service.ts` — `submitReview` (one `Review` row per selected order item, or a single business-level row if none selected; awards `REVIEW_LOYALTY_POINTS` via `features/customer`'s wallet-service when the order was placed while logged in) and `submitSurvey` (upserts `OrderSurvey`).
  - `menu-language-service.ts` — the `magmenu_lang_<slug>` cookie (read/write; session-only when the business turns off "ذخیره زبان مشتری").
- `routes/actions.ts` — `"use server"` actions the cart/receipt/review pages call: `createOrderAction`, `submitReviewAction`, `submitSurveyAction`, `setMenuLanguageAction`.
- `client/cart-context.tsx` — client-only cart state (React context + `localStorage`), not business logic — nothing here talks to Postgres.
- `utils/money.ts` — `fa-IR` number formatting.
- `utils/menu-language.ts` — pure fa/en copy dictionary + name/description fallback resolution for the bilingual menu (`Menu Language Toggle.dc.html`). Unit tested in `menu-language.test.ts`.

## Bilingual menu (`Menu Language Toggle.dc.html`)

- Scoped to the entry page (`/[cafeSlug]`) only — banner FA/EN toggle, first-visit language gate, and full RTL/LTR mirror of the header/wallet-teaser/order-type rows/lead text. Controlled per business from the dashboard's "زبان" settings tab (`Business.bilingualMenuEnabled` / `askLanguageOnEntry` / `rememberCustomerLanguage`).
- The category browser, item detail, cart, and checkout pages are **not** translated yet — only `Product.nameEn`/`descriptionEn` exist on the schema (edited from the "زبان" tab's item translation table) for that future work to build on; untranslated products just fall back to their Persian name (`localizedName`/`localizedText` in `menu-language.ts`).
- No `addressEn` field — the business address shows the same text in both languages.

## Post-order feedback (`Customer Feedback.dc.html`)

- `/[cafeSlug]/receipt/[orderId]/review` (`components/menu/review-form.tsx`) — star rating, optional multi-select of which order items the review is about, fixed quick-pick tags, free-text comment, anonymous toggle. Submitting shows a thank-you state inline (no separate route) with the loyalty points earned, if any.
- The receipt page shows a "ثبت نظر" prompt card linking to the review page (only while the order has no review yet), and auto-opens `components/menu/survey-sheet.tsx` — the dismissible 3-question bottom sheet — the first time the receipt is viewed (only while the order has no `OrderSurvey` yet). The design's separate "standalone survey view" frame is the same component; there's no dedicated route for it since the bottom sheet is the only real entry point.
- Loyalty points for reviews are a flat `REVIEW_LOYALTY_POINTS` (50, `features/customer/services/loyalty.ts`), separate from the order-total-based points `wallet-service.ts` already awards at checkout. Only awarded when `Order.customerAccountId` is set (logged in) — same gate as cashback.

**Known scope cuts** (same spirit as `features/customer/README.md`'s wallet-redemption cut):
- **No photo upload on reviews.** The design's "افزودن عکس" control isn't built — wiring it to `features/uploads` felt like a separate task, and a decorative non-functional button would violate "no half-finished implementations". `Review` has no `photoUrls` column yet.
- **The standalone survey page/route isn't built** — see above, the bottom sheet is the only real entry point in this app (guest and logged-in customers alike land on the receipt page right after checkout).
- **A review can't be edited or deleted** after submission — matches the rest of the app (no edit flow exists for admin-side reviews either).

## How to test

```bash
npm run test              # order-flow + review-schemas unit tests
npm run dev
# then walk /demo → /demo/menu → an item → add to cart → /demo/cart →
# submit, and confirm a row lands in Postgres:
docker compose exec db psql -U magmenu -d magmenu -c 'select id, type, "totalPrice" from "Order" order by "createdAt" desc limit 5;'
# then on the receipt page: dismiss or submit the survey sheet, and follow
# "ثبت نظر" to submit a review; confirm rows landed:
docker compose exec db psql -U magmenu -d magmenu -c 'select id, rating, tags, anonymous from "Review" order by "createdAt" desc limit 5;'
```
