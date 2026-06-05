import type { ReactNode } from "react";
import { cn } from "@/lib/utils/tailwind-merge";

type AdminPageShellProps = {
  title: string;
  description?: string;
  actions?: ReactNode;
  children: ReactNode;
  className?: string;
};

export function AdminPageShell({
  title,
  description,
  actions,
  children,
  className,
}: AdminPageShellProps) {
  return (
    <div className={cn("p-6 space-y-6", className)}>
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
            {title}
          </h1>
          {description && (
            <p className="text-sm text-gray-500 mt-1">{description}</p>
          )}
        </div>
        {actions && <div className="shrink-0">{actions}</div>}
      </div>
      {children}
    </div>
  );
}
