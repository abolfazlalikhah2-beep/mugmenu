# Leads

Phone-only lead capture (e.g. a homepage "می‌خوام باهام تماس بگیرید" widget).
Anonymous — no session/auth — so a submission is just a row, not tied to any
`Business`. Reviewed from `/superadmin/leads`.

## Layers

- `repositories/lead-repository.ts` — the only file that touches `LeadCapture` via Prisma.
- `services/lead-service.ts` — `submitLeadCapture` validates with `lead-schemas.ts` (zod), rate-limits per IP, logs, persists via the repository; `getLeadCaptures`/`setLeadCaptureRead` back the superadmin list.
- `routes/actions.ts` — the `"use server"` action the superadmin leads page calls to mark a row read/unread.

Public submission goes through `POST /api/lead` (`app/api/lead/route.ts`), not a server action, since it's meant to be called from any capture widget via `fetch`.

## How to test

```bash
npm run dev
curl -X POST http://localhost:3000/api/lead -H "content-type: application/json" -d '{"phone":"09120000000","source":"homepage"}'
```

Rate limit (in-memory, single-instance only — see `lib/rate-limit.ts`): 5 submissions / 10 min / IP.
