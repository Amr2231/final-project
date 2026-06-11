"use client";

import { useState } from "react";
import { Shield, Info, ListOrdered } from "lucide-react";
import { ReceptionPageShell } from "../shared/reception-page-shell";
import {
  ReceptionLoadingState,
  PriorityBadge,
  StatusBadge,
} from "../shared/ui";
import {
  usePriorityOverview,
  useUpdateAppointmentPriority,
} from "../../hooks/use-reception";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { PRIORITY_LEVELS } from "../../constants";
import { EmptyState } from "@/components/ui/empty-state";

export function PriorityQueuePage() {
  const { data: queue = [], isLoading } = usePriorityOverview();
  const { mutate: updatePriority } = useUpdateAppointmentPriority();
  const [editingId, setEditingId] = useState<number | null>(null);

  if (isLoading && queue.length === 0) return <ReceptionLoadingState />;

  return (
    <ReceptionPageShell
      title="Priority Queue System"
      description="Automatic prioritization with transparent queue reasoning"
    >
      <div className="rounded-xl border border-blue-200 bg-blue-50/50 dark:bg-blue-950/20 p-4 mb-4 flex gap-3">
        <Info className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
        <div className="text-sm">
          <p className="font-medium text-blue-900 dark:text-blue-200">
            Priority Rules
          </p>
          <p className="text-blue-800/80 dark:text-blue-300/80 mt-1">
            Emergency patients are always first. VIP, Pregnant, and Senior
            Citizen levels receive elevated scores. Wait time adds +2 points per
            minute to prevent starvation.
          </p>
        </div>
      </div>

      <div className="space-y-3">
        {queue.length === 0 ? (
          <EmptyState
            icon={ListOrdered}
            title="Priority Queue is Empty"
            description="There are currently no patients in the priority queue."
          />
        ) : (
          queue.map((item , i) => (
            <div
              key={`${item.queue_id}-${i}`}
              className="rounded-xl border p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
            >
              <div className="flex items-center gap-4">
                <span className="flex h-10 w-10 items-center justify-center rounded-full bg-[#8B1A2B]/10 text-[#8B1A2B] font-bold">
                  {item.queue_position}
                </span>
                <div>
                  <p className="font-semibold">{item.patient_name}</p>
                  <p className="text-sm text-muted-foreground flex items-center gap-2 mt-1">
                    <Shield className="w-3 h-3" />
                    Score:{" "}
                    <span className="font-mono font-bold">
                      {item.priority_score}
                    </span>
                  </p>
                  {item.priority_reason && (
                    <p className="text-xs text-muted-foreground mt-1">
                      {item.priority_reason}
                    </p>
                  )}
                </div>
              </div>
              <div className="flex items-center gap-3 flex-wrap">
                <StatusBadge label={item.board_status} />
                {editingId === item.appointment_id ? (
                  <Select
                    defaultValue={item.priority_level}
                    onValueChange={(v) => {
                      updatePriority({
                        id: item.appointment_id,
                        priority_level: v,
                      });
                      setEditingId(null);
                    }}
                  >
                    <SelectTrigger className="w-[160px]">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {PRIORITY_LEVELS.map((p) => (
                        <SelectItem key={p} value={p}>
                          {p}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                ) : (
                  <button
                    type="button"
                    onClick={() => setEditingId(item.appointment_id)}
                  >
                    <PriorityBadge label={item.priority_level} />
                  </button>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </ReceptionPageShell>
  );
}
