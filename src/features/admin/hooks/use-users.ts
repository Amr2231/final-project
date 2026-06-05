"use client";

import { useQuery } from "@tanstack/react-query";
import { getActiveUsersAction } from "../actions/users.actions";

type Filters = {
  keyword?: string;
  role?: string;
  // status?: "active" | "deactivated";
  created_date?: string;
  sort?: "newest" | "oldest";
  page?: number;
};

export function useUsers(filters?: Filters) {
  return useQuery({
    queryKey: [
      "users",
      {
        keyword: filters?.keyword,
        role: filters?.role,
        // status: filters?.status,
        created_date: filters?.created_date,
        sort: filters?.sort,
        page: filters?.page,
      },
    ],
    queryFn: async () => {
      const res = await getActiveUsersAction(filters);
      return {
        data: res.data ?? [],
        total: res.total ?? 0,
        pages: res.pages ?? 1,
        page: res.page ?? 1,
      };
    },
    placeholderData: (prev) => prev,
    staleTime: 0, 
  });
}
