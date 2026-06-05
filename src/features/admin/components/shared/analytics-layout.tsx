import type { ReactNode } from "react";
import { cn } from "@/lib/utils/tailwind-merge";

type AnalyticsLayoutProps = {
  filters?: ReactNode;
  kpis?: ReactNode;
  children: ReactNode;
  className?: string;
};

export function AnalyticsLayout({
  filters,
  kpis,
  children,
  className,
}: AnalyticsLayoutProps) {
  return (
    <div className={cn("space-y-6", className)}>
      {filters}
      {kpis && (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">{kpis}</div>
      )}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">{children}</div>
    </div>
  );
}

type MetricGridProps = {
  children: ReactNode;
  cols?: 2 | 3 | 4;
};

export function MetricGrid({ children, cols = 4 }: MetricGridProps) {
  const colClass =
    cols === 2
      ? "grid-cols-2"
      : cols === 3
        ? "grid-cols-2 lg:grid-cols-3"
        : "grid-cols-2 lg:grid-cols-4";
  return <div className={cn("grid gap-4", colClass)}>{children}</div>;
}
