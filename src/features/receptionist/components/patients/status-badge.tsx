import { CalendarClock, CheckCircle2, Clock } from "lucide-react";
import { cn } from "@/lib/utils/tailwind-merge";
import { StudyStatus } from "@/lib/types/receptionist";

export const StatusBadge = ({ status }: { status: StudyStatus }) => {
  const config: Record<
    StudyStatus,
    { icon: React.ElementType; className: string; label: string }
  > = {
    Completed: {
      icon: CheckCircle2,
      className: "bg-green-100 text-green-700 border-green-200",
      label: "Completed",
    },
    Scheduled: {
      icon: CalendarClock,
      className: "bg-gray-100 text-gray-500 border-gray-200",
      label: "Scheduled",
    },
    Viewed: {
      icon: Clock,
      className: "bg-blue-50 text-blue-600 border-blue-200",
      label: "Viewed",
    },
    "In Progress": {
      icon: Clock,
      className: "bg-orange-100 text-red-700 border-red-200",
      label: "Pending",
    },
  };

  const { icon: Icon, className, label } = config[status] ?? config.Scheduled;

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border",
        className,
      )}
    >
      <Icon className="w-3.5 h-3.5" />
      {label}
    </span>
  );
};
