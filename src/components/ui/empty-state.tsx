import { type LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils/tailwind-merge";

interface EmptyStateProps {
  icon: LucideIcon;
  title: string;
  description?: string;
  className?: string;
}

export function EmptyState({
  icon: Icon,
  title,
  description,
  className,
}: EmptyStateProps) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center py-12 gap-4",
        className,
      )}
    >
      <div className="w-14 h-14 rounded-full bg-blue-100 flex items-center justify-center">
        <Icon className="w-6 h-6 text-blue-800" />
      </div>
      <div className="text-center">
        <p className="text-sm font-medium text-gray-900 mb-1">{title}</p>
        {description && <p className="text-xs text-gray-400">{description}</p>}
      </div>
    </div>
  );
}

EmptyState.displayName = "EmptyState";