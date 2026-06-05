"use client";

import Link from "next/link";
import { Sparkle, Star, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { EmptyState } from "@/components/ui/empty-state";
import { cn } from "@/lib/utils/tailwind-merge";
import {
  DoctorLoadingState,
  DoctorPageShell,
  DoctorTableShell,
} from "../shared/ui";
import {
  useRemoveFromWatchlist,
  useWatchlist,
} from "../../hooks/use-watchlist";

const PRIORITY_STYLES: Record<string, string> = {
  critical:
    "bg-red-50 text-red-700 border-red-200 dark:bg-red-950/40 dark:text-red-300 dark:border-red-900",
  monitor:
    "bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/40 dark:text-amber-300 dark:border-amber-900",
  stable:
    "bg-green-50 text-green-700 border-green-200 dark:bg-green-950/40 dark:text-green-300 dark:border-green-900",
};

export function WatchlistPage() {
  const { data, isLoading } = useWatchlist();
  const { mutate: remove } = useRemoveFromWatchlist();
  const items = data?.data ?? [];

  if (isLoading) return <DoctorLoadingState />;

  return (
    <DoctorPageShell
      title="Watchlist"
      description="Starred patients requiring close monitoring"
    >
      <DoctorTableShell>
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/50 hover:bg-muted/50 border-b border-border">
              {["Patient", "Study", "AI EF", "Priority", "Latest Note", "Actions"].map(
                (h) => (
                  <TableHead
                    key={h}
                    className="text-xs font-semibold text-muted-foreground first:pl-4"
                  >
                    {h}
                  </TableHead>
                ),
              )}
            </TableRow>
          </TableHeader>
          <TableBody>
            {items.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="py-10">
                  <EmptyState
                    icon={Star}
                    title="Watchlist is empty"
                    description="Star patients from active patients table."
                  />
                </TableCell>
              </TableRow>
            ) : (
              items.map((item) => (
                <TableRow
                  key={item.id}
                  className="border-b border-border hover:bg-muted/40"
                >
                  <TableCell className="pl-4">
                    <Link
                      href={`/doctor/patients/profile/${item.national_id}`}
                      className="text-sm font-medium text-foreground hover:underline"
                    >
                      {item.first_name} {item.last_name}
                    </Link>
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">
                    {item.study_type ?? "—"}
                  </TableCell>
                  <TableCell className="text-sm tabular-nums">
                    {item.ejection_fraction != null
                      ? `${item.ejection_fraction}%`
                      : "—"}
                  </TableCell>
                  <TableCell>
                    <span
                      className={cn(
                        "inline-flex rounded-full border px-2 py-0.5 text-xs font-medium capitalize",
                        PRIORITY_STYLES[item.priority] ??
                          PRIORITY_STYLES.monitor,
                      )}
                    >
                      {item.priority}
                    </span>
                  </TableCell>
                  <TableCell
                    className="text-sm text-muted-foreground max-w-xs truncate"
                    title={item.latest_study_note || item.note || undefined}
                  >
                    {item.latest_study_note || item.note || "—"}
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-1">
                      {item.study_id && (
                        <Link
                          href={`/doctor/patients/${item.study_id}/ai-analysis`}
                        >
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-8 w-8 text-blue-500 hover:text-blue-700"
                          >
                            <Sparkle className="w-4 h-4 " />
                          </Button>
                        </Link>
                      )}
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-blue-500 hover:text-blue-700"
                        onClick={() => remove(item.national_id)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </DoctorTableShell>
    </DoctorPageShell>
  );
}
