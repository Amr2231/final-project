"use client";

import { useQuery } from "@tanstack/react-query";
import { adminKeys } from "../constants/query-keys";
import {
  getAIResultsAction,
  getAIStatsAction,
} from "../actions/ai-stats.actions";

// get ai stats
export function useAIStats() {
  // hooks
  return useQuery({
    queryKey: adminKeys.aiStats,
    queryFn: getAIStatsAction,
    staleTime: 60_000,
  });
}

// get ai results
export function useAIResults(filters?: {
  page?: number;
  status?: string;
  from_date?: string;
  to_date?: string;
}) {
  return useQuery({
    queryKey: adminKeys.aiResults(filters),
    queryFn: () => getAIResultsAction(filters),
    placeholderData: (prev) => prev,
    staleTime: 30_000,
  });
}
