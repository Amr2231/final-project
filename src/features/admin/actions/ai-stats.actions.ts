"use server";

import * as aiStatsApi from "../api/ai-stats.api";

// get ai stats action
export async function getAIStatsAction() {
  return aiStatsApi.fetchAIStats();
}

// get ai results action
export async function getAIResultsAction(
  filters?: Parameters<typeof aiStatsApi.fetchAIResults>[0],
) {
  return aiStatsApi.fetchAIResults(filters);
}
