"use client";

import { useState } from "react";
import Link from "next/link";
import { History, User } from "lucide-react";
import { useDebounce } from "use-debounce";
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
import {
  DoctorErrorState,
  DoctorLoadingState,
  DoctorPageShell,
  DoctorTableShell,
  TableToolbar,
} from "../shared/ui";
import PaginationWrapper from "@/components/ui/paginationWrapper";
import { useRecentPatients } from "../../hooks/use-active-patients";
import { DEFAULT_PAGE_SIZE } from "@/lib/shared/constants/api";

// Component
export function RecentPatientsPage({
  searchParams,
}: {
  searchParams?: { page?: string };
}) {
  // hooks
  const [search, setSearch] = useState("");
  const [debounced] = useDebounce(search, 400);
  const currentPage = Math.max(1, Number(searchParams?.page) || 1);

  // useQuery
  const { data, isLoading, isError, refetch } = useRecentPatients({
    keyword: debounced.trim() || undefined,
    page: currentPage,
    limit: DEFAULT_PAGE_SIZE,
  });

  // render
  const patients = data?.patients ?? [];
  const totalPages = data?.pages ?? 1;

  // Loading state
  if (isLoading) return <DoctorLoadingState />;
  // Error state
  if (isError) {
    return (
      <DoctorPageShell
        title="Recent Patients"
        description="Patients you viewed recently"
      >
        <DoctorErrorState onRetry={() => refetch()} />
      </DoctorPageShell>
    );
  }

  // Render
  return (
    <DoctorPageShell
      title="Recent Patients"
      description="Last viewed patients from your activity"
    >
      <TableToolbar
        search={search}
        onSearchChange={setSearch}
        searchPlaceholder="Search patients..."
      />

      <DoctorTableShell>
        <Table>
          <TableHeader>
            <TableRow className="bg-gray-50/70 hover:bg-gray-50/70 border-b border-gray-200">
              {["Patient", "Study", "Date", "Report", "Actions"].map((h) => (
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
            {patients.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="py-10">
                  <EmptyState
                    icon={History}
                    title="No recent patients"
                    description="Patients appear here after you work on studies."
                  />
                </TableCell>
              </TableRow>
            ) : (
              patients.map((p) => (
                <TableRow
                  key={`${p.national_id}-${p.studies.study_id}`}
                  className="border-b border-gray-100"
                >
                  <TableCell className="pl-4">
                    <p className="text-sm font-medium">
                      {p.first_name} {p.last_name}
                    </p>
                    <p className="text-xs text-gray-500">{p.national_id}</p>
                  </TableCell>
                  <TableCell className="text-sm">{p.study}</TableCell>
                  <TableCell className="text-sm tabular-nums">
                    {formatFullTimestamp(p.received_date)}
                  </TableCell>
                  <TableCell className="text-sm">
                    {p.report_status ?? "—"}
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-1">
                      <Link href={`/doctor/patients/profile/${p.national_id}`}>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-8 text-xs text-blue-800"
                        >
                          <User />
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

      {/* pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between mt-4">
          <p className="text-xs text-gray-400">
            Page {currentPage} of {totalPages} — {data?.total ?? 0} patients
          </p>
          {/* dynamc pagination */}
          <PaginationWrapper
            totalPages={totalPages}
            searchParams={{ page: String(currentPage) }}
          />
        </div>
      )}
    </DoctorPageShell>
  );
}
