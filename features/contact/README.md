# Contact

Public marketing-site `/contact` form. Anonymous — no session/auth — so a
submission is just a lead/support request row, not tied to any `Business`.

## Layers

- `repositories/contact-message-repository.ts` — the only file that touches `ContactMessage` via Prisma.
- `services/contact-service.ts` — validates input with `contact-schemas.ts` (zod), rate-limits submissions per IP, logs the outcome, persists via the repository.
- `routes/actions.ts` — the `"use server"` action `components/marketing/contact-form.tsx` calls. Thin: parse `FormData`, call the service, map the result to `ContactActionState`.

## How to test

```bash
npm run dev
# then visit /contact, submit the form, and confirm a row lands in Postgres:
docker compose exec db psql -U magmenu -d magmenu -c 'select name, phone, email, "createdAt" from "ContactMessage" order by "createdAt" desc limit 5;'
```

Rate limit (in-memory, single-instance only — see `lib/rate-limit.ts`): 3 submissions / 10 min / IP.
