"use client";

import Link from "next/link";
import {
  Activity,
  Brain,
  Clock,
  FileText,
  Star,
  Stethoscope,
  Users,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { formatFullTimestamp } from "@/lib/utils/date-format";
import { formatReportStatusLabel } from "@/features/doctor/utils/report-status";
import {
  BarChart,
  DoctorErrorState,
  DoctorLoadingState,
  DoctorPageShell,
  MetricCard,
  MetricGrid,
} from "../shared/ui";
import { useDoctorDashboard } from "../../hooks/use-dashboard";
import { EmptyState } from "@/components/ui/empty-state";

// doctor dashboard page component
export function DoctorDashboardPage() {
  // custom hook
  const { data, isLoading, isError, refetch, dataUpdatedAt } =
    useDoctorDashboard();

  // Handle loading state by showing a loading component while the dashboard data is being fetched
  if (isLoading) return <DoctorLoadingState />;
  if (isError || !data?.stats) {
    return (
      <DoctorPageShell title="Dashboard" description="Your clinical overview">
        <DoctorErrorState onRetry={() => refetch()} />
      </DoctorPageShell>
    );
  }

  // Destructure necessary data from the dashboard query result for easier access in the component
  const {
    stats,
    recent_patients,
    today_schedule,
    upcoming_followups,
    watchlist,
  } = data;

  // Render the dashboard page
  return (
    <DoctorPageShell
      title="Dashboard"
      description="Your clinical overview for today"
      actions={
        <span className="text-xs text-gray-500 tabular-nums">
          Updated {formatFullTimestamp(new Date(dataUpdatedAt).toISOString())}
        </span>
      }
    >
      {/* Metric Grid */}
      <MetricGrid cols={4}>
        {/* Metric Card for each patient today */}
        <MetricCard
          label="Patients Today"
          value={stats.patients_today}
          icon={Stethoscope}
          accent="bg-green-100 dark:bg-green-900/40"
        />
        {/* Metric Card for average consultation time */}
        <MetricCard
          label="Avg Consultation"
          value={`${Math.max(0, stats.avg_consultation_min ?? 0)}m`}
          icon={Clock}
        />
        {/* Metric Card for prescriptions */}
        <MetricCard
          label="Studies This Month"
          value={stats.prescriptions_month}
          icon={FileText}
        />
        {/* Metric Card for follow-up rate */}
        <MetricCard
          label="Follow-up Rate"
          value={`${stats.followup_completion_pct}%`}
          icon={Activity}
        />
      </MetricGrid>

      {/* Metric Grid */}
      <MetricGrid cols={3}>
        {/* Metric Card for AI Accept Rate */}
        <MetricCard
          label="AI Accept Rate"
          value={`${stats.ai_accept_rate_pct}%`}
          icon={Brain}
        />
        {/* Metric Card for today's schedule */}
        <MetricCard
          label="Schedule Today"
          value={today_schedule.length}
          icon={Users}
        />
        {/* Metric Card for watchlist */}
        <MetricCard
          label="Watchlist"
          value={watchlist.length}
          icon={Star}
          accent="bg-amber-100 dark:bg-amber-900/40"
        />
      </MetricGrid>

      {/* Today's Schedule */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <section className="rounded-xl border border-border bg-card p-4">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-sm font-semibold text-foreground">
              Today&apos;s Schedule
            </h2>
            {/* view all */}
            <Link
              href="/doctor/schedule"
              className="text-xs text-blue-800 hover:underline"
            >
              View all
            </Link>
          </div>
          {today_schedule.length === 0 ? (
            // <p className="text-sm text-gray-400 py-6 text-center">
              <EmptyState
                title="No scheduled patients for today"
                description="You have no patients scheduled for today. Check your schedule later or add new appointments."
                icon={Stethoscope}
              />
            // </p>
          ) : (
            <ul className="space-y-2">
              {today_schedule.slice(0, 5).map((item) => (
                <li
                  key={item.study_id}
                  className="flex items-center justify-between py-2 border-b border-border last:border-0"
                >
                  <div>
                    <p className="text-sm font-medium text-foreground">
                      {item.first_name} {item.last_name}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {item.study_type} · {formatFullTimestamp(item.study_date)}
                    </p>
                  </div>
                  <Link href={`/doctor/patients/${item.study_id}/report`}>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-blue-800 h-8 text-xs"
                    >
                      Open
                    </Button>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </section>

        {/* Watchlist */}
        <section className="rounded-xl border border-border bg-card p-4">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-sm font-semibold text-foreground">
              Watchlist
            </h2>
            {/* manage */}
            <Link
              href="/doctor/watchlist"
              className="text-xs text-blue-800 hover:underline"
            >
              Manage
            </Link>
          </div>
          {watchlist.length === 0 ? (
            // <p className="text-sm text-gray-400 py-6 text-center">
              <EmptyState
                title="Your watchlist is empty"
                description="Add patients to your watchlist to easily track their status and receive follow-up reminders."
                icon={Star}
              />
            // </p>
          ) : (
            <ul className="space-y-2">
              {watchlist.map((w) => (
                <li
                  key={w.national_id}
                  className="flex items-center justify-between py-2 border-b border-border last:border-0"
                >
                  <div>
                    <p className="text-sm font-medium text-foreground">
                      {w.first_name} {w.last_name}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {w.note || "No note"}
                    </p>
                  </div>
                  <span
                    className={`text-xs font-medium px-2 py-0.5 rounded-full border ${w.priority === "critical" ? "bg-red-50 text-red-700 border-red-200 dark:bg-red-950/40 dark:text-red-300 dark:border-red-900" : "bg-muted text-muted-foreground border-border"}`}
                  >
                    {w.priority}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </section>

        {/* Recent Patients */}
        <section className="rounded-xl border border-border bg-card p-4">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-sm font-semibold text-foreground">
              Recent Patients
            </h2>
            {/* view all */}
            <Link
              href="/doctor/recent-patients"
              className="text-xs text-blue-800 hover:underline"
            >
              View all
            </Link>
          </div>
          {recent_patients.length === 0 ? (
            // <p className="text-sm text-gray-400 py-6 text-center">
              <EmptyState
                title="No recent patients"
                description="You have not seen any patients recently. Once you start seeing patients, they will appear here for quick access."
                icon={Users}
              />
            // </p>
          ) : (
            <ul className="space-y-2">
              {recent_patients.slice(0, 5).map((p) => (
                <li
                  key={`${p.national_id}-${p.study_id}`}
                  className="flex items-center justify-between py-2 border-b border-border last:border-0"
                >
                  <div>
                    <p className="text-sm font-medium text-foreground">
                      {p.first_name} {p.last_name}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {p.study_type} ·{" "}
                      {formatReportStatusLabel(p.report_status)}
                    </p>
                  </div>
                  <Link href={`/doctor/patients/profile/${p.national_id}`}>
                    <Button variant="ghost" size="sm" className="h-8 text-xs">
                      Profile
                    </Button>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </section>

        {/* Follow-up Reminders */}
        <section className="rounded-xl border border-border bg-card p-4">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-sm font-semibold text-foreground">
              Follow-up Reminders
            </h2>
            {/* center */}
            <Link
              href="/doctor/follow-ups"
              className="text-xs text-blue-800 hover:underline"
            >
              Center
            </Link>
          </div>
          {upcoming_followups.length === 0 ? (
            // <p className="text-sm text-gray-400 py-6 text-center">
              <EmptyState
                title="No upcoming follow-ups"
                description="You have no follow-up reminders scheduled. Once you set up follow-ups, they will appear here."
                icon={Clock}
              />
            // </p>
          ) : (
            <ul className="space-y-2">
              {upcoming_followups.map((f) => (
                <li
                  key={f.reminder_id}
                  className="py-2 border-b border-border last:border-0"
                >
                  <p className="text-sm font-medium text-foreground">
                    {f.first_name} {f.last_name}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {f.reason} · in {f.days_remaining}d
                  </p>
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>

      <BarChart
        title="Recent Activity (schedule volume)"
        data={today_schedule.map((s, i) => ({
          label: s.study_type.slice(0, 3) + i,
          value: 1,
        }))}
        color="bg-blue-800"
      />
    </DoctorPageShell>
  );
}
