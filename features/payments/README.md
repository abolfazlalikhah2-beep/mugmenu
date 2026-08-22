# Payments (پرداخت کارت به کارت)

Stands in for a real payment gateway (see CLAUDE.md phase 3): the super
admin maintains a pool of bank cards, a business owner transfers manually on
`/payment` and files a `PaymentRequest`, and a super admin verifies it by
hand against their bank statement — no automatic reconciliation.

## Layers

- `repositories/payment-repository.ts` — all Prisma access for `PaymentCard`
  and `PaymentRequest`.
- `services/payment-service.ts`
  - Card CRUD (super admin only, called from `routes/actions.ts` after
    `requireSuperAdmin()`).
  - `pickRandomActiveCard()` — `Math.random()` over the active card pool,
    called server-side from the `/payment` page so which card a business is
    shown isn't predictable/gameable from the client.
  - `createRequest()` — business owner side, rate-limited per business
    (5/hour, see `lib/rate-limit.ts`).
  - `verifyRequest()` — super admin side. Setting `status: "VERIFIED"`
    requires `newPlanId` and calls `features/plans/services/plan-service.ts`'s
    `changeBusinessPlan()` with whatever plan/cycle the admin picked in the
    same modal; nothing infers the plan from the transferred amount.
- `routes/actions.ts` — card actions require `requireSuperAdmin()`; request
  creation requires `requireOwnerRole()`; request verification requires
  `requireSuperAdmin()`.

## How to test

```bash
npm run test
npm run dev
# super admin: /superadmin/payment-cards, /superadmin/payment-requests
# business owner: /dashboard/account → "خرید اشتراک"/"تمدید" → /payment
```
