import type { ReactNode } from "react";
import { cn } from "@/lib/utils/tailwind-merge";

type AdminTableShellProps = {
  children: ReactNode;
  isFetching?: boolean;
  className?: string;
};

export function AdminTableShell({
  children,
  isFetching,
  className,
}: AdminTableShellProps) {
  return (
    <div
      className={cn(
        "rounded-xl border border-gray-200 bg-white dark:bg-gray-950 dark:border-gray-800 overflow-hidden transition-opacity",
        isFetching && "opacity-70",
        className,
      )}
    >
      <div className="overflow-x-auto">{children}</div>
    </div>
  );
}

export function AdminTableHead({ children }: { children: ReactNode }) {
  return (
    <thead>
      <tr className="bg-gray-50/70 hover:bg-gray-50/70 border-b border-gray-200 dark:bg-gray-900/50">
        {children}
      </tr>
    </thead>
  );
}
