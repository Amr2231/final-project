"use client";

import { memo } from "react";
import PaginationWrapper from "@/components/ui/paginationWrapper";

interface PatientsPaginationProps {
  totalPatients: number;
  totalPages: number;
  currentPage: number;
  pageSize: number;
}

export const PatientsPagination = memo(function PatientsPagination({
  totalPatients,
  totalPages,
  currentPage,
  pageSize,
}: PatientsPaginationProps) {
  if (totalPages <= 1) return null;

  const from = (currentPage - 1) * pageSize + 1;
  const to = Math.min(currentPage * pageSize, totalPatients);

  return (
    <div className="mt-4 flex items-center justify-between text-sm text-gray-500">
      <span className="w-full">
        Showing {from}–{to} of {totalPatients} patients
      </span>
      <PaginationWrapper
        totalPages={totalPages}
        searchParams={{ page: String(currentPage) }}
      />
    </div>
  );
});
