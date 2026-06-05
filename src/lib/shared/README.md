# Shared layer

Cross-feature utilities used by `features/*` and thin `app/*` routes.

- `api/` — server HTTP client, unified errors
- `config/` — environment variables
- `forms/` — `useZodForm`, field errors
- `schemas/` — Zod schemas shared across roles (settings, reports)
- `constants/` — API pagination, headers

Do not import feature code from here.
