import type { LucideIcon } from "lucide-react";
import {
  Archive,
  BarChart3,
  BellRing,
  Brain,
  LayoutDashboard,
  MessageSquare,
  ScrollText,
  Settings,
  ShieldAlert,
  UserPlus,
  Users,
  Wifi,
} from "lucide-react";

export type AdminNavItem = {
  title: string;
  url: string;
  icon: LucideIcon;
  exact?: boolean;
};

export type AdminNavGroup = {
  label: string;
  items: AdminNavItem[];
};

export const ADMIN_NAV_GROUPS: AdminNavGroup[] = [
  {
    label: "Overview",
    items: [
      { title: "Live Dashboard", url: "/admin/dashboard", icon: LayoutDashboard },
      { title: "Analytics", url: "/admin/analytics", icon: BarChart3 },
    ],
  },
  {
    label: "User Management",
    items: [
      { title: "Users", url: "/admin/users", icon: Users , exact: true },
      { title: "Create User", url: "/admin/users/add", icon: UserPlus },
      { title: "Inactive Accounts", url: "/admin/inactive-accounts", icon: Archive },
    ],
  },
  {
    label: "Security",
    items: [
      { title: "Security Center", url: "/admin/security", icon: ShieldAlert },
      { title: "Session Management", url: "/admin/sessions", icon: Wifi },
      { title: "AI Smart Detection", url: "/admin/ai-detection", icon: Brain },
      { title: "Audit Logs", url: "/admin/audit-logs", icon: ScrollText },
    ],
  },
  {
    label: "Communication",
    items: [
      { title: "Internal Chat", url: "/admin/chat", icon: MessageSquare },
      { title: "Notifications", url: "/admin/notifications", icon: BellRing },
    ],
  },
  {
    label: "System",
    items: [
      { title: "Settings", url: "/admin/settings", icon: Settings },
    ],
  },
];

export const ADMIN_BREADCRUMB_LABELS: Record<string, string> = {
  admin: "Admin",
  dashboard: "Live Dashboard",
  analytics: "Analytics",
  users: "Users",
  add: "Create User",
  "inactive-accounts": "Inactive Accounts",
  security: "Security Center",
  sessions: "Session Management",
  "ai-detection": "AI Smart Detection",
  "audit-logs": "Audit Logs",
  chat: "Internal Chat",
  notifications: "Notifications",
  settings: "Settings",
};
