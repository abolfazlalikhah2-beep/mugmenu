# features/plans

Subscription plan/feature gating. `feature-matrix.ts` is the single source of
truth for what each of the 3 plans (منو دیداری / منو سفارش / منو پیشرفته)
includes — it is only read by `prisma/seed.ts` to populate the `PlanFeature`
table. Every runtime check goes through `services/plan-service.ts` against
that table, never the matrix file, so changing what a plan includes later is
a data change (edit `PlanFeature` rows), not a code release.

## Usage

- `getBusinessFeatureSet(businessId)` — fetch once per page/layout, pass the
  returned `{ keys, limits }` down to gate several UI sections cheaply.
- `businessHasFeature(businessId, featureKey)` / `getBusinessFeatureLimit(...)`
  — for one-off checks (e.g. inside a server action before mutating).
- `components/dashboard/upgrade-gate.tsx` — wraps a locked section with the
  "این امکان در پلن شما موجود نیست" upgrade prompt.

## Testing

`resolveFeatureAccess` is pure (no I/O) — `plan-service.test.ts` covers it
directly against fixture rows shaped like `PlanFeature`.
