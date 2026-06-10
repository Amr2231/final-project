import { getServerSession } from "next-auth";
import { authOptions } from "@/auth";
import { getServerApiUrl } from "@/lib/shared/config/env";
import { ApiError, parseApiErrorMessage } from "./errors";

// API base URL
export function getApiBaseUrl(): string {
  return getServerApiUrl();
}

// Get headers with auth token for server-side requests
export async function getAuthHeaders(
  includeJsonContentType = true,
): Promise<Record<string, string>> {
  const session = await getServerSession(authOptions);
  if (!session?.accessToken) {
    throw new ApiError("Unauthorized", 401);
  }
  return {
    ...(includeJsonContentType ? { "Content-Type": "application/json" } : {}),
    Authorization: `Bearer ${session?.accessToken ?? ""}`,
  };
}

// Generic server-side fetch with error handling
export async function serverFetch<T>(
  path: string,
  options: RequestInit = {},
): Promise<T> {
  const isFormData = options.body instanceof FormData;
  const headers = await getAuthHeaders(!isFormData);

  const res = await fetch(`${getApiBaseUrl()}${path}`, {
    cache: "no-store",
    ...options,
    headers: {
      ...headers,
      ...(options.headers as Record<string, string> | undefined),
    },
  });

  if (!res.ok) {
    throw new ApiError(await parseApiErrorMessage(res), res.status);
  }

  if (res.status === 204) {
    return undefined as T;
  }

  return res.json() as Promise<T>;
}

// Fetch a blob (file download) with auth headers and error handling
export async function serverFetchBlob(
  path: string,
  options: RequestInit = {},
): Promise<Blob> {
  const headers = await getAuthHeaders(false);

  const res = await fetch(`${getApiBaseUrl()}${path}`, {
    cache: "no-store",
    ...options,
    headers: {
      ...headers,
      ...(options.headers as Record<string, string> | undefined),
    },
  });

  if (!res.ok) {
    throw new ApiError(await parseApiErrorMessage(res), res.status);
  }

  return res.blob();
}
