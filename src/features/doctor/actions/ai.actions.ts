"use server";

import {
  editAiResult,
  fetchAiResult,
  runAiAnalysis,
  validateAi,
} from "../api/ai.api";
import type { EditAiPayload, MutationResponse } from "@/lib/types/doctor";

export async function runAiAnalysisAction(study_id: string, image_id?: number) {
  return runAiAnalysis(study_id, image_id);
}

export async function getAiResultAction(study_id: string) {
  return fetchAiResult(study_id);
}

export async function validateAiAction(
  study_id: string,
  action: "approve" | "reject",
): Promise<MutationResponse> {
  return validateAi(study_id, action);
}

export async function editAiResultAction(
  study_id: string,
  payload: EditAiPayload,
) {
  return editAiResult(study_id, payload);
}
