import type { ReactNode } from "react";
import { cn } from "@/lib/utils/tailwind-merge";

// types
type AdminPageShellProps = {
  title: string;
  description?: string;
  actions?: ReactNode;
  children: ReactNode;
  className?: string;
};

// component
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
          {/* title */}
          <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
            {title}
          </h1>

          {/* description */}
          {description && (
            <p className="text-sm text-gray-500 mt-1">{description}</p>
          )}
        </div>

        {/* actions */}
        {actions && <div className="shrink-0">{actions}</div>}
      </div>
      {children}
    </div>
  );
}
