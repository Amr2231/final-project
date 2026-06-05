"use server";

import {
  getActivePatientByStudyId,
  listActivePatients,
  listHistoricalPatients,
  listRecentPatients,
  updateAssignedPatient,
  getPatientByNationalId,
  getPatientVisitHistory,
  type PatientsListResult,
} from "../services/patients.service";
import type {
  ActivePatient,
  HistoricalPatient,
  MutationResponse,
} from "@/lib/types/doctor";
import type { UpdatePatientPayload } from "@/lib/types/receptionist";
import type {
  ActivePatientsQuery,
  HistoricalPatientsQuery,
} from "../utils/filters";

export async function getActivePatientsAction(
  options?: ActivePatientsQuery,
): Promise<PatientsListResult<ActivePatient>> {
  return listActivePatients(options);
}

export async function getHistoricalPatientsAction(
  options?: HistoricalPatientsQuery,
): Promise<PatientsListResult<HistoricalPatient>> {
  return listHistoricalPatients(options);
}

/** @deprecated Use `getActivePatientsAction` — kept for backward compatibility. */
export async function getPatientsWithStudiesAction(
  options?: ActivePatientsQuery,
) {
  const result = await listActivePatients(options);
  return {
    success: true,
    message: "OK",
    patients: result.patients,
    total: result.total,
    pages: result.pages,
    page: result.page,
    data: result.patients,
  };
}

export async function getActivePatientByStudyIdAction(studyId: string) {
  return getActivePatientByStudyId(studyId);
}

export async function updatePatientAction(
  national_id: string,
  payload: UpdatePatientPayload,
): Promise<MutationResponse> {
  return updateAssignedPatient(national_id, payload);
}

export async function getPatientByNationalIdAction(nationalId: string) {
  const profile = await getPatientByNationalId(nationalId);
  if (!profile) return null;
  const visits = await getPatientVisitHistory(nationalId);
  return { ...profile, visits };
}

export async function getRecentPatientsAction(params?: {
  keyword?: string;
  page?: number;
  limit?: number;
}) {
  return listRecentPatients(params);
}
