"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "motion/react";
import { Eye, FileText, Upload, Sparkles, Star, UserX } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils/tailwind-merge";
import { ReportStatusBadge } from "./status-badge";
import { PatientsFiltersModal } from "./patients-filters";
import {
  PatientNotesModal,
  ViewPatientModal,
  UploadImageModal,
} from "./modals";
import PaginationWrapper from "@/components/ui/paginationWrapper";
import { useActivePatients } from "../../hooks/use-active-patients";
import { PatientsSearchBar } from "../shared/patients-search-bar";
import type { ActivePatient } from "@/lib/types/doctor";
import { useDebounce } from "use-debounce";
import { DEFAULT_PAGE_SIZE } from "@/lib/shared/constants/api";
import { PulseLoader } from "@/components/ui/pulse-loader";
import { EmptyState } from "@/components/ui/empty-state";
import { useAddToWatchlist } from "../../hooks/use-watchlist";

// Table headers
const tableHeaders = [
  "Patient",
  "Study",
  "Status",
  "Received",
  "Notes",
  "Images",
  "Actions",
];

// Component
export function ActivePatientsTable() {
  // hooks
  const router = useRouter();

  // ===== FILTER STATE =====
  const [search, setSearch] = useState("");
  const [filterStudy, setFilterStudy] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [filterReportStatus, setFilterReportStatus] = useState("all");
  const [filterDate, setFilterDate] = useState("");
  const [sortDate, setSortDate] = useState<"newest" | "oldest">("newest");
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [notesPatient, setNotesPatient] = useState<ActivePatient | null>(null);
  const [viewPatient, setViewPatient] = useState<ActivePatient | null>(null);
  const [uploadPatient, setUploadPatient] = useState<ActivePatient | null>(
    null,
  );

  const [debouncedSearch] = useDebounce(search, 400);
  useEffect(() => {
    setCurrentPage(1);
  }, [debouncedSearch, filterStudy, filterReportStatus, filterDate, sortDate]);
  const { mutate: addWatchlist } = useAddToWatchlist();

  // ===== SERVER-SIDE FETCH =====
  const { data, isLoading } = useActivePatients({
    keyword: debouncedSearch.trim() || undefined,
    study_type: filterStudy !== "all" ? filterStudy : undefined,
    report_status:
      filterReportStatus !== "all" ? filterReportStatus : undefined,
    date: filterDate || undefined,
    sort: sortDate,
    page: currentPage,
    limit: DEFAULT_PAGE_SIZE,
  });

  const patients = data?.patients ?? [];
  const totalPages = data?.pages ?? 1;

  const activeFilters = [
    filterStudy !== "all",
    filterReportStatus !== "all",
    !!filterDate,
    sortDate !== "newest",
  ].filter(Boolean).length;

  const filtered = patients;

  // Handle loading state
  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20 text-sm text-muted-foreground">
        <PulseLoader />
      </div>
    );
  }

  return (
    <TooltipProvider>
      <>
        {/* Search + Filter Bar */}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <PatientsSearchBar
            search={search}
            onSearchChange={setSearch}
            activeFilters={activeFilters}
            onOpenFilters={() => setFiltersOpen(true)}
          />
        </motion.div>

        {/* Table */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.25 }}
          className="rounded-xl border border-border bg-card overflow-hidden"
        >
          <Table className="table-fixed">
            <TableHeader>
              <TableRow className="bg-muted/50 hover:bg-muted/50 border-b border-border">
                {tableHeaders.map((h) => (
                  <TableHead
                    key={h}
                    className="text-xs font-semibold text-muted-foreground"
                  >
                    {h}
                  </TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={10}
                    className="text-center text-sm text-gray-400 py-10"
                  >
                    <EmptyState
                      icon={UserX}
                      title="No Patients Found"
                      description="Try changing your search or filters."
                    />
                  </TableCell>
                </TableRow>
              ) : (
                filtered.map((patient, i) => (
                  <motion.tr
                    key={patient.id}
                    initial={{ opacity: 0, x: -8 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3, delay: 0.3 + i * 0.04 }}
                    className={cn(
                      "border-b border-border transition-colors hover:bg-muted/40 group",
                    )}
                  >
                    <TableCell className="text-sm text-foreground font-medium">
                      <div className="flex flex-col">
                        <div className="truncate">
                          {patient.first_name} {patient.last_name}
                        </div>

                        <div className="text-xs text-muted-foreground font-mono">
                          {patient.national_id}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground font-mono">
                      {patient.study}
                    </TableCell>
                    <TableCell>
                      <ReportStatusBadge status={patient.report_status} />
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {new Date(patient.received_date).toLocaleDateString(
                        "en-GB",
                        {
                          year: "numeric",
                          month: "short",
                          day: "numeric",
                        },
                      )}
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground max-w-45">
                      {patient.notes ? (
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <button
                              type="button"
                              onClick={() => setNotesPatient(patient)}
                              className="text-left w-full truncate hover:text-blue-800 dark:hover:text-blue-300 transition-colors"
                            >
                              {patient.notes}
                            </button>
                          </TooltipTrigger>
                          <TooltipContent className="max-w-xs">
                            {patient.notes}
                          </TooltipContent>
                        </Tooltip>
                      ) : (
                        <Button
                          variant="link"
                          size="sm"
                          onClick={() => setNotesPatient(patient)}
                          className="inline-flex items-center gap-1.5 p-0 h-auto text-muted-foreground hover:text-blue-800 dark:hover:text-blue-300"
                        >
                          <FileText className="w-3.5 h-3.5" />
                          <span className="text-xs">Add note</span>
                        </Button>
                      )}
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {patient.image_numbers}
                    </TableCell>

                    <TableCell className="pr-4">
                      <div className="flex items-center gap-1 opacity-60 group-hover:opacity-100 transition-opacity">
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8 text-muted-foreground hover:text-blue-800 dark:hover:text-blue-300"
                              onClick={() => setViewPatient(patient)}
                            >
                              <Eye className="w-4 h-4" />
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>View</TooltipContent>
                        </Tooltip>

                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8 text-muted-foreground hover:text-blue-800 dark:hover:text-blue-300"
                              onClick={() =>
                                router.push(
                                  `/doctor/patients/${patient.studies.study_id}/report`,
                                )
                              }
                            >
                              <FileText className="w-4 h-4" />
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>Report</TooltipContent>
                        </Tooltip>

                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8 text-muted-foreground hover:text-blue-800 dark:hover:text-blue-300"
                              onClick={() => setUploadPatient(patient)}
                            >
                              <Upload className="w-4 h-4" />
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>Upload</TooltipContent>
                        </Tooltip>

                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8 text-gray-500 hover:text-amber-500"
                              onClick={() =>
                                addWatchlist({
                                  national_id: patient.national_id,
                                  priority: "monitor",
                                })
                              }
                            >
                              <Star className="w-4 h-4" />
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>Add to Watchlist</TooltipContent>
                        </Tooltip>

                        {patient.study === "Echo" && (
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8 text-muted-foreground hover:text-blue-800 dark:hover:text-blue-300"
                                onClick={() =>
                                  router.push(
                                    `/doctor/patients/${patient.studies.study_id}/ai-analysis`,
                                  )
                                }
                              >
                                <Sparkles className="w-4 h-4" />
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent>AI Analysis</TooltipContent>
                          </Tooltip>
                        )}
                      </div>
                    </TableCell>
                  </motion.tr>
                ))
              )}
            </TableBody>
          </Table>
        </motion.div>

        {/* Pagination */}
        {totalPages > 1 && (
          <PaginationWrapper
            totalPages={totalPages}
            searchParams={{ page: String(currentPage) }}
            currentPage={currentPage}
            onPageChange={setCurrentPage}
          />
        )}

        <PatientsFiltersModal
          open={filtersOpen}
          onOpenChange={setFiltersOpen}
          filterStudy={filterStudy}
          setFilterStudy={setFilterStudy}
          filterReportStatus={filterReportStatus}
          setFilterReportStatus={setFilterReportStatus}
          filterDate={filterDate}
          setFilterDate={setFilterDate}
          sortDate={sortDate}
          setSortDate={setSortDate}
        />

        <PatientNotesModal
          patient={notesPatient}
          onClose={() => setNotesPatient(null)}
        />
        <ViewPatientModal
          patient={viewPatient}
          onClose={() => setViewPatient(null)}
          onMarkComplete={() => undefined}
        />
        <UploadImageModal
          patient={uploadPatient}
          onClose={() => setUploadPatient(null)}
        />
      </>
    </TooltipProvider>
  );
}
