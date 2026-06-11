"use client";

import { useState } from "react";
import { motion } from "motion/react";
import { Eye, FileText, Download, Trash } from "lucide-react";
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
import { ReportStatusBadge, PatientStatusBadge } from "./status-badge";
import { PatientsFiltersModal } from "./patients-filters";
import PaginationWrapper from "@/components/ui/paginationWrapper";
import { useHistoricalPatients } from "../../hooks/use-historical-patients";
import { useExportReportPDF } from "../../hooks/use-report";
import { useDebounce } from "use-debounce";
const LIMIT = 10;
import { EmptyState } from "@/components/ui/empty-state";
import { ViewPatientModal } from "./modals";
import { PulseLoader } from "@/components/ui/pulse-loader";
import type { ActivePatient, HistoricalPatient } from "@/lib/types/doctor";
import { PatientsSearchBar } from "../shared/patients-search-bar";
import { ViewReportModal } from "./historical/view-report-modal";
import { DownloadReportModal } from "./historical/download-report-modal";

// TABLE HEADERS 
const tableHeaders = [
  "Full Name",
  "Report Status",
  "Study",
  "Received",
  "Image Numbers",
  "Patient Status",
  "Actions",
];

export function HistoricalPatientsTable({
  searchParams,
}: {
  searchParams?: { page?: string };
}) {
  // ===== FILTER STATE (local — زي ActivePatientsTable) =====
  const [search, setSearch] = useState("");
  const [filterStudy, setFilterStudy] = useState("all");
  // const [filterReportStatus, setFilterReportStatus] = useState("all");
  const [filterDate, setFilterDate] = useState("");
  const [sortDate, setSortDate] = useState<"newest" | "oldest">("newest");
  const [filtersOpen, setFiltersOpen] = useState(false);

  const [viewPatient, setViewPatient] = useState<
    ActivePatient | HistoricalPatient | null
  >(null);
  const [viewReportStudyId, setViewReportStudyId] = useState<string | null>(
    null,
  );
  const [downloadPatient, setDownloadPatient] =
    useState<HistoricalPatient | null>(null);

  const currentPage = Math.max(1, Number(searchParams?.page) || 1);
  const [debouncedSearch] = useDebounce(search, 400);

  // ===== SERVER-SIDE FETCH =====
  const { data, isLoading } = useHistoricalPatients({
    keyword: debouncedSearch.trim() || undefined,
    study_type: filterStudy !== "all" ? filterStudy : undefined,
    // report_status:
    // filterReportStatus !== "all" ? filterReportStatus : undefined,
    date: filterDate || undefined,
    sort: sortDate,
    page: currentPage,
    limit: LIMIT,
  });

  const patients = data?.patients ?? [];
  const totalPages = data?.pages ?? 1;

  const activeFilters = [
    filterStudy !== "all",
    // filterReportStatus !== "all",
    !!filterDate,
    sortDate !== "newest",
  ].filter(Boolean).length;

  // ===== DOWNLOAD =====
  const exportPDF = useExportReportPDF(
    String(downloadPatient?.studies?.study_id ?? ""),
  );

  const handleConfirmDownload = () => {
    exportPDF.mutate(undefined, {
      onSuccess: () => setDownloadPatient(null),
    });
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20 text-sm text-gray-400">
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
          className="rounded-xl border overflow-hidden"
        >
          <Table>
            <TableHeader>
              <TableRow className="bg-gray-50/70 hover:bg-gray-50/70 border-b border-gray-200">
                {tableHeaders.map((h) => (
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
                  <TableCell
                    colSpan={tableHeaders.length}
                    className="text-center text-sm text-gray-400 py-10"
                  >
                    <EmptyState
                      title="No patients found"
                      icon={Trash}
                      description="We could not find any patients matching your search criteria."
                    />
                  </TableCell>
                </TableRow>
              ) : (
                patients.map((patient, i) => (
                  <motion.tr
                    key={patient.id}
                    initial={{ opacity: 0, x: -8 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3, delay: 0.3 + i * 0.04 }}
                    className={cn(
                      "border-b border-gray-100 transition-colors  group",
                    )}
                  >
                    {/* Full Name + NID */}
                    <TableCell>
                      <div className="flex flex-col">
                        <span className="font-medium text-gray-800 truncate dark:text-gray-100">
                          {patient.first_name} {patient.last_name}
                        </span>
                        <span className="text-xs text-gray-400 font-mono">
                          {patient.national_id}
                        </span>
                      </div>
                    </TableCell>

                    {/* Report Status */}
                    <TableCell>
                      <ReportStatusBadge status={patient.report_status} />
                    </TableCell>

                    {/* Study */}
                    <TableCell className="text-sm text-gray-600">
                      {patient.study}
                    </TableCell>

                    {/* Received */}
                    <TableCell className="text-sm text-[#8B1A2B]/70 tabular-nums">
                      {patient.received_date
                        ? new Date(patient.received_date).toLocaleDateString(
                            "en-US",
                            {
                              year: "numeric",
                              month: "short",
                              day: "numeric",
                            },
                          )
                        : "—"}
                    </TableCell>

                    {/* Image Numbers */}
                    <TableCell className="text-sm text-gray-600">
                      {patient.image_numbers}
                    </TableCell>

                    {/* Patient Status */}
                    <TableCell>
                      <PatientStatusBadge status={patient.patient_status} />
                    </TableCell>

                    {/* Actions */}
                    <TableCell className="pr-4">
                      <div className="flex items-center gap-1 opacity-60 group-hover:opacity-100 transition-opacity">
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8 text-gray-500 hover:text-blue-800"
                              onClick={() => setViewPatient(patient)}
                            >
                              <Eye className="w-4 h-4" />
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>View Patient</TooltipContent>
                        </Tooltip>

                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8 text-gray-500 hover:text-blue-800"
                              onClick={() =>
                                setViewReportStudyId(
                                  String(patient.studies.study_id),
                                )
                              }
                            >
                              <FileText className="w-4 h-4" />
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>View Report</TooltipContent>
                        </Tooltip>

                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8 text-gray-500 hover:text-blue-800"
                              onClick={() => setDownloadPatient(patient)}
                            >
                              <Download className="w-4 h-4" />
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>Download Report</TooltipContent>
                        </Tooltip>
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
          <div className="flex items-center justify-between mt-4">
            <p className="text-xs text-gray-400">
              Page {currentPage} of {totalPages} — {data?.total ?? 0} patients
            </p>
            <PaginationWrapper
              totalPages={totalPages}
              searchParams={{ page: String(currentPage) }}
            />
          </div>
        )}

        <PatientsFiltersModal
          open={filtersOpen}
          onOpenChange={setFiltersOpen}
          filterStudy={filterStudy}
          setFilterStudy={setFilterStudy}
          // filterReportStatus={filterReportStatus}
          // setFilterReportStatus={setFilterReportStatus}
          filterDate={filterDate}
          setFilterDate={setFilterDate}
          sortDate={sortDate}
          setSortDate={setSortDate}
        />

        <ViewPatientModal
          patient={viewPatient}
          onClose={() => setViewPatient(null)}
          onMarkComplete={() => undefined}
        />

        <ViewReportModal
          studyId={viewReportStudyId}
          onClose={() => setViewReportStudyId(null)}
        />

        <DownloadReportModal
          patient={downloadPatient}
          onClose={() => setDownloadPatient(null)}
          onConfirm={handleConfirmDownload}
          isLoading={exportPDF.isPending}
        />
      </>
    </TooltipProvider>
  );
}
