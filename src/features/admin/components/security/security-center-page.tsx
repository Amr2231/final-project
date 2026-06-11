"use client";

import { useState } from "react";
import { useDebounce } from "use-debounce";
import { LockKeyhole, ShieldAlert, TrendingUp, Unlock } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { EmptyState } from "@/components/ui/empty-state";
import type { LockedAccount } from "@/lib/types/admin-features";
import { formatFullTimestamp } from "@/lib/utils/date-format";
import {
  AdminLoadingState,
  AdminPageShell,
  AdminTableShell,
  AdminTabs,
  BarChart,
  MetricCard,
  MetricGrid,
  TableToolbar,
} from "../shared";
import {
  useFailedLoginLogs,
  useLockedAccounts,
  useSecurityOverview,
  useUnlockAccount,
} from "../../hooks/use-security";
import PaginationWrapper from "@/components/ui/paginationWrapper";

// tabs
type SecurityTab = "overview" | "locked" | "logs";

// components
function SuspiciousIPsPanel({
  ips,
}: {
  ips: { ip_address: string; attempts: number }[];
}) {
  // render
  if (!ips.length) return null;
  return (
    <div className="rounded-xl border border-gray-200 bg-white dark:bg-gray-950 dark:border-gray-800 p-4">
      {/* header */}
      <p className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
        Top Suspicious IPs — Last 24h
      </p>
      <div className="space-y-2">
        {/* ips */}
        {ips.map((ip) => (
          <div
            key={ip.ip_address}
            className="flex items-center justify-between py-1.5 border-b border-gray-100 last:border-0"
          >
            {/* ip */}
            <span className="font-mono text-xs text-gray-600 dark:text-gray-400">
              {ip.ip_address}
            </span>

            {/* attempts */}
            <span className="text-xs font-semibold text-red-600 dark:text-red-400">
              {ip.attempts} attempts
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

// main
export function SecurityCenterPage() {
  // state
  const [tab, setTab] = useState<SecurityTab>("overview");
  const [targetUser, setTargetUser] = useState<LockedAccount | null>(null);
  const [logsPage, setLogsPage] = useState(1);
  const [ipSearch, setIpSearch] = useState("");
  const [debouncedIp] = useDebounce(ipSearch, 400);

  // queries
  const { data: overviewData, isLoading: overviewLoading } =
    useSecurityOverview();
  const { data: lockedData, isLoading: lockedLoading } = useLockedAccounts();
  const { data: logsData, isFetching: logsFetching } = useFailedLoginLogs({
    page: logsPage,
    ip: debouncedIp || undefined,
  });
  const { mutate: unlock, isPending: unlockPending } = useUnlockAccount();

  // data
  const overview = overviewData?.data;

  // handlers
  const handleUnlock = () => {
    if (!targetUser) return;
    unlock(targetUser.user_id, {
      onSuccess: () => setTargetUser(null),
    });
  };

  // tabs
  const tabs = [
    { id: "overview" as const, label: "Overview" },
    {
      id: "locked" as const,
      label: "Locked Accounts",
      count: lockedData?.total,
    },
    { id: "logs" as const, label: "Failed Logins" },
  ];

  return (
    <AdminPageShell
      title="Security Center"
      description="Monitor threats, failed logins and locked accounts"
    >
      <AdminTabs tabs={tabs} active={tab} onChange={setTab} />

      {/* tabs */}
      {tab === "overview" && (
        <div className="space-y-6">
          {overviewLoading ? (
            <AdminLoadingState />
          ) : overview ? (
            <>
              {/* metrics */}
              <MetricGrid cols={3}>
                {/* locked accounts */}
                <MetricCard
                  label="Locked Accounts"
                  value={overview.locked_accounts}
                  icon={LockKeyhole}
                  danger={overview.locked_accounts > 0}
                />

                {/* at risk accounts */}
                <MetricCard
                  label="At Risk Accounts"
                  value={overview.at_risk_accounts}
                  icon={ShieldAlert}
                  danger={overview.at_risk_accounts > 0}
                />

                {/* failed logins */}
                <MetricCard
                  label="Failed Logins (24h)"
                  value={overview.failed_logins_24h}
                  icon={TrendingUp}
                  danger={overview.failed_logins_24h > 10}
                />
              </MetricGrid>

              {/* charts */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                <BarChart
                  title="Failed Logins — Last 7 Days"
                  data={overview.failed_logins_by_day.map((d) => ({
                    label: d.day.slice(5),
                    value: d.count,
                  }))}
                  color="bg-red-400 dark:bg-red-600"
                />
                <SuspiciousIPsPanel ips={overview.top_suspicious_ips} />
              </div>
            </>
          ) : null}
        </div>
      )}

      {/* locked accounts */}
      {tab === "locked" && (
        <AdminTableShell isFetching={lockedLoading}>
          {lockedLoading ? (
            <AdminLoadingState />
          ) : (
            <Table>
              <TableHeader>
                <TableRow className="bg-gray-50/70 hover:bg-gray-50/70 border-b border-gray-200">
                  {[
                    "User",
                    "Role",
                    "Failed Attempts",
                    "Locked Until",
                    "IP",
                    "Action",
                  ].map((h) => (
                    <TableHead
                      key={h}
                      className="text-xs font-semibold text-gray-500 first:pl-4"
                    >
                      {h}
                    </TableHead>
                  ))}
                </TableRow>
              </TableHeader>
              <TableBody>
                {!lockedData?.data.length ? (
                  <TableRow>
                    <TableCell colSpan={6} className="py-10">
                      {/* empty */}
                      <EmptyState
                        icon={ShieldAlert}
                        title="No locked accounts"
                        description="All accounts are accessible."
                      />
                    </TableCell>
                  </TableRow>
                ) : (
                  lockedData.data.map((acc) => (
                    <TableRow
                      key={acc.user_id}
                      className="border-b border-gray-100 hover:bg-gray-50/60"
                    >
                      {/* user info */}
                      <TableCell className="pl-4">
                        <p className="text-sm font-medium text-gray-800 dark:text-gray-100">
                          {acc.first_name} {acc.last_name}
                        </p>
                        <p className="text-xs text-gray-400">{acc.email}</p>
                      </TableCell>

                      {/* role */}
                      <TableCell className="text-sm text-gray-600">
                        {acc.role_name}
                      </TableCell>

                      {/* failed attempts */}
                      <TableCell>
                        <span className="text-sm font-semibold text-red-600">
                          {acc.failed_login_attempts}
                        </span>
                      </TableCell>

                      {/* locked until */}
                      <TableCell className="text-sm text-gray-600 tabular-nums whitespace-nowrap">
                        {formatFullTimestamp(acc.lockout_until)}
                      </TableCell>

                      {/* last login ip */}
                      <TableCell className="font-mono text-xs text-gray-500">
                        {acc.last_login_ip ?? "—"}
                      </TableCell>

                      {/* unlock */}
                      <TableCell>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-green-600 hover:text-green-700 hover:bg-green-50 gap-1 h-8 text-xs"
                          onClick={() => setTargetUser(acc)}
                        >
                          <Unlock className="w-3 h-3" />
                          Unlock
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          )}
        </AdminTableShell>
      )}

      {/* logs */}
      {tab === "logs" && (
        <div className="space-y-4">
          <TableToolbar
            search={ipSearch}
            onSearchChange={(v) => {
              setIpSearch(v);
              setLogsPage(1);
            }}
            searchPlaceholder="Filter by IP address..."
          />
          <AdminTableShell isFetching={logsFetching}>
            <Table>
              <TableHeader>
                <TableRow className="bg-gray-50/70 hover:bg-gray-50/70 border-b border-gray-200">
                  {["Timestamp", "User", "Description", "IP Address"].map(
                    (h) => (
                      <TableHead
                        key={h}
                        className="text-xs font-semibold text-gray-500 first:pl-4"
                      >
                        {h}
                      </TableHead>
                    ),
                  )}
                </TableRow>
              </TableHeader>
              <TableBody>
                {!logsData?.data.length ? (
                  <TableRow>
                    <TableCell colSpan={4} className="py-10">
                      {/* empty */}
                      <EmptyState
                        icon={ShieldAlert}
                        title="No failed login logs"
                        description="No suspicious activity found."
                      />
                    </TableCell>
                  </TableRow>
                ) : (
                  logsData.data.map((log, i) => (
                    <TableRow
                      key={`${log.audit_log_id}-${i}`}
                      className="border-b border-gray-100 hover:bg-gray-50/60"
                    >
                      {/* Timestamp created at */}
                      <TableCell className="pl-4 text-sm text-gray-600 tabular-nums whitespace-nowrap">
                        {formatFullTimestamp(log.created_at)}
                      </TableCell>

                      {/* Actor name */}
                      <TableCell>
                        <p className="text-sm font-medium text-gray-800 dark:text-gray-100">
                          {log.actor_name ?? "—"}
                        </p>
                      </TableCell>

                      {/* Description */}
                      <TableCell className="text-sm text-gray-600 max-w-xs truncate">
                        {log.description ?? "—"}
                      </TableCell>

                      {/* IP Address */}
                      <TableCell className="font-mono text-xs text-gray-500">
                        {log.ip_address ?? "—"}
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </AdminTableShell>

          {/* pagination */}
          {(logsData?.pages ?? 0) > 1 && (
            <PaginationWrapper
              totalPages={logsData?.pages ?? 1}
              currentPage={logsPage}
              onPageChange={setLogsPage}
            />
          )}
        </div>
      )}

      <Dialog
        open={!!targetUser}
        onOpenChange={(v) => !v && setTargetUser(null)}
      >
        <DialogContent className="max-w-sm">
          {/* header */}
          <DialogHeader>
            <DialogTitle>Unlock Account</DialogTitle>
            <DialogDescription>
              Unlock {/* name */}
              <span className="font-medium text-gray-800">
                {targetUser?.first_name} {targetUser?.last_name}
              </span>
              ? They will be able to log in immediately.
            </DialogDescription>
          </DialogHeader>

          {/* footer */}
          <DialogFooter>
            <Button variant="outline" onClick={() => setTargetUser(null)}>
              Cancel
            </Button>

            {/* unlock button */}
            <Button
              disabled={unlockPending}
              onClick={handleUnlock}
              className="bg-[#8B1A2B] hover:bg-[#7a1726] text-white"
            >
              {unlockPending ? "Unlocking..." : "Unlock"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </AdminPageShell>
  );
}
