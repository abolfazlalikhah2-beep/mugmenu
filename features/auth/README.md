# Auth

Phone + password login, with an OTP step gating registration and password
reset.

## Layers

- `repositories/user-repository.ts` — the only file that touches `User` via Prisma.
- `services/`
  - `auth-service.ts` — login/register/forgot-password/verify/change-password. Validates input with `auth-schemas.ts` (zod), rate-limits login attempts and OTP sends, logs every outcome.
  - `session-service.ts` — signed (JWT, `jose`) `httpOnly` cookie. Not database-backed yet.
  - `otp-service.ts` — abstract `OtpProvider`; `sendOtp()` generates the code, hashes and persists it (`OtpCode`, via `repositories/otp-repository.ts`), then hands it to the active provider. `getOtpProvider()` picks `otp-providers/melipayamak-provider.ts`'s `MelipayamakOtpProvider` when `MELIPAYAMAK_API_KEY`/`MELIPAYAMAK_BODY_ID` are set (production; Melipayamak authenticates via an `apikey` request header), otherwise falls back to `MockOtpProvider` (logs the code instead of sending an SMS — the local dev default). `verifyOtp()` checks the code against the stored hash (rate-limited, single-use, TTL-bound).
  - `authorize.ts` — `requireSession()` / `requireBusinessOwner()` for protecting routes elsewhere in the app (used by the dashboard).
- `routes/actions.ts` — the `"use server"` actions the `(auth)` pages call directly. Thin: parse `FormData`, call a service, map the result to redirect or an error string.

## How to test

```bash
npm run dev
# then visit /register, complete the flow through /verify, and confirm
# a row lands in Postgres:
docker compose exec db psql -U magmenu -d magmenu -c 'select phone, "fullName" from "User";'
```

Rate limits (in-memory, single-instance only — see `lib/rate-limit.ts`):
- Login: 5 attempts / 15 min / phone.
- OTP send (register, forgot-password, resend): 3 / 10 min / phone.
