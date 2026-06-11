"use client";

import { memo, useCallback, useState } from "react";
import { useDebounce } from "use-debounce";
import dynamic from "next/dynamic";
import {
  Search,
  SlidersHorizontal,
  ChevronDown,
  ChevronUp,
  ScrollText,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { cn } from "@/lib/utils/tailwind-merge";
import { EmptyState } from "@/components/ui/empty-state";
import { PulseLoader } from "@/components/ui/pulse-loader";
import type { AuditLogRow } from "@/lib/types/audit-logs";
import { useAuditLogs } from "../../hooks/use-audit-logs";
import {
  AUDIT_TABLE_HEADERS,
  getAuditLogRowKey,
} from "../../constants/audit-logs.constants";
import { ActionBadge } from "./action-badge";
import { EntityBadge } from "./entity-badge";
import type { AuditLogFiltersState } from "./audit-log-filters-modal";
import { formatFullTimestamp } from "@/lib/utils/date-format";
import PaginationWrapper from "@/components/ui/paginationWrapper";

// dynamic imports
const AuditLogFiltersModal = dynamic(() =>
  import("./audit-log-filters-modal").then((m) => ({
    default: m.AuditLogFiltersModal,
  })),
);

// constants
const DEFAULT_FILTERS: AuditLogFiltersState = {
  action: "",
  entity: "",
  actorId: "",
  entityId: "",
  fromDate: "",
  toDate: "",
  sort: "created_at",
  order: "DESC",
};

// components
const AuditLogRowComponent = memo(function AuditLogRowComponent({
  log,
  isExpanded,
  onToggle,
}: {
  log: AuditLogRow;
  isExpanded: boolean;
  onToggle: () => void;
}) {
  const actorDisplay = log.actor_name?.trim() || "System";
  const hasDetails =
    Boolean(log.description) ||
    Boolean(log.ip_address) ||
    log.entity_id != null;

  return (
    <>
      <TableRow
        className={cn(
          "border-b border-gray-100 transition-colors hover:bg-gray-50/60 dark:hover:bg-gray-900/40",
          isExpanded && "bg-gray-50/40 dark:bg-gray-900/20",
        )}
      >
        {/* Timestamp created at */}
        <TableCell className="pl-4 text-sm text-gray-600 tabular-nums whitespace-nowrap">
          {formatFullTimestamp(log.created_at)}
        </TableCell>
        <TableCell>
          <div className="min-w-0">
            <p className="text-sm font-medium text-gray-800 dark:text-gray-200 truncate">
              {actorDisplay}
            </p>

            {/* Actor role */}
            {log.actor_role && (
              <p className="text-xs text-gray-400">{log.actor_role}</p>
            )}

            {/* Actor ID */}
            {log.actor_id != null && (
              <p className="text-xs text-gray-400 tabular-nums">
                ID: {log.actor_id}
              </p>
            )}
          </div>
        </TableCell>

        {/* Action */}
        <TableCell>
          <ActionBadge action={log.action} />
        </TableCell>

        {/* Entity */}
        <TableCell>
          <div className="flex flex-col gap-1">
            <EntityBadge entity={log.entity} />
            {log.entity_id != null && (
              <span className="text-xs text-gray-400 tabular-nums truncate max-w-32">
                {String(log.entity_id)}
              </span>
            )}
          </div>
        </TableCell>

        {/* Description */}
        <TableCell className="max-w-xs">
          <p className="text-sm text-gray-600 dark:text-gray-400 truncate">
            {log.description || "—"}
          </p>
        </TableCell>

        {/* Details */}
        <TableCell className="pr-4 w-10">
          {hasDetails && (
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 text-gray-500"
              onClick={onToggle}
              aria-expanded={isExpanded}
              aria-label={isExpanded ? "Collapse details" : "Expand details"}
            >
              {isExpanded ? (
                <ChevronUp className="w-4 h-4" />
              ) : (
                <ChevronDown className="w-4 h-4" />
              )}
            </Button>
          )}
        </TableCell>
      </TableRow>

      {/* Details */}
      {isExpanded && hasDetails && (
        <TableRow className="bg-gray-50/50 dark:bg-gray-900/30 border-b border-gray-100">
          {/* Details */}
          <TableCell colSpan={AUDIT_TABLE_HEADERS.length} className="px-6 py-4">
            <dl className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 text-sm">
              {/* Description */}
              {log.description && (
                <div className="sm:col-span-2 lg:col-span-3">
                  <dt className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">
                    Description
                  </dt>
                  {/* Description */}
                  <dd className="text-gray-700 dark:text-gray-300">
                    {log.description}
                  </dd>
                </div>
              )}

              {/* Entity ID */}
              {log.entity_id != null && (
                <div>
                  <dt className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">
                    Entity ID
                  </dt>
                  <dd className="text-gray-700 dark:text-gray-300 font-mono text-xs">
                    {String(log.entity_id)}
                  </dd>
                </div>
              )}

              {/* IP Address */}
              {log.ip_address && (
                <div>
                  <dt className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">
                    IP Address
                  </dt>
                  <dd className="text-gray-700 dark:text-gray-300 font-mono text-xs">
                    {log.ip_address}
                  </dd>
                </div>
              )}
              <div>
                {/* Timestamp */}
                <dt className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">
                  Timestamp
                </dt>
                <dd className="text-gray-700 dark:text-gray-300 tabular-nums">
                  {formatFullTimestamp(log.created_at)}
                </dd>
              </div>
            </dl>
          </TableCell>
        </TableRow>
      )}
    </>
  );
});

// Audit logs table
export function AuditLogsTable() {
  // state
  const [search, setSearch] = useState("");
  const [debouncedSearch] = useDebounce(search, 400);
  const [page, setPage] = useState(1);
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [filters, setFilters] = useState<AuditLogFiltersState>(DEFAULT_FILTERS);
  const [expandedKeys, setExpandedKeys] = useState<Set<string>>(new Set());

  // queries
  const activeFilterCount = [
    filters.action,
    filters.entity,
    filters.actorId,
    filters.entityId,
    filters.fromDate,
    filters.toDate,
    filters.sort !== "created_at",
    filters.order !== "DESC",
  ].filter(Boolean).length;

  const { data, isLoading, isError, isFetching } = useAuditLogs({
    page,
    limit: 20,
    keyword: debouncedSearch || undefined,
    action: filters.action || undefined,
    entity: filters.entity || undefined,
    actor_id: filters.actorId ? Number(filters.actorId) : undefined,
    entity_id: filters.entityId || undefined,
    from_date: filters.fromDate || undefined,
    to_date: filters.toDate || undefined,
    sort: filters.sort as "created_at" | "action" | "entity" | "actor_name",
    order: filters.order,
  });

  // computed values
  const logs = data?.data ?? [];
  const totalPages = data?.pages ?? 1;
  const total = data?.total ?? 0;

  // handlers
  const handleSearchChange = useCallback((val: string) => {
    setSearch(val);
    setPage(1);
  }, []);

  const handleApplyFilters = useCallback((next: AuditLogFiltersState) => {
    setFilters(next);
    setPage(1);
  }, []);

  const handleResetFilters = useCallback(() => {
    setFilters(DEFAULT_FILTERS);
    setPage(1);
    setFiltersOpen(false);
  }, []);

  const toggleExpanded = useCallback((key: string) => {
    setExpandedKeys((prev) => {
      const next = new Set(prev);
      if (next.has(key)) next.delete(key);
      else next.add(key);
      return next;
    });
  }, []);

  // loading state
  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <PulseLoader />
      </div>
    );
  }

  // error state
  if (isError) {
    return (
      <div className="rounded-xl border border-red-200 bg-red-50 dark:bg-red-950/20 p-8 text-center">
        <p className="text-sm font-medium text-red-700 dark:text-red-400">
          Failed to load audit logs
        </p>
        <p className="text-xs text-red-500 mt-1">
          Ensure you have admin access and the backend is running.
        </p>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
          Audit Logs
        </h1>

        {/* Description */}
        <p className="text-sm text-gray-500 mt-1">
          Complete activity trail across the system
          {total > 0 && (
            <span className="ml-1 tabular-nums">· {total} entries</span>
          )}
        </p>
      </div>

      {/* search */}
      <div className="flex items-center gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 z-10" />
          <Input
            placeholder="Search actor, description, or entity ID..."
            className="pl-9 h-10 text-sm  dark:bg-gray-950"
            value={search}
            onChange={(e) => handleSearchChange(e.target.value)}
          />
        </div>

        {/* filter */}
        <Button
          variant="outline"
          className={cn(
            "h-10 gap-2 text-sm font-normal text-gray-600 border-gray-200",
            activeFilterCount > 0 && "bg-blue-600 text-white border-blue-600",
          )}
          onClick={() => setFiltersOpen(true)}
        >
          <SlidersHorizontal className="w-4 h-4" />
          Filters
          {activeFilterCount > 0 && (
            <span className="flex h-4 w-4 items-center justify-center rounded-full bg-white text-[10px] text-[#8B1A2B] font-bold">
              {activeFilterCount}
            </span>
          )}
        </Button>
      </div>

      {/* table */}
      <div
        className={cn(
          "rounded-xl border bg-white dark:bg-gray-950 overflow-hidden transition-opacity",
          isFetching && "opacity-70",
        )}
      >
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="bg-gray-50/70 hover:bg-gray-50/70 border-b border-gray-200 dark:bg-gray-900/50">
                {AUDIT_TABLE_HEADERS.map((h) => (
                  <TableHead
                    key={h || "expand"}
                    className="text-xs font-semibold text-gray-500 first-of-type:pl-4"
                  >
                    {h}
                  </TableHead>
                ))}
              </TableRow>
            </TableHeader>

            <TableBody>
              {logs.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={AUDIT_TABLE_HEADERS.length}
                    className="py-10"
                  >
                    {/* Empty */}
                    <EmptyState
                      icon={ScrollText}
                      title="No audit logs found"
                      description="Try adjusting your search or filters."
                    />
                  </TableCell>
                </TableRow>
              ) : (
                // Logs
                logs.map((log, index) => {
                  const key = getAuditLogRowKey(log, index);
                  return (
                    <AuditLogRowComponent
                      key={key}
                      log={log}
                      isExpanded={expandedKeys.has(key)}
                      onToggle={() => toggleExpanded(key)}
                    />
                  );
                })
              )}
            </TableBody>
          </Table>
        </div>
      </div>

      {/* pagination */}
      {totalPages > 1 && (
        <PaginationWrapper
          totalPages={totalPages}
          currentPage={page}
          onPageChange={setPage}
        />
      )}

      {/* filters */}
      {filtersOpen && (
        <AuditLogFiltersModal
          open={filtersOpen}
          onOpenChange={setFiltersOpen}
          filters={filters}
          onApply={handleApplyFilters}
          onReset={handleResetFilters}
        />
      )}
    </div>
  );
}
