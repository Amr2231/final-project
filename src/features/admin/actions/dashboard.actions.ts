"use server";

import * as dashboardApi from "../api/dashboard.api";

export async function getDashboardAction() {
  return dashboardApi.fetchDashboard();
}
