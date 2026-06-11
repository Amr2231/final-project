"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { EmptyState } from "@/components/ui/empty-state";
import { useGetReport } from "@/features/doctor/hooks/use-report";
import { ClipboardMinus } from "lucide-react";

type ViewReportModalProps = {
  studyId: string | null;
  onClose: () => void;
};

export function ViewReportModal({ studyId, onClose }: ViewReportModalProps) {
  const { data: report, isLoading } = useGetReport(studyId ?? "");

  return (
    <Dialog open={Boolean(studyId)} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-lg font-bold text-gray-900">
            Report
          </DialogTitle>
          {report && (
            <DialogDescription className="text-sm text-gray-500">
              {report.patient_first_name} {report.patient_last_name} —{" "}
              {report.study_type}
            </DialogDescription>
          )}
        </DialogHeader>

        {isLoading ? (
          <div className="py-10 text-center text-sm text-gray-400">
            Loading report...
          </div>
        ) : !report ? (
          <div className="py-10 text-center text-sm text-gray-400">
            <EmptyState
              icon={ClipboardMinus}
              title="No report found"
              description="This report does not exist or has been deleted."
            />
          </div>
        ) : (
          <div className="space-y-4 text-sm pt-2">
            <div className="grid grid-cols-2 gap-3 bg-gray-900 rounded-lg p-4 border ">
              <div>
                <p className="text-xs text-gray-400">Patient</p>
                <p className="font-medium text-gray-800 dark:text-gray-100">
                  {report.patient_first_name} {report.patient_last_name}
                </p>
              </div>
              <div>
                <p className="text-xs text-gray-400">Study Type</p>
                <p className="font-medium text-gray-800 dark:text-gray-100">{report.study_type}</p>
              </div>
              <div>
                <p className="text-xs text-gray-400">Study Date</p>
                <p className="font-medium text-gray-800 dark:text-gray-100">
                  {report.study_date
                    ? new Date(report.study_date).toLocaleDateString("en-GB", {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                      })
                    : "—"}
                </p>
              </div>
              <div>
                <p className="text-xs text-gray-400">Status</p>
                <p className="font-medium capitalize text-gray-800 dark:text-gray-100">
                  {report.report_status}
                </p>
              </div>
              <div>
                <p className="text-xs text-gray-400">Assigned Doctor</p>
                <p className="font-medium text-gray-800 dark:text-gray-100">
                  {report.assigned_doctor ?? "—"}
                </p>
              </div>
              {report.signing_doctor && (
                <div>
                  <p className="text-xs text-gray-400">Signed By</p>
                  <p className="font-medium text-gray-800 dark:text-gray-100">
                    {report.signing_doctor}
                  </p>
                </div>
              )}
              {report.signed_at && (
                <div className="col-span-2">
                  <p className="text-xs text-gray-400">Signed At</p>
                  <p className="font-medium text-gray-800 dark:text-gray-100">
                    {
                      new Date(report.signed_at)
                        .toISOString()
                        .replace("T", " ")
                        .split(".")[0]
                    }
                  </p>
                </div>
              )}
            </div>
            <div>
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">
                Findings
              </p>
              <pre className="whitespace-pre-wrap font-sans text-sm text-gray-500 bg-gray-900 border  rounded-lg p-4 leading-relaxed">
                {report.report_content || "No findings recorded."}
              </pre>
            </div>
          </div>
        )}

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
