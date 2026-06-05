import type { Role } from "@/lib/types/admin";
import type { Notification } from "@/lib/types/notifications";

const NOTIFICATIONS_PATH: Record<Role, string> = {
  Doctor: "/doctor/notifications",
  Admin: "/admin/notifications",
  Receptionist: "/receptionist/notifications",
};

const CHAT_PATH: Record<Role, string> = {
  Doctor: "/doctor/chat",
  Admin: "/admin/notifications",
  Receptionist: "/receptionist/chat",
};

export function getNotificationsPagePath(role: Role): string {
  return NOTIFICATIONS_PATH[role];
}

export function getNotificationHref(
  notification: Notification,
  role: Role,
): string | null {
  const { type, studyId, patientId } = notification;

  if (type === "chat_message") {
    return CHAT_PATH[role] ?? null;
  }

  if (
    type === "appointment_created" ||
    type === "appointment_cancelled" ||
    type === "appointment_approved" ||
    type === "appointment_status"
  ) {
    if (role === "Receptionist" || role === "Admin") {
      return "/receptionist/appointments";
    }
    if (role === "Doctor") {
      return "/doctor/schedule";
    }
  }

  if (role === "Doctor" && studyId != null) {
    if (
      type === "ai_completed" ||
      type === "ai_validated" ||
      type === "ai_edited"
    ) {
      return `/doctor/patients/${studyId}/ai-analysis`;
    }
    if (type === "report_signed" || type === "image_uploaded") {
      return `/doctor/patients/${studyId}/report`;
    }
    return `/doctor/patients/${studyId}/report`;
  }

  if (role === "Receptionist") {
    if (patientId) return `/receptionist/patients`;
    return "/receptionist/patients";
  }

  if (role === "Admin") {
    if (type === "patient_registered" || type === "doctor_reassigned") {
      return "/admin/users";
    }
    return null;
  }

  return null;
}
