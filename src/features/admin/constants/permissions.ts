import type { Role } from "@/lib/types/admin";

export const ADMIN_ROLE: Role = "Admin";

export function isAdminRole(role: string | undefined | null): role is Role {
  return role === ADMIN_ROLE;
}

/** Routes restricted to Admin role (enforced also by proxy.ts) */
export const ADMIN_ONLY_PREFIX = "/admin";
