"use client";

import { useState, useCallback, useMemo, useEffect } from "react";
import { motion } from "motion/react";
import {
  Eye,
  FileDown,
  History,
  Search,
  SlidersHorizontal,
  ClipboardList,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { cn } from "@/lib/utils/tailwind-merge";
import { ReassignModal, DownloadReportModal, ViewPatientModal } from "./modals";
import { HistoricalFiltersModal } from "./patients-filters";
import { useHistoricalPatients } from "../../hooks/use-historical";
import { useReassignPatient } from "../../hooks/use-reassign-patient";
import { useDownloadReport } from "../../hooks/use-download-report";
import type { HistoricalPatient } from "@/lib/types/receptionist";
import { StatusBadge } from "./status-badge";
import { useDebounce } from "use-debounce";
import { TABLE_HEADERS } from "@/lib/constants/patient-table.constants";
import { EmptyState } from "@/components/ui/empty-state";
import { PulseLoader } from "@/components/ui/pulse-loader";
import { ReceptionPageShell } from "@/features/reception-workspace/components/shared/reception-page-shell";
import PaginationWrapper from "@/components/ui/paginationWrapper";

export function RecordedTable() {
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [filterStudy, setFilterStudy] = useState("all");
  const [filterDate, setFilterDate] = useState("");
  const [sortDate, setSortDate] = useState<"newest" | "oldest">("newest");

  const [selected, setSelected] = useState<string[]>([]);
  const [viewPatient, setViewPatient] = useState<HistoricalPatient | null>(
    null,
  );
  const [reassignPatient, setReassignPatient] =
    useState<HistoricalPatient | null>(null);
  const [downloadPatient, setDownloadPatient] =
    useState<HistoricalPatient | null>(null);

  const [debouncedSearch] = useDebounce(search, 150);
  useEffect(() => {
    setPage(1);
  }, [debouncedSearch, filterStudy, filterDate, sortDate]);

  const { data: response, isLoading } = useHistoricalPatients({
    keyword: debouncedSearch || undefined,
    study_type: filterStudy !== "all" ? filterStudy : undefined,
    date: filterDate || undefined,
    sort: sortDate,
    page,
  });

  const totalPages = Math.ceil((response?.total ?? 0) / 10);

  const patients = useMemo(() => response?.data ?? [], [response?.data]);

  const { mutate: reassign } = useReassignPatient();
  const { download } = useDownloadReport();

  const activeFilters = [
    filterStudy !== "all",
    !!filterDate,
    sortDate !== "newest",
  ].filter(Boolean).length;

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <PulseLoader />
      </div>
    );
  }

  return (
    <>
      <ReceptionPageShell
        title="Historical Patients"
        description="View and manage your historical patients"
      >
        <div className="flex gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 z-10" />
            <Input
              placeholder="Search by patient name or National ID..."
              className="pl-9 h-10 text-sm "
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <Button
            variant="outline"
            className={cn(
              "h-10 gap-2 text-sm font-normal text-gray-600 border-gray-200",
              activeFilters > 0 && "border-[#8B1A2B] text-[#8B1A2B]",
            )}
            onClick={() => setFiltersOpen(true)}
          >
            <SlidersHorizontal className="w-4 h-4" />
            Filters
            {activeFilters > 0 && (
              <span className="flex h-4 w-4 items-center justify-center rounded-full bg-[#8B1A2B] text-[10px] text-white font-medium">
                {activeFilters}
              </span>
            )}
          </Button>
        </div>
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.25 }}
          className="rounded-xl border overflow-hidden"
        >
          <Table>
            <TableHeader>
              <TableRow className="bg-gray-50/70 hover:bg-gray-50/70 border-b border-gray-200">
                {TABLE_HEADERS.map((h) => (
                  <TableHead
                    key={h}
                    className="text-xs font-semibold text-gray-500"
                  >
                    {h}
                  </TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              {patients.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={TABLE_HEADERS.length + 1}>
                    <EmptyState
                      icon={ClipboardList}
                      title="No historical records found"
                      description="Try adjusting your search or filters"
                    />
                  </TableCell>
                </TableRow>
              ) : (
                patients.map((patient, i) => (
                  <motion.tr
                    key={patient.study_id}
                    initial={{ opacity: 0, x: -8 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3, delay: 0.3 + i * 0.04 }}
                    className={cn(
                      "border-b border-gray-100 transition-colors  group",
                      selected.includes(patient.national_id) &&
                        "bg-[#8B1A2B]/5",
                    )}
                  >
                    <TableCell className="">
                      <div className="flex flex-col">
                        <span className="font-medium text-gray-800 truncate dark:text-gray-200 ">
                          {patient.first_name} {patient.last_name}
                        </span>

                        <span className="text-xs text-gray-400 font-mono">
                          {patient.national_id}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell className="text-sm text-gray-600">
                      {patient.study_type}
                    </TableCell>
                    <TableCell className="text-sm text-gray-600">
                      {patient.doctor_name ?? "—"}
                    </TableCell>
                    <TableCell className="text-sm text-gray-600">
                      {new Date(patient.study_date).toLocaleDateString(
                        "en-GB",
                        {
                          day: "2-digit",
                          month: "short",
                          year: "numeric",
                        },
                      )}
                    </TableCell>
                    <TableCell>
                      <StatusBadge status={patient.status} />
                    </TableCell>
                    <TableCell className="text-sm text-gray-600">
                      {patient.phone_number}
                    </TableCell>
                    <TableCell className="pr-4">
                      <div className="flex items-center gap-1 opacity-60 group-hover:opacity-100 transition-opacity">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-gray-500 hover:text-blue-800"
                          onClick={() => setViewPatient(patient)}
                        >
                          <Eye className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-gray-500 hover:text-blue-800"
                          onClick={() => setDownloadPatient(patient)}
                        >
                          <FileDown className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-gray-500 hover:text-blue-800"
                          onClick={() => setReassignPatient(patient)}
                        >
                          <History className="w-4 h-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </motion.tr>
                ))
              )}
            </TableBody>
          </Table>
        </motion.div>
        <HistoricalFiltersModal
          open={filtersOpen}
          onOpenChange={setFiltersOpen}
          filterStudy={filterStudy}
          setFilterStudy={setFilterStudy}
          filterDate={filterDate}
          setFilterDate={setFilterDate}
          sortDate={sortDate}
          setSortDate={setSortDate}
        />
        <PaginationWrapper
          currentPage={page}
          totalPages={totalPages}
          searchParams={{ page: String(page) }}
          onPageChange={setPage}
        />
      </ReceptionPageShell>

      <ViewPatientModal
        patient={viewPatient}
        onClose={() => setViewPatient(null)}
      />

      <ReassignModal
        patient={reassignPatient}
        onClose={() => setReassignPatient(null)}
        onSave={(form) => {
          if (!reassignPatient) return;
          reassign({ national_id: reassignPatient.national_id, ...form });
          setReassignPatient(null);
        }}
      />

      <DownloadReportModal
        patient={downloadPatient}
        onClose={() => setDownloadPatient(null)}
        onConfirm={() => {
          if (!downloadPatient) return;
          download(String(downloadPatient.study_id));
          setDownloadPatient(null);
        }}
      />
    </>
  );
}
