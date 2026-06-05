"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion } from "motion/react";
import { useZodForm } from "@/lib/shared/forms/create-zod-form";
import { FormFieldError } from "@/lib/shared/forms/form-field-error";
import {
  ArrowLeft,
  User,
  Stethoscope,
  FileText,
  Upload,
  Loader2,
  CheckCircle2,
  Clock,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils/tailwind-merge";
import { ReportStatusBadge } from "../patients/status-badge";
import {
  useSaveReportDraft,
  useSignReport,
  useOpenReport,
  useExportReportPDF,
} from "../../hooks/use-report";
import { usePatientByStudyId } from "../../hooks/use-active-patients";
import { reportSchema } from "../../validation/schemas";
import { resolvePatientReportStatus } from "../../utils/report-status";
import { PulseLoader } from "@/components/ui/pulse-loader";
import { DoctorErrorState } from "../shared/ui";
function SectionCard({
  icon: Icon,
  title,
  children,
}: {
  icon: React.ElementType;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-xl border border-border bg-card overflow-hidden">
      <div className="flex items-center gap-3 px-5 py-4 border-b border-border bg-muted/40">
        <span className="flex items-center justify-center w-7 h-7 rounded-lg bg-blue-100 dark:bg-blue-900/40">
          <Icon className="w-4 h-4 text-blue-900 dark:text-blue-200" />
        </span>
        <h2 className="text-sm font-semibold text-foreground">{title}</h2>
      </div>
      <div className="p-5">{children}</div>
    </div>
  );
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between py-2.5 border-b border-border last:border-0">
      <span className="text-sm text-muted-foreground">{label}</span>
      <span className="text-sm font-medium text-foreground">{value}</span>
    </div>
  );
}

function SaveIndicator({
  isSaving,
  isSaved,
  isError,
}: {
  isSaving: boolean;
  isSaved: boolean;
  isError: boolean;
}) {
  if (isSaving) {
    return (
      <span className="inline-flex items-center gap-1.5 text-xs text-muted-foreground">
        <Loader2 className="w-3 h-3 animate-spin" />
        Saving…
      </span>
    );
  }
  if (isError) {
    return (
      <span className="inline-flex items-center gap-1.5 text-xs text-red-500">
        Save failed
      </span>
    );
  }
  if (isSaved) {
    return (
      <span className="inline-flex items-center gap-1.5 text-xs text-emerald-600 dark:text-emerald-400">
        <CheckCircle2 className="w-3 h-3" />
        Draft saved
      </span>
    );
  }
  return (
    <span className="inline-flex items-center gap-1.5 text-xs text-muted-foreground">
      <Clock className="w-3 h-3" />
      Unsaved changes
    </span>
  );
}

export function ReportForm({ patientId }: { patientId: string }) {
  const router = useRouter();
  const studyId = patientId;
  const { data: patient, isLoading: patientsLoading, refetch } =
    usePatientByStudyId(studyId);

  const { data: openData, isLoading: reportLoading } = useOpenReport(studyId);

  const {
    mutate: saveDraft,
    isPending: isSaving,
    isSuccess: isSaved,
    isError: isSaveError,
    reset: resetMutation,
  } = useSaveReportDraft(studyId);

  const { mutate: signReport, isPending: isSigning } = useSignReport(studyId);
  const { mutate: exportPdf, isPending: isExporting } =
    useExportReportPDF(studyId);

  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors, isDirty },
  } = useZodForm(reportSchema, {
    defaultValues: { notes: "" },
  });

  useEffect(() => {
    if (!openData) return;
    const content =
      (openData as { report_content?: string }).report_content ?? "";
    reset({ notes: content }, { keepDirty: false });
  }, [openData, reset]);

  const notesValue = watch("notes");
  useEffect(() => {
    if (isSaved && isDirty) resetMutation();
  }, [notesValue, isSaved, isDirty, resetMutation]);

  const reportStatus = resolvePatientReportStatus(
    (openData as { report_status?: string })?.report_status,
    patient ?? undefined,
  );
  const isSigned = reportStatus === "signed";

  const onSaveDraft = handleSubmit((values) => {
    saveDraft({ notes: values.notes });
  });

  const onSign = handleSubmit((values) => {
    signReport({ notes: values.notes });
  });

  if (patientsLoading || reportLoading) {
    return (
      <div className="min-h-screen bg-background p-6 flex items-center justify-center gap-3 text-muted-foreground">
        <span className="text-sm">
          <PulseLoader />
        </span>
      </div>
    );
  }

  if (!patient) {
    return (
      <div className="min-h-screen bg-background p-6 lg:p-8">
        <DoctorErrorState
          message="Unable to load patient for this study."
          onRetry={() => refetch()}
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background p-6 lg:p-8">
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="flex items-center justify-between mb-6"
      >
        <div className="flex items-center gap-3">
          <button
            onClick={() => router.back()}
            className="flex items-center justify-center w-8 h-8 rounded-lg border border-border bg-card text-muted-foreground hover:text-[#8B1A2B] hover:border-[#8B1A2B]/30 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <div>
            <h1 className="text-xl font-bold text-foreground">
              Report — {patient.first_name} {patient.last_name}
            </h1>
            <p className="text-xs text-muted-foreground mt-0.5">
              Medical Report Generation
            </p>
          </div>
        </div>
        <ReportStatusBadge status={reportStatus} />
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="space-y-4">
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.1 }}
          >
            <SectionCard icon={User} title="Patient Information">
              <InfoRow
                label="Name"
                value={`${patient.first_name} ${patient.last_name}`}
              />
              <InfoRow label="Patient ID" value={patient.national_id} />
              <InfoRow label="Gender" value={patient.gender} />
              <InfoRow label="Study Type" value={patient.study} />
              <InfoRow
                label="Study Date"
                value={
                  patient.received_date
                    ? new Date(patient.received_date).toLocaleDateString(
                        "en-GB",
                        { day: "2-digit", month: "short", year: "numeric" },
                      )
                    : "—"
                }
              />
            </SectionCard>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.15 }}
          >
            <SectionCard icon={Stethoscope} title="Assigned Doctor">
              <div className="flex items-center gap-3">
                <div className="flex items-center justify-center w-10 h-10 rounded-full bg-blue-800 text-white text-sm font-bold">
                  {patient.assigned_doctor?.charAt(0) ?? "D"}
                </div>
                <div>
                  <p className="text-sm font-semibold text-foreground">
                    {patient.assigned_doctor}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {patient.doctor_specialty}
                  </p>
                </div>
              </div>
            </SectionCard>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.1 }}
        >
          <SectionCard icon={FileText} title="Doctor's Notes">
            <div className="mb-3 flex items-center gap-2 px-3 py-2 rounded-lg bg-blue-50 dark:bg-blue-950/30 border border-blue-100 dark:border-blue-900/50">
              <span className="text-blue-500 text-xs">ℹ</span>
              <p className="text-xs text-blue-600 dark:text-blue-300">
                You can add notes and recommendations here.
              </p>
            </div>

            <textarea
              {...register("notes")}
              placeholder="Enter your medical findings and recommendations here..."
              disabled={isSigned}
              className={cn(
                "w-full h-64 resize-none rounded-lg border border-border bg-muted/30 p-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-blue-200/20 dark:focus:ring-blue-800/30 focus:border-blue-400 transition-colors",
                isSigned && "opacity-60 cursor-not-allowed",
                errors.notes && "border-blue-400 focus:ring-blue-200",
              )}
            />

            <FormFieldError error={errors.notes} className="mt-1.5" />

            <div className="mt-2 flex justify-end">
              <SaveIndicator
                isSaving={isSaving}
                isSaved={isSaved}
                isError={isSaveError}
              />
            </div>
          </SectionCard>
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3, delay: 0.3 }}
        className="flex items-center justify-end gap-2 mt-6"
      >
        <Button
          variant="outline"
          onClick={onSaveDraft}
          disabled={isSaving || isSigned}
          className="gap-2 text-sm"
        >
          <FileText className="w-3.5 h-3.5" />
          {isSaving ? "Saving…" : "Save Draft"}
        </Button>

        <Button
          onClick={onSign}
          disabled={isSigning || isSigned}
          className="gap-2 text-sm bg-blue-800 hover:bg-blue-900 text-white"
        >
          {isSigning ? "Signing…" : "Sign Report"}
        </Button>

        <Button
          variant="secondary"
          onClick={() => exportPdf()}
          disabled={isExporting || !isSigned}
          className="gap-2 text-sm bg-gray-800 hover:bg-gray-900 text-white dark:bg-gray-700 dark:hover:bg-gray-600"
        >
          {isExporting ? (
            <Loader2 className="w-3.5 h-3.5 animate-spin" />
          ) : (
            <Upload className="w-3.5 h-3.5" />
          )}
          Export PDF
        </Button>
      </motion.div>
    </div>
  );
}
