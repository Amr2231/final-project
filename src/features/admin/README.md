# Admin feature

User management (active, inactive, deactivated patients) aligned with the doctor feature layout.

- `api/users.api.ts` — `serverFetch` calls
- `actions/users.actions.ts` — server actions for hooks
- `hooks/` — React Query
- `components/` — tables, modals, `AddUserForm`

Settings use `@/features/settings`. App routes under `app/admin/*` import from `@/features/admin`.
