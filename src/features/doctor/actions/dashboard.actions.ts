"use server";

import * as dashboardApi from "../api/dashboard.api";

// Server action to get the doctor's dashboard data by calling the corresponding API function
export async function getDoctorDashboardAction() {
  return dashboardApi.fetchDoctorDashboard();
}

// Server action to get the doctor's performance metrics for a given period by calling the corresponding API function
export async function getDoctorPerformanceAction(period?: string) {
  return dashboardApi.fetchDoctorPerformance(period);
}
