# Menu (customer-facing)

The public, unauthenticated flow at `/[cafeSlug]`: browse categories →
item detail → 3-state cart → order → receipt. From `project/Menu Flow.dc.html`.

## Layers

- `repositories/menu-repository.ts` — the only file that touches `Business`/`Category`/`Product`/`Order`/`Review` via Prisma.
- `services/`
  - `order-flow.ts` — **the three-state order state machine.** Pure, no I/O: required fields per order type, total computation, the system-shown delivery-time estimate. Unit tested in `order-flow.test.ts`.
  - `order-schemas.ts` — zod schema for `createOrder` input.
  - `order-service.ts` — validates (schema + `order-flow`), prices the order from current product data, writes it via the repository, logs the outcome.
  - `menu-service.ts` — read side: assembles what each page needs (business + rating, category + product lists, item + rating, reviews + count, receipt).
- `routes/actions.ts` — the one `"use server"` action (`createOrderAction`) the cart page calls.
- `client/cart-context.tsx` — client-only cart state (React context + `localStorage`), not business logic — nothing here talks to Postgres.
- `utils/money.ts` — `fa-IR` number formatting.

## How to test

```bash
npm run test              # order-flow unit tests
npm run dev
# then walk /demo → /demo/menu → an item → add to cart → /demo/cart →
# submit, and confirm a row lands in Postgres:
docker compose exec db psql -U magmenu -d magmenu -c 'select id, type, "totalPrice" from "Order" order by "createdAt" desc limit 5;'
```
