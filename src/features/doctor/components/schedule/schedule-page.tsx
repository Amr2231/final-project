"use client";

import Link from "next/link";
import { useState } from "react";
import { CalendarCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { EmptyState } from "@/components/ui/empty-state";
import { formatFullTimestamp } from "@/lib/utils/date-format";
import { cn } from "@/lib/utils/tailwind-merge";
import {
  DoctorErrorState,
  DoctorLoadingState,
  DoctorPageShell,
  DoctorTableShell,
} from "../shared/ui";
import { useDoctorDashboard } from "../../hooks/use-dashboard";
import { AvailabilityEditor } from "./availability-editor";

// types
type ScheduleTab = "today" | "availability";

// component
export function SchedulePage() {
  // hooks
  const [tab, setTab] = useState<ScheduleTab>("today");
  const { data, isLoading, isError, refetch } = useDoctorDashboard();
  const schedule = data?.today_schedule ?? [];

  // loading state for schedule tab
  if (isLoading && tab === "today") return <DoctorLoadingState />;

  const upcoming = schedule.filter((s) => s.status !== "Completed");
  const completed = schedule.filter((s) => s.status === "Completed");

  // render
  return (
    <DoctorPageShell
      title="Schedule"
      description="Today's appointments and your booking availability"
    >
      {/* tabs */}
      <div className="flex gap-2 border-b border-gray-200 pb-2">
        {(
          [
            ["today", "Today's appointments"],
            ["availability", "Availability settings"],
          ] as const
        ).map(([id, label]) => (
          <Button
            key={id}
            type="button"
            size="sm"
            variant={tab === id ? "default" : "ghost"}
            className={cn(tab === id && "bg-blue-800 hover:bg-blue-900")}
            onClick={() => setTab(id)}
          >
            {label}
          </Button>
        ))}
      </div>

      {tab === "availability" ? (
        <AvailabilityEditor />
      ) : isError ? (
        <DoctorErrorState onRetry={() => refetch()} />
      ) : (
        <>
          {/* stats */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="rounded-xl border  dark:bg-gray-950 p-4">
              <p className="text-xs text-gray-500">Upcoming</p>
              <p className="text-2xl font-semibold tabular-nums">
                {upcoming.length}
              </p>
            </div>
            <div className="rounded-xl border  dark:bg-gray-950 p-4">
              <p className="text-xs text-gray-500">Completed</p>
              <p className="text-2xl font-semibold tabular-nums">
                {completed.length}
              </p>
            </div>
            <div className="rounded-xl border  dark:bg-gray-950 p-4">
              <p className="text-xs text-gray-500">Total Today</p>
              <p className="text-2xl font-semibold tabular-nums">
                {schedule.length}
              </p>
            </div>
          </div>

          <DoctorTableShell>
            <Table>
              <TableHeader>
                <TableRow className="bg-gray-50/70 hover:bg-gray-50/70 border-b border-gray-200">
                  {["Patient", "Study", "Date", "Status", "Actions"].map(
                    (h) => (
                      <TableHead
                        key={h}
                        className="text-xs font-semibold text-gray-500 first:pl-4"
                      >
                        {h}
                      </TableHead>
                    ),
                  )}
                </TableRow>
              </TableHeader>
              <TableBody>
                {schedule.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} className="py-10">
                      <EmptyState
                        icon={CalendarCheck}
                        title="No schedule for today"
                        description="New studies will appear here when assigned."
                      />
                    </TableCell>
                  </TableRow>
                ) : (
                  schedule.map((item) => (
                    <TableRow
                      key={item.study_id}
                      className="border-b border-gray-100"
                    >
                      <TableCell className="pl-4 text-sm font-medium">
                        {item.first_name} {item.last_name}
                      </TableCell>
                      <TableCell className="text-sm text-gray-600">
                        {item.study_type}
                      </TableCell>
                      <TableCell className="text-sm tabular-nums">
                        {new Date(item.study_date).toLocaleString("en-GB", {
                          day: "2-digit",
                          month: "short",
                          year: "numeric",
                        })}
                      </TableCell>
                      <TableCell className="text-sm">{item.status}</TableCell>
                      <TableCell>
                        <div className="flex gap-1">
                          <Link
                            href={`/doctor/patients/${item.study_id}/report`}
                          >
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-8 text-xs text-blue-600"
                            >
                              Report
                            </Button>
                          </Link>
                          <Link
                            href={`/doctor/patients/profile/${item.national_id}`}
                          >
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-8 text-xs text-blue-600"
                            >
                              Profile
                            </Button>
                          </Link>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </DoctorTableShell>
        </>
      )}
    </DoctorPageShell>
  );
}
