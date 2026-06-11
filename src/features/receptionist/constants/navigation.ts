import type { LucideIcon } from "lucide-react";
import {
  Archive,
  BellRing,
  CalendarDays,
  LayoutDashboard,
  ListOrdered,
  MessageSquare,
  Monitor,
  Settings,
  Sparkles,
  UserPlus,
  Users,
} from "lucide-react";

export type ReceptionNavItem = {
  title: string;
  url: string;
  icon: LucideIcon;
  badge?: string;
};

export type ReceptionNavGroup = {
  label: string;
  items: ReceptionNavItem[];
};

export const RECEPTION_NAV_GROUPS: ReceptionNavGroup[] = [
  {
    label: "Overview",
    items: [
      {
        title: "Dashboard",
        url: "/receptionist/dashboard",
        icon: LayoutDashboard,
      },
      {
        title: "Today's Appointments",
        url: "/receptionist/appointments",
        icon: CalendarDays,
      },
    ],
  },
  {
    label: "Operations",
    items: [
      {
        title: "Arrival Board",
        url: "/receptionist/arrival-board",
        icon: Monitor,
      },
      {
        title: "Priority Queue",
        url: "/receptionist/priority-queue",
        icon: ListOrdered,
      },
      {
        title: "Smart Scheduling",
        url: "/receptionist/scheduling",
        icon: Sparkles,
      },
    ],
  },
  {
    label: "Patients",
    items: [
      { title: "Patients", url: "/receptionist/patients", icon: Users },
      {
        title: "Add Patient",
        url: "/receptionist/patients/add",
        icon: UserPlus,
      },
      {
        title: "Historical Data",
        url: "/receptionist/historical-data",
        icon: Archive,
      },
    ],
  },
  {
    label: "Communication",
    items: [
      {
        title: "Internal Chat",
        url: "/receptionist/chat",
        icon: MessageSquare,
        badge: "chat",
      },

      {
        title: "Notifications",
        url: "/receptionist/notifications",
        icon: BellRing,
      },
    ],
  },
  {
    label: "System",
    items: [
      { title: "Settings", url: "/receptionist/settings", icon: Settings },
    ],
  },
];
