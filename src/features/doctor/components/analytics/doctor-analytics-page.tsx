"use client";

import { useState } from "react";
import { Activity, Brain, CheckCircle2, Clock, FileText } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  BarChart,
  DoctorErrorState,
  DoctorLoadingState,
  DoctorPageShell,
  MetricCard,
  MetricGrid,
  MiniBar,
} from "../shared/ui";
import { useDoctorPerformance } from "../../hooks/use-dashboard";

// dummy data
const PERIODS = [
  { value: "week", label: "This Week" },
  { value: "month", label: "This Month" },
  { value: "quarter", label: "Quarter" },
  { value: "year", label: "Year" },
];

// main component
export function DoctorAnalyticsPage() {
  // hooks
  const [period, setPeriod] = useState("month");
  const { data, isLoading, isError, refetch } = useDoctorPerformance(period);

  // render states
  if (isLoading) return <DoctorLoadingState />;
  if (isError || !data?.performance) {
    return (
      <DoctorPageShell
        title="Analytics"
        description="Performance metrics from your practice"
      >
        <DoctorErrorState onRetry={() => refetch()} />
      </DoctorPageShell>
    );
  }

  // destructure data
  const { performance, monthly_activity, diagnosis_distribution } = data;
  const dist = diagnosis_distribution;
  // console.log("dist:", dist); 

  return (
    <DoctorPageShell
      title="Analytics"
      description="Performance metrics from your practice"
      actions={
        <Select value={period} onValueChange={setPeriod}>
          <SelectTrigger className="w-40 h-9">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {/* show periods */}
            {PERIODS.map((p) => (
              <SelectItem key={p.value} value={p.value}>
                {p.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      }
    >
      {/* show metrics */}
      <MetricGrid cols={4}>
        <MetricCard
          label="Studies Completed"
          value={performance.studies_completed}
          icon={FileText}
        />
        <MetricCard
          label="Reports Signed"
          value={performance.reports_signed}
          icon={CheckCircle2}
        />
        <MetricCard
          label="Completion Rate"
          value={`${performance.completion_rate}%`}
          icon={Activity}
        />
        <MetricCard
          label="AI Accept Rate"
          value={`${performance.ai_accept_rate}%`}
          icon={Brain}
        />
      </MetricGrid>

      <MetricGrid cols={3}>
        <MetricCard
          label="On-Time Rate"
          value={`${performance.on_time_rate}%`}
          icon={Clock}
        />
        <MetricCard
          label="Follow-up Rate"
          value={`${performance.followup_rate}%`}
          icon={Activity}
        />
        <MetricCard label="Period" value={data.period} icon={FileText} />
      </MetricGrid>

      {/* show charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 ">
        <BarChart
          title="Monthly Activity"
          data={monthly_activity.map((m) => ({
            label: `${m.mo}/${String(m.yr).slice(-2)}`,
            value: m.count,
          }))}
          color="bg-blue-900"
        />
        <div className="rounded-xl border flex flex-col gap-3 border-gray-200 bg-white dark:bg-gray-950 dark:border-gray-800 p-4">
          <p className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-4">
            Diagnosis Distribution
          </p>
          <div className="space-y-3">
            {[
              {
                label: "HFrEF only",
                value: Number(dist.hfref_only),
                color: "bg-red-600",
              },
              {
                label: "LVH only",
                value: Number(dist.lvh_only),
                color: "bg-orange-500",
              },
              {
                label: "Both",
                value: Number(dist.both_conditions),
                color: "bg-purple-600",
              },
              {
                label: "Normal",
                value: Number(dist.normal),
                color: "bg-emerald-500",
              },
              {
                label: "Borderline",
                value: Number(dist.borderline),
                color: "bg-amber-400",
              },
            ].map((row) => (
              <MiniBar
                key={row.label}
                label={row.label}
                value={row.value}
                max={Math.max(
                  Number(dist.hfref_only),
                  Number(dist.lvh_only),
                  Number(dist.both_conditions),
                  Number(dist.normal),
                  Number(dist.borderline),
                  1,
                )}
                color={row.color}
              />
            ))}
          </div>
        </div>
      </div>
    </DoctorPageShell>
  );
}
