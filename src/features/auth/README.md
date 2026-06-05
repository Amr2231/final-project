# Auth feature

Login, forgot-password (OTP flow), and reset-password UI + server actions.

- `api/` — public auth endpoints (`sendResetLink`, `verifyOtp`, `resetPassword`)
- `actions/` — `"use server"` wrappers for client hooks
- `components/` — forms and `AuthVisual`
- `hooks/` — React Query mutations (`useLogin`, `useSendOtp`, …)

App routes (`app/(auth)/*`) stay thin and import from `@/features/auth`.

`@/lib/actions/auth.action` re-exports actions for backward compatibility.
