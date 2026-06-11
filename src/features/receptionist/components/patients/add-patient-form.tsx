"use client";

import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion } from "motion/react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils/tailwind-merge";
import {
  User,
  Stethoscope,
  Calendar,
  Clock,
  AlertTriangle,
  CheckCircle2,
} from "lucide-react";
import { useAddPatient } from "../../hooks/use-add-patient";
import { useDoctors } from "../../hooks/use-doctors";
import { useSuggestedSlots } from "../../hooks/use-suggested-slots";
import {
  addPatientSchema,
  type AddPatientFields,
} from "@/lib/schemas/patient.schema";
import { STUDY } from "@/lib/constants/study.constants";
import { ReceptionPageShell } from "@/features/reception-workspace/components/shared/reception-page-shell";
import { PulseLoader } from "@/components/ui/pulse-loader";

// ── Sub-components

function SectionCard({
  icon: Icon,
  title,
  description,
  children,
  index = 0,
}: {
  icon: React.ElementType;
  title: string;
  description: string;
  children: React.ReactNode;
  index?: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.1 + index * 0.08 }}
      className="rounded-2xl border border-gray-200 dark:border-gray-700  dark:bg-gray-900 overflow-hidden"
    >
      <div className="flex items-center gap-3 px-6 py-4 border-b border-gray-100 dark:border-gray-700 bg-gray-50/60 ">
        <span className="flex items-center justify-center w-8 h-8 rounded-lg bg-blue-100/10 dark:bg-blue-900/20">
          <Icon className="w-4 h-4 text-blue-800" />
        </span>
        <div>
          <h2 className="text-sm font-semibold text-gray-900 ">{title}</h2>
          <p className="text-xs text-gray-400 dark:text-gray-500">
            {description}
          </p>
        </div>
      </div>
      <div className="p-6">{children}</div>
    </motion.div>
  );
}

function FieldLabel({
  label,
  required,
}: {
  label: string;
  required?: boolean;
}) {
  return (
    <label className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide">
      {label} {required && <span className="text-blue-800">*</span>}
    </label>
  );
}

function FieldError({ message }: { message?: string }) {
  if (!message) return null;
  return <p className="text-xs text-red-500 mt-1">{message}</p>;
}

// ── Main Form

export function AddPatientForm() {
  const { mutate: addPatient, isPending } = useAddPatient();
  const { data: doctors = [], isLoading: loadingDoctors } = useDoctors();

  const {
    register,
    handleSubmit,
    control,
    watch,
    setValue,
    formState: { errors },
  } = useForm<AddPatientFields>({
    resolver: zodResolver(addPatientSchema),
    defaultValues: {
      first_name: "",
      last_name: "",
      national_id: "",
      gender: undefined,
      doctor_id: 0,
      phone_number: "",
      study_type: undefined,
      study_date: "",
      appointment_time: "",
    },
  });

  const nationalId = watch("national_id");
  const doctorId = watch("doctor_id");
  const studyDate = watch("study_date");
  const selectedTime = watch("appointment_time");

  const { data: slotsData, isFetching: loadingSlots } = useSuggestedSlots({
    doctor_id: doctorId,
    date: studyDate,
    national_id: nationalId?.length === 14 ? nationalId : undefined,
  });

  const slots = slotsData?.data?.suggestions ?? [];
  const warnings = (slotsData?.data?.warnings ?? []) as Array<{
    type: string;
    message: string;
  }>;

  const onSubmit = (data: AddPatientFields) => {
    addPatient(data);
  };

  return (
    <ReceptionPageShell
      title="Add New Patient"
      description="Register a new patient in the system."
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* ── Personal Info ── */}
        <SectionCard
          icon={User}
          title="Personal Information"
          description="Enter the patient's basic details"
          index={0}
        >
          <div className="grid grid-cols-2 gap-5">
            <div className="space-y-1.5">
              <FieldLabel label="First Name" required />
              <Input
                placeholder="e.g. Ahmed"
                {...register("first_name")}
                className={cn(
                  "h-10  text-sm",
                  errors.first_name && "border-red-400",
                )}
              />
              <FieldError message={errors.first_name?.message} />
            </div>

            <div className="space-y-1.5">
              <FieldLabel label="Last Name" required />
              <Input
                placeholder="e.g. Hassan"
                {...register("last_name")}
                className={cn(
                  "h-10  text-sm",
                  errors.last_name && "border-red-400",
                )}
              />
              <FieldError message={errors.last_name?.message} />
            </div>

            <div className="space-y-1.5 col-span-2">
              <FieldLabel label="National ID" required />
              <Input
                placeholder="14-digit National ID"
                {...register("national_id", {
                  onChange: (e) => {
                    e.target.value = e.target.value.replace(/\D/g, "");
                  },
                })}
                className={cn(
                  "h-10  text-sm font-mono tracking-wider",
                  errors.national_id && "border-red-400",
                )}
              />
              {errors.national_id ? (
                <FieldError message={errors.national_id.message} />
              ) : (
                <p className="text-xs text-gray-400">
                  {(nationalId ?? "").length}/14 digits
                </p>
              )}
            </div>

            <div className="space-y-1.5">
              <FieldLabel label="Gender" required />
              <Controller
                name="gender"
                control={control}
                render={({ field }) => (
                  <Select value={field.value} onValueChange={field.onChange}>
                    <SelectTrigger
                      className={cn(
                        "w-full h-10  text-sm",
                        errors.gender && "border-red-400",
                      )}
                    >
                      <SelectValue placeholder="Select Gender" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Male">Male</SelectItem>
                      <SelectItem value="Female">Female</SelectItem>
                    </SelectContent>
                  </Select>
                )}
              />
              <FieldError message={errors.gender?.message} />
            </div>

            <div className="space-y-1.5">
              <FieldLabel label="Phone Number" required />
              <Input
                placeholder="01xxxxxxxxx"
                {...register("phone_number", {
                  onChange: (e) => {
                    e.target.value = e.target.value
                      .replace(/\D/g, "")
                      .slice(0, 11);
                  },
                })}
                className={cn(
                  "w-full h-10 px-3  text-sm",
                  errors.phone_number && "border-red-400",
                )}
              />
              <FieldError message={errors.phone_number?.message} />
            </div>
          </div>
        </SectionCard>

        {/* ── Medical Assignment ── */}
        <SectionCard
          icon={Stethoscope}
          title="Medical Assignment"
          description="Assign the patient to a doctor"
          index={1}
        >
          <div className="grid grid-cols-2 gap-5">
            <div className="space-y-1.5 col-span-2">
              <FieldLabel label="Assigned Doctor" required />
              <Controller
                name="doctor_id"
                control={control}
                render={({ field }) => (
                  <Select
                    value={field.value ? String(field.value) : ""}
                    onValueChange={(v) => {
                      field.onChange(Number(v));
                      setValue("appointment_time", "");
                    }}
                    disabled={loadingDoctors}
                  >
                    <SelectTrigger
                      className={cn(
                        "h-9 text-sm w-full",
                        errors.doctor_id && "border-red-400",
                      )}
                    >
                      <SelectValue
                        placeholder={
                          loadingDoctors ? "Loading..." : "Select a doctor"
                        }
                      />
                    </SelectTrigger>
                    <SelectContent>
                      {doctors.map((d) => (
                        <SelectItem key={d.user_id} value={String(d.user_id)}>
                          {d.first_name} {d.last_name} ({d.username})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />
              <FieldError message={errors.doctor_id?.message} />
            </div>

            <div className="space-y-1.5 col-span-2">
              <FieldLabel label="Study Type" required />
              <Controller
                name="study_type"
                control={control}
                render={({ field }) => (
                  <Select
                    value={field.value ?? ""}
                    onValueChange={field.onChange}
                  >
                    <SelectTrigger
                      className={cn(
                        "h-10 text-sm w-full",
                        errors.study_type && "border-red-400",
                      )}
                    >
                      <SelectValue placeholder="Select a study" />
                    </SelectTrigger>
                    <SelectContent>
                      {STUDY.map((s) => (
                        <SelectItem key={s} value={s} className="text-sm">
                          {s}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />
              <FieldError message={errors.study_type?.message} />
            </div>
          </div>
        </SectionCard>

        {/* ── Dates & Time ── */}
        <SectionCard
          icon={Calendar}
          title="Date & Appointment Time"
          description="Set study date and pick an available slot"
          index={2}
        >
          <div className="space-y-5">
            <div className="space-y-1.5">
              <FieldLabel label="Study Date" required />
              <Input
                type="date"
                min={new Date().toISOString().slice(0, 10)}
                {...register("study_date", {
                  onChange: () => setValue("appointment_time", ""),
                })}
                className={cn(
                  "h-10  text-sm",
                  errors.study_date && "border-red-400",
                )}
              />
              <FieldError message={errors.study_date?.message} />
            </div>

            {/* Slots */}
            {doctorId > 0 && studyDate && (
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <Clock className="w-3.5 h-3.5 text-gray-400" />
                  <FieldLabel label="Available Time Slots" required />
                  {loadingSlots && <PulseLoader />}
                </div>

                {/* Warnings */}
                {warnings.map((w, i) => (
                  <div
                    key={i}
                    className="flex gap-2 rounded-lg border border-amber-200 bg-amber-50 px-3 py-2 text-xs text-amber-800"
                  >
                    <AlertTriangle className="w-3.5 h-3.5 shrink-0 mt-0.5 text-amber-600" />
                    {w.message}
                  </div>
                ))}

                {!loadingSlots && slots.length === 0 && !warnings.length && (
                  <p className="text-xs text-muted-foreground py-2">
                    No available slots for this date.
                  </p>
                )}

                {slots.length > 0 && (
                  <Controller
                    name="appointment_time"
                    control={control}
                    render={({ field }) => (
                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                        {slots.map(
                          (slot: {
                            appointment_time: string;
                            score?: number;
                          }) => {
                            const time = String(slot.appointment_time).slice(
                              0,
                              5,
                            );
                            const isSelected =
                              field.value === slot.appointment_time;
                            return (
                              <button
                                key={slot.appointment_time}
                                type="button"
                                onClick={() =>
                                  field.onChange(slot.appointment_time)
                                }
                                className={cn(
                                  "flex flex-col items-start gap-1 rounded-xl border px-3 py-2.5 text-left transition-all",
                                  isSelected
                                    ? "border-blue-600 bg-blue-50 ring-1 ring-blue-600"
                                    : "border-gray-200 bg-gray-50 hover:border-blue-300 hover:bg-blue-50/40",
                                )}
                              >
                                <div className="flex items-center justify-between w-full">
                                  <span
                                    className={cn(
                                      "font-mono text-sm font-semibold",
                                      isSelected
                                        ? "text-blue-700"
                                        : "text-gray-800",
                                    )}
                                  >
                                    {time}
                                  </span>
                                  {isSelected && (
                                    <CheckCircle2 className="w-3.5 h-3.5 text-blue-600" />
                                  )}
                                </div>
                                <span
                                  className={cn(
                                    "text-[10px]",
                                    isSelected
                                      ? "text-blue-600"
                                      : "text-gray-400",
                                  )}
                                >
                                  Score: {slot.score}/100
                                </span>
                              </button>
                            );
                          },
                        )}
                      </div>
                    )}
                  />
                )}
                <FieldError message={errors.appointment_time?.message} />
              </div>
            )}

            {/* Selected time summary */}
            {selectedTime && (
              <div className="flex items-center gap-2 rounded-lg bg-blue-50 border border-blue-200 px-3 py-2">
                <CheckCircle2 className="w-4 h-4 text-blue-600 shrink-0" />
                <p className="text-sm text-blue-700">
                  Appointment at{" "}
                  <span className="font-mono font-semibold">
                    {String(selectedTime).slice(0, 5)}
                  </span>
                </p>
              </div>
            )}
          </div>
        </SectionCard>

        {/* ── Submit ── */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3, delay: 0.4 }}
          className="flex justify-end pb-4"
        >
          <Button type="submit" disabled={isPending}>
            {isPending ? "Saving..." : "Add Patient"}
          </Button>
        </motion.div>
      </form>
    </ReceptionPageShell>
  );
}
