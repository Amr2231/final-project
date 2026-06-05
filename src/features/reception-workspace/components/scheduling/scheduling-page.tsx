"use client";

import { useState } from "react";
import { toast } from "sonner";
import {
  Calendar,
  Sparkles,
  AlertTriangle,
  CheckCircle2,
  CalendarCheck,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ReceptionPageShell } from "../shared/reception-page-shell";
import { ReceptionLoadingState } from "../shared/ui";
import {
  useSuggestSlots,
  useCreateAppointment,
} from "../../hooks/use-reception";
import { useDoctors } from "@/features/receptionist/hooks/use-doctors";
import { EmptyState } from "@/components/ui/empty-state";

export function SchedulingPage() {
  const { data: doctors = [], isLoading: loadingDoctors } = useDoctors();
  const { mutate: suggest, isPending, data: suggestResult } = useSuggestSlots();
  const { mutate: book, isPending: booking } = useCreateAppointment();

  const [doctorId, setDoctorId] = useState("");
  const [date, setDate] = useState(new Date().toISOString().slice(0, 10));
  const [nationalId, setNationalId] = useState("");
  const [duration, setDuration] = useState("30");
  const [bookedTimes, setBookedTimes] = useState<string[]>([]);
  const [lastBookedTime, setLastBookedTime] = useState<string | null>(null);

  const scheduling = suggestResult?.data;
  const bookingLocked = lastBookedTime !== null;

  const handleSuggest = () => {
    if (!doctorId || !date || bookingLocked) return;
    setBookedTimes([]);
    setLastBookedTime(null);
    suggest({
      doctor_id: Number(doctorId),
      date,
      national_id: nationalId || undefined,
      duration_minutes: Number(duration),
    });
  };

  const handleBook = (time: string) => {
    if (!nationalId || nationalId.length !== 14) return;
    if (bookingLocked || bookedTimes.includes(time) || booking) return;

    book(
      {
        national_id: nationalId,
        doctor_id: Number(doctorId),
        appointment_date: date,
        appointment_time: time,
        duration_minutes: Number(duration),
      },
      {
        onSuccess: (result) => {
          if (result && typeof result === "object" && "error" in result) {
            toast.error(
              (result as { message?: string }).message ??
                "Could not book this slot",
            );
            return;
          }
          setBookedTimes((prev) => [...prev, time]);
          setLastBookedTime(time);
          toast.success("Appointment booked successfully");
        },
        onError: () => {
          toast.error("Failed to book appointment. Please try again.");
        },
      },
    );
  };

  const resetBookingFlow = () => {
    setBookedTimes([]);
    setLastBookedTime(null);
    setNationalId("");
  };

  if (loadingDoctors) return <ReceptionLoadingState />;

  return (
    <ReceptionPageShell
      title="Smart Scheduling"
      description="AI-assisted slot recommendations with conflict detection"
    >
      <div className="grid grid-cols-1 lg:grid-cols-[320px_1fr] gap-6 items-start">
        {/* ── Left panel: form ── */}
        <div className="rounded-xl border bg-card p-5 space-y-5">
          <div className="space-y-1.5">
            <Label>Doctor</Label>
            <Select value={doctorId} onValueChange={setDoctorId}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select doctor" />
              </SelectTrigger>
              <SelectContent>
                {doctors.map((d) => (
                  <SelectItem key={d.user_id} value={String(d.user_id)}>
                    {d.first_name} {d.last_name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-1.5">
            <Label>Date</Label>
            <Input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
            />
          </div>

          <div className="space-y-1.5">
            <Label>Patient National ID</Label>
            <Input
              value={nationalId}
              onChange={(e) => setNationalId(e.target.value)}
              maxLength={14}
              placeholder="14 digits"
            />
          </div>

          <div className="space-y-1.5">
            <Label>Duration</Label>
            <Select value={duration} onValueChange={setDuration}>
              <SelectTrigger className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="15">15 minutes</SelectItem>
                <SelectItem value="30">30 minutes</SelectItem>
                <SelectItem value="45">45 minutes</SelectItem>
                <SelectItem value="60">60 minutes</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {bookingLocked && (
            <div className="rounded-lg border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm text-emerald-800">
              Booked {String(lastBookedTime).slice(0, 5)}. Start a new booking to
              continue.
            </div>
          )}

          {bookingLocked && (
            <Button type="button" variant="outline" className="w-full" onClick={resetBookingFlow}>
              New Booking
            </Button>
          )}

          <Button
            className="w-full"
            onClick={handleSuggest}
            disabled={isPending || !doctorId || bookingLocked}
          >
            <Sparkles className="w-4 h-4 mr-2" />
            {isPending ? "Analyzing..." : "Suggest Best Slots"}
          </Button>
        </div>

        {/* ── Right panel: results ── */}
        <div className="space-y-4 min-w-0">
          {/* Warnings */}
          {scheduling?.warnings?.map((w, i) => (
            <div
              key={i}
              className="flex gap-2.5 rounded-lg border border-blue-200 bg-blue-50 px-4 py-3 text-sm text-blue-800"
            >
              <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5 text-blue-600" />
              <span>{w.message}</span>
            </div>
          ))}

          {/* Empty state */}
          {!scheduling ? (
            <div className="rounded-xl border border-dashed p-14 text-center">
              <Calendar className="w-10 h-10 mx-auto mb-3 text-muted-foreground/40" />
              <p className="text-sm text-muted-foreground">
                Select a doctor and date, then request slot suggestions
              </p>
            </div>
          ) : scheduling.suggestions.length === 0 ? (
            <div className="rounded-xl border border-dashed p-10 text-center">
              <EmptyState
                icon={CalendarCheck}
                title="No Suggested Slots"
                description="We couldn't find any slots that match your preferences."
              />
            </div>
          ) : (
            <div className="grid gap-3">
              {scheduling.suggestions.map((slot) => (
                <div
                  key={slot.appointment_time}
                  className="rounded-xl border bg-card p-4"
                >
                  <div className="flex items-start justify-between gap-4">
                    {/* Time + meta */}
                    <div className="flex items-center gap-4">
                      <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-lg bg-blue-100 text-blue-800">
                        <span className="text-lg font-mono font-bold leading-none">
                          {String(slot.appointment_time).slice(0, 5)}
                        </span>
                      </div>
                      <div>
                        <p className="text-sm font-medium">
                          {slot.doctor_name}
                        </p>
                        <p className="text-xs text-muted-foreground mt-0.5">
                          Match score:{" "}
                          <span className="text-blue-900 font-semibold">
                            {slot.score}/100
                          </span>
                        </p>
                      </div>
                    </div>

                    <Button
                      size="sm"
                      className="shrink-0"
                      disabled={
                        booking ||
                        bookingLocked ||
                        bookedTimes.includes(slot.appointment_time) ||
                        nationalId.length !== 14
                      }
                      onClick={() => handleBook(slot.appointment_time)}
                    >
                      {bookedTimes.includes(slot.appointment_time)
                        ? "Booked"
                        : booking
                          ? "Booking…"
                          : "Book"}
                    </Button>
                  </div>

                  {/* Reasons */}
                  {slot.reasons.length > 0 && (
                    <ul className="mt-3 pt-3 border-t space-y-1.5">
                      {slot.reasons.map((r, i) => (
                        <li
                          key={i}
                          className="flex items-center gap-2 text-xs text-muted-foreground"
                        >
                          <CheckCircle2 className="w-3.5 h-3.5 shrink-0 text-green-600" />
                          {r}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              ))}
            </div>
          )}

          {/* Alternative Dates */}
          {scheduling?.alternatives?.length ? (
            <div className="pt-2">
              <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-3">
                Alternative dates
              </p>
              <div className="flex flex-wrap gap-2">
                {scheduling.alternatives.map((alt) => (
                  <div
                    key={alt.date}
                    className="flex items-center gap-2 rounded-lg border bg-card px-3 py-2 text-sm"
                  >
                    <Calendar className="w-3.5 h-3.5 text-muted-foreground" />
                    <span className="font-medium">{alt.date}</span>
                    <span className="text-muted-foreground font-mono text-xs">
                      {String(alt.top_slot.appointment_time).slice(0, 5)}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          ) : null}
        </div>
      </div>
    </ReceptionPageShell>
  );
}
