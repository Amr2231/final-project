import { serverFetch } from "@/lib/shared/api/server-client";
import type {
  WatchlistResponse,
  CreateFollowUpPayload,
  FollowUpResponse,
} from "@/lib/types/doctor-portal";
import type { MutationResponse } from "@/lib/types/doctor";

export async function fetchWatchlist(): Promise<WatchlistResponse> {
  return serverFetch<WatchlistResponse>("/api/watchlist");
}

export async function addToWatchlist(payload: {
  national_id: string;
  note?: string;
  priority?: string;
}): Promise<MutationResponse> {
  return serverFetch<MutationResponse>("/api/watchlist", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export async function removeFromWatchlist(
  nationalId: string,
): Promise<MutationResponse> {
  return serverFetch<MutationResponse>(`/api/watchlist/${nationalId}`, {
    method: "DELETE",
  });
}

export async function updateWatchlistItem(
  nationalId: string,
  payload: { note?: string; priority?: string },
): Promise<MutationResponse> {
  return serverFetch<MutationResponse>(`/api/watchlist/${nationalId}`, {
    method: "PATCH",
    body: JSON.stringify(payload),
  });
}

export async function fetchFollowUps(
  filter?: string,
): Promise<FollowUpResponse> {
  const qs = filter && filter !== "all" ? `?filter=${filter}` : "";
  return serverFetch<FollowUpResponse>(`/api/followup${qs}`);
}

export async function createFollowUp(
  payload: CreateFollowUpPayload,
): Promise<MutationResponse & { reminder_id?: number; due_date?: string }> {
  return serverFetch("/api/followup", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export async function markFollowUpDone(
  reminderId: number,
): Promise<MutationResponse> {
  return serverFetch<MutationResponse>(`/api/followup/${reminderId}/done`, {
    method: "PATCH",
  });
}

export async function deleteFollowUp(
  reminderId: number,
): Promise<MutationResponse> {
  return serverFetch<MutationResponse>(`/api/followup/${reminderId}`, {
    method: "DELETE",
  });
}
