"use client";

import { useState, useCallback, useMemo, memo } from "react";
import { useDebounce } from "use-debounce";
import dynamic from "next/dynamic";
import {
  Search,
  SlidersHorizontal,
  Plus,
  Eye,
  Edit,
  Trash2,
  UserX,
  ChevronLeft,
  ChevronRight,
  Users,
  ArrowLeft,
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
import { UserStatusBadge } from "./status-badge";
import { useUsers } from "../../hooks/use-users";
import { useDeleteUser } from "../../hooks/use-delete-user";
import { useUpdateUser } from "../../hooks/use-update-user";
import { useMoveUser } from "../../hooks/use-move-user";
import type { User } from "@/lib/types/admin";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { motion } from "motion/react";
import type { EditUserPayload } from "./active-modals/edit-user-modal";
import { EmptyState } from "@/components/ui/empty-state";
import { PulseLoader } from "@/components/ui/pulse-loader";
import { TABLE_HEADERS } from "@/lib/constants/users-table.constants";

// ── Lazy-load modals ──────────────────────────────────────────────────────────
const UserFiltersModal = dynamic(() =>
  import("./active-modals").then((m) => ({ default: m.UserFiltersModal })),
);
const ViewUserModal = dynamic(() =>
  import("./active-modals").then((m) => ({ default: m.ViewUserModal })),
);
const EditUserModal = dynamic(() =>
  import("./active-modals").then((m) => ({ default: m.EditUserModal })),
);
const DeactivateUserModal = dynamic(() =>
  import("./active-modals").then((m) => ({ default: m.DeactivateUserModal })),
);
const DeleteUserModal = dynamic(() =>
  import("./active-modals").then((m) => ({ default: m.DeleteUserModal })),
);

// ── Memoized row ──────────────────────────────────────────────────────────────
const UserRow = memo(function UserRow({
  user,
  isSelected,
  onView,
  onEdit,
  onDeactivate,
  onDelete,
  isDeactivating,
  currentUserId,
}: {
  user: User;
  isSelected: boolean;
  onToggle: (id: number) => void;
  onView: (user: User) => void;
  onEdit: (user: User) => void;
  onDeactivate: (user: User) => void;
  onDelete: (user: User) => void;
  isDeactivating: boolean;
  currentUserId?: number;
}) {
  return (
    <TableRow
      className={cn(
        "border-b border-gray-100 transition-colors hover:bg-gray-50/60 group",
        isSelected && "bg-[#8B1A2B]/5",
        user.is_active === 0 && "bg-red-50/40",
      )}
    >
      <TableCell className="pl-4">
        <span className="text-sm font-medium text-gray-700">
          U-{String(user.user_id).padStart(4, "0")}
        </span>
      </TableCell>
      <TableCell className="">
        <span className="font-medium text-gray-800 truncate text-center">
          {user.first_name} {user.last_name}
        </span>
      </TableCell>
      <TableCell className="text-sm text-gray-600">{user.role_name}</TableCell>
      <TableCell className="text-sm text-[#8B1A2B]/70 tabular-nums">
        {new Date(user.created_at).toLocaleDateString("en-GB", {
          year: "numeric",
          month: "short",
          day: "numeric",
        })}
      </TableCell>
      <TableCell>
        <UserStatusBadge
          status={user.is_active === 1 ? "Active" : "Inactive"}
        />
      </TableCell>
      <TableCell className="pr-4">
        <div className="flex items-center gap-1">
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 text-gray-500 hover:text-[#8B1A2B]"
            onClick={() => onView(user)}
            title="View"
          >
            <Eye className="w-4 h-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 text-gray-500 hover:text-[#8B1A2B]"
            onClick={() => onEdit(user)}
            title="Edit"
          >
            <Edit className="w-4 h-4" />
          </Button>
          {user.role_name === "Doctor" ? (
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 text-gray-500 hover:text-orange-500"
              onClick={() => onDeactivate(user)}
              disabled={isDeactivating}
              title="Deactivate"
            >
              <UserX className="w-4 h-4" />
            </Button>
          ) : null}
          {user.role_name !== "Doctor" &&
          user.user_id !== currentUserId ? (
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 text-gray-500 hover:text-red-500"
              onClick={() => onDelete(user)}
              title="Delete"
            >
              <Trash2 className="w-4 h-4" />
            </Button>
          ) : null}
        </div>
      </TableCell>
    </TableRow>
  );
});

// ── UsersTable ────────────────────────────────────────────────────────────────
export function UsersTable() {
  const { data: session } = useSession();
  const currentUserId = Number(session?.user?.id ?? 0);
  const [search, setSearch] = useState("");
  const [debouncedSearch] = useDebounce(search, 400);
  const [filterRole, setFilterRole] = useState("all");
  const filterStatus = "all";
  const [filterDate, setFilterDate] = useState("");
  const [sortDate, setSortDate] = useState<"newest" | "oldest">("newest");
  const [page, setPage] = useState(1);

  const [selected, setSelected] = useState<number[]>([]);
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [viewUser, setViewUser] = useState<User | null>(null);
  const [editUser, setEditUser] = useState<User | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<User | null>(null);
  const [deactivateTarget, setDeactivateTarget] = useState<User | null>(null);

  const activeFilters = [
    filterRole !== "all",
    filterStatus !== "all",
    sortDate !== "newest",
    !!filterDate,
  ].filter(Boolean).length;

  const { data: usersData, isLoading } = useUsers({
    keyword: debouncedSearch || undefined,
    role: filterRole === "all" ? undefined : filterRole,
    // status:
    //   filterStatus === "all"
    //     ? undefined
    //     : (filterStatus as "active" | "deactivated"),
    sort: sortDate,
    created_date: filterDate || undefined,
    page,
  });

  const users = useMemo(() => usersData?.data ?? [], [usersData?.data]);
  const visibleUsers =
    currentUserId > 0
      ? users.filter((u) => u.user_id !== currentUserId)
      : users;
  const totalPages = usersData?.pages ?? 1;

  const { mutate: deleteUser, isPending: isDeleting } = useDeleteUser();
  const { mutate: updateUser, isPending: isUpdating } = useUpdateUser();
  const { mutate: deactivateUser, isPending: isDeactivating } = useMoveUser();

  const handleSearchChange = useCallback((val: string) => {
    setSearch(val);
    setPage(1);
  }, []);

  const handleSetFilterRole = useCallback((val: string) => {
    setFilterRole(val);
    setPage(1);
  }, []);

  const handleSetFilterDate = useCallback((val: string) => {
    setFilterDate(val);
    setPage(1);
  }, []);

  const handleSetSortDate = useCallback((val: "newest" | "oldest") => {
    setSortDate(val);
    setPage(1);
  }, []);

  const toggleOne = useCallback((id: number) => {
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id],
    );
  }, []);

  const handleConfirmDelete = useCallback(() => {
    if (deleteTarget) deleteUser(deleteTarget.user_id);
    setDeleteTarget(null);
  }, [deleteTarget, deleteUser]);

  const handleSaveEdit = useCallback(
    (id: number, payload: EditUserPayload) => {
      updateUser({ id, payload });
      setEditUser(null);
    },
    [updateUser],
  );

  const handleConfirmDeactivate = useCallback(
    (newDoctorId?: number) => {
      if (!deactivateTarget) return;
      deactivateUser({ id: deactivateTarget.user_id, newDoctorId });
      setDeactivateTarget(null);
    },
    [deactivateTarget, deactivateUser],
  );

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
      {/* Header */}
      <div className="space-y-6 p-5">
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="flex items-center gap-3"
        >
          <Link
            href="/admin/users"
            className="flex items-center justify-center w-8 h-8 rounded-lg border border-gray-200 bg-white text-gray-500 hover:text-[#8B1A2B] hover:border-[#8B1A2B]/30 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              Users Management
            </h1>
            <p className="text-sm text-gray-500 mt-0.5">
              View and manage users
            </p>
          </div>
        </motion.div>
        <div className="flex items-center gap-2 mb-4 animate-in fade-in duration-300">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 z-10" />
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

          <Link href="/admin/users/add">
            <Button className="h-10 bg-blue-800 hover:bg-blue-900 text-white flex items-center gap-2">
              <Plus className="w-4 h-4" />
              Create User
            </Button>
          </Link>
        </div>

        {/* ── Table ── */}
        <div className="rounded-xl border border-gray-200 bg-white overflow-hidden animate-in fade-in duration-300">
          <Table>
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
              {visibleUsers.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={TABLE_HEADERS.length + 1}
                    className="text-center text-sm text-gray-400 py-10"
                  >
                    <EmptyState
                      icon={Users}
                      title="No users found"
                      description="Create a new user to get started."
                    />
                  </TableCell>
                </TableRow>
              ) : (
                visibleUsers.map((user) => (
                  <UserRow
                    key={user.user_id}
                    user={user}
                    isSelected={selected.includes(user.user_id)}
                    onToggle={toggleOne}
                    onView={setViewUser}
                    onEdit={setEditUser}
                    onDeactivate={setDeactivateTarget}
                    onDelete={setDeleteTarget}
                    isDeactivating={isDeactivating}
                    currentUserId={currentUserId}
                  />
                ))
              )}
            </TableBody>
          </Table>
        </div>

        {/* ── Pagination ── */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between mt-4 px-1 animate-in fade-in duration-300">
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
          </div>
        )}

        {/* ── Modals ── */}
        {filtersOpen && (
          <UserFiltersModal
            open={filtersOpen}
            onOpenChange={setFiltersOpen}
            filterRole={filterRole}
            setFilterRole={handleSetFilterRole}
            // filterStatus={filterStatus}
            // setFilterStatus={handleSetFilterStatus}
            filterDate={filterDate}
            setFilterDate={handleSetFilterDate}
            sortDate={sortDate}
            setSortDate={handleSetSortDate}
          />
        )}
        {viewUser && (
          <ViewUserModal user={viewUser} onClose={() => setViewUser(null)} />
        )}
        {editUser && (
          <EditUserModal
            user={editUser}
            onClose={() => setEditUser(null)}
            onSave={handleSaveEdit}
            isPending={isUpdating}
          />
        )}
        {deactivateTarget && (
          <DeactivateUserModal
            user={deactivateTarget}
            onClose={() => setDeactivateTarget(null)}
            onConfirm={handleConfirmDeactivate}
            isPending={isDeactivating}
          />
        )}
        {deleteTarget && (
          <DeleteUserModal
            user={deleteTarget}
            onClose={() => setDeleteTarget(null)}
            onConfirm={handleConfirmDelete}
            isPending={isDeleting}
          />
        )}
      </div>
    </>
  );
}
