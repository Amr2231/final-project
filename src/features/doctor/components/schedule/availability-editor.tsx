"use client";

import { useState } from "react";
import { CalendarOff, Save, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import {
  useAddDoctorHoliday,
  useDoctorAvailability,
  useRemoveDoctorHoliday,
  useSaveDoctorAvailability,
} from "../../hooks/use-doctor-schedule";
import type { DoctorScheduleDay } from "../../api/schedule.api";
import { DoctorLoadingState } from "../shared/ui";

// helpers
function toTimeInput(value?: string | null) {
  if (!value) return "";
  return String(value).slice(0, 5);
}

// helpers
function fromTimeInput(value: string) {
  if (!value) return value;
  return value.length === 5 ? `${value}:00` : value;
}

// component
export function AvailabilityEditor() {
  // hooks
  const { data, isLoading } = useDoctorAvailability();
  const { mutate: save, isPending: isSaving } = useSaveDoctorAvailability();
  const { mutate: addHoliday, isPending: isAddingHoliday } =
    useAddDoctorHoliday();
  const { mutate: removeHoliday } = useRemoveDoctorHoliday();

  const serverDays = data?.days ?? [];
  const serverKey = JSON.stringify(serverDays);
  const [days, setDays] = useState<DoctorScheduleDay[]>(serverDays);
  const [loadedKey, setLoadedKey] = useState(serverKey);
  const [holidayDate, setHolidayDate] = useState("");
  const [holidayReason, setHolidayReason] = useState("");

  if (serverKey !== loadedKey) {
    setDays(serverDays);
    setLoadedKey(serverKey);
  }

  const updateDay = (dayOfWeek: number, patch: Partial<DoctorScheduleDay>) => {
    setDays((prev) =>
      prev.map((d) => (d.day_of_week === dayOfWeek ? { ...d, ...patch } : d)),
    );
  };

  // loading state for availability tab
  if (isLoading) return <DoctorLoadingState />;

  return (
    <div className="space-y-6">
      <div className="rounded-xl border border-gray-200 bg-white dark:bg-gray-950 overflow-hidden">
        <div className="px-4 py-3 border-b border-gray-100 flex items-center justify-between">
          <div>
            <p className="text-sm font-semibold">Weekly availability</p>
            <p className="text-xs text-gray-500">
              Patients can only book during active days and working hours.
            </p>
          </div>
          <Button
            size="sm"
            className="bg-blue-800 hover:bg-blue-900"
            disabled={isSaving}
            onClick={() => save(days)}
          >
            <Save className="w-4 h-4 mr-1" />
            {isSaving ? "Saving..." : "Save schedule"}
          </Button>
        </div>

        <div className="divide-y divide-gray-100">
          {days.map((day) => (
            <div
              key={day.day_of_week}
              className="p-4 grid grid-cols-1 lg:grid-cols-[140px_1fr_auto] gap-4 items-start"
            >
              <div className="flex items-center gap-3">
                <Checkbox
                  checked={Boolean(day.is_active)}
                  onCheckedChange={(checked) =>
                    updateDay(day.day_of_week, { is_active: checked === true })
                  }
                />
                <span className="text-sm font-medium">{day.day_name}</span>
              </div>

              <div
                className={`grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 ${
                  day.is_active ? "" : "opacity-50 pointer-events-none"
                }`}
              >
                <div className="space-y-1">
                  <Label className="text-xs">Start</Label>
                  <Input
                    type="time"
                    value={toTimeInput(day.start_time)}
                    onChange={(e) =>
                      updateDay(day.day_of_week, {
                        start_time: fromTimeInput(e.target.value),
                      })
                    }
                  />
                </div>
                <div className="space-y-1">
                  <Label className="text-xs">End</Label>
                  <Input
                    type="time"
                    value={toTimeInput(day.end_time)}
                    onChange={(e) =>
                      updateDay(day.day_of_week, {
                        end_time: fromTimeInput(e.target.value),
                      })
                    }
                  />
                </div>
                <div className="space-y-1">
                  <Label className="text-xs">Break start</Label>
                  <Input
                    type="time"
                    value={toTimeInput(day.break_start)}
                    onChange={(e) =>
                      updateDay(day.day_of_week, {
                        break_start: fromTimeInput(e.target.value) || null,
                      })
                    }
                  />
                </div>
                <div className="space-y-1">
                  <Label className="text-xs">Break end</Label>
                  <Input
                    type="time"
                    value={toTimeInput(day.break_end)}
                    onChange={(e) =>
                      updateDay(day.day_of_week, {
                        break_end: fromTimeInput(e.target.value) || null,
                      })
                    }
                  />
                </div>
                <div className="space-y-1">
                  <Label className="text-xs">Slot (min)</Label>
                  <Input
                    type="number"
                    min={15}
                    max={120}
                    step={15}
                    value={day.slot_duration_minutes}
                    onChange={(e) =>
                      updateDay(day.day_of_week, {
                        slot_duration_minutes: Number(e.target.value) || 30,
                      })
                    }
                  />
                </div>
                <div className="space-y-1">
                  <Label className="text-xs">Capacity</Label>
                  <Input
                    type="number"
                    min={1}
                    max={50}
                    value={day.max_appointments}
                    onChange={(e) =>
                      updateDay(day.day_of_week, {
                        max_appointments: Number(e.target.value) || 16,
                      })
                    }
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="rounded-xl border border-gray-200 bg-white dark:bg-gray-950 p-4 space-y-4">
        <div>
          <p className="text-sm font-semibold flex items-center gap-2">
            <CalendarOff className="w-4 h-4" />
            Holidays / leave
          </p>
          <p className="text-xs text-gray-500 mt-1">
            Block specific dates from patient booking.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3">
          <Input
            type="date"
            value={holidayDate}
            onChange={(e) => setHolidayDate(e.target.value)}
            className="sm:max-w-45"
          />
          <Input
            value={holidayReason}
            onChange={(e) => setHolidayReason(e.target.value)}
            placeholder="Reason (optional)"
          />
          <Button
            variant="outline"
            disabled={!holidayDate || isAddingHoliday}
            onClick={() => {
              addHoliday(
                {
                  holiday_date: holidayDate,
                  reason: holidayReason || undefined,
                },
                {
                  onSuccess: () => {
                    setHolidayDate("");
                    setHolidayReason("");
                  },
                },
              );
            }}
          >
            Add holiday
          </Button>
        </div>

        {(data?.holidays ?? []).length === 0 ? (
          <p className="text-sm text-gray-400">
            No upcoming holidays configured.
          </p>
        ) : (
          <ul className="space-y-2">
            {(data?.holidays ?? []).map((holiday) => (
              <li
                key={holiday.holiday_id}
                className="flex items-center justify-between rounded-lg border px-3 py-2 text-sm"
              >
                <span>
                  {holiday.holiday_date}
                  {holiday.reason ? ` — ${holiday.reason}` : ""}
                </span>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 text-blue-500"
                  onClick={() => removeHoliday(holiday.holiday_id)}
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
