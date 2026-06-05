import { serverFetch } from "@/lib/shared/api/server-client";
import type {
  ApiResponse,
  Appointment,
  ArrivalBoardEntry,
  CallbackRequest,
  CommunicationEntry,
  ContactAttempt,
  DashboardData,
  DoctorAvailability,
  PaginatedResponse,
  PatientChatThread,
  QueueEntry,
  SchedulingResult,
  SlotSuggestion,
} from "@/lib/types/reception-workspace";
import type {
  ChatInboxItem,
  ChatMessage,
} from "@/lib/types/reception-workspace";

const BASE = "/api/reception";

function qs(params: Record<string, string | number | undefined>) {
  const sp = new URLSearchParams();
  for (const [k, v] of Object.entries(params)) {
    if (v !== undefined && v !== "") sp.set(k, String(v));
  }
  const q = sp.toString();
  return q ? `?${q}` : "";
}

// Dashboard
export async function fetchDashboard() {
  return serverFetch<ApiResponse<DashboardData>>(`${BASE}/dashboard`);
}

export async function fetchPriorityOverview() {
  return serverFetch<ApiResponse<QueueEntry[]>>(`${BASE}/priority-overview`);
}

// Appointments
export async function fetchTodayAppointments(
  params: Record<string, string | number | undefined> = {},
) {
  return serverFetch<PaginatedResponse<Appointment>>(
    `${BASE}/appointments/today${qs(params)}`,
  );
}

export async function fetchAppointment(id: number) {
  return serverFetch<ApiResponse<Appointment>>(`${BASE}/appointments/${id}`);
}

export async function fetchAppointmentTimeline(id: number) {
  return serverFetch<
    ApiResponse<{
      appointment: Appointment;
      timeline: {
        type: string;
        title: string;
        at: string;
        detail?: string;
        actor?: string;
      }[];
    }>
  >(`${BASE}/appointments/${id}/timeline`);
}

export async function createAppointment(body: Record<string, unknown>) {
  return serverFetch<ApiResponse<Appointment>>(`${BASE}/appointments`, {
    method: "POST",
    body: JSON.stringify(body),
  });
}

export async function updateAppointmentStatus(id: number, status: string) {
  return serverFetch<ApiResponse<Appointment>>(
    `${BASE}/appointments/${id}/status`,
    {
      method: "PATCH",
      body: JSON.stringify({ status }),
    },
  );
}

export async function updateAppointmentPriority(
  id: number,
  priority_level: string,
) {
  return serverFetch<ApiResponse<Appointment>>(
    `${BASE}/appointments/${id}/priority`,
    {
      method: "PATCH",
      body: JSON.stringify({ priority_level }),
    },
  );
}

// Queue & Arrival Board
export async function fetchQueue(
  params: Record<string, string | number | undefined> = {},
) {
  return serverFetch<PaginatedResponse<QueueEntry>>(
    `${BASE}/queue${qs(params)}`,
  );
}

export async function fetchArrivalBoard(
  params: Record<string, string | number | undefined> = {},
) {
  return serverFetch<ApiResponse<ArrivalBoardEntry[]>>(
    `${BASE}/arrival-board${qs(params)}`,
  );
}

export async function callPatient(appointmentId: number) {
  return serverFetch<ApiResponse<Appointment>>(
    `${BASE}/arrival-board/${appointmentId}/call`,
    {
      method: "POST",
    },
  );
}

// Communications
export async function fetchCallbacks(
  params: Record<string, string | number | undefined> = {},
) {
  return serverFetch<PaginatedResponse<CallbackRequest>>(
    `${BASE}/callbacks${qs(params)}`,
  );
}

export async function createCallback(body: Record<string, unknown>) {
  return serverFetch<ApiResponse<CallbackRequest>>(`${BASE}/callbacks`, {
    method: "POST",
    body: JSON.stringify(body),
  });
}

export async function updateCallbackStatus(id: number, status: string) {
  return serverFetch<ApiResponse<CallbackRequest>>(`${BASE}/callbacks/${id}`, {
    method: "PATCH",
    body: JSON.stringify({ status }),
  });
}

export async function addContactAttempt(
  id: number,
  body: Record<string, unknown>,
) {
  return serverFetch<
    ApiResponse<{ attempt_id: number; callback: CallbackRequest }>
  >(`${BASE}/callbacks/${id}/attempts`, {
    method: "POST",
    body: JSON.stringify(body),
  });
}

export async function fetchCommunicationTimeline(
  nationalId: string,
  params: Record<string, string | number | undefined> = {},
) {
  return serverFetch<
    ApiResponse<{
      communications: CommunicationEntry[];
      contact_attempts: ContactAttempt[];
      page: number;
      limit: number;
      total: number;
    }>
  >(`${BASE}/communications/${nationalId}/timeline${qs(params)}`);
}

export async function addCommunicationNote(body: Record<string, unknown>) {
  return serverFetch<ApiResponse<{ communication_id: number }>>(
    `${BASE}/communications/notes`,
    { method: "POST", body: JSON.stringify(body) },
  );
}

// Scheduling
export async function suggestSlots(body: Record<string, unknown>) {
  return serverFetch<ApiResponse<SchedulingResult>>(
    `${BASE}/scheduling/suggest`,
    {
      method: "POST",
      body: JSON.stringify(body),
    },
  );
}

export async function checkSchedulingConflict(body: Record<string, unknown>) {
  return serverFetch<
    ApiResponse<{ has_conflict: boolean; conflicts: Appointment[] }>
  >(`${BASE}/scheduling/check-conflict`, {
    method: "POST",
    body: JSON.stringify(body),
  });
}

// Doctor Availability
export async function fetchDoctorsAvailability() {
  return serverFetch<ApiResponse<DoctorAvailability[]>>(
    `${BASE}/doctors/availability`,
  );
}

// Chat (reuses /api/chat)
export async function fetchChatInbox() {
  return serverFetch<{ success: boolean; data: ChatInboxItem[] }>(
    "/api/chat/inbox",
  );
}

export async function fetchChatConversation(
  userId: number,
  patientId?: string,
) {
  const q = patientId ? `?patient_id=${patientId}` : "";
  return serverFetch<{ success: boolean; data: ChatMessage[] }>(
    `/api/chat/${userId}${q}`,
  );
}

export async function fetchPatientChatThreads() {
  return serverFetch<{ success: boolean; data: PatientChatThread[] }>(
    "/api/chat/patient-threads",
  );
}

export async function sendChatMessage(body: Record<string, unknown>) {
  return serverFetch<{ success: boolean; message_id: number }>("/api/chat", {
    method: "POST",
    body: JSON.stringify(body),
  });
}

export async function setChatTyping(typingToUserId: number) {
  return serverFetch<{ success: boolean }>("/api/chat/typing", {
    method: "POST",
    body: JSON.stringify({ typing_to_user_id: typingToUserId }),
  });
}

export async function searchChatUsers(query = "") {
  const qs = query.trim() ? `?q=${encodeURIComponent(query.trim())}` : "";
  return serverFetch<{
    success: boolean;
    data: {
      user_id: number;
      first_name: string;
      last_name: string;
      username: string;
      email: string;
      role_name: string;
      is_online: number;
    }[];
  }>(`/api/chat/users${qs}`);
}

export async function updatePresence(isOnline: boolean) {
  return serverFetch<{ success: boolean }>(`${BASE}/presence`, {
    method: "PATCH",
    body: JSON.stringify({ is_online: isOnline }),
  });
}

export type { SlotSuggestion };
