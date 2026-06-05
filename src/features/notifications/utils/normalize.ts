import type {
  Notification,
  NotificationCategory,
  NotificationRow,
} from "@/lib/types/notifications";

export function normalizeIsRead(value: NotificationRow["is_read"]): boolean {
  return value === true || value === 1;
}

export function getNotificationCategory(
  type: NotificationRow["type"],
): NotificationCategory {
  if (
    type === "patient_registered" ||
    type === "doctor_reassigned"
  ) {
    return "patient";
  }
  if (type === "report_signed" || type === "image_uploaded") {
    return "report";
  }
  if (
    type === "appointment_created" ||
    type === "appointment_cancelled" ||
    type === "appointment_approved" ||
    type === "appointment_status"
  ) {
    return "system";
  }
  if (type === "chat_message" || type === "doctor_unavailable") {
    return "system";
  }
  if (
    type === "ai_completed" ||
    type === "ai_validated" ||
    type === "ai_edited"
  ) {
    return "ai";
  }
  return "system";
}

export function normalizeNotification(row: NotificationRow): Notification {
  return {
    id: row.notification_id,
    type: row.type,
    category: getNotificationCategory(row.type),
    title: row.title,
    message: row.message,
    studyId: row.study_id,
    patientId: row.patient_id,
    isRead: normalizeIsRead(row.is_read),
    createdAt: row.created_at,
  };
}

export function normalizeNotifications(rows: NotificationRow[]): Notification[] {
  return rows.map(normalizeNotification);
}
