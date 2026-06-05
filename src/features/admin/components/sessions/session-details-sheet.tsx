"use client";

import { Clock, Globe, LogOut, Monitor, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import type { ActiveSession } from "@/lib/types/admin-features";
import { formatFullTimestamp } from "@/lib/utils/date-format";
import { RoleBadge } from "../shared";

type SessionDetailsSheetProps = {
  session: ActiveSession | null;
  onClose: () => void;
  onForceLogout: (session: ActiveSession) => void;
};

export function SessionDetailsSheet({
  session,
  onClose,
  onForceLogout,
}: SessionDetailsSheetProps) {
  if (!session) return null;

  const details = [
    { icon: User, label: "Username", value: session.username },
    { icon: Monitor, label: "Role", value: session.role_name },
    { icon: Clock, label: "Last Login", value: session.last_login_at ? formatFullTimestamp(session.last_login_at) : "—" },
    { icon: Clock, label: "Session Expires", value: formatFullTimestamp(session.session_expires_at) },
    { icon: Globe, label: "IP Address", value: session.last_login_ip ?? "Unknown" },
  ];

  return (
    <Sheet open={!!session} onOpenChange={(v) => !v && onClose()}>
      <SheetContent className="sm:max-w-md">
        <SheetHeader>
          <SheetTitle>
            {session.first_name} {session.last_name}
          </SheetTitle>
          <p className="text-sm text-gray-500">{session.email}</p>
        </SheetHeader>

        <div className="mt-6 space-y-4">
          <RoleBadge role={session.role_name} />

          <div className="space-y-3 pt-2">
            {details.map(({ icon: Icon, label, value }) => (
              <div key={label} className="flex items-start gap-3">
                <Icon className="w-4 h-4 text-gray-400 mt-0.5 shrink-0" />
                <div>
                  <p className="text-xs text-gray-500">{label}</p>
                  <p className="text-sm text-gray-800 dark:text-gray-200 font-mono break-all">
                    {value}
                  </p>
                </div>
              </div>
            ))}
          </div>

          <div className="pt-4 border-t border-gray-100 dark:border-gray-800">
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">
              Session Activity
            </p>
            <div className="relative pl-4 border-l-2 border-[#8B1A2B]/30 space-y-4">
              {session.last_login_at && (
                <div className="relative">
                  <span className="absolute -left-[21px] top-1 w-2.5 h-2.5 rounded-full bg-[#8B1A2B]" />
                  <p className="text-xs text-gray-500">Last login</p>
                  <p className="text-sm text-gray-700 dark:text-gray-300">
                    {formatFullTimestamp(session.last_login_at)}
                  </p>
                </div>
              )}
              <div className="relative">
                <span className="absolute -left-[21px] top-1 w-2.5 h-2.5 rounded-full bg-green-500" />
                <p className="text-xs text-gray-500">Session active</p>
                <p className="text-sm text-gray-700 dark:text-gray-300">
                  Expires {formatFullTimestamp(session.session_expires_at)}
                </p>
              </div>
            </div>
          </div>

          <Button
            variant="outline"
            className="w-full text-red-600 border-red-200 hover:bg-red-50 gap-2"
            onClick={() => onForceLogout(session)}
          >
            <LogOut className="w-4 h-4" />
            Force Logout
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
}
