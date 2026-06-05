import { cn } from "@/lib/utils/tailwind-merge";
import type { Role } from "@/lib/types/admin";

const ROLE_STYLES: Record<string, string> = {
  Doctor:
    "bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-950 dark:text-blue-400 dark:border-blue-800",
  Receptionist:
    "bg-teal-50 text-teal-700 border-teal-200 dark:bg-teal-950 dark:text-teal-400 dark:border-teal-800",
  Admin:
    "bg-violet-50 text-violet-700 border-violet-200 dark:bg-violet-950 dark:text-violet-400 dark:border-violet-800",
};

type RoleBadgeProps = {
  role: Role | string;
  className?: string;
};

export function RoleBadge({ role, className }: RoleBadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border px-2 py-0.5 text-xs font-medium whitespace-nowrap",
        ROLE_STYLES[role] ??
          "bg-gray-50 text-gray-600 border-gray-200 dark:bg-gray-900 dark:text-gray-400",
        className,
      )}
    >
      {role}
    </span>
  );
}
