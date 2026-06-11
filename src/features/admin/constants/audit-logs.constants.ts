// constants
export const AUDIT_ACTIONS = [
  "LOGIN",
  "LOGOUT",
  "AI_RUN",
  "AI_APPROVE",
  "AI_REJECT",
  "AI_EDIT",
  "REPORT_SIGNED",
  "IMAGE_UPLOAD",
  "PATIENT_REGISTER",
  "PATIENT_UPDATE",
  "PATIENT_DEACTIVATE",
  "DOCTOR_REASSIGN",
  "USER_CREATE",
  "USER_DEACTIVATE",
  "USER_REACTIVATE",
  "PATIENTS_TRANSFER",
] as const;

export const AUDIT_ENTITIES = ["User", "Patient", "Study", "Report"] as const;

export const AUDIT_SORT_FIELDS = [
  { value: "created_at", label: "Date" },
  { value: "action", label: "Action" },
  { value: "entity", label: "Entity" },
  { value: "actor_name", label: "Actor" },
] as const;

export const AUDIT_TABLE_HEADERS = [
  "Timestamp",
  "Actor",
  "Action",
  "Entity",
  "Description",
  "",
] as const;

// helpers
export function getAuditLogRowKey(
  log: {
    audit_log_id?: number;
    id?: number;
    created_at: string;
    action: string;
    entity_id?: string | number | null;
  },
  index: number,
): string {
  const id = log.audit_log_id ?? log.id;
  if (id != null) return String(id);
  return `${log.created_at}-${log.action}-${log.entity_id ?? index}`;
}
