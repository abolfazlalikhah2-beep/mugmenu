# Credits (نسیه)

Buy-now-pay-later tracking for manual/POS orders. A `CreditRecord` is
created automatically when a cashier submits a manual order
(`app/(dashboard)/dashboard/orders`) with payment method نسیه — see
`features/dashboard/services/order-mgmt-service.ts`'s `createManualOrder`,
which calls this module's `createCreditRecord` right after the `Order` row
exists. There is no standalone "create a credit record" client action —
every record must be derived from a real order.

## Layers

- `repositories/credit-repository.ts` — all Prisma access for `CreditRecord`.
- `services/credit-service.ts`
  - `createCreditRecord()` — internal, called from
    `features/dashboard/services/order-mgmt-service.ts` only.
  - `getCreditRecords()` / `getCreditRecordDetail()` — the دسته‌بندی list
    and تسویه modal on `/dashboard/credits`.
  - `settleCreditRecord()` — adds the received amount to `paidAmount`;
    `status` becomes `PAID` once `paidAmount >= amount`, otherwise `PARTIAL`.
  - `getOutstandingCreditForRange()` — sum of remaining (unpaid + partial)
    balances in a date range, consumed by the "گزارش صندوق" report tab.
- `routes/actions.ts` — `settleCreditRecordAction`, gated by
  `requireBusinessOwner()` (any staff role, same level as the orders page —
  settling نسیه is a day-to-day cashier task, not owner-only billing).

## How to test

```bash
npm run test
npm run dev
# /dashboard/orders → "ثبت سفارش دستی" → پرداخت: نسیه → submit
# /dashboard/credits → click the new row → "تسویه"
```
