"use client";

import { useMemo, useState } from "react";
import { useDebounce } from "use-debounce";
import {
  LayoutList,
  GitBranch,
  ArrowUpDown,
  CalendarDaysIcon,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ReceptionPageShell } from "../shared/reception-page-shell";
import {
  TableToolbar,
  ReceptionLoadingState,
  StatusBadge,
  PriorityBadge,
} from "../shared/ui";
import { AppointmentDetailsPanel } from "./appointment-details-panel";
import {
  useTodayAppointments,
  useUpdateAppointmentStatus,
} from "../../hooks/use-reception";
import { APPOINTMENT_STATUSES, PRIORITY_LEVELS } from "../../constants";
import type { Appointment } from "@/lib/types/reception-workspace";
import { cn } from "@/lib/utils/tailwind-merge";
import { EmptyState } from "@/components/ui/empty-state";
import PaginationWrapper from "@/components/ui/paginationWrapper";

export function AppointmentsPage() {
  const [view, setView] = useState<"table" | "timeline">("table");
  const [search, setSearch] = useState("");
  const [debouncedSearch] = useDebounce(search, 400);
  const [status, setStatus] = useState("");
  const [priority, setPriority] = useState("");
  const sort = "time";
  const [order, setOrder] = useState<"asc" | "desc">("asc");
  const [page, setPage] = useState(1);
  const [selected, setSelected] = useState<Appointment | null>(null);

  const filters = useMemo(
    () => ({
      search: debouncedSearch,
      status: status || undefined,
      priority: priority || undefined,
      sort,
      order,
      page,
      limit: 10,
    }),
    [debouncedSearch, status, priority, sort, order, page],
  );

  const { data, isLoading } = useTodayAppointments(filters);
  const { mutate: updateStatus } = useUpdateAppointmentStatus();

  const appointments = data?.data ?? [];
  const total = data?.total ?? 0;
  const totalPages = Math.ceil(total / 10);

  if (isLoading && !data) return <ReceptionLoadingState />;

  return (
    <>
      <ReceptionPageShell
        title="Today's Appointments"
        description="Manage check-ins, queue status, and consultation flow"
        actions={
          <div className="flex gap-1 rounded-lg border p-1">
            <Button
              size="sm"
              variant={view === "table" ? "default" : "ghost"}
              onClick={() => setView("table")}
            >
              <LayoutList className="w-4 h-4 mr-1" /> Table
            </Button>
            <Button
              size="sm"
              variant={view === "timeline" ? "default" : "ghost"}
              onClick={() => setView("timeline")}
            >
              <GitBranch className="w-4 h-4 mr-1" /> Timeline
            </Button>
          </div>
        }
      >
        <div className="flex flex-col sm:flex-row gap-3 flex-wrap">
          <TableToolbar
            search={search}
            onSearchChange={(v) => {
              setSearch(v);
              setPage(1);
            }}
            searchPlaceholder="Search patients..."
            className="flex-1"
          />
          <Select
            value={status || "all"}
            onValueChange={(v) => {
              setStatus(v === "all" ? "" : v);
              setPage(1);
            }}
          >
            <SelectTrigger className="w-40">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All statuses</SelectItem>
              {APPOINTMENT_STATUSES.map((s) => (
                <SelectItem key={s} value={s}>
                  {s}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select
            value={priority || "all"}
            onValueChange={(v) => {
              setPriority(v === "all" ? "" : v);
              setPage(1);
            }}
          >
            <SelectTrigger className="w-40">
              <SelectValue placeholder="Priority" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All priorities</SelectItem>
              {PRIORITY_LEVELS.map((p) => (
                <SelectItem key={p} value={p}>
                  {p}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setOrder(order === "asc" ? "desc" : "asc")}
          >
            <ArrowUpDown className="w-4 h-4 mr-1" />
            {sort} {order}
          </Button>
        </div>

        {view === "table" ? (
          <div className="rounded-xl border overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-muted/50 border-b">
                <tr>
                  <th className="text-left p-3 font-medium">Time</th>
                  <th className="text-left p-3 font-medium">Patient</th>
                  <th className="text-left p-3 font-medium hidden md:table-cell">
                    Doctor
                  </th>
                  <th className="text-left p-3 font-medium">Status</th>
                  <th className="text-left p-3 font-medium hidden sm:table-cell">
                    Priority
                  </th>
                  <th className="text-left p-3 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {appointments.length === 0 ? (
                  <tr>
                    <td
                      colSpan={6}
                      className="p-8 text-center text-muted-foreground"
                    >
                      <EmptyState
                        title="No appointments found"
                        description="Try adjusting your search or filters to find what you're looking for."
                        icon={CalendarDaysIcon}
                      />
                    </td>
                  </tr>
                ) : (
                  appointments.map((a) => (
                    <tr
                      key={a.appointment_id}
                      className="border-b hover:bg-muted/30 cursor-pointer"
                      onClick={() => setSelected(a)}
                    >
                      <td className="p-3 font-mono">
                        {String(a.appointment_time).slice(0, 5)}
                      </td>
                      <td className="p-3 font-medium">{a.patient_name}</td>
                      <td className="p-3 hidden md:table-cell text-muted-foreground">
                        {a.doctor_name}
                      </td>
                      <td className="p-3">
                        <StatusBadge label={a.status} />
                      </td>
                      <td className="p-3 hidden sm:table-cell">
                        <PriorityBadge label={a.priority_level} />
                      </td>
                      <td className="p-3" onClick={(e) => e.stopPropagation()}>
                        {a.status === "Scheduled" && (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() =>
                              updateStatus({
                                id: a.appointment_id,
                                status: "Checked In",
                              })
                            }
                          >
                            Check In
                          </Button>
                        )}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="relative pl-6 space-y-0">
            <div className="absolute left-2 top-0 bottom-0 w-px bg-border" />
            {appointments.map((a) => (
              <div
                key={a.appointment_id}
                className={cn(
                  "relative ml-4 mb-4 p-4 rounded-xl border bg-card cursor-pointer hover:shadow-sm transition-shadow",
                  selected?.appointment_id === a.appointment_id &&
                    "ring-2 ring-[#8B1A2B]/30",
                )}
                onClick={() => setSelected(a)}
              >
                <span className="absolute left-[-1.35rem] top-5 h-3 w-3 rounded-full bg-[#8B1A2B] ring-4 ring-background" />
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div>
                    <p className="font-mono text-xs text-muted-foreground">
                      {String(a.appointment_time).slice(0, 5)}
                    </p>
                    <p className="font-semibold">{a.patient_name}</p>
                    <p className="text-sm text-muted-foreground">
                      {a.doctor_name}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <StatusBadge label={a.status} />
                    <PriorityBadge label={a.priority_level} />
                  </div>
                </div>
              </div>
            ))}
            {appointments.length === 0 && (
              <EmptyState
                title="No appointments found"
                description="Try adjusting your search or filters to find what you're looking for."
                icon={CalendarDaysIcon}
              />
            )}
          </div>
        )}

        {/* <TablePagination
          page={page}
          totalPages={totalPages}
          onPageChange={setPage}
        /> */}
        {totalPages > 1 && (
          <PaginationWrapper
            currentPage={page}
            totalPages={totalPages}
            onPageChange={setPage}
          />
        )}
      </ReceptionPageShell>

      {selected && (
        <>
          <div
            className="fixed inset-0 bg-black/20 z-40"
            onClick={() => setSelected(null)}
          />
          <AppointmentDetailsPanel
            appointment={selected}
            onClose={() => setSelected(null)}
          />
        </>
      )}
    </>
  );
}
