import { doctorFetch } from "./client";
import type {
  AiResult,
  AiValidationStatus,
  EditAiPayload,
  MutationResponse,
} from "@/lib/types/doctor";

export type AiResultResponse = {
  success: boolean;
  data: (AiResult & { validation_status: AiValidationStatus }) | null;
  message?: string;
};

export async function runAiAnalysis(
  studyId: string,
  imageId?: number,
): Promise<AiResultResponse & { message?: string }> {
  return doctorFetch(`/ai/run/${studyId}`, {
    method: "POST",
    body: JSON.stringify({ image_id: imageId }),
  });
}

export async function fetchAiResult(studyId: string): Promise<AiResultResponse> {
  return doctorFetch<AiResultResponse>(`/ai/${studyId}`);
}

export async function validateAi(
  studyId: string,
  action: "approve" | "reject",
): Promise<MutationResponse> {
  return doctorFetch<MutationResponse>(`/ai/validate/${studyId}`, {
    method: "POST",
    body: JSON.stringify({ action }),
  });
}

export async function editAiResult(
  studyId: string,
  payload: EditAiPayload,
): Promise<{ success: boolean; message: string; data: AiResult | null }> {
  return doctorFetch(`/ai/edit/${studyId}`, {
    method: "PUT",
    body: JSON.stringify(payload),
  });
}
