import { serverFetch } from "@/lib/shared/api/server-client";
import type {
  AddUserPayload,
  InactiveUsersListResponse,
  MutationResponse,
  UpdateUserPayload,
  UsersListResponse,
} from "@/lib/types/admin";

export type DeactivatedPatient = {
  national_id: string;
  first_name: string;
  last_name: string;
  gender: string;
  phone_number: string;
  doctor_id: number;
  doctor_name: string;
  study_type: string;
  study_date: string;
};

type DoctorListItem = {
  user_id: number;
  first_name: string;
  last_name: string;
  username: string;
};

type AssignedPatientRow = {
  user_id: number;
  first_name: string;
  last_name: string;
};

export async function fetchActiveUsers(filters?: {
  role?: string;
  sort?: "newest" | "oldest";
  created_date?: string;
  page?: number;
  keyword?: string;
}): Promise<UsersListResponse> {
  const params = new URLSearchParams();
  if (filters?.role && filters.role !== "all") params.set("role", filters.role);
  if (filters?.page) params.set("page", String(filters.page));
  if (filters?.keyword) params.set("keyword", filters.keyword);
  if (filters?.created_date) params.set("created_date", filters.created_date);
  if (filters?.sort) {
    params.set("order", filters.sort === "newest" ? "DESC" : "ASC");
  }

  return serverFetch<UsersListResponse>(
    `/users?status=active&${params.toString()}`,
  );
}

export async function fetchInactiveUsers(filters?: {
  page?: number;
  keyword?: string;
  role?: string;
  sort?: "newest" | "oldest";
  created_date?: string;
}): Promise<InactiveUsersListResponse> {
  const params = new URLSearchParams({ status: "deactivated" });
  if (filters?.page) params.set("page", String(filters.page));
  if (filters?.keyword) params.set("keyword", filters.keyword);
  if (filters?.role && filters.role !== "all") params.set("role", filters.role);
  if (filters?.sort) {
    params.set("order", filters.sort === "newest" ? "DESC" : "ASC");
  }
  if (filters?.created_date) params.set("created_date", filters.created_date);

  return serverFetch<InactiveUsersListResponse>(`/users?${params.toString()}`);
}

export async function createUser(payload: AddUserPayload) {
  return serverFetch<MutationResponse>("/users", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export async function updateUser(id: number, payload: UpdateUserPayload) {
  return serverFetch<MutationResponse>(`/users/${id}`, {
    method: "PUT",
    body: JSON.stringify(payload),
  });
}

export async function deleteUser(id: number) {
  return serverFetch<MutationResponse>(`/users/${id}`, { method: "DELETE" });
}

export async function deactivateUser(id: number) {
  return serverFetch<MutationResponse>(`/users/${id}/deactivate`, {
    method: "PATCH",
  });
}

export async function reactivateUser(id: number) {
  return serverFetch<MutationResponse>(`/users/${id}/reactivate`, {
    method: "PATCH",
  });
}

export async function transferPatients(oldDoctor: number, newDoctor: number) {
  return serverFetch<MutationResponse>("/users/transfer", {
    method: "POST",
    body: JSON.stringify({ oldDoctor, newDoctor }),
  });
}

export async function fetchDoctors() {
  return serverFetch<{
    success: boolean;
    data: DoctorListItem[];
  }>("/users?status=active&role=Doctor");
}

export async function fetchDeactivatedPatients(filters?: {
  page?: number;
  keyword?: string;
  sort?: "newest" | "oldest";
  created_date?: string;
}) {
  const params = new URLSearchParams();
  if (filters?.page) params.set("page", String(filters.page));
  if (filters?.keyword) params.set("keyword", filters.keyword);
  if (filters?.sort) {
    params.set("order", filters.sort === "newest" ? "DESC" : "ASC");
  }
  if (filters?.created_date) params.set("created_date", filters.created_date);

  return serverFetch<{
    success: boolean;
    page: number;
    pages: number;
    total: number;
    data: DeactivatedPatient[];
  }>(`/patients/deactivated?${params.toString()}`);
}

export async function reactivatePatient(nationalId: string) {
  return serverFetch<{ success: boolean; message: string }>(
    `/patients/${nationalId}/reactivate`,
    { method: "PATCH" },
  );
}

export async function fetchPatientsOfDoctor() {
  const json = await serverFetch<{
    data?: AssignedPatientRow[];
  }>("/patients/assigned?page=1&limit=100");

  return {
    success: true,
    data: (json.data ?? []).map((user) => ({
      user_id: user.user_id,
      full_name: `${user.first_name} ${user.last_name}`,
    })),
  };
}
