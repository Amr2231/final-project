"use client";

import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "motion/react";
import {
  ArrowLeft,
  Sparkles,
  Check,
  X,
  Pencil,
  FileText,
  Archive,
  AlertTriangle,
  RefreshCw,
  ChevronDown,
  ChevronUp,
  Info,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils/tailwind-merge";
import {
  ReportStatusBadge,
  PatientStatusBadge,
} from "../patients/status-badge";
import {
  useRunAiAnalysis,
  useAiResult,
  useValidateAi,
  useEditAiResult,
  useInsertAiFindings,
} from "../../hooks/use-ai-analysis";
import { usePatientByStudyId } from "../../hooks/use-active-patients";
import type {
  AiResult,
  EditAiPayload,
  AiValidationStatus,
} from "@/lib/types/doctor";
import { PulseLoader } from "@/components/ui/pulse-loader";
import { EmptyState } from "@/components/ui/empty-state";
import { StudyImageViewer } from "./image-viewer";

// Types
type AiResultWithStatus = AiResult & { validation_status?: AiValidationStatus };

// Constants
const EDITABLE_FIELDS = [
  {
    key: "ejection_fraction" as const,
    label: "Ejection Fraction (%)",
    step: "0.1",
    min: 0,
    max: 100,
  },
  {
    key: "wall_thickness" as const,
    label: "Wall Thickness (mm)",
    step: "0.1",
    min: 0,
    max: 50,
  },
  {
    key: "hfref_confidence" as const,
    label: "HFrEF Confidence (0–1)",
    step: "0.01",
    min: 0,
    max: 1,
  },
  {
    key: "lvh_confidence" as const,
    label: "LVH Confidence (0–1)",
    step: "0.01",
    min: 0,
    max: 1,
  },
  {
    key: "has_hfref" as const,
    label: "Has HFrEF (0 or 1)",
    step: "1",
    min: 0,
    max: 1,
  },
  {
    key: "has_lvh" as const,
    label: "Has LVH (0 or 1)",
    step: "1",
    min: 0,
    max: 1,
  },
] as const;

// Helpers
function diagnosisBannerConfig(diagnosis: string | undefined) {
  const isNormal = diagnosis === "Normal";
  return {
    wrapperClass: isNormal
      ? "bg-green-50 border-green-200"
      : "bg-red-50 border-red-200",
    titleClass: isNormal ? "text-green-700" : "text-red-700",
    subtitleClass: isNormal ? "text-green-600" : "text-red-600",
  };
}

//  Sub-components
function InfoRow({
  label,
  value,
  children,
}: {
  label: string;
  value?: string | null;
  children?: React.ReactNode;
}) {
  return (
    <div className="space-y-1">
      <p className="text-xs text-blue-900/70 font-medium uppercase tracking-wide">
        {label}
      </p>
      {children ?? (
        <p className="text-sm font-semibold text-gray-900">{value ?? "—"}</p>
      )}
    </div>
  );
}

// Metric card
function MetricCard({
  label,
  value,
  note,
}: {
  label: string;
  value: string;
  note?: string;
}) {
  return (
    <div className="rounded-lg bg-white border border-gray-200 p-3 space-y-0.5">
      <p className="text-xs text-gray-400">{label}</p>
      <p className="font-bold text-gray-900 text-sm">{value}</p>
      {note && <p className="text-xs text-gray-400">{note}</p>}
    </div>
  );
}

// Inline confirmation banner — avoids modal overhead for simple approve/reject
function ConfirmBanner({
  action,
  onConfirm,
  onCancel,
  isLoading,
}: {
  action: "approve" | "reject";
  onConfirm: () => void;
  onCancel: () => void;
  isLoading: boolean;
}) {
  const isApprove = action === "approve";
  return (
    <motion.div
      initial={{ opacity: 0, y: -8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      className={cn(
        "rounded-lg border p-3 flex items-center justify-between gap-3",
        isApprove ? "bg-green-50 border-green-200" : "bg-red-50 border-red-200",
      )}
    >
      <div className="flex items-center gap-2">
        <AlertTriangle
          className={cn(
            "w-4 h-4 shrink-0",
            isApprove ? "text-green-600" : "text-red-600",
          )}
        />
        <p
          className={cn(
            "text-sm font-medium",
            isApprove ? "text-green-800" : "text-red-800",
          )}
        >
          {isApprove
            ? "Approve this AI result? This will allow inserting findings into the report."
            : "Reject this AI result? No further actions will be available."}
        </p>
      </div>
      <div className="flex items-center gap-2 shrink-0">
        <Button
          size="sm"
          variant="outline"
          disabled={isLoading}
          onClick={onCancel}
          className="h-7 text-xs"
        >
          Cancel
        </Button>
        <Button
          size="sm"
          disabled={isLoading}
          onClick={onConfirm}
          className={cn(
            "h-7 text-xs gap-1.5 text-white",
            isApprove
              ? "bg-green-600 hover:bg-green-700"
              : "bg-blue-600 hover:bg-blue-700",
          )}
        >
          {isLoading && <PulseLoader className="w-3 h-3 animate-spin" />}
          {isApprove ? "Yes, Approve" : "Yes, Reject"}
        </Button>
      </div>
    </motion.div>
  );
}

// AiResultCard
function AiResultCard({
  result,
  studyId,
  onFindingsInserted,
}: {
  result: AiResultWithStatus;
  studyId: string;
  onFindingsInserted?: () => void;
}) {
  // State
  const router = useRouter();
  const [isEditing, setIsEditing] = useState(false);
  const [pendingAction, setPendingAction] = useState<
    "approve" | "reject" | null
  >(null);
  const [interpretation, setInterpretation] = useState("");
  const [showInsertSection, setShowInsertSection] = useState(false);

  const [editForm, setEditForm] = useState<EditAiPayload>({
    ejection_fraction: result.ejection_fraction,
    wall_thickness: result.wall_thickness,
    has_hfref: result.has_hfref,
    has_lvh: result.has_lvh,
    hfref_confidence: result.hfref_confidence,
    lvh_confidence: result.lvh_confidence,
  });

  // Mutations
  const { mutate: validate, isPending: isValidating } = useValidateAi(studyId);
  const { mutate: editAi, isPending: isEditPending } = useEditAiResult(studyId);
  const { mutate: insertFindings, isPending: isInserting } =
    useInsertAiFindings(studyId, () => {
      onFindingsInserted?.();
      router.push(`/doctor/patients/${studyId}/report`);
    });

  // Computed
  const status = result.validation_status;
  const isApproved = status === "Approved";
  const isRejected = status === "Rejected";
  const isEdited = status === "Edited";
  const canTakeAction = !isApproved && !isRejected;
  const banner = diagnosisBannerConfig(result.diagnosis);

  const handleValidate = useCallback(
    (action: "approve" | "reject") => {
      validate(action, {
        onSuccess: () => setPendingAction(null),
        onError: () => setPendingAction(null),
      });
    },
    [validate],
  );

  const handleSaveEdits = useCallback(() => {
    editAi(editForm, {
      onSuccess: (data) => {
        if (data.success && data.message !== "No changes detected") {
          setIsEditing(false);
        }
      },
    });
  }, [editAi, editForm]);

  return (
    <div className="space-y-4">
      {/* ── Diagnosis Banner ── */}
      <div
        className={cn(
          "rounded-lg p-4 flex items-start justify-between gap-3 border",
          banner.wrapperClass,
        )}
      >
        <div>
          <p className={cn("text-base font-bold", banner.titleClass)}>
            {result.diagnosis ?? "Unknown"}
          </p>
          <p className={cn("text-xs mt-0.5", banner.subtitleClass)}>
            {result.summary ?? "No summary available"}
          </p>
        </div>
      </div>

      {/* ── Edited notice ── */}
      <AnimatePresence>
        {isEdited && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="flex items-center gap-2 rounded-lg bg-blue-50 border border-blue-200 p-3 text-xs text-blue-700"
          >
            <Info className="w-4 h-4 shrink-0" />
            Values were edited. Please approve or reject the updated result.
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Rejected notice ── */}
      <AnimatePresence>
        {isRejected && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="flex items-center gap-2 rounded-lg bg-red-50 border border-red-200 p-3 text-xs text-red-700"
          >
            <X className="w-4 h-4 shrink-0" />
            This AI result has been rejected. No further actions are available.
            You may re-run the analysis to start over.
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Metrics: View Mode ── */}
      {!isEditing && (
        <div className="grid grid-cols-2 gap-3">
          <MetricCard
            label="Ejection Fraction"
            value={`${result.ejection_fraction ?? "—"}%`}
            note="Normal: 55–70%"
          />
          <MetricCard
            label="Wall Thickness"
            value={`${result.wall_thickness ?? "—"} mm`}
          />
          <MetricCard
            label="HFrEF Confidence"
            value={
              result.hfref_confidence != null
                ? `${(result.hfref_confidence * 100).toFixed(1)}%`
                : "—"
            }
          />
          <MetricCard
            label="LVH Confidence"
            value={
              result.lvh_confidence != null
                ? `${(result.lvh_confidence * 100).toFixed(1)}%`
                : "—"
            }
          />
        </div>
      )}

      {/* ── Metrics: Edit Mode ── */}
      <AnimatePresence>
        {isEditing && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="grid grid-cols-2 gap-3"
          >
            {EDITABLE_FIELDS.map(({ key, label, step, min, max }) => (
              <div
                key={key}
                className="rounded-lg bg-white border border-gray-200 p-3 space-y-1"
              >
                <p className="text-xs text-gray-400">{label}</p>
                <Input
                  type="number"
                  step={step}
                  min={min}
                  max={max}
                  value={editForm[key] ?? ""}
                  onChange={(e) =>
                    setEditForm((prev) => ({
                      ...prev,
                      [key]: Number(e.target.value),
                    }))
                  }
                  className="h-8 text-sm"
                />
              </div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Confirmation Banner ── */}
      <AnimatePresence>
        {pendingAction && (
          <ConfirmBanner
            action={pendingAction}
            isLoading={isValidating}
            onConfirm={() => handleValidate(pendingAction)}
            onCancel={() => setPendingAction(null)}
          />
        )}
      </AnimatePresence>

      {/* ── Action Buttons ── */}
      {canTakeAction && !pendingAction && (
        <div className="flex items-center gap-2 flex-wrap">
          {isEditing ? (
            <>
              <Button
                size="sm"
                disabled={isEditPending}
                className="gap-1.5 bg-blue-600 hover:bg-blue-700 text-white"
                onClick={handleSaveEdits}
              >
                {isEditPending ? (
                  <PulseLoader />
                ) : (
                  <Check className="w-3.5 h-3.5" />
                )}
                Save Edits
              </Button>
              <Button
                size="sm"
                variant="outline"
                disabled={isEditPending}
                onClick={() => {
                  // Reset form to original values on cancel
                  setEditForm({
                    ejection_fraction: result.ejection_fraction,
                    wall_thickness: result.wall_thickness,
                    has_hfref: result.has_hfref,
                    has_lvh: result.has_lvh,
                    hfref_confidence: result.hfref_confidence,
                    lvh_confidence: result.lvh_confidence,
                  });
                  setIsEditing(false);
                }}
              >
                Cancel
              </Button>
            </>
          ) : (
            <>
              <Button
                size="sm"
                disabled={isValidating || isEditPending}
                className="gap-1.5 bg-green-600 hover:bg-green-700 text-white"
                onClick={() => setPendingAction("approve")}
              >
                <Check className="w-3.5 h-3.5" />
                Approve
              </Button>
              <Button
                size="sm"
                disabled={isValidating || isEditPending}
                className="gap-1.5 bg-red-600 hover:bg-red-700 text-white"
                onClick={() => setPendingAction("reject")}
              >
                <X className="w-3.5 h-3.5" />
                Reject
              </Button>
              <Button
                size="sm"
                variant="outline"
                disabled={isValidating}
                className="gap-1.5"
                onClick={() => setIsEditing(true)}
              >
                <Pencil className="w-3.5 h-3.5" />
                Edit
              </Button>
            </>
          )}
        </div>
      )}

      {/* ── Insert into Report (Approved only) ── */}
      {isApproved && (
        <div className="pt-3 border-t border-gray-100 space-y-3">
          <button
            type="button"
            className="flex items-center gap-2 text-sm font-semibold text-gray-700 hover:text-[#8B1A2B] transition-colors"
            onClick={() => setShowInsertSection((v) => !v)}
          >
            <FileText className="w-4 h-4" />
            Insert AI Findings into Report
            {showInsertSection ? (
              <ChevronUp className="w-3.5 h-3.5" />
            ) : (
              <ChevronDown className="w-3.5 h-3.5" />
            )}
          </button>

          <AnimatePresence>
            {showInsertSection && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="space-y-3 overflow-hidden"
              >
                <div className="flex items-start gap-2 rounded-lg bg-blue-50 border border-blue-200 p-3 text-xs text-blue-700">
                  <Info className="w-4 h-4 shrink-0 mt-0.5" />
                  <span>
                    This will populate the report with AI measurements and your
                    interpretation. The report status will be set to{" "}
                    <strong>Written</strong>.
                  </span>
                </div>

                <div className="space-y-1.5">
                  <p className="text-xs text-gray-500 font-medium">
                    Physician Interpretation{" "}
                    <span className="text-gray-400">(optional)</span>
                  </p>
                  <textarea
                    value={interpretation}
                    onChange={(e) => setInterpretation(e.target.value)}
                    placeholder="Add your clinical interpretation, recommendations, or follow-up notes..."
                    rows={4}
                    disabled={isInserting}
                    className="w-full resize-none rounded-lg border border-gray-200 bg-gray-50 p-3 text-sm text-gray-700 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#8B1A2B]/20 focus:border-[#8B1A2B] disabled:opacity-60 disabled:cursor-not-allowed"
                  />
                </div>

                <Button
                  disabled={isInserting}
                  className="gap-2 bg-[#8B1A2B] hover:bg-[#7a1726] text-white w-full"
                  onClick={() => insertFindings(interpretation)}
                >
                  {isInserting ? (
                    <>
                      <PulseLoader />
                    </>
                  ) : (
                    <>
                      <FileText className="w-4 h-4" />
                      Confirm — Insert into Report
                    </>
                  )}
                </Button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
}

// ─── AiAnalysisForm (Page) ────────────────────────────────────────────────────

export function AiAnalysisForm({ patientId }: { patientId: string }) {
  const router = useRouter();

  const { data: patient, isLoading: patientLoading } =
    usePatientByStudyId(patientId);
  const { data: aiData, isLoading: aiLoading } = useAiResult(patientId);
  const {
    mutate: runAnalysis,
    isPending: isRunning,
    data: runResult,
  } = useRunAiAnalysis(patientId);

  // Prefer persisted result from GET; fall back to just-run result
  const aiResult: AiResultWithStatus | null =
    aiData?.data ?? (runResult?.success ? runResult.data : null);

  const studyKey = patient?.studies?.study_id ?? 0;
  const baseImages = patient?.studies?.images ?? [];
  const [imageOverrides, setImageOverrides] = useState<{
    studyKey: number;
    images: typeof baseImages;
  } | null>(null);

  const images =
    imageOverrides?.studyKey === studyKey ? imageOverrides.images : baseImages;

  const [selectedByStudy, setSelectedByStudy] = useState<
    Record<number, number | null>
  >({});

  const selectedImageId =
    selectedByStudy[studyKey] ?? images[0]?.image_id ?? null;

  const setSelectedImageId = (imageId: number | null) => {
    setSelectedByStudy((previous) => ({
      ...previous,
      [studyKey]: imageId,
    }));
  };
  // ── Loading state ──
  if (patientLoading) {
    return (
      <div className="flex items-center justify-center py-20 gap-2 text-sm text-gray-400">
        <PulseLoader />
      </div>
    );
  }

  // ── Not found ──
  if (!patient) {
    return (
      <div className="flex items-center justify-center py-20">
        <EmptyState
          title="No patient found"
          description="This patient does not exist or you do not have access."
          icon={Archive}
        />
      </div>
    );
  }

  const hasImages = images.length > 0;
  const selectedImage = images.find((img) => img.image_id === selectedImageId);
  const selectedIsVideo =
    !!selectedImage &&
    ["video", "avi", "mp4", "mov", "wmv", "mkv"].some((t) =>
      String(selectedImage.file_format ?? selectedImage.file_path ?? "")
        .toLowerCase()
        .includes(t),
    );

  // Study type guard — AI only supports Echo
  const studyType = patient.study ?? "";
  const isEchoStudy = studyType === "Echo";

  return (
    <div className="min-h-screen  p-6 lg:p-8">
      {/* ── Header ── */}
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="flex items-center justify-between mb-6"
      >
        <div className="flex items-center gap-3">
          <button
            onClick={() => router.back()}
            className="flex items-center justify-center w-8 h-8 rounded-lg border border-gray-200 text-gray-500 hover:text-blue-800  transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <div>
            <h1 className="text-xl font-bold text-gray-900 dark:text-gray-100">
              AI Analysis
            </h1>
            <p className="text-xs text-gray-400 mt-0.5">
              Artificial Intelligence Medical Image Analysis
            </p>
          </div>
        </div>
        <Sparkles className="w-6 h-6 text-blue-800" />
      </motion.div>

      <div className="grid grid-cols-[320px_1fr] gap-6">
        {/* ── Left: Patient Info ── */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.1 }}
          className="space-y-4"
        >
          <div className="rounded-xl border border-gray-200 dark:bg-gray-400 p-5 space-y-4">
            <h2 className="text-base font-bold text-gray-900">
              Patient Information
            </h2>
            <div className="space-y-3">
              <InfoRow
                label="Full Name"
                value={`${patient.first_name} ${patient.last_name}`}
              />
              <InfoRow label="National ID" value={patient.national_id} />
              <InfoRow label="Gender" value={patient.gender} />
              <InfoRow label="Study Type" value={patient.study} />
              <InfoRow label="Received Date" value={patient.received_date} />
              <InfoRow label="Report Status">
                <ReportStatusBadge status={patient.report_status} />
              </InfoRow>
              <InfoRow label="Patient Status">
                <PatientStatusBadge status={patient.patient_status} />
              </InfoRow>
            </div>
          </div>

          {/* Echo-only warning */}
          {!isEchoStudy && (
            <div className="rounded-xl border border-amber-200 bg-amber-50 p-4 flex items-start gap-2">
              <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
              <p className="text-xs text-amber-800">
                AI analysis is only supported for <strong>Echo</strong> studies.
                This study is <strong>{studyType || "unknown type"}</strong>.
              </p>
            </div>
          )}
        </motion.div>

        {/* ── Right: Images + AI ── */}
        <div className="space-y-4">
          {/* Images */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.15 }}
            className="rounded-xl border border-gray-200 dark:bg-gray-400 p-5"
          >
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-base font-bold text-gray-900">
                Medical Images
              </h2>
              {selectedImageId && (
                <p className="text-xs text-gray-400 mt-2">
                  Selected for AI:{" "}
                  <span className="font-medium text-gray-600">
                    {images.find((i) => i.image_id === selectedImageId)
                      ?.view_type ?? "—"}
                  </span>
                </p>
              )}
            </div>

            {!hasImages ? (
              <EmptyState
                title="No images uploaded"
                description="Upload medical images before running AI analysis."
                icon={Archive}
              />
            ) : (
              <div className="grid grid-cols-3 gap-3">
                {images.map((img) => (
                  <StudyImageViewer
                    key={img.image_id}
                    studyId={String(patient.studies.study_id)}
                    imageId={img.image_id}
                    fileFormat={img.file_format}
                    viewType={img.view_type}
                    filePath={img.file_path}
                    isSelected={selectedImageId === img.image_id}
                    onSelect={(id) => setSelectedImageId(id)}
                    onDeleted={(id) => {
                      const updated = images.filter((i) => i.image_id !== id);
                      setImageOverrides({ studyKey, images: updated });
                      if (selectedImageId === id) {
                        setSelectedImageId(updated[0]?.image_id ?? null);
                      }
                    }}
                  />
                ))}
              </div>
            )}
          </motion.div>

          {/* AI Panel */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.2 }}
            className="rounded-xl border border-gray-200 dark:bg-gray-400 p-5"
          >
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-base font-bold text-gray-900">AI Analysis</h2>

              <Button
                onClick={() => runAnalysis(selectedImageId ?? undefined)}
                disabled={isRunning || !isEchoStudy || !selectedIsVideo}
                title={
                  !isEchoStudy
                    ? "Only Echo studies are supported"
                    : !selectedIsVideo
                      ? "Select a video file to run AI analysis"
                      : undefined
                }
                className="gap-2 bg-blue-800 hover:bg-blue-900 text-white disabled:opacity-50"
              >
                {isRunning ? (
                  <>
                    <PulseLoader />
                    Analyzing...
                  </>
                ) : (
                  <>
                    {aiResult ? (
                      <RefreshCw className="w-4 h-4" />
                    ) : (
                      <Sparkles className="w-4 h-4" />
                    )}
                    {aiResult ? "Re-run Analysis" : "Run AI Analysis"}
                  </>
                )}
              </Button>
            </div>

            {/* AI content */}
            {aiLoading ? (
              <div className="flex items-center justify-center py-10 gap-2 text-gray-400">
                <PulseLoader />
                <span className="text-sm">Loading AI results...</span>
              </div>
            ) : aiResult ? (
              <AiResultCard
                result={aiResult}
                studyId={patientId}
                onFindingsInserted={() =>
                  router.push(`/doctor/patients/${patientId}/report`)
                }
              />
            ) : (
              <div className="flex flex-col items-center justify-center py-10 gap-3 text-gray-400">
                <Sparkles className="w-10 h-10 text-blue-800/20" />
                <p className="text-sm text-center text-gray-700  max-w-xs">
                  {isEchoStudy
                    ? 'Click "Run AI Analysis" to analyze the uploaded medical images.'
                    : "AI analysis is not available for this study type."}
                </p>
              </div>
            )}
          </motion.div>
        </div>
      </div>
    </div>
  );
}
