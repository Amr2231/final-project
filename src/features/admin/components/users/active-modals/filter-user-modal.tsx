"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ROLES } from "@/lib/constants/roles.constants";
import {
  activeFiltersSchema,
  type ActiveFiltersSchema,
} from "@/lib/schemas/admin.schema";

type FiltersModalProps = {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  filterRole: string;
  setFilterRole: (v: string) => void;
  sortDate: "newest" | "oldest";
  setSortDate: (v: "newest" | "oldest") => void;
  filterDate: string;
  setFilterDate: (v: string) => void;
};

export function UserFiltersModal({
  open,
  onOpenChange,
  filterRole,
  setFilterRole,
  sortDate,
  setSortDate,
  filterDate,
  setFilterDate,
}: FiltersModalProps) {
  const { register, reset, watch } = useForm<ActiveFiltersSchema>({
    resolver: zodResolver(activeFiltersSchema),
    defaultValues: {
      sortDate: "newest",
      filterRole: "all",
      filterDate: "",
    },
  });

  // sync لما يفتح الـ modal
  useEffect(() => {
    if (open) {
      reset({ sortDate, filterRole, filterDate: filterDate ?? "" });
    }
  }, [open, sortDate, filterRole, filterDate, reset]);

  useEffect(() => {
    const { unsubscribe } = watch((values) => {
      setFilterRole(values.filterRole ?? "all");
      setSortDate((values.sortDate as "newest" | "oldest") ?? "newest");
      setFilterDate(values.filterDate ?? "");
    });
    return unsubscribe;
  }, [watch, setFilterRole, setSortDate, setFilterDate]);

  const hasActive =
    filterRole !== "all" || sortDate !== "newest" || !!filterDate;

  const handleReset = () => {
    reset({ sortDate: "newest", filterRole: "all", filterDate: "" });
    setFilterRole("all");
    setSortDate("newest");
    setFilterDate("");
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-sm">
        <DialogHeader>
          <DialogTitle className="text-base font-bold text-gray-900 dark:text-gray-200">
            Filters
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4 py-2">
          <div className="space-y-1.5">
            <p className="text-xs text-gray-400 dark:text-gray-100">
              Sort by date
            </p>
            <select
              {...register("sortDate")}
              className="w-full h-9 rounded-md border border-gray-200 px-3 text-sm text-gray-700 dark:text-gray-400/80 focus:outline-none focus:ring-2 focus:ring-blue-800/20 focus:border-blue-600"
            >
              <option value="newest">Newest</option>
              <option value="oldest">Oldest</option>
            </select>
          </div>

          <div className="space-y-1.5">
            <p className="text-xs text-gray-400">Role</p>
            <select
              {...register("filterRole")}
              className="w-full h-9 rounded-md border border-gray-200 px-3 text-sm text-gray-700 dark:text-gray-400/80 focus:outline-none focus:ring-2 focus:ring-blue-800/20 focus:border-blue-600"
            >
              <option value="all">All Roles</option>
              {ROLES.map((r) => (
                <option key={r} value={r}>
                  {r}
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-1.5">
            <p className="text-xs text-gray-400">Created Date</p>
            <Input type="date" {...register("filterDate")} />
          </div>
        </div>

        <DialogFooter className="gap-2">
          {hasActive && (
            <Button
              type="button"
              variant="ghost"
              className="text-sm text-gray-400 hover:text-gray-700 mr-auto"
              onClick={handleReset}
            >
              Reset
            </Button>
          )}
          <Button
            onClick={() => onOpenChange(false)}
            className="bg-blue-800 hover:bg-blue-900 text-white"
          >
            Apply
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
