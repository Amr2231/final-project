"use server";

import * as api from "../api/reception.api";

// Dashboard
export async function fetchDashboard() {
  return api.fetchDashboard();
}

export async function fetchPriorityOverview() {
  return api.fetchPriorityOverview();
}

// Appointments
export async function fetchTodayAppointments(
  params: Record<string, string | number | undefined> = {},
) {
  return api.fetchTodayAppointments(params);
}

export async function fetchAppointment(id: number) {
  return api.fetchAppointment(id);
}

export async function fetchAppointmentTimeline(id: number) {
  return api.fetchAppointmentTimeline(id);
}

export async function createAppointment(body: Record<string, unknown>) {
  try {
    return await api.createAppointment(body);
  } catch (error: unknown) {
    const err = error as { status?: number; message?: string };
    return {
      success: false,
      status: err.status || 500,
      message: err.message || "Failed to create appointment",
    };
  }
}

export async function updateAppointmentStatus(id: number, status: string) {
  return api.updateAppointmentStatus(id, status);
}

export async function updateAppointmentPriority(
  id: number,
  priority_level: string,
) {
  return api.updateAppointmentPriority(id, priority_level);
}

// Queue & Arrival Board
export async function fetchQueue(
  params: Record<string, string | number | undefined> = {},
) {
  return api.fetchQueue(params);
}

export async function fetchArrivalBoard(
  params: Record<string, string | number | undefined> = {},
) {
  return api.fetchArrivalBoard(params);
}

export async function callPatient(appointmentId: number) {
  return api.callPatient(appointmentId);
}

// Communications
export async function fetchCallbacks(
  params: Record<string, string | number | undefined> = {},
) {
  return api.fetchCallbacks(params);
}

export async function createCallback(body: Record<string, unknown>) {
  return api.createCallback(body);
}

export async function updateCallbackStatus(id: number, status: string) {
  return api.updateCallbackStatus(id, status);
}

export async function addContactAttempt(
  id: number,
  body: Record<string, unknown>,
) {
  return api.addContactAttempt(id, body);
}

export async function fetchCommunicationTimeline(
  nationalId: string,
  params: Record<string, string | number | undefined> = {},
) {
  return api.fetchCommunicationTimeline(nationalId, params);
}

export async function addCommunicationNote(body: Record<string, unknown>) {
  return api.addCommunicationNote(body);
}

// Scheduling
export async function suggestSlots(body: Record<string, unknown>) {
  return api.suggestSlots(body);
}

export async function checkSchedulingConflict(body: Record<string, unknown>) {
  return api.checkSchedulingConflict(body);
}

// Doctor Availability
export async function fetchDoctorsAvailability() {
  return api.fetchDoctorsAvailability();
}

// Chat
export async function fetchChatInbox() {
  return api.fetchChatInbox();
}

export async function fetchChatConversation(
  userId: number,
  patientId?: string,
) {
  return api.fetchChatConversation(userId, patientId);
}

export async function fetchPatientChatThreads() {
  return api.fetchPatientChatThreads();
}

export async function sendChatMessage(body: Record<string, unknown>) {
  return api.sendChatMessage(body);
}

export async function setChatTyping(typingToUserId: number) {
  return api.setChatTyping(typingToUserId);
}

export async function updatePresence(isOnline: boolean) {
  return api.updatePresence(isOnline);
}

export async function searchChatUsers(query = "") {
  return api.searchChatUsers(query);
}
