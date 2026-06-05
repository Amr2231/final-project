import { serverFetch } from "@/lib/shared/api/server-client";
import type { DashboardResponse } from "@/lib/types/admin-features";

export async function fetchDashboard(): Promise<DashboardResponse> {
  return serverFetch<DashboardResponse>("/api/admin/dashboard");
}
