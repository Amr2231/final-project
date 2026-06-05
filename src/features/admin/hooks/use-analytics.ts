"use client";

import { useQuery } from "@tanstack/react-query";
import { adminKeys } from "../constants/query-keys";
import {
  getFileAccessLogsAction,
  getGeoLoginsAction,
  getHeatmapAction,
} from "../actions/analytics.actions";

export function useHeatmap(filters?: {
  from_date?: string;
  to_date?: string;
  actor_id?: number;
}) {
  return useQuery({
    queryKey: adminKeys.heatmap(filters),
    queryFn: () => getHeatmapAction(filters),
    staleTime: 60_000,
  });
}

export function useFileAccessLogs(filters?: {
  page?: number;
  entity?: string;
  actor_id?: number;
  from_date?: string;
  to_date?: string;
}) {
  return useQuery({
    queryKey: adminKeys.fileAccess(filters),
    queryFn: () => getFileAccessLogsAction(filters),
    placeholderData: (prev) => prev,
    staleTime: 30_000,
  });
}

export function useGeoLogins(filters?: {
  from_date?: string;
  to_date?: string;
}) {
  return useQuery({
    queryKey: adminKeys.geoLogins(filters),
    queryFn: () => getGeoLoginsAction(filters),
    staleTime: 60_000,
  });
}
