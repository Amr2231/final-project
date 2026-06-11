import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils/tailwind-merge";

// types
type MetricCardProps = {
  label: string;
  value: number | string;
  icon: LucideIcon;
  accent?: string;
  danger?: boolean;
  sublabel?: string;
};

// main
export function MetricCard({
  label,
  value,
  icon: Icon,
  accent,
  danger,
  sublabel,
}: MetricCardProps) {
  return (
    <div
      className={cn(
        "rounded-xl border p-4 flex items-center gap-4 transition-colors",
        danger
          ? "border-red-200 bg-red-50 dark:bg-red-950/20 dark:border-red-900"
          : "border-gray-200 bg-white dark:bg-gray-950 dark:border-gray-800",
      )}
    >
      <div
        className={cn(
          "p-2 rounded-lg shrink-0",
          danger
            ? "bg-red-100 dark:bg-red-900/40"
            : (accent ?? "bg-gray-100 dark:bg-gray-800"),
        )}
      >
        <Icon
          className={cn(
            "w-5 h-5",
            danger ? "text-red-600" : "text-gray-600 dark:text-gray-300",
          )}
        />
      </div>
      <div className="min-w-0">
        <p className="text-xs text-gray-500 truncate">{label}</p>
        <p
          className={cn(
            "text-2xl font-semibold tabular-nums",
            danger
              ? "text-red-700 dark:text-red-400"
              : "text-gray-900 dark:text-gray-100",
          )}
        >
          {value}
        </p>
        {sublabel && (
          <p className="text-[10px] text-gray-400 mt-0.5">{sublabel}</p>
        )}
      </div>
    </div>
  );
}
