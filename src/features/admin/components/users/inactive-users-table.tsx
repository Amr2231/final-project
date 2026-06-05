"use client";

import { useState } from "react";
import { useDebounce } from "use-debounce";
import { motion } from "motion/react";
import {
  Search,
  SlidersHorizontal,
  RotateCcw,
  Trash2,
  UserX,
  ChevronLeft,
  ChevronRight,
  Users,
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
import { InactiveStatusBadge } from "./status-badge";
import {
  InactiveFiltersModal,
  TransferModal,
  ReactivateModal,
  DeleteInactiveModal,
} from "./inactive-modals";
import { useInactiveUsers } from "../../hooks/use-inactive-users";
import { useMoveUser } from "../../hooks/use-move-user";
import { useReactivateUser } from "../../hooks/use-reactivate-user";
import { useDeleteUser } from "../../hooks/use-delete-user";
import type { InactiveUser } from "@/lib/types/admin";
import { PulseLoader } from "@/components/ui/pulse-loader";
import { EmptyState } from "@/components/ui/empty-state";
import { TABLE_HEADERS } from "@/lib/constants/users-table.constants";

export function InactiveUsersTable() {
  const [search, setSearch] = useState("");
  const [debouncedSearch] = useDebounce(search, 400);
  const [page, setPage] = useState(1);

  const [filtersOpen, setFiltersOpen] = useState(false);
  const [filterRole, setFilterRole] = useState("all");
  const [sortDate, setSortDate] = useState<"newest" | "oldest">("newest");
  const [filterDate, setFilterDate] = useState<string | undefined>(undefined);

  const [transferTarget, setTransferTarget] = useState<InactiveUser | null>(
    null,
  );
  const [reactivateTarget, setReactivateTarget] = useState<InactiveUser | null>(
    null,
  );
  const [deleteTarget, setDeleteTarget] = useState<InactiveUser | null>(null);

  const activeFilters = [
    filterRole !== "all",
    !!filterDate,
    sortDate !== "newest",
  ].filter(Boolean).length;

  const { data: inactiveData, isLoading } = useInactiveUsers({
    keyword: debouncedSearch || undefined,
    page,
    role: filterRole === "all" ? undefined : filterRole,
    sort: sortDate,
    created_date: filterDate,
  });

  const users = inactiveData?.data ?? [];
  const totalPages = inactiveData?.pages ?? 1;

  const { mutate: transferAndDeactivate, isPending: isTransferring } =
    useMoveUser();
  const { mutate: reactivateUser, isPending: isReactivating } =
    useReactivateUser();
  const { mutate: deleteUser, isPending: isDeleting } = useDeleteUser();

  const handleSearchChange = (val: string) => {
    setSearch(val);
    setPage(1);
  };
  const handleSetFilterRole = (val: string) => {
    setFilterRole(val);
    setPage(1);
  };

  const handleSetSortDate = (val: "newest" | "oldest") => {
    setSortDate(val);
    setPage(1);
  };

  const handleTransfer = (id: number, newDoctorId: number) => {
    transferAndDeactivate({ id, newDoctorId });
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20 text-sm text-gray-400">
        <PulseLoader />
      </div>
    );
  }

  return (
    <>
      {/* ── Toolbar ── */}
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="flex items-center gap-2 mb-4"
      >
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 z-1" />
          <Input
            placeholder="Search by name or username..."
            className="pl-9 h-10 text-sm bg-white"
            value={search}
            onChange={(e) => handleSearchChange(e.target.value)}
          />
        </div>

        <Button
          variant="outline"
          className={cn(
            "h-10 gap-2 text-sm font-normal text-gray-600 border-gray-200",
            activeFilters > 0 && "bg-[#8B1A2B] text-white border-[#8B1A2B]",
          )}
          onClick={() => setFiltersOpen(true)}
        >
          <SlidersHorizontal className="w-4 h-4" />
          Filters
          {activeFilters > 0 && (
            <span className="flex h-4 w-4 items-center justify-center rounded-full bg-white text-[10px] text-[#8B1A2B] font-bold">
              {activeFilters}
            </span>
          )}
        </Button>
      </motion.div>

      {/* ── Table ── */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.25 }}
        className="rounded-xl border border-gray-200 bg-white overflow-hidden"
      >
        <Table className="table-fixed">
          <TableHeader>
            <TableRow className="bg-gray-50/70 hover:bg-gray-50/70 border-b border-gray-200">
              {TABLE_HEADERS.map((h) => (
                <TableHead
                  key={h}
                  className="text-xs font-semibold text-gray-500 first-of-type:pl-3.5"
                >
                  {h}
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>

          <TableBody>
            {users.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={TABLE_HEADERS.length + 1}
                  className="text-center text-sm text-gray-400 py-10"
                >
                  <EmptyState
                    icon={Users}
                    title="No inactive users found"
                    description="Try adjusting your search or filters"
                  />
                </TableCell>
              </TableRow>
            ) : (
              users.map((user, i) => (
                <motion.tr
                  key={user.id}
                  initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: 0.3 + i * 0.04 }}
                  className={cn(
                    "border-b border-gray-100 transition-colors hover:bg-gray-50/60 group",
                  )}
                >
                  <TableCell className="pl-4">
                    <span className="text-sm font-medium text-gray-700">
                      U-{String(user.id).padStart(4, "0")}
                    </span>
                  </TableCell>
                  <TableCell className="">
                    <span className="font-medium text-gray-800 truncate text-center">
                      {user.fName} {user.lName}
                    </span>
                  </TableCell>
                  <TableCell className="text-sm text-gray-600">
                    {user.role}
                  </TableCell>
                  <TableCell className="text-sm text-[#8B1A2B]/70 tabular-nums">
                    {new Date(user.created_date).toLocaleDateString("en-GB", {
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                    })}
                  </TableCell>
                  <TableCell>
                    <InactiveStatusBadge status={user.status} />
                  </TableCell>
                  <TableCell className="pr-4">
                    <div className="flex items-center gap-1">
                      {user.role === "Doctor" && (
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-gray-500 hover:text-orange-500"
                          onClick={() => setTransferTarget(user)}
                          disabled={isTransferring}
                          title="Transfer patients"
                        >
                          <UserX className="w-4 h-4" />
                        </Button>
                      )}
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-gray-500 hover:text-green-600"
                        onClick={() => setReactivateTarget(user)}
                        disabled={isReactivating}
                        title="Reactivate"
                      >
                        <RotateCcw className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-gray-500 hover:text-red-500"
                        onClick={() => setDeleteTarget(user)}
                        disabled={isDeleting}
                        title="Delete"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </TableCell>
                </motion.tr>
              ))
            )}
          </TableBody>
        </Table>
      </motion.div>

      {/* ── Pagination ── */}
      {totalPages > 1 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3, delay: 0.4 }}
          className="flex items-center justify-between mt-4 px-1"
        >
          <p className="text-xs text-gray-400">
            Page {page} of {totalPages}
          </p>
          <div className="flex items-center gap-1">
            <Button
              variant="outline"
              size="icon"
              className="h-8 w-8 border-gray-200"
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
            >
              <ChevronLeft className="w-4 h-4" />
            </Button>

            {Array.from({ length: totalPages }, (_, i) => i + 1)
              .filter(
                (p) => p === 1 || p === totalPages || Math.abs(p - page) <= 1,
              )
              .reduce<(number | "...")[]>((acc, p, idx, arr) => {
                if (idx > 0 && p - (arr[idx - 1] as number) > 1)
                  acc.push("...");
                acc.push(p);
                return acc;
              }, [])
              .map((item, idx) =>
                item === "..." ? (
                  <span
                    key={`ellipsis-${idx}`}
                    className="w-8 text-center text-xs text-gray-400"
                  >
                    ...
                  </span>
                ) : (
                  <Button
                    key={item}
                    variant="outline"
                    size="icon"
                    className={cn(
                      "h-8 w-8 text-xs border-gray-200",
                      page === item &&
                        "bg-[#8B1A2B] text-white border-[#8B1A2B] hover:bg-[#7a1726] hover:text-white",
                    )}
                    onClick={() => setPage(item as number)}
                  >
                    {item}
                  </Button>
                ),
              )}

            <Button
              variant="outline"
              size="icon"
              className="h-8 w-8 border-gray-200"
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
            >
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
        </motion.div>
      )}

      {/* ── Modals ── */}
      <InactiveFiltersModal
        open={filtersOpen}
        onOpenChange={setFiltersOpen}
        filterRole={filterRole}
        setFilterRole={handleSetFilterRole}
        created_date={filterDate}
        setCreatedDate={setFilterDate}
        sortDate={sortDate}
        setSortDate={handleSetSortDate}
      />
      <TransferModal
        user={transferTarget}
        onClose={() => setTransferTarget(null)}
        onConfirm={handleTransfer}
        isPending={isTransferring}
      />
      <ReactivateModal
        user={reactivateTarget}
        onClose={() => setReactivateTarget(null)}
        onConfirm={(id) => reactivateUser(id)}
        isPending={isReactivating}
      />
      <DeleteInactiveModal
        user={deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={(id) => deleteUser(id)}
        isPending={isDeleting}
      />
    </>
  );
}
