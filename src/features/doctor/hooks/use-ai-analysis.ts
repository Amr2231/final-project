"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import {
  editAiResultAction,
  getAiResultAction,
  insertAiFindingsAction,
  runAiAnalysisAction,
  validateAiAction,
} from "../actions";
import { doctorKeys } from "../constants/query-keys";
import type { EditAiPayload } from "@/lib/types/doctor";

export { doctorKeys as aiKeys };

export function useRunAiAnalysis(studyId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (imageId?: number) => runAiAnalysisAction(studyId, imageId),
    onSuccess: (data) => {
      if (!data.success) {
        toast.error(data.message ?? "AI analysis failed");
        return;
      }
      toast.success("AI analysis completed successfully");
      queryClient.invalidateQueries({ queryKey: doctorKeys.aiResult(studyId) });
      queryClient.invalidateQueries({
        queryKey: doctorKeys.patientByStudy(studyId),
      });
    },
    onError: (error: Error) => {
      toast.error(error.message ?? "Failed to reach AI service");
    },
  });
}

export function useAiResult(studyId: string) {
  return useQuery({
    queryKey: doctorKeys.aiResult(studyId),
    queryFn: () => getAiResultAction(studyId),
    enabled: Boolean(studyId),
    refetchOnMount: true,
    staleTime: 0,
    retry: 1,
  });
}

export function useValidateAi(studyId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (action: "approve" | "reject") =>
      validateAiAction(studyId, action),
    onSuccess: (data, action) => {
      if (!data.success) {
        toast.error(data.message ?? "Validation failed");
        return;
      }
      const label = action === "approve" ? "approved" : "rejected";
      toast.success(`AI result ${label} successfully`);
      queryClient.invalidateQueries({ queryKey: doctorKeys.aiResult(studyId) });
      queryClient.invalidateQueries({ queryKey: doctorKeys.patients });
      queryClient.invalidateQueries({
        queryKey: doctorKeys.patientByStudy(studyId),
      });
    },
    onError: (error: Error) => {
      toast.error(error.message ?? "Validation request failed");
    },
  });
}

export function useEditAiResult(studyId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: EditAiPayload) =>
      editAiResultAction(studyId, payload),
    onSuccess: (data) => {
      if (!data.success) {
        toast.error(data.message ?? "Failed to save edits");
        return;
      }
      if (data.message === "No changes detected") {
        toast.info("No changes were detected");
        return;
      }
      toast.success("AI result updated — please approve the final result");
      queryClient.invalidateQueries({ queryKey: doctorKeys.aiResult(studyId) });
    },
    onError: (error: Error) => {
      toast.error(error.message ?? "Edit request failed");
    },
  });
}

export function useInsertAiFindings(studyId: string, onNavigate?: () => void) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (doctorInterpretation: string) =>
      insertAiFindingsAction(studyId, doctorInterpretation),
    onSuccess: (data) => {
      if (!data.success) {
        toast.error(data.message ?? "Failed to insert AI findings");
        return;
      }

      toast.success("AI findings inserted into report successfully", {
        duration: 1500,
        onAutoClose: () => onNavigate?.(),
        onDismiss: () => onNavigate?.(),
      });

      queryClient.invalidateQueries({
        queryKey: doctorKeys.reportDraft(studyId),
      });
      queryClient.invalidateQueries({ queryKey: doctorKeys.patients });
      queryClient.invalidateQueries({
        queryKey: doctorKeys.patientByStudy(studyId),
      });
    },
    onError: (error: Error) => {
      toast.error(error.message ?? "Insert findings request failed");
    },
  });
}
