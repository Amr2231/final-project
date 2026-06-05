"use server";

import * as sessionsApi from "../api/sessions.api";

export async function getActiveSessionsAction(
  filters?: Parameters<typeof sessionsApi.fetchActiveSessions>[0],
) {
  return sessionsApi.fetchActiveSessions(filters);
}

export async function getSessionStatsAction() {
  return sessionsApi.fetchSessionStats();
}

export async function forceLogoutUserAction(userId: number) {
  return sessionsApi.forceLogoutUser(userId);
}

export async function forceLogoutAllAction() {
  return sessionsApi.forceLogoutAll();
}
