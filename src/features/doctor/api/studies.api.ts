import { doctorFetch } from "./client";
import type { MutationResponse } from "@/lib/types/doctor";

export async function completeStudy(studyId: string): Promise<MutationResponse> {
  return doctorFetch<MutationResponse>(`/studies/complete/${studyId}`, {
    method: "PUT",
  });
}
