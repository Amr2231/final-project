"use client";

import { useStaffRealtime } from "@/hooks/use-staff-realtime";

type StaffRealtimeBridgeProps = {
  scope: "doctor" | "reception" | "admin";
};

/**
 * Keeps SSE subscriptions alive for the whole staff layout so the
 * notification bell and workspace data update on every page — not only
 * on pages that mount useReceptionRealtime manually.
 */
export function StaffRealtimeBridge({ scope }: StaffRealtimeBridgeProps) {
  useStaffRealtime(scope);
  return null;
}
