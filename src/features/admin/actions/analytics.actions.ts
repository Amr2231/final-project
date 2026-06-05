"use server";

import * as analyticsApi from "../api/analytics.api";

export async function getHeatmapAction(
  filters?: Parameters<typeof analyticsApi.fetchHeatmap>[0],
) {
  return analyticsApi.fetchHeatmap(filters);
}

export async function getFileAccessLogsAction(
  filters?: Parameters<typeof analyticsApi.fetchFileAccessLogs>[0],
) {
  return analyticsApi.fetchFileAccessLogs(filters);
}

export async function getGeoLoginsAction(
  filters?: Parameters<typeof analyticsApi.fetchGeoLogins>[0],
) {
  return analyticsApi.fetchGeoLogins(filters);
}
