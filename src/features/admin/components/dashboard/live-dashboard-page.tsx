"use client";

import dynamic from "next/dynamic";
import {
  Activity,
  Brain,
  FileText,
  ShieldAlert,
  Stethoscope,
  Users,
  Wifi,
} from "lucide-react";
import { formatFullTimestamp } from "@/lib/utils/date-format";
import {
  AdminErrorState,
  AdminLoadingState,
  AdminPageShell,
  BarChart,
  MetricCard,
  MetricGrid,
} from "../shared";
import { useDashboard } from "../../hooks/use-dashboard";

// dynamically import the LiveIndicator component
const LiveIndicator = dynamic(
  () => import("./live-indicator").then((m) => ({ default: m.LiveIndicator })),
  { ssr: false },
);

// live dashboard page
export function LiveDashboardPage() {
  // fetch dashboard data
  const { data, isLoading, isError, refetch, dataUpdatedAt } = useDashboard();
  const dashboard = data?.data;

  // Loading state
  if (isLoading) return <AdminLoadingState />;
  // Error state
  if (isError || !dashboard) {
    return (
      <AdminPageShell
        title="Live Dashboard"
        description="Real-time system overview"
      >
        {/* render error state */}
        <AdminErrorState onRetry={() => refetch()} />
      </AdminPageShell>
    );
  }

  // destructure dashboard data
  const { users, patients, studies, ai, reports, activity } = dashboard;

  return (
    <AdminPageShell
      title="Live Dashboard"
      description="Real-time system health and activity overview"
      actions={
        <div className="flex items-center gap-3 text-xs text-gray-500">
          {/* render live indicator */}
          <LiveIndicator />
          <span className="tabular-nums">
            Updated {formatFullTimestamp(new Date(dataUpdatedAt).toISOString())}
          </span>
        </div>
      }
    >
      {/* render metric grid */}
      <MetricGrid cols={4}>
        {/* online now */}
        <MetricCard
          label="Online Now"
          value={users.online_now}
          icon={Wifi}
          accent="bg-green-100 dark:bg-green-900/40"
        />

        {/* active users */}
        <MetricCard
          label="Active Users"
          value={users.active_users}
          icon={Users}
        />

        {/* active patients */}
        <MetricCard
          label="Active Patients"
          value={patients.active_patients}
          icon={Stethoscope}
        />

        {/* studies today */}
        <MetricCard
          label="Studies Today"
          value={studies.today}
          icon={Activity}
        />
      </MetricGrid>

      {/* render metric grid */}
      <MetricGrid cols={4}>
        {/* locked accounts */}
        <MetricCard
          label="Locked Accounts"
          value={users.locked_accounts}
          icon={ShieldAlert}
          danger={users.locked_accounts > 0}
        />

        {/* ai pending */}
        <MetricCard
          label="AI Pending"
          value={ai.pending}
          icon={Brain}
          accent="bg-amber-100 dark:bg-amber-900/40"
        />

        {/* reports signed */}
        <MetricCard
          label="Reports Signed"
          value={reports.signed}
          icon={FileText}
        />

        {/* failed logins */}
        <MetricCard
          label="Failed Logins (24h)"
          value={activity.failed_logins_24h}
          icon={ShieldAlert}
          danger={activity.failed_logins_24h > 5}
        />
      </MetricGrid>

      {/* render metric grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* bar chart */}
        <BarChart
          title="Studies — Last 7 Days"
          data={studies.last_7_days.map((d) => ({
            label: new Date(d.day).toLocaleDateString("en-GB", {
              month: "short",
              day: "numeric",
            }),
            value: d.count,
          }))}
        />
        <div className="rounded-xl border border-gray-200 bg-white dark:bg-gray-950 dark:border-gray-800 p-4">
          {/* header */}
          <p className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-4">
            System Status
          </p>

          {/* metrics */}
          <div className="space-y-3">
            {[
              {
                label: "Users",
                detail: `${users.total_users} total · ${users.new_today} new today`,
              },
              {
                label: "Patients",
                detail: `${patients.total_patients} total · ${patients.new_today} new today`,
              },
              {
                label: "Studies",
                detail: `${studies.completed} completed · ${studies.in_progress} in progress`,
              },
              {
                label: "AI Pipeline",
                detail: `${ai.approved} approved · ${ai.rejected} rejected · ${ai.edited} edited`,
              },
              {
                label: "Reports",
                detail: `${reports.written} written · ${reports.signed} signed`,
              },
              {
                label: "Audit Activity",
                detail: `${activity.audit_logs_today} logs today`,
              },
            ].map((item) => (
              <div
                key={item.label}
                className="flex items-center justify-between py-2 border-b border-gray-100 dark:border-gray-800 last:border-0"
              >
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  {item.label}
                </span>
                <span className="text-xs text-gray-500">{item.detail}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* render users by role grid */}
      <div className="rounded-xl border border-gray-200 bg-white dark:bg-gray-950 dark:border-gray-800 p-4">
        <p className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
          Users by Role
        </p>
        <div className="flex flex-wrap gap-3">
          {/* render users by role */}
          {users.by_role.map((r) => (
            <div
              key={r.role_name}
              className="rounded-lg bg-gray-50 dark:bg-gray-900 px-4 py-2"
            >
              {/* role name */}
              <p className="text-xs text-gray-500">{r.role_name}</p>

              {/* count */}
              <p className="text-lg font-semibold tabular-nums text-gray-900 dark:text-gray-100">
                {r.count}
              </p>
            </div>
          ))}
        </div>
      </div>
    </AdminPageShell>
  );
}
