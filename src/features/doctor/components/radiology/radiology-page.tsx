"use client";

import Link from "next/link";
import { Scan, View } from "lucide-react";
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
import {
  DoctorLoadingState,
  DoctorPageShell,
  DoctorTableShell,
} from "../shared/ui";
import { useActivePatients } from "../../hooks/use-active-patients";

export function RadiologyPage() {
  const { data, isLoading } = useActivePatients({ limit: 50, page: 1 });
  const patients = data?.patients ?? [];

  if (isLoading) return <DoctorLoadingState />;

  return (
    <DoctorPageShell
      title="Radiology Studies"
      description="Assigned studies with imaging and AI analysis"
    >
      <DoctorTableShell>
        <Table>
          <TableHeader>
            <TableRow className="bg-gray-50/70 hover:bg-gray-50/70 border-b border-gray-200">
              {["Patient", "Study", "Images", "Status", "Actions"].map((h) => (
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
                    icon={Scan}
                    title="No studies"
                    description="Assigned radiology studies will appear here."
                  />
                </TableCell>
              </TableRow>
            ) : (
              patients.map((p) => (
                <TableRow key={p.id} className="border-b border-gray-100">
                  <TableCell className="pl-4 text-sm font-medium">
                    {p.first_name} {p.last_name}
                  </TableCell>
                  <TableCell className="text-sm">{p.study}</TableCell>
                  <TableCell className="text-sm tabular-nums">
                    {p.image_numbers}
                  </TableCell>
                  <TableCell className="text-sm">{p.patient_status}</TableCell>
                  <TableCell>
                    <div className="flex gap-1">
                      <Link
                        href={`/doctor/patients/${p.studies.study_id}/ai-analysis`}
                      >
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-8 text-xs text-blue-900"
                        >
                          <View className="w-3 h-3" />
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
    </DoctorPageShell>
  );
}
