"use server";

import * as securityApi from "../api/security.api";

export async function getSecurityOverviewAction() {
  return securityApi.fetchSecurityOverview();
}

export async function getLockedAccountsAction() {
  return securityApi.fetchLockedAccounts();
}

export async function getFailedLoginLogsAction(
  filters?: Parameters<typeof securityApi.fetchFailedLoginLogs>[0],
) {
  return securityApi.fetchFailedLoginLogs(filters);
}

export async function unlockAccountAction(userId: number) {
  return securityApi.unlockAccount(userId);
}
