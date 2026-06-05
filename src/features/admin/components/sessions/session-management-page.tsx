"use client";

import { useCallback, useState } from "react";
import { useDebounce } from "use-debounce";
import { AlertTriangle, Clock, LogOut, Shield, Users, Wifi } from "lucide-react";
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { EmptyState } from "@/components/ui/empty-state";
import type { ActiveSession } from "@/lib/types/admin-features";
import { formatFullTimestamp } from "@/lib/utils/date-format";
import {
  AdminLoadingState,
  AdminPageShell,
  AdminTableShell,
  MetricCard,
  MetricGrid,
  RoleBadge,
  TablePagination,
  TableToolbar,
} from "../shared";
import {
  useActiveSessions,
  useForceLogout,
  useForceLogoutAll,
  useSessionStats,
} from "../../hooks/use-sessions";
import { SessionDetailsSheet } from "./session-details-sheet";

export function SessionManagementPage() {
  const [search, setSearch] = useState("");
  const [debouncedSearch] = useDebounce(search, 400);
  const [page, setPage] = useState(1);
  const [role, setRole] = useState("all");
  const [targetSession, setTargetSession] = useState<ActiveSession | null>(null);
  const [detailsSession, setDetailsSession] = useState<ActiveSession | null>(null);
  const [logoutAllOpen, setLogoutAllOpen] = useState(false);

  const { data, isLoading, isFetching } = useActiveSessions({
    page,
    keyword: debouncedSearch || undefined,
    role: role !== "all" ? role : undefined,
  });
  const { data: statsData } = useSessionStats();
  const { mutate: forceLogout, isPending: logoutPending } = useForceLogout();
  const { mutate: logoutAll, isPending: logoutAllPending } = useForceLogoutAll();

  const stats = statsData?.data;
  const sessions = data?.data ?? [];
  const totalPages = data?.pages ?? 1;

  const handleForceLogout = useCallback(() => {
    if (!targetSession) return;
    forceLogout(targetSession.user_id, {
      onSuccess: () => setTargetSession(null),
    });
  }, [targetSession, forceLogout]);

  const handleLogoutAll = useCallback(() => {
    logoutAll(undefined, {
      onSuccess: () => setLogoutAllOpen(false),
    });
  }, [logoutAll]);

  if (isLoading) return <AdminLoadingState />;

  return (
    <AdminPageShell
      title="Session Management"
      description="Monitor and control active user sessions"
      actions={
        <Button
          onClick={() => setLogoutAllOpen(true)}
          className="bg-red-600 hover:bg-red-700 text-white gap-2"
        >
          <LogOut className="w-4 h-4" />
          Terminate All
        </Button>
      }
    >
      {stats && (
        <MetricGrid cols={4}>
          <MetricCard
            label="Active Sessions"
            value={stats.active_sessions}
            icon={Wifi}
            accent="bg-green-100 dark:bg-green-900/40"
          />
          <MetricCard
            label="Expired Sessions"
            value={stats.expired_sessions}
            icon={Clock}
            accent="bg-amber-100 dark:bg-amber-900/40"
          />
          {stats.by_role.map((r) => (
            <MetricCard
              key={r.role_name}
              label={`${r.role_name}s Online`}
              value={r.count}
              icon={Users}
            />
          ))}
        </MetricGrid>
      )}

      <TableToolbar
        search={search}
        onSearchChange={(v) => {
          setSearch(v);
          setPage(1);
        }}
        searchPlaceholder="Search by name, email or username..."
        filters={
          <Select
            value={role}
            onValueChange={(v) => {
              setRole(v);
              setPage(1);
            }}
          >
            <SelectTrigger className="w-40 h-10">
              <SelectValue placeholder="All roles" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All roles</SelectItem>
              <SelectItem value="Doctor">Doctor</SelectItem>
              <SelectItem value="Receptionist">Receptionist</SelectItem>
              <SelectItem value="Admin">Admin</SelectItem>
            </SelectContent>
          </Select>
        }
      />

      <AdminTableShell isFetching={isFetching}>
        <Table>
          <TableHeader>
            <TableRow className="bg-gray-50/70 hover:bg-gray-50/70 border-b border-gray-200 dark:bg-gray-900/50">
              {["User", "Role", "Last Login", "Session Expires", "IP", "Actions"].map(
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
            {sessions.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="py-10">
                  <EmptyState
                    icon={Shield}
                    title="No active sessions"
                    description="No users are currently logged in."
                  />
                </TableCell>
              </TableRow>
            ) : (
              sessions.map((session) => (
                <TableRow
                  key={session.user_id}
                  className="border-b border-gray-100 hover:bg-gray-50/60 dark:hover:bg-gray-900/40 cursor-pointer"
                  onClick={() => setDetailsSession(session)}
                >
                  <TableCell className="pl-4">
                    <p className="text-sm font-medium text-gray-800 dark:text-gray-200">
                      {session.first_name} {session.last_name}
                    </p>
                    <p className="text-xs text-gray-400">{session.email}</p>
                  </TableCell>
                  <TableCell>
                    <RoleBadge role={session.role_name} />
                  </TableCell>
                  <TableCell className="text-sm text-gray-600 tabular-nums whitespace-nowrap">
                    {session.last_login_at
                      ? formatFullTimestamp(session.last_login_at)
                      : "—"}
                  </TableCell>
                  <TableCell className="text-sm text-gray-600 tabular-nums whitespace-nowrap">
                    {formatFullTimestamp(session.session_expires_at)}
                  </TableCell>
                  <TableCell className="font-mono text-xs text-gray-500">
                    {session.last_login_ip ?? "—"}
                  </TableCell>
                  <TableCell onClick={(e) => e.stopPropagation()}>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-red-600 hover:text-red-700 hover:bg-red-50 gap-1 h-8 text-xs"
                      onClick={() => setTargetSession(session)}
                    >
                      <LogOut className="w-3 h-3" />
                      Logout
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </AdminTableShell>

      <TablePagination page={page} totalPages={totalPages} onPageChange={setPage} />

      <SessionDetailsSheet
        session={detailsSession}
        onClose={() => setDetailsSession(null)}
        onForceLogout={(s) => {
          setDetailsSession(null);
          setTargetSession(s);
        }}
      />

      <Dialog open={!!targetSession} onOpenChange={(v) => !v && setTargetSession(null)}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle>Terminate Session</DialogTitle>
            <DialogDescription>
              Force logout{" "}
              <span className="font-medium text-gray-800">
                {targetSession?.first_name} {targetSession?.last_name}
              </span>
              ? They will be signed out immediately.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setTargetSession(null)}>
              Cancel
            </Button>
            <Button
              disabled={logoutPending}
              onClick={handleForceLogout}
              className="bg-red-600 hover:bg-red-700 text-white"
            >
              {logoutPending ? "Terminating..." : "Terminate"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={logoutAllOpen} onOpenChange={setLogoutAllOpen}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-red-500" />
              Terminate All Sessions
            </DialogTitle>
            <DialogDescription>
              This will immediately sign out ALL users except yourself.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setLogoutAllOpen(false)}>
              Cancel
            </Button>
            <Button
              disabled={logoutAllPending}
              onClick={handleLogoutAll}
              className="bg-red-600 hover:bg-red-700 text-white"
            >
              {logoutAllPending ? "Terminating..." : "Terminate All"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </AdminPageShell>
  );
}
