# Receptionist feature

Patient list, historical data, and add-patient flow.

- `api/patients.api.ts` — `serverFetch` calls
- `actions/patients.actions.ts` — server actions
- `hooks/` — React Query
- `components/` — tables, modals, `AddPatientForm`

Settings use `@/features/settings`. App routes under `app/receptionist/*` import from `@/features/receptionist`.
