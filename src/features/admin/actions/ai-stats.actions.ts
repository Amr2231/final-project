"use server";

import * as aiStatsApi from "../api/ai-stats.api";

export async function getAIStatsAction() {
  return aiStatsApi.fetchAIStats();
}

export async function getAIResultsAction(
  filters?: Parameters<typeof aiStatsApi.fetchAIResults>[0],
) {
  return aiStatsApi.fetchAIResults(filters);
}
