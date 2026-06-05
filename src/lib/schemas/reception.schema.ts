import { z } from "zod";

export const appointmentStatusSchema = z.enum([
  "Scheduled",
  "Checked In",
  "Waiting",
  "In Consultation",
  "Completed",
  "Cancelled",
  "No Show",
]);

export const priorityLevelSchema = z.enum([
  "Emergency",
  "VIP",
  "Pregnant",
  "Senior Citizen",
  "Normal",
]);

export const createAppointmentSchema = z.object({
  national_id: z.string().length(14, "National ID must be 14 digits"),
  doctor_id: z.coerce.number().positive(),
  appointment_date: z.string().min(1),
  appointment_time: z.string().min(1),
  duration_minutes: z.coerce.number().min(15).max(120).default(30),
  priority_level: priorityLevelSchema.default("Normal"),
  reason: z.string().optional(),
  notes: z.string().optional(),
});

export const updateAppointmentStatusSchema = z.object({
  status: appointmentStatusSchema,
});

export const createCallbackSchema = z.object({
  national_id: z.string().length(14).optional().or(z.literal("")),
  patient_name: z.string().optional(),
  phone_number: z.string().min(7, "Phone number is required"),
  reason: z.string().min(1, "Reason is required"),
  notes: z.string().optional(),
  priority: z.enum(["High", "Normal", "Low"]).default("Normal"),
});

export const contactAttemptSchema = z.object({
  outcome: z.enum(["Answered", "No Answer", "Voicemail", "Busy", "Wrong Number"]),
  notes: z.string().optional(),
});

export const schedulingSuggestSchema = z.object({
  doctor_id: z.coerce.number().positive(),
  date: z.string().min(1),
  national_id: z.string().optional(),
  duration_minutes: z.coerce.number().default(30),
});

export const sendChatSchema = z.object({
  receiver_id: z.coerce.number().positive(),
  message: z.string().min(1),
  patient_id: z.string().optional(),
  appointment_id: z.coerce.number().optional(),
});

export type CreateAppointmentInput = z.infer<typeof createAppointmentSchema>;
export type CreateCallbackInput = z.infer<typeof createCallbackSchema>;
