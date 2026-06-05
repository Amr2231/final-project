import { cn } from "@/lib/utils/tailwind-merge";
import type { PatientStatus } from "@/lib/types/doctor";
import {
  formatReportStatusLabel,
  normalizeReportStatus,
} from "@/features/doctor/utils/report-status";

// Report status Badge
export const ReportStatusBadge = ({ status }: { status: string }) => {
  const normalized = normalizeReportStatus(status);
  const config: Record<string, string> = {
    "not written": "bg-red-100 text-red-600 border-red-200",
    written: "bg-yellow-100 text-yellow-600 border-yellow-200",
    signed: "bg-green-100 text-green-600 border-green-200",
  };

  return (
    <span
      className={cn(
        "inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium border",
        config[normalized] ?? config["not written"],
      )}
    >
      {formatReportStatusLabel(status)}
    </span>
  );
};

export const PatientStatusBadge = ({ status }: { status: PatientStatus | string }) => {
  const normalized =
    status === "In Progress"
      ? "Viewed"
      : status === "Pending"
        ? "Viewed"
        : status;

  const config: Record<string, string> = {
    Scheduled: "bg-gray-100 text-gray-700 border-gray-200",
    Viewed: "bg-blue-50 text-blue-600 border-blue-200",
    Completed: "bg-green-50 text-green-700 border-green-200",
  };

  const label =
    status === "In Progress"
      ? "Pending"
      : String(normalized);

  return (
    <span
      className={cn(
        "inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium border",
        config[String(normalized)] ?? config.Scheduled,
      )}
    >
      {label}
    </span>
  );
};
