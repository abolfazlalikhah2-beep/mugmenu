# Customer account (end-customer login, wallet, loyalty)

The public-menu-facing customer identity at `/[cafeSlug]/account/*` — from
`project/Customer Account.dc.html`. Phone + OTP login, completely separate
from staff auth (`features/auth`, phone + password): see the
`CustomerAccount` model comment in `prisma/schema.prisma`.

## Layers

- `repositories/customer-repository.ts` — all Prisma access for
  CustomerAccount/CustomerAddress/WalletTransaction/customer-scoped Order
  queries.
- `services/`
  - `loyalty.ts` — pure (no I/O) cashback and loyalty-point/tier math, unit
    tested. Rates (۵٪ cashback, ۲٬۰۰۰ points to gold) mirror the design file
    exactly; there's no admin control for these yet, same simplification
    already made for the hardcoded subscription plan defaults on `Business`.
  - `customer-session-service.ts` — the `magmenu_customer_session` cookie,
    keyed by business **slug** rather than businessId, because a customer
    can be logged in to more than one restaurant's account in the same
    browser (every QR scan is its own tenant).
  - `customer-auth-service.ts` — send/verify OTP (reuses
    `features/auth/services/otp-service.ts`), find-or-create account on
    first verify. Doesn't actually check the OTP code against what was
    sent yet — same stub as `features/auth/services/auth-service.ts`'s
    `verifyOtp`, for the same reason (no real SMS provider connected).
  - `wallet-service.ts` — wallet balance + loyalty summary, the ledger, and
    `creditCashbackForOrder` (called from `features/menu/services/order-service.ts`
    right after an order is created while logged in).
  - `address-service.ts`, `order-history-service.ts` — CRUD / read-model
    shaping for the account pages.
- `routes/actions.ts` — every mutating action either takes the slug as its
  first bound argument or resolves `requireCustomerSession(slug)` itself
  before touching a service.

## How this hooks into the existing menu/checkout flow

Logging in is additive — guest checkout is unchanged. `createOrderAction`
(in `features/menu/routes/actions.ts`) reads the customer session cookie
server-side and passes the resolved `customerAccountId` into
`order-service.ts`'s `createOrder`; no changes were made to the cart UI or
the order-flow state machine itself.

## Known scope cut

**Spending the wallet balance to reduce an order's total at checkout is not
built.** The wallet is credit-only today (cashback in, nothing out) —
`WalletTransaction` only ever has `CASHBACK_EARNED` rows written by real
code (`ADJUSTMENT` exists in the enum for a future manual correction, but
nothing writes it yet). Building redemption would mean changing the
existing, working cart/checkout total computation, which felt like too
much blast radius to fold into a design-import task. The order-detail
"پرداخت از کیف پول" line from the design simply never appears until this
is built.

Also cut: a cancelled order's cashback/points are not clawed back — they're
credited once at order placement and never reversed. Reversing on
cancellation would mean touching `features/dashboard/services/order-mgmt-service.ts`
(the admin's `updateOrderStatus`), which is a different feature's code path.

## How to test

```bash
npm run test     # loyalty.ts unit tests
npm run dev
# log in as the seeded demo customer (09190001234, any OTP code — see the
# stub note above) on the "demo" business, or start fresh with any phone
# number; walk /demo/account, /demo/account/orders, /demo/account/wallet,
# /demo/account/addresses, and place an order from /demo/menu while logged
# in to see cashback credited.
```
