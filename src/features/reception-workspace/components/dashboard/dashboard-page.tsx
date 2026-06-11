"use client";

import {
  CalendarCheck,
  Clock,
  LayoutDashboard,
  ListOrdered,
  UserCheck,
  Users,
  UserX,
  Activity,
} from "lucide-react";
import { ReceptionPageShell } from "../shared/reception-page-shell";
import {
  MetricCard,
  MetricGrid,
  BarChart,
  MiniBar,
  ReceptionLoadingState,
  StatusBadge,
  PriorityBadge,
  DoctorStatusBadge,
} from "../shared/ui";
import { useReceptionDashboard } from "../../hooks/use-reception";
import { EmptyState } from "@/components/ui/empty-state";

export function DashboardPage() {
  const { data, isLoading, isError } = useReceptionDashboard();

  if (isLoading) return <ReceptionLoadingState />;
  if (isError || !data) {
    return (
      <ReceptionPageShell title="Reception Dashboard">
        <p className="text-sm text-destructive">
          Unable to load dashboard data.
        </p>
      </ReceptionPageShell>
    );
  }

  const { metrics, live_queue, upcoming, doctors, charts, priority_overview } =
    data;

  return (
    <ReceptionPageShell
      title="Reception Dashboard"
      description="Real-time overview of today's front desk operations"
    >
      <MetricGrid>
        <MetricCard
          label="Total Appointments Today"
          value={metrics.total_today}
          icon={CalendarCheck}
          accent="bg-blue-100 dark:bg-blue-900/40"
        />
        <MetricCard
          label="Checked In"
          value={metrics.checked_in}
          icon={UserCheck}
          accent="bg-cyan-100 dark:bg-cyan-900/40"
        />
        <MetricCard
          label="Waiting"
          value={metrics.waiting}
          icon={Clock}
          accent="bg-yellow-100 dark:bg-yellow-900/40"
        />
        <MetricCard
          label="Completed"
          value={metrics.completed}
          icon={LayoutDashboard}
          accent="bg-green-100 dark:bg-green-900/40"
        />
        <MetricCard
          label="No Shows"
          value={metrics.no_shows}
          icon={UserX}
          danger={metrics.no_shows > 0}
        />
      </MetricGrid>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
        <div className="xl:col-span-2 rounded-xl border bg-card p-4">
          <div className="flex items-center gap-2 mb-4">
            <ListOrdered className="w-4 h-4 text-blue-800 dark:text-blue-300" />
            <h2 className="font-semibold text-sm">Live Queue</h2>
          </div>
          {live_queue.length === 0 ? (
            <EmptyState
              title="Queue is empty"
              description="There are no patients currently in the queue."
              icon={Users}
            />
          ) : (
            <div className="space-y-2">
              {live_queue.map((item, i) => (
                <div
                  key={`${item.queue_id}-${i}`}
                  className="flex items-center justify-between gap-3 p-3 rounded-lg bg-muted/40 border border-border/50"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#8B1A2B]/10 text-[#8B1A2B] text-sm font-bold">
                      {item.queue_position}
                    </span>
                    <div className="min-w-0">
                      <p className="text-sm font-medium truncate">
                        {item.patient_name}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {item.doctor_name}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <PriorityBadge label={item.priority_level} />
                    <StatusBadge label={item.board_status} />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="rounded-xl border bg-card p-4">
          <h2 className="font-semibold text-sm mb-4">Upcoming Appointments</h2>
          <div className="space-y-2">
            {upcoming.length === 0 ? (
              <EmptyState
                title="No Upcoming Appointments"
                description="There are no appointments scheduled for today."
                icon={Clock}
              />
            ) : (
              upcoming.map((a) => (
                <div
                  key={a.appointment_id}
                  className="flex justify-between gap-2 text-sm py-2 border-b last:border-0"
                >
                  <div>
                    <p className="font-medium">{a.patient_name}</p>
                    <p className="text-xs text-muted-foreground">
                      {a.doctor_name}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-mono text-xs">
                      {String(a.appointment_time).slice(0, 5)}
                    </p>
                    <StatusBadge label={a.status} />
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="rounded-xl border bg-card p-4">
          <h2 className="font-semibold text-sm mb-4">Doctor Availability</h2>
          <div className="space-y-2">
            {doctors.map((d) => (
              <div
                key={d.doctor_id}
                className="flex items-center justify-between p-2 rounded-lg hover:bg-muted/50"
              >
                <div>
                  <p className="text-sm font-medium">{d.doctor_name}</p>
                  <p className="text-xs text-muted-foreground">
                    {d.today_appointments ?? 0} today · workload{" "}
                    {d.workload_count}
                  </p>
                </div>
                <DoctorStatusBadge label={d.status} />
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-xl border bg-card p-4">
          <h2 className="font-semibold text-sm mb-4">
            Priority Queue Overview
          </h2>
          <div className="flex flex-wrap gap-2 mb-4 justify-center">
            {priority_overview.map((p) => (
              <div
                key={p.priority_level}
                className="flex items-center gap-2 rounded-lg border px-3 py-2"
              >
                <PriorityBadge label={p.priority_level} />
                <span className="text-lg font-semibold tabular-nums">
                  {p.count}
                </span>
              </div>
            ))}
            {priority_overview.length === 0 && (
              <EmptyState
                title="No Priority Patients"
                description="There are no patients with elevated priority levels."
                icon={Users}
              />
            )}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="rounded-xl border bg-card p-4">
          <h2 className="font-semibold text-sm mb-4">
            Appointment Trends (7 days)
          </h2>
          <BarChart
            title=""
            data={charts.appointment_trends.map((r) => ({
              label: new Date(r.day).toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
              }),
              value: r.total,
            }))}
            className="border-0 p-0 shadow-none"
          />
        </div>
        <div className="rounded-xl border bg-card p-4">
          <h2 className="font-semibold text-sm mb-4">
            Check-In Activity Today
          </h2>
          <div className="space-y-2">
            {charts.check_in_activity.length === 0 ? (
              <EmptyState
                title="No Check-In Activity"
                description="There is no check-in activity today."
                icon={Clock}
              />
            ) : (
              charts.check_in_activity.map((r) => {
                const max = Math.max(
                  ...charts.check_in_activity.map((x) => x.count),
                  1,
                );
                return (
                  <MiniBar
                    key={r.hour}
                    label={`${r.hour}:00`}
                    value={r.count}
                    max={max}
                  />
                );
              })
            )}
          </div>
        </div>
        <div className="rounded-xl border bg-card p-4">
          <h2 className="font-semibold text-sm mb-4">Daily Operations</h2>
          <div className="space-y-2">
            {charts.daily_operations.length === 0 ? (
              <EmptyState
                title="No Operations Data"
                description="There is no operations data available for today."
                icon={Activity}
              />
            ) : (
              charts.daily_operations.map((r) => (
                <div
                  key={r.status}
                  className="flex items-center justify-between text-sm"
                >
                  <StatusBadge label={r.status} />
                  <span className="font-semibold tabular-nums">{r.count}</span>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </ReceptionPageShell>
  );
}
