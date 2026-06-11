import { serverFetch } from "@/lib/shared/api/server-client";
import { buildQueryParams } from "../utils/build-query-params";
import type {
  AIStatsData,
  AIResultsListResponse,
} from "@/lib/types/admin-features";

// constant url prefix
const BASE = "/api/admin/ai";

// fetch ai stats data
export async function fetchAIStats(): Promise<{
  success: boolean;
  data: AIStatsData;
}> {
  return serverFetch(`${BASE}/stats`);
}

// fetch ai results
export async function fetchAIResults(filters?: {
  page?: number;
  limit?: number;
  status?: string;
  from_date?: string;
  to_date?: string;
}): Promise<AIResultsListResponse> {
  return serverFetch<AIResultsListResponse>(
    `${BASE}/results${buildQueryParams({
      page: filters?.page,
      limit: filters?.limit,
      status:
        filters?.status && filters.status !== "all"
          ? filters.status
          : undefined,
      from_date: filters?.from_date,
      to_date: filters?.to_date,
    })}`,
  );
}
