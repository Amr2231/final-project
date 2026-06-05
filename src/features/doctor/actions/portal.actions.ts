"use server";

import * as portalApi from "../api/portal.api";
import type { CreateFollowUpPayload } from "@/lib/types/doctor-portal";

export async function getWatchlistAction() {
  return portalApi.fetchWatchlist();
}

export async function addToWatchlistAction(payload: {
  national_id: string;
  note?: string;
  priority?: string;
}) {
  return portalApi.addToWatchlist(payload);
}

export async function removeFromWatchlistAction(nationalId: string) {
  return portalApi.removeFromWatchlist(nationalId);
}

export async function getFollowUpsAction(filter?: string) {
  return portalApi.fetchFollowUps(filter);
}

export async function createFollowUpAction(payload: CreateFollowUpPayload) {
  return portalApi.createFollowUp(payload);
}

export async function markFollowUpDoneAction(reminderId: number) {
  return portalApi.markFollowUpDone(reminderId);
}

export async function deleteFollowUpAction(reminderId: number) {
  return portalApi.deleteFollowUp(reminderId);
}
