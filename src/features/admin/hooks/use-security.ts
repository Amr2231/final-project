"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { adminKeys } from "../constants/query-keys";
import {
  getFailedLoginLogsAction,
  getLockedAccountsAction,
  getSecurityOverviewAction,
  unlockAccountAction,
} from "../actions/security.actions";

// security overview
export function useSecurityOverview() {
  return useQuery({
    queryKey: adminKeys.securityOverview,
    queryFn: getSecurityOverviewAction,
    refetchInterval: 60_000,
    staleTime: 30_000,
  });
}

// locked accounts
export function useLockedAccounts() {
  return useQuery({
    queryKey: adminKeys.lockedAccounts,
    queryFn: getLockedAccountsAction,
    staleTime: 30_000,
  });
}

// failed logins
export function useFailedLoginLogs(filters?: {
  page?: number;
  from_date?: string;
  to_date?: string;
  ip?: string;
}) {
  return useQuery({
    queryKey: adminKeys.failedLogins(filters),
    queryFn: () => getFailedLoginLogsAction(filters),
    placeholderData: (prev) => prev,
    staleTime: 30_000,
  });
}

// unlock account
export function useUnlockAccount() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (userId: number) => unlockAccountAction(userId),
    onSuccess: () => {
      toast.success("Account unlocked");
      qc.invalidateQueries({ queryKey: adminKeys.lockedAccounts });
      qc.invalidateQueries({ queryKey: adminKeys.securityOverview });
    },
    onError: () => toast.error("Failed to unlock account"),
  });
}
