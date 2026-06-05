"use client";

import { useEffect, useCallback } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { useSession } from "next-auth/react";
import { getPublicApiUrl } from "@/lib/shared/config/env";
import { RECEPTION_QUERY_KEYS } from "../constants";

const REALTIME_CHANNELS = [
  "appointments",
  "queue",
  "arrival_board",
  "dashboard",
  "availability",
  "chat",
  "notifications",
] as const;

export function useReceptionRealtime() {
  const queryClient = useQueryClient();
  const { data: session } = useSession();

  const invalidateAll = useCallback(() => {
    queryClient.invalidateQueries({ queryKey: ["reception"] });
  }, [queryClient]);

  const invalidateChannel = useCallback(
    (channel: string) => {
      switch (channel) {
        case "dashboard":
          queryClient.invalidateQueries({ queryKey: RECEPTION_QUERY_KEYS.dashboard });
          break;
        case "appointments":
          queryClient.invalidateQueries({ queryKey: ["reception", "appointments"] });
          break;
        case "queue":
        case "arrival_board":
          queryClient.invalidateQueries({ queryKey: ["reception", "queue"] });
          queryClient.invalidateQueries({ queryKey: ["reception", "arrival-board"] });
          queryClient.invalidateQueries({ queryKey: RECEPTION_QUERY_KEYS.priorityOverview });
          break;
        case "availability":
          queryClient.invalidateQueries({ queryKey: RECEPTION_QUERY_KEYS.doctorsAvailability });
          break;
        case "chat":
          queryClient.invalidateQueries({ queryKey: ["reception", "chat"] });
          break;
        case "notifications":
          queryClient.invalidateQueries({ queryKey: ["notifications"] });
          break;
        default:
          invalidateAll();
      }
    },
    [queryClient, invalidateAll],
  );

  useEffect(() => {
    const token = session?.accessToken;
    if (!token) return;

    const base = getPublicApiUrl();
    const url = `${base}/api/reception/events`;
    let es: EventSource | null = null;
    let retryTimer: ReturnType<typeof setTimeout>;

    const connect = () => {
      es = new EventSource(`${url}?token=${encodeURIComponent(token)}`);

      for (const ch of REALTIME_CHANNELS) {
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

  return { invalidateAll };
}
