"use client";

import { Fragment, useState } from "react";
import { BarChart3, Globe, Shield } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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
import { EmptyState } from "@/components/ui/empty-state";
import { formatFullTimestamp } from "@/lib/utils/date-format";
import {
  AdminLoadingState,
  AdminPageShell,
  AdminTableShell,
  AdminTabs,
  MetricCard,
  MiniBar,
  TablePagination,
} from "../shared";
import {
  useFileAccessLogs,
  useGeoLogins,
  useHeatmap,
} from "../../hooks/use-analytics";

type AnalyticsTab = "heatmap" | "file-access" | "geo";

const DAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

function HeatmapGrid({
  matrix,
}: {
  matrix: { hour_of_day: number; day_of_week: number; count: number }[];
}) {
  const max = Math.max(...matrix.map((m) => m.count), 1);

  const getCount = (day: number, hour: number) =>
    matrix.find((m) => m.day_of_week === day && m.hour_of_day === hour)?.count ?? 0;

  return (
    <div className="rounded-xl border border-gray-200 bg-white dark:bg-gray-950 dark:border-gray-800 p-4 overflow-x-auto">
      <p className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-4">
        Activity Heatmap
      </p>
      <div className="min-w-[600px]">
        <div className="grid grid-cols-[40px_repeat(24,1fr)] gap-0.5">
          <div />
          {Array.from({ length: 24 }, (_, h) => (
            <div key={h} className="text-[9px] text-gray-400 text-center">
              {h}
            </div>
          ))}
          {DAYS.map((day, dayIdx) => (
            <Fragment key={day}>
              <div className="text-xs text-gray-500 flex items-center">
                {day}
              </div>
              {Array.from({ length: 24 }, (_, hour) => {
                const count = getCount(dayIdx, hour);
                const opacity = count > 0 ? Math.max(0.15, count / max) : 0.05;
                return (
                  <div
                    key={`${dayIdx}-${hour}`}
                    title={`${day} ${hour}:00 — ${count} actions`}
                    className="aspect-square rounded-sm bg-[#8B1A2B]"
                    style={{ opacity }}
                  />
                );
              })}
            </Fragment>
          ))}
        </div>
      </div>
    </div>
  );
}

export function AnalyticsPage() {
  const [tab, setTab] = useState<AnalyticsTab>("heatmap");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [filePage, setFilePage] = useState(1);
  const [entityFilter, setEntityFilter] = useState("all");

  const dateFilters = {
    from_date: fromDate || undefined,
    to_date: toDate || undefined,
  };

  const { data: heatmapData, isLoading: heatmapLoading } = useHeatmap(dateFilters);
  const { data: fileData, isFetching: fileFetching } = useFileAccessLogs({
    ...dateFilters,
    page: filePage,
    entity: entityFilter !== "all" ? entityFilter : undefined,
  });
  const { data: geoData, isLoading: geoLoading } = useGeoLogins(dateFilters);

  const tabs = [
    { id: "heatmap" as const, label: "Activity Heatmap" },
    { id: "file-access" as const, label: "File Access" },
    { id: "geo" as const, label: "Geo Logins" },
  ];

  const dateRangeFilter = (
    <div className="flex flex-wrap items-end gap-3">
      <div className="space-y-1">
        <Label htmlFor="from-date" className="text-xs">From</Label>
        <Input
          id="from-date"
          type="date"
          className="h-9 w-40"
          value={fromDate}
          onChange={(e) => setFromDate(e.target.value)}
        />
      </div>
      <div className="space-y-1">
        <Label htmlFor="to-date" className="text-xs">To</Label>
        <Input
          id="to-date"
          type="date"
          className="h-9 w-40"
          value={toDate}
          onChange={(e) => setToDate(e.target.value)}
        />
      </div>
    </div>
  );

  return (
    <AdminPageShell
      title="Analytics"
      description="System activity insights, file access monitoring and login geography"
    >
      {dateRangeFilter}
      <AdminTabs tabs={tabs} active={tab} onChange={setTab} />

      {tab === "heatmap" && (
        <div className="space-y-4">
          {heatmapLoading ? (
            <AdminLoadingState />
          ) : heatmapData?.data ? (
            <>
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                {heatmapData.data.top_actors.slice(0, 4).map((a) => (
                  <MetricCard
                    key={a.actor_id}
                    label={a.actor_name}
                    value={a.total_actions}
                    icon={BarChart3}
                    sublabel={a.actor_role}
                  />
                ))}
              </div>
              <HeatmapGrid matrix={heatmapData.data.matrix} />
              <div className="rounded-xl border border-gray-200 bg-white dark:bg-gray-950 dark:border-gray-800 p-4 space-y-2">
                <p className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                  Action Breakdown
                </p>
                {heatmapData.data.action_breakdown.slice(0, 8).map((a) => (
                  <MiniBar
                    key={a.action}
                    label={a.action.replace(/_/g, " ")}
                    value={a.count}
                    max={heatmapData.data.action_breakdown[0]?.count ?? 1}
                  />
                ))}
              </div>
            </>
          ) : null}
        </div>
      )}

      {tab === "file-access" && (
        <div className="space-y-4">
          <Select
            value={entityFilter}
            onValueChange={(v) => {
              setEntityFilter(v);
              setFilePage(1);
            }}
          >
            <SelectTrigger className="w-40 h-10">
              <SelectValue placeholder="All types" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All types</SelectItem>
              <SelectItem value="Image">Images</SelectItem>
              <SelectItem value="Report">Reports</SelectItem>
            </SelectContent>
          </Select>
          <AdminTableShell isFetching={fileFetching}>
            <Table>
              <TableHeader>
                <TableRow className="bg-gray-50/70 hover:bg-gray-50/70 border-b border-gray-200">
                  {["Timestamp", "Actor", "Entity", "Description", "IP"].map((h) => (
                    <TableHead key={h} className="text-xs font-semibold text-gray-500 first:pl-4">
                      {h}
                    </TableHead>
                  ))}
                </TableRow>
              </TableHeader>
              <TableBody>
                {!fileData?.data.length ? (
                  <TableRow>
                    <TableCell colSpan={5} className="py-10">
                      <EmptyState icon={Shield} title="No file access logs" description="No file access activity recorded." />
                    </TableCell>
                  </TableRow>
                ) : (
                  fileData.data.map((log) => (
                    <TableRow key={log.audit_log_id} className="border-b border-gray-100 hover:bg-gray-50/60">
                      <TableCell className="pl-4 text-sm tabular-nums whitespace-nowrap text-gray-600">
                        {formatFullTimestamp(log.created_at)}
                      </TableCell>
                      <TableCell className="text-sm font-medium text-gray-800">
                        {log.actor_name ?? "—"}
                      </TableCell>
                      <TableCell className="text-sm text-gray-600">{log.entity}</TableCell>
                      <TableCell className="text-sm text-gray-600 max-w-xs truncate">
                        {log.description ?? "—"}
                      </TableCell>
                      <TableCell className="font-mono text-xs text-gray-500">
                        {log.ip_address ?? "—"}
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </AdminTableShell>
          <TablePagination
            page={filePage}
            totalPages={fileData?.pages ?? 1}
            onPageChange={setFilePage}
          />
        </div>
      )}

      {tab === "geo" && (
        <div className="space-y-4">
          {geoLoading ? (
            <AdminLoadingState />
          ) : geoData?.data ? (
            <>
              <MetricCard label="Total Login Events" value={geoData.data.total} icon={Globe} />
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                <div className="rounded-xl border border-gray-200 bg-white dark:bg-gray-950 dark:border-gray-800 p-4">
                  <p className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
                    Top Countries
                  </p>
                  {geoData.data.countries.length === 0 ? (
                    <p className="text-sm text-gray-400">No geo data available</p>
                  ) : (
                    geoData.data.countries.map((c) => (
                      <MiniBar
                        key={c.code}
                        label={c.code}
                        value={c.count}
                        max={geoData.data.countries[0]?.count ?? 1}
                      />
                    ))
                  )}
                </div>
                <AdminTableShell>
                  <Table>
                    <TableHeader>
                      <TableRow className="bg-gray-50/70 hover:bg-gray-50/70 border-b border-gray-200">
                        {["User", "Location", "IP", "Time"].map((h) => (
                          <TableHead key={h} className="text-xs font-semibold text-gray-500 first:pl-4">
                            {h}
                          </TableHead>
                        ))}
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {geoData.data.data.slice(0, 10).map((entry, i) => (
                        <TableRow key={`${entry.actor_id}-${i}`} className="border-b border-gray-100">
                          <TableCell className="pl-4 text-sm font-medium text-gray-800">
                            {entry.actor_name}
                          </TableCell>
                          <TableCell className="text-sm text-gray-600">
                            {entry.geo
                              ? `${entry.geo.city}, ${entry.geo.country}`
                              : "Unknown"}
                          </TableCell>
                          <TableCell className="font-mono text-xs text-gray-500">
                            {entry.ip_address}
                          </TableCell>
                          <TableCell className="text-sm tabular-nums text-gray-600 whitespace-nowrap">
                            {formatFullTimestamp(entry.created_at)}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </AdminTableShell>
              </div>
            </>
          ) : null}
        </div>
      )}
    </AdminPageShell>
  );
}
