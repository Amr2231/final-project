"use client";

import { useState } from "react";
import { Brain } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils/tailwind-merge";
import { EmptyState } from "@/components/ui/empty-state";
import { formatFullTimestamp } from "@/lib/utils/date-format";
import {
  AdminLoadingState,
  AdminPageShell,
  AdminTableShell,
  AdminTabs,
  BarChart,
  MetricCard,
  MetricGrid,
  MiniBar,
} from "../shared";
import { useAIResults, useAIStats } from "../../hooks/use-ai-stats";
import PaginationWrapper from "@/components/ui/paginationWrapper";

// types
type AITab = "stats" | "results";

// constants
const STATUS_STYLES: Record<string, string> = {
  Pending: "bg-amber-50 text-amber-700 border-amber-200",
  Approved: "bg-green-50 text-green-700 border-green-200",
  Rejected: "bg-red-50 text-red-700 border-red-200",
  Edited: "bg-blue-50 text-blue-700 border-blue-200",
};

// status badges
function StatusBadge({ status }: { status: string }) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border px-2 py-0.5 text-xs font-medium",
        STATUS_STYLES[status] ?? "bg-gray-50 text-gray-600 border-gray-200",
      )}
    >
      {status}
    </span>
  );
}

// diagnosis badges
function DiagnosisBadge({
  result,
}: {
  result: { has_hfref: number; has_lvh: number };
}) {
  const hf = Number(result.has_hfref) === 1;
  const lvh = Number(result.has_lvh) === 1;
  const label =
    !hf && !lvh
      ? "Normal"
      : hf && lvh
        ? "HF + LVH"
        : hf
          ? "Heart Failure"
          : "LVH";
  const style =
    !hf && !lvh
      ? "bg-emerald-50 text-emerald-700 border-emerald-200"
      : "bg-rose-50 text-rose-700 border-rose-200";
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border px-2 py-0.5 text-xs font-medium",
        style,
      )}
    >
      {label}
    </span>
  );
}

// main component
export function AIDetectionPage() {
  // state
  const [tab, setTab] = useState<AITab>("stats");
  const [statusFilter, setStatusFilter] = useState("all");
  const [page, setPage] = useState(1);

  // hooks
  const { data: statsData, isLoading: statsLoading } = useAIStats();
  const { data: resultsData, isFetching: resultsFetching } = useAIResults({
    page,
    status: statusFilter !== "all" ? statusFilter : undefined,
  });

  // computed values
  const stats = statsData?.data;
  const results = resultsData?.data ?? [];
  const totalPages = resultsData?.pages ?? 1;

  // tabs and filters
  const tabs = [
    { id: "stats" as const, label: "Statistics" },
    {
      id: "results" as const,
      label: "Detection History",
      count: resultsData?.total,
    },
  ];

  return (
    <AdminPageShell
      title="AI Smart Detection"
      description="Monitor AI analysis runs, validation status and abnormal patterns"
    >
      {/* tabs */}
      <AdminTabs tabs={tabs} active={tab} onChange={setTab} />

      {/* stats tab content */}
      {tab === "stats" && (
        <div className="space-y-6">
          {/* loading state */}
          {statsLoading ? (
            <AdminLoadingState />
          ) : stats ? (
            <>
              {/* metric grid */}
              <MetricGrid cols={4}>
                {/* metric card for total runs */}
                <MetricCard
                  label="Total AI Runs"
                  value={stats.total_runs}
                  icon={Brain}
                />

                {/* metric card for edited results */}
                <MetricCard
                  label="Edited Results"
                  value={stats.edited_results}
                  icon={Brain}
                  accent="bg-blue-100 dark:bg-blue-900/40"
                />

                {/* metric cards for each status */}
                {stats.by_status.map((s) => (
                  <MetricCard
                    key={s.status}
                    label={s.status}
                    value={s.count}
                    icon={Brain}
                  />
                ))}
              </MetricGrid>

              {/* bar charts */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                <BarChart
                  title="AI Runs — Last 7 Days"
                  data={stats.runs_last_7_days.map((d) => ({
                    label: d.day.slice(5),
                    value: d.count,
                  }))}
                />

                {/* diagnosis distribution */}
                <div className="rounded-xl border border-gray-200 bg-white dark:bg-gray-950 dark:border-gray-800 p-4 space-y-3">
                  <p className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                    Diagnosis Distribution
                  </p>

                  {/* mini bars */}
                  <MiniBar
                    label="Normal"
                    value={stats.diagnosis_dist.normal}
                    max={stats.total_runs}
                    color="bg-emerald-500"
                  />
                  <MiniBar
                    label="HF Only"
                    value={stats.diagnosis_dist.hf_only}
                    max={stats.total_runs}
                    color="bg-rose-500"
                  />
                  <MiniBar
                    label="LVH Only"
                    value={stats.diagnosis_dist.lvh_only}
                    max={stats.total_runs}
                    color="bg-orange-500"
                  />
                  <MiniBar
                    label="Both"
                    value={stats.diagnosis_dist.both}
                    max={stats.total_runs}
                    color="bg-red-600"
                  />

                  {/* average ef */}
                  <div className="pt-2 border-t border-gray-100 dark:border-gray-800 text-xs text-gray-500">
                    Avg EF: {stats.averages.avg_ef.toFixed(1)}% · Avg Wall:{" "}
                    {stats.averages.avg_wall_thickness.toFixed(1)}mm
                  </div>
                </div>
              </div>
            </>
          ) : null}
        </div>
      )}

      {/* results tab content */}
      {tab === "results" && (
        <div className="space-y-4">
          {/* status filters */}
          <Select
            value={statusFilter}
            onValueChange={(v) => {
              setStatusFilter(v);
              setPage(1);
            }}
          >
            <SelectTrigger className="w-44 h-10">
              <SelectValue placeholder="All statuses" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All statuses</SelectItem>
              <SelectItem value="Pending">Pending</SelectItem>
              <SelectItem value="Approved">Approved</SelectItem>
              <SelectItem value="Rejected">Rejected</SelectItem>
              <SelectItem value="Edited">Edited</SelectItem>
            </SelectContent>
          </Select>

          {/* table shell for results */}
          <AdminTableShell isFetching={resultsFetching}>
            <Table>
              <TableHeader>
                <TableRow className="bg-gray-50/70 hover:bg-gray-50/70 border-b border-gray-200">
                  {[
                    "Study",
                    "EF",
                    "Wall",
                    "Diagnosis",
                    "Status",
                    "Validated By",
                    "Date",
                  ].map((h) => (
                    <TableHead
                      key={h}
                      className="text-xs font-semibold text-gray-500 first:pl-4"
                    >
                      {h}
                    </TableHead>
                  ))}
                </TableRow>
              </TableHeader>
              <TableBody>
                {/* results rows */}
                {results.length === 0 ? (
                  <TableRow>
                    {/* empty state */}
                    <TableCell colSpan={7} className="py-10">
                      <EmptyState
                        icon={Brain}
                        title="No AI results"
                        description="No detection history found."
                      />
                    </TableCell>
                  </TableRow>
                ) : (
                  results.map((r) => (
                    <TableRow
                      key={r.study_id}
                      className="border-b border-gray-100 hover:bg-gray-50/60"
                    >
                      {/* study id */}
                      <TableCell className="pl-4 text-sm font-medium text-gray-800">
                        #{r.study_id}
                      </TableCell>
                      {/* ef and wall */}
                      <TableCell className="text-sm tabular-nums">
                        {r.ejection_fraction}%
                      </TableCell>

                      {/* wall thickness */}
                      <TableCell className="text-sm tabular-nums">
                        {r.wall_thickness}mm
                      </TableCell>

                      {/* diagnosis */}
                      <TableCell>
                        <DiagnosisBadge result={r} />
                      </TableCell>

                      {/* status */}
                      <TableCell>
                        <StatusBadge status={r.validation_status} />
                      </TableCell>

                      {/* validated by name */}
                      <TableCell className="text-sm text-gray-600">
                        {r.validated_by_name ?? "—"}
                      </TableCell>

                      {/* date */}
                      <TableCell className="text-sm text-gray-600 tabular-nums whitespace-nowrap">
                        {formatFullTimestamp(r.created_at)}
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </AdminTableShell>

          {/* pagination */}
          <PaginationWrapper
            currentPage={page}
            totalPages={totalPages}
            onPageChange={setPage}
          />
        </div>
      )}
    </AdminPageShell>
  );
}
