"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  fetchDashboard,
  fetchTodayAppointments,
  fetchAppointment,
  fetchAppointmentTimeline,
  updateAppointmentStatus,
  updateAppointmentPriority,
  fetchQueue,
  fetchArrivalBoard,
  callPatient,
  fetchCallbacks,
  createCallback,
  updateCallbackStatus,
  addContactAttempt,
  fetchCommunicationTimeline,
  addCommunicationNote,
  suggestSlots,
  fetchDoctorsAvailability,
  fetchPriorityOverview,
  fetchChatInbox,
  fetchChatConversation,
  fetchPatientChatThreads,
  sendChatMessage,
  setChatTyping,
  createAppointment,
} from "../actions/reception.actions";
import { RECEPTION_QUERY_KEYS } from "../constants";

export function useReceptionDashboard() {
  return useQuery({
    queryKey: RECEPTION_QUERY_KEYS.dashboard,
    queryFn: () => fetchDashboard().then((r) => r.data),
    refetchInterval: 30000,
  });
}

export function useTodayAppointments(
  filters: Record<string, string | number | undefined> = {},
) {
  return useQuery({
    queryKey: RECEPTION_QUERY_KEYS.appointmentsToday(filters),
    queryFn: () => fetchTodayAppointments(filters),
    refetchInterval: 15000,
    placeholderData: (prev) => prev,
    staleTime: 0,
  });
}

export function useAppointment(id: number) {
  return useQuery({
    queryKey: RECEPTION_QUERY_KEYS.appointment(id),
    queryFn: () => fetchAppointment(id).then((r) => r.data),
    enabled: id > 0,
  });
}

export function useAppointmentTimeline(id: number) {
  return useQuery({
    queryKey: RECEPTION_QUERY_KEYS.appointmentTimeline(id),
    queryFn: () => fetchAppointmentTimeline(id).then((r) => r.data),
    enabled: id > 0,
  });
}

export function useUpdateAppointmentStatus() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, status }: { id: number; status: string }) =>
      updateAppointmentStatus(id, status),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["reception"] });
    },
  });
}

export function useUpdateAppointmentPriority() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({
      id,
      priority_level,
    }: {
      id: number;
      priority_level: string;
    }) => updateAppointmentPriority(id, priority_level),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["reception"] }),
  });
}

export function useCreateAppointment() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: createAppointment,
    onSuccess: (result) => {
      if (result && "error" in result && result.error) return;
      qc.invalidateQueries({ queryKey: ["reception"] });
    },
  });
}

export function useQueue(
  filters: Record<string, string | number | undefined> = {},
) {
  return useQuery({
    queryKey: RECEPTION_QUERY_KEYS.queue(filters),
    queryFn: () => fetchQueue(filters),
    refetchInterval: 10000,
  });
}

export function useArrivalBoard(
  filters: Record<string, string | number | undefined> = {},
) {
  return useQuery({
    queryKey: RECEPTION_QUERY_KEYS.arrivalBoard(filters),
    queryFn: () => fetchArrivalBoard(filters).then((r) => r.data),
    refetchInterval: 8000,
    placeholderData: (prev) => prev,
  });
}

export function useCallPatient() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: callPatient,
    onSuccess: () => qc.invalidateQueries({ queryKey: ["reception"] }),
  });
}

export function usePriorityOverview() {
  return useQuery({
    queryKey: RECEPTION_QUERY_KEYS.priorityOverview,
    queryFn: () => fetchPriorityOverview().then((r) => r.data),
    refetchInterval: 10000,
    placeholderData: (prev) => prev,
  });
}

export function useDoctorsAvailability() {
  return useQuery({
    queryKey: RECEPTION_QUERY_KEYS.doctorsAvailability,
    queryFn: () => fetchDoctorsAvailability().then((r) => r.data),
    refetchInterval: 15000,
  });
}

export function useCallbacks(
  filters: Record<string, string | number | undefined> = {},
) {
  return useQuery({
    queryKey: RECEPTION_QUERY_KEYS.callbacks(filters),
    queryFn: () => fetchCallbacks(filters),
  });
}

export function useCreateCallback() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: createCallback,
    onSuccess: () =>
      qc.invalidateQueries({ queryKey: RECEPTION_QUERY_KEYS.callbacks({}) }),
  });
}

export function useUpdateCallbackStatus() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, status }: { id: number; status: string }) =>
      updateCallbackStatus(id, status),
    onSuccess: () =>
      qc.invalidateQueries({ queryKey: ["reception", "callbacks"] }),
  });
}

export function useAddContactAttempt() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({
      id,
      ...body
    }: {
      id: number;
      outcome: string;
      notes?: string;
    }) => addContactAttempt(id, body),
    onSuccess: () =>
      qc.invalidateQueries({ queryKey: ["reception", "callbacks"] }),
  });
}

export function useCommunicationTimeline(
  nationalId: string,
  filters: Record<string, string | number | undefined> = {},
) {
  return useQuery({
    queryKey: RECEPTION_QUERY_KEYS.communications(nationalId, filters),
    queryFn: () =>
      fetchCommunicationTimeline(nationalId, filters).then((r) => r.data),
    enabled: !!nationalId,
  });
}

export function useAddCommunicationNote() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: addCommunicationNote,
    onSuccess: () =>
      qc.invalidateQueries({ queryKey: ["reception", "communications"] }),
  });
}

export function useSuggestSlots() {
  return useMutation({
    mutationFn: suggestSlots,
  });
}

export function useChatInbox() {
  return useQuery({
    queryKey: RECEPTION_QUERY_KEYS.chatInbox,
    queryFn: () => fetchChatInbox().then((r) => r.data),
    refetchInterval: 15000,
  });
}

export function useChatConversation(userId: number, patientId?: string) {
  return useQuery({
    queryKey: RECEPTION_QUERY_KEYS.chatConversation(userId, patientId),
    queryFn: () => fetchChatConversation(userId, patientId).then((r) => r.data),
    enabled: userId > 0,
    refetchInterval: 5000,
  });
}

export function usePatientChatThreads() {
  return useQuery({
    queryKey: RECEPTION_QUERY_KEYS.patientThreads,
    queryFn: () => fetchPatientChatThreads().then((r) => r.data),
    refetchInterval: 15000,
  });
}

export function useSendChatMessage() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: sendChatMessage,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["reception", "chat"] });
    },
  });
}

export function useChatTyping() {
  return useMutation({ mutationFn: setChatTyping });
}
