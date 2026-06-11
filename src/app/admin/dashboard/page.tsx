import { LiveDashboardPage } from "@/features/admin";

// metadata for dashboard page
export const metadata = {
  title: "Dashboard | Echo vision",
  description: "View and manage your Echo vision account dashboard",
};

// Dashboard Page
export default function DashboardPage() {
  return <LiveDashboardPage />;
}
