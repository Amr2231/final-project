"use client";

import { useState, useCallback, memo } from "react";
import { Eye, Edit, Trash2, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { cn } from "@/lib/utils/tailwind-merge";
import type { ActivePatient } from "@/lib/types/receptionist";
import { TABLE_HEADERS } from "@/lib/constants/patient-table.constants";
import { EmptyState } from "@/components/ui/empty-state";
import { StatusBadge } from "./status-badge";

// ── Types ────

interface PatientsDataTableProps {
  patients: ActivePatient[];
  onView: (p: ActivePatient) => void;
  onEdit: (p: ActivePatient) => void;
  onDelete: (p: ActivePatient) => void;
}

interface PatientRowProps {
  patient: ActivePatient;
  isSelected: boolean;
  onToggle: (id: string) => void;
  onView: (p: ActivePatient) => void;
  onEdit: (p: ActivePatient) => void;
  onDelete: (p: ActivePatient) => void;
}

// ── PatientRow ────────────────────────────────────────────────────────────────

function canDeactivatePatient(status: ActivePatient["status"]) {
  return status === "Scheduled";
}

const PatientRow = memo(function PatientRow({
  patient,
  onView,
  onEdit,
  onDelete,
}: PatientRowProps) {
  return (
    <TableRow
      className={cn(
        "border-b border-gray-100 transition-colors hover:bg-gray-50/60 group",
      )}
    >
      <TableCell className="">
        <div className="flex flex-col">
          <span className="font-medium text-gray-800 truncate ">
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
        {new Date(patient.study_date).toLocaleString("en-GB", {
          day: "2-digit",
          month: "short",
          year: "numeric",
        })}
      </TableCell>

      <TableCell>
        <span className="inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium">
          <StatusBadge status={patient.status}></StatusBadge>
        </span>
      </TableCell>

      <TableCell className="text-sm text-gray-600">
        {patient.phone_number}
      </TableCell>

      <TableCell className="pr-4">
        <div className="flex items-center gap-1">
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 text-gray-500 hover:text-blue-800"
            onClick={() => onView(patient)}
          >
            <Eye className="w-4 h-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 text-gray-500 hover:text-blue-800"
            onClick={() => onEdit(patient)}
          >
            <Edit className="w-4 h-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 text-gray-500 hover:text-blue-800 disabled:opacity-40"
            onClick={() => onDelete(patient)}
            disabled={!canDeactivatePatient(patient.status)}
            title={
              canDeactivatePatient(patient.status)
                ? "Deactivate patient"
                : "Only Scheduled patients can be deactivated"
            }
          >
            <Trash2 className="w-4 h-4" />
          </Button>
        </div>
      </TableCell>
    </TableRow>
  );
});

// ── PatientsDataTable ─────────────────────────────────────────────────────────
export const PatientsDataTable = memo(function PatientsDataTable({
  patients,
  onView,
  onEdit,
  onDelete,
}: PatientsDataTableProps) {
  const [selected, setSelected] = useState<string[]>([]);

  const toggleOne = useCallback((id: string) => {
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id],
    );
  }, []);

  return (
    <div className="rounded-xl border border-gray-200 bg-white overflow-hidden animate-in fade-in duration-300">
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
                  icon={Users}
                  title="No patients found"
                  description="Try adjusting your search or filters"
                />
              </TableCell>
            </TableRow>
          ) : (
            patients.map((patient) => (
              <PatientRow
                key={patient.national_id}
                patient={patient}
                isSelected={selected.includes(patient.national_id)}
                onToggle={toggleOne}
                onView={onView}
                onEdit={onEdit}
                onDelete={onDelete}
              />
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
});
