import {
  LayoutDashboard,
  Users,
  Clock,
  Star,
  GitCompare,
  CalendarCheck,
  Scan,
  MessageSquare,
  BarChart3,
  BellRing,
  Settings,
  Archive,
  History,
} from "lucide-react";

export type DoctorNavItem = {
  title: string;
  url: string;
  icon: typeof LayoutDashboard;
};

export type DoctorNavGroup = {
  label: string;
  items: DoctorNavItem[];
};

export const DOCTOR_NAV_GROUPS: DoctorNavGroup[] = [
  {
    label: "Overview",
    items: [
      { title: "Dashboard", url: "/doctor/dashboard", icon: LayoutDashboard },
      { title: "Analytics", url: "/doctor/analytics", icon: BarChart3 },
      { title: "Today's Schedule", url: "/doctor/schedule", icon: CalendarCheck },
    ],
  },
  {
    label: "Patients",
    items: [
      { title: "Active Patients", url: "/doctor/patients", icon: Users },
      { title: "Recent Patients", url: "/doctor/recent-patients", icon: History },
      { title: "Historical Patients", url: "/doctor/historical-patients", icon: Archive },
      { title: "Watchlist", url: "/doctor/watchlist", icon: Star },
    ],
  },
  {
    label: "Clinical",
    items: [
      { title: "Follow-Ups", url: "/doctor/follow-ups", icon: Clock },
      { title: "Compare Visits", url: "/doctor/compare-visits", icon: GitCompare },
    ],
  },
  {
    label: "Radiology",
    items: [
      { title: "Studies", url: "/doctor/radiology", icon: Scan },
    ],
  },
  {
    label: "Communication",
    items: [
      { title: "Internal Chat", url: "/doctor/chat", icon: MessageSquare },
      { title: "Notifications", url: "/doctor/notifications", icon: BellRing },
    ],
  },
  {
    label: "System",
    items: [{ title: "Settings", url: "/doctor/settings", icon: Settings }],
  },
];

export const DOCTOR_BREADCRUMB_LABELS: Record<string, string> = {
  doctor: "Doctor",
  dashboard: "Dashboard",
  analytics: "Analytics",
  schedule: "Schedule",
  patients: "Patients",
  "recent-patients": "Recent Patients",
  "historical-patients": "Historical Patients",
  watchlist: "Watchlist",
  "follow-ups": "Follow-Ups",
  "compare-visits": "Compare Visits",
  radiology: "Radiology",
  chat: "Chat",
  notifications: "Notifications",
  settings: "Settings",
  profile: "Patient Profile",
  report: "Report",
  "ai-analysis": "AI Analysis",
};
