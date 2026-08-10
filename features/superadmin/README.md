# Super admin (پنل داخلی ماگ‌منو)

The cross-tenant internal panel at `/superadmin/*` — from `project/Super
Admin.dc.html`. Reuses the same phone/password login and `User` table as the
business owner panel; there is no separate super-admin auth path (see the
`User` model comment in `prisma/schema.prisma`).

## Layers

- `repositories/superadmin-repository.ts` — all Prisma access across
  `Business`/`Transaction`/`PlatformSettings`/`Ticket`/`User` for this
  feature. Every query here is intentionally cross-tenant (no `businessId`
  scoping) — that's the whole point of this panel.
- `services/`
  - `subscription-status.ts` — pure (no I/O) derivation of a business's
    اشتراک فعال/دوره آزمایشی/رو‌به‌انقضا/منقضی badge from `planExpiresAt`
    and whether it has ever paid. Unit tested.
  - `finance-service.ts` — revenue stats (reuses `computeDelta` from
    `features/dashboard/services/stat-delta.ts`), transaction history, and
    the Zarinpal gateway settings form (`lib/payments/payment-gateway.ts`
    is the mock provider, same pattern as `lib/sms/sms-provider.ts`).
  - `customer-service.ts` — the مشتریان list/detail, manual subscription
    renewal, و تعلیق پنل (`Business.isSuspended`, enforced in
    `requireBusinessOwner()`).
  - `team-service.ts` — ماگ‌منو's own internal staff accounts
    (`User.isSuperAdmin`), invited the same way `dashboard/user-mgmt-service.ts`
    invites business staff: a temp password shown once, no email/SMS invite
    link (no email auth exists in this app).
  - `ticket-service.ts` — the تیکت‌ها inbound queue: every business's
    support tickets in one list, an agent reply (`TicketMessage.authorType
    = AGENT`), and creating a ticket addressed to a customer. A reply
    always sets the ticket to `ANSWERED`; an owner replying to an
    ANSWERED/CLOSED ticket reopens it to `OPEN` (see the small addition in
    `features/dashboard/services/support-service.ts`) — that's the whole
    state machine for `Ticket.status`.
- `routes/actions.ts` — every action calls `requireSuperAdmin()` first.

## Deviations from the design file

- The customer-detail "مودال" in the design is a real page
  (`/superadmin/customers/[businessId]`) here, not a floating overlay —
  matching how `/dashboard/support/[ticketId]` already does ticket detail
  in this app, rather than inventing modal-with-server-fetch machinery.
- Only one payment gateway (Zarinpal) has real settings fields on
  `PlatformSettings`; the design's decorative extra gateway rows (سامان
  کیش، کیف پول) were dropped rather than shipping toggles with no backing
  data.
- "دعوت کاربر جدید" collects a phone number (not email) and shows a temp
  password once, like the dashboard's own staff invite — there's no email
  auth in this app to send a real invite link through.

## How to test

```bash
npm run test     # subscription-status unit tests
npm run dev
# log in as the seeded super admin (see prisma/seed.ts), then walk
# /superadmin/customers, /superadmin/finance, /superadmin/tickets,
# /superadmin/users.
```
