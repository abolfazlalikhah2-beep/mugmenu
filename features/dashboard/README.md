# Dashboard (owner panel)

The authenticated, business-scoped panel at `/dashboard/*` — from
`project/Admin Panel.dc.html` (onboarding, home, orders) and
`project/Admin Panel B.dc.html` (products, categories, settings).

## Layers

- `repositories/dashboard-repository.ts` — all Prisma access for Business/Order/Product/Category from this feature.
- `services/`
  - `onboarding-service.ts` — creates the `Business` row and links it to the current `User`.
  - `stats-service.ts` + `stat-delta.ts` — dashboard home numbers. `stat-delta.ts` is the pure today-vs-yesterday percentage math, unit tested.
  - `order-mgmt-service.ts`, `product-service.ts`, `category-service.ts`, `settings-service.ts` — CRUD + zod validation (`dashboard-schemas.ts`), each checking the resource actually belongs to the caller's `businessId` before mutating it.
- `routes/actions.ts` — every action calls `requireBusinessOwner()` first (authorization, not just "is logged in") before touching a service.

## Authorization

Every mutation is scoped to the signed-in owner's own business — a service
never trusts a `businessId` from the client, it takes it from
`requireBusinessOwner()` and then checks the row it's about to touch
(product/category/order) actually belongs to that business.

## How to test

```bash
npm run test     # stat-delta unit tests
npm run dev
# log in with the seeded owner (09376220110 / demo1234), or register a new
# account and complete /onboarding, then walk /dashboard, /dashboard/orders,
# /dashboard/products, /dashboard/categories, /dashboard/settings.
```
