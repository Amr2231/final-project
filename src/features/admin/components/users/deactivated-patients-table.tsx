"use client";

import { useState } from "react";
import { useDebounce } from "use-debounce";
import { motion } from "motion/react";
import {
  Search,
  RotateCcw,
  UserX,
  ChevronLeft,
  ChevronRight,
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
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils/tailwind-merge";
import { EmptyState } from "@/components/ui/empty-state";
import { PulseLoader } from "@/components/ui/pulse-loader";
import { useDeactivatedPatients } from "../../hooks/use-deactivated-patients";
import { useReactivatePatient } from "../../hooks/use-reactivate-patient";
// import { DeactivatedPatientsFiltersModal } from "./patient-modals/filter-patients-modal";
import type { DeactivatedPatient } from "../../actions/users.actions";
import PaginationWrapper from "@/components/ui/paginationWrapper";

export const TABLE_HEADERS = [
  "Patient",
  "Study",
  "Doctor",
  "Study Date",
  "Contact",
  "Actions",
] as const;

function ReactivatePatientModal({
  patient,
  onClose,
  onConfirm,
  isPending,
}: {
  patient: DeactivatedPatient | null;
  onClose: () => void;
  onConfirm: () => void;
  isPending?: boolean;
}) {
  return (
    <Dialog open={!!patient} onOpenChange={(v) => !v && onClose()}>
      <DialogContent className="max-w-sm">
        <DialogHeader>
          <DialogTitle className="text-lg font-bold text-gray-900 dark:text-gray-100">
            Reactivate Patient
          </DialogTitle>
          <DialogDescription className="text-sm text-gray-500">
            Are you sure you want to reactivate{" "}
            <span className="font-medium text-gray-800 dark:text-gray-100">
              {patient?.first_name} {patient?.last_name} ?
            </span>
            They will appear in the active patients list again.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button
            disabled={isPending}
            onClick={onConfirm}
            className="bg-green-600 hover:bg-green-700 text-white"
          >
            {isPending ? "Reactivating..." : "Yes, Reactivate"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export function DeactivatedPatientsTable() {
  const [search, setSearch] = useState("");
  const [debouncedSearch] = useDebounce(search, 400);
  const [page, setPage] = useState(1);
  const sortDate = "newest" as const;
  const filterDate = undefined;
  const [reactivateTarget, setReactivateTarget] =
    useState<DeactivatedPatient | null>(null);

  // const activeFilters = [sortDate !== "newest", !!filterDate].filter(
  //   Boolean,
  // ).length;

  const { data, isLoading } = useDeactivatedPatients({
    keyword: debouncedSearch || undefined,
    page,
    sort: sortDate,
    created_date: filterDate,
  });

  const patients = data?.data ?? [];
  const totalPages = data?.pages ?? 1;
  const total = data?.total ?? 0;

  const { mutate: reactivatePatient, isPending: isReactivating } =
    useReactivatePatient();

  const handleSearchChange = (val: string) => {
    setSearch(val);
    setPage(1);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20 text-sm text-gray-400">
        <PulseLoader />
      </div>
    );
  }

  return (
    <>
      {/* ── Toolbar ── */}
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="flex items-center gap-2 mb-4"
      >
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 z-10" />
          <Input
            placeholder="Search by name or National ID..."
            className="pl-9 h-10 text-sm "
            value={search}
            onChange={(e) => handleSearchChange(e.target.value)}
          />
        </div>

        {total > 0 && (
          <span className="text-xs text-gray-400 whitespace-nowrap">
            {total} deactivated
          </span>
        )}
      </motion.div>

      {/* ── Table ── */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.1 }}
        className="rounded-xl border  overflow-hidden"
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
                <TableCell colSpan={TABLE_HEADERS.length}>
                  <EmptyState
                    icon={UserX}
                    title="No deactivated patients"
                    description="All patients are currently active"
                  />
                </TableCell>
              </TableRow>
            ) : (
              patients.map((patient, i) => (
                <motion.tr
                  key={patient.national_id}
                  initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: 0.1 + i * 0.04 }}
                  className="border-b border-gray-100 transition-colors dark:hover:bg-gray-900 hover:bg-gray-50"
                >
                  <TableCell>
                    <div className="flex flex-col">
                      <span className="font-medium text-gray-800 dark:text-gray-200 truncate ">
                        {patient.first_name} {patient.last_name}
                      </span>

                      <span className="text-xs text-gray-400 font-mono">
                        {patient.national_id}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell className="text-sm text-gray-600">
                    {patient.study_type ?? "—"}
                  </TableCell>
                  <TableCell className="text-sm text-gray-600">
                    {patient.doctor_name}
                  </TableCell>
                  <TableCell className="text-sm text-gray-600">
                    {new Date(patient.study_date).toLocaleDateString("en-GB", {
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                    })}
                  </TableCell>
                  <TableCell className="text-sm text-gray-600">
                    {patient.phone_number}
                  </TableCell>
                  <TableCell className="pr-4">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-8 gap-1.5 text-xs text-gray-500 hover:text-green-600"
                      onClick={() => setReactivateTarget(patient)}
                      disabled={isReactivating}
                    >
                      <RotateCcw className="w-3.5 h-3.5" />
                      Reactivate
                    </Button>
                  </TableCell>
                </motion.tr>
              ))
            )}
          </TableBody>
        </Table>
      </motion.div>

      {/* ── Pagination ── */}
      {totalPages > 1 && (
        <PaginationWrapper
          totalPages={totalPages}
          currentPage={page}
          onPageChange={setPage}
        />
      )}

      {/* ── Modals ── */}
      {/* <DeactivatedPatientsFiltersModal
        open={filtersOpen}
        onOpenChange={setFiltersOpen}
        sortDate={sortDate}
        setSortDate={(v) => {
          setSortDate(v);
          setPage(1);
        }}
        // {/* filterRole و setFilterRole مش محتاجينهم هنا */}
      {/* / */}
      <ReactivatePatientModal
        patient={reactivateTarget}
        onClose={() => setReactivateTarget(null)}
        onConfirm={() => {
          if (!reactivateTarget) return;
          reactivatePatient(reactivateTarget.national_id);
          setReactivateTarget(null);
        }}
        isPending={isReactivating}
      />
    </>
  );
}
