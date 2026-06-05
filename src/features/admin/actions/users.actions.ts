"use server";

import * as usersApi from "../api/users.api";
import type {
  AddUserPayload,
  InactiveUsersListResponse,
  MutationResponse,
  UpdateUserPayload,
  UsersListResponse,
} from "@/lib/types/admin";

export type { DeactivatedPatient } from "../api/users.api";

export async function getActiveUsersAction(
  filters?: Parameters<typeof usersApi.fetchActiveUsers>[0],
): Promise<UsersListResponse> {
  return usersApi.fetchActiveUsers(filters);
}

export async function getInactiveUsersAction(
  filters?: Parameters<typeof usersApi.fetchInactiveUsers>[0],
): Promise<InactiveUsersListResponse> {
  return usersApi.fetchInactiveUsers(filters);
}

export async function addUserAction(
  payload: AddUserPayload,
): Promise<MutationResponse> {
  return usersApi.createUser(payload);
}

export async function updateUserAction(
  id: number,
  payload: UpdateUserPayload,
): Promise<MutationResponse> {
  return usersApi.updateUser(id, payload);
}

export async function deleteUserAction(id: number): Promise<MutationResponse> {
  return usersApi.deleteUser(id);
}

export async function deactivateUserAction(
  id: number,
): Promise<MutationResponse> {
  return usersApi.deactivateUser(id);
}

export async function reactivateUserAction(
  id: number,
): Promise<MutationResponse> {
  return usersApi.reactivateUser(id);
}

export async function transferPatientsAction(
  oldDoctor: number,
  newDoctor: number,
): Promise<MutationResponse> {
  return usersApi.transferPatients(oldDoctor, newDoctor);
}

export async function getDoctorsAction() {
  return usersApi.fetchDoctors();
}

export async function getDeactivatedPatientsAction(
  filters?: Parameters<typeof usersApi.fetchDeactivatedPatients>[0],
) {
  return usersApi.fetchDeactivatedPatients(filters);
}

export async function reactivatePatientAction(national_id: string) {
  return usersApi.reactivatePatient(national_id);
}

export async function getPatientsOfDoctorAction() {
  return usersApi.fetchPatientsOfDoctor();
}

import { updateProfileAction } from "@/features/settings/actions/profile.actions";
import type { PersonalInfoFormValues } from "@/lib/shared/schemas/settings.schema";

/** @deprecated Use updateProfileAction from @/features/settings */
export async function updateMeAction(payload: PersonalInfoFormValues) {
  return updateProfileAction(payload);
}
