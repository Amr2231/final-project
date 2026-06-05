import { cn } from "@/lib/utils/tailwind-merge";
import { PRIORITY_COLORS, STATUS_COLORS, DOCTOR_STATUS_COLORS } from "../../constants";

type BadgeProps = {
  label: string;
  className?: string;
};

export function StatusBadge({ label, className }: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium",
        STATUS_COLORS[label] ?? "bg-gray-100 text-gray-700",
        className,
      )}
    >
      {label}
    </span>
  );
}

export function PriorityBadge({ label, className }: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold",
        PRIORITY_COLORS[label] ?? PRIORITY_COLORS.Normal,
        className,
      )}
    >
      {label}
    </span>
  );
}

export function DoctorStatusBadge({ label, className }: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium",
        DOCTOR_STATUS_COLORS[label] ?? "bg-gray-100 text-gray-700",
        className,
      )}
    >
      {label}
    </span>
  );
}

export { MetricCard } from "@/features/admin/components/shared/metric-card";
export { MetricGrid } from "@/features/admin/components/shared/analytics-layout";
export { TablePagination } from "@/features/admin/components/shared/table-pagination";
export { TableToolbar } from "@/features/admin/components/shared/table-toolbar";
export { AdminLoadingState as ReceptionLoadingState } from "@/features/admin/components/shared/admin-loading-state";
export { BarChart, MiniBar } from "@/features/admin/components/shared/bar-chart";
