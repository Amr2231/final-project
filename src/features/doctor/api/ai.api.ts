import { doctorFetch } from "./client";
import type {
  AiResult,
  AiValidationStatus,
  EditAiPayload,
  MutationResponse,
} from "@/lib/types/doctor";

// type
export type AiResultResponse = {
  success: boolean;
  data: (AiResult & { validation_status: AiValidationStatus }) | null;
  message?: string;
};

// run ai analysis
export async function runAiAnalysis(
  studyId: string,
  imageId?: number,
): Promise<AiResultResponse & { message?: string }> {
  return doctorFetch(`/ai/run/${studyId}`, {
    method: "POST",
    body: JSON.stringify({ image_id: imageId }),
  });
}

// fetch ai result
export async function fetchAiResult(studyId: string): Promise<AiResultResponse> {
  return doctorFetch<AiResultResponse>(`/ai/${studyId}`);
}

// validate ai
export async function validateAi(
  studyId: string,
  action: "approve" | "reject",
): Promise<MutationResponse> {
  return doctorFetch<MutationResponse>(`/ai/validate/${studyId}`, {
    method: "POST",
    body: JSON.stringify({ action }),
  });
}

// edit ai
export async function editAiResult(
  studyId: string,
  payload: EditAiPayload,
): Promise<{ success: boolean; message: string; data: AiResult | null }> {
  return doctorFetch(`/ai/edit/${studyId}`, {
    method: "PUT",
    body: JSON.stringify(payload),
  });
}
