"use client";

import { useEffect, useCallback } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { useSession } from "next-auth/react";
import { getPublicApiUrl } from "@/lib/shared/config/env";
import { doctorKeys } from "@/features/doctor/constants/query-keys";
import { RECEPTION_QUERY_KEYS } from "@/features/reception-workspace/constants";

export function useStaffRealtime(
  scope: "doctor" | "reception" | "admin" = "doctor",
) {
  const queryClient = useQueryClient();
  const { data: session } = useSession();

  const invalidateChannel = useCallback(
    (channel: string) => {
      if (channel === "chat") {
        if (scope === "doctor" || scope === "admin") {
          queryClient.invalidateQueries({ queryKey: doctorKeys.chatInbox });
          queryClient.invalidateQueries({ queryKey: doctorKeys.chatUnread });
        }
        if (scope === "reception" || scope === "admin") {
          queryClient.invalidateQueries({ queryKey: ["reception", "chat"] });
        }
        return;
      }

      if (channel === "notifications") {
        queryClient.invalidateQueries({ queryKey: ["notifications"] });
        return;
      }

      if (scope === "reception" || scope === "admin") {
        switch (channel) {
          case "dashboard":
            queryClient.invalidateQueries({
              queryKey: RECEPTION_QUERY_KEYS.dashboard,
            });
            break;
          case "appointments":
            queryClient.invalidateQueries({
              queryKey: ["reception", "appointments"],
            });
            break;
          case "queue":
          case "arrival_board":
            queryClient.invalidateQueries({ queryKey: ["reception", "queue"] });
            queryClient.invalidateQueries({
              queryKey: ["reception", "arrival-board"],
            });
            queryClient.invalidateQueries({
              queryKey: RECEPTION_QUERY_KEYS.priorityOverview,
            });
            break;
          case "availability":
            queryClient.invalidateQueries({
              queryKey: RECEPTION_QUERY_KEYS.doctorsAvailability,
            });
            break;
          default:
            queryClient.invalidateQueries({ queryKey: ["reception"] });
        }
      }
    },
    [queryClient, scope],
  );

  useEffect(() => {
    const token = session?.accessToken;
    if (!token) return;

    const url = `${getPublicApiUrl()}/api/reception/events`;
    let es: EventSource | null = null;
    let retryTimer: ReturnType<typeof setTimeout>;

    const connect = () => {
      es = new EventSource(`${url}?token=${encodeURIComponent(token)}`);

      for (const ch of [
        "appointments",
        "queue",
        "arrival_board",
        "dashboard",
        "availability",
        "chat",
        "notifications",
      ]) {
        es.addEventListener(ch, () => invalidateChannel(ch));
      }

      es.onerror = () => {
        es?.close();
        retryTimer = setTimeout(connect, 5000);
      };
    };

    connect();

    return () => {
      clearTimeout(retryTimer);
      es?.close();
    };
  }, [session?.accessToken, invalidateChannel]);

  return { invalidateChannel };
}
