"use client";

import { cn } from "@/lib/utils/tailwind-merge";

export type AdminTab<T extends string> = {
  id: T;
  label: string;
  count?: number;
};

type AdminTabsProps<T extends string> = {
  tabs: AdminTab<T>[];
  active: T;
  onChange: (id: T) => void;
  className?: string;
};

export function AdminTabs<T extends string>({
  tabs,
  active,
  onChange,
  className,
}: AdminTabsProps<T>) {
  return (
    <div className={cn("flex gap-1 border-b border-gray-200 dark:border-gray-800", className)}>
      {tabs.map((tab) => (
        <button
          key={tab.id}
          type="button"
          onClick={() => onChange(tab.id)}
          className={cn(
            "px-4 py-2 text-sm font-medium border-b-2 -mb-px transition-colors",
            active === tab.id
              ? "border-blue-600 text-blue-600"
              : "border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400",
          )}
        >
          {tab.label}
          {tab.count != null && tab.count > 0 && (
            <span className="ml-1.5 text-xs tabular-nums opacity-70">
              ({tab.count})
            </span>
          )}
        </button>
      ))}
    </div>
  );
}
