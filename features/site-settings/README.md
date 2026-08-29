# Site Settings

Key/value store for marketing-site content editable from `/superadmin/site-settings`
(contact info, logo/favicon, homepage hero copy). One `SiteSetting` row per key rather
than a fixed-column singleton, so adding a new setting is a code change, not a migration.

## Layers

- `repositories/site-setting-repository.ts` — raw CRUD (`getSetting`, `getAllSettings`,
  `setSetting` as an upsert keyed on `key`).
- `services/site-setting-schemas.ts` — `SITE_SETTING_KEYS`, the single source of truth
  for which keys exist, plus the zod schema validating them.
- `services/site-setting-service.ts` — `getSettings()` returns every known key with `""`
  for anything not yet set (so the form never sees `undefined`); `updateSettings()`
  validates and upserts all keys in one call.
- `routes/actions.ts` — `updateSiteSettingsAction`, gated by `requireSuperAdmin()`.

Logo/favicon uploads reuse `features/uploads` via a separate
`uploadSiteSettingImageAction` (not the business-scoped `uploadImageAction`, since
these aren't tied to a business).

## How to test

```bash
npm run dev
# /superadmin/site-settings → edit a field in each section → save,
# reload the page and confirm the values persisted.
```
