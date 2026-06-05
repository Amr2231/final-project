import { doctorFetch } from "./client";
import type { MutationResponse } from "@/lib/types/doctor";

export async function changePassword(payload: {
  current_password: string;
  new_password: string;
  confirm_password: string;
}): Promise<MutationResponse> {
  return doctorFetch<MutationResponse>("/auth/change-password", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export async function updateProfile(payload: {
  first_name?: string;
  last_name?: string;
  username?: string;
  email?: string;
}): Promise<MutationResponse> {
  return doctorFetch<MutationResponse>("/users/profile", {
    method: "PATCH",
    body: JSON.stringify(payload),
  });
}
