import { SessionManagementPage } from "@/features/admin";

// metadata for sessions page
export const metadata = {
  title: "Sessions | Echo vision",
  description: "View and manage audit logs for your Echo vision account",
};

// Sessions Page
export default function SessionsPage() {
  return <SessionManagementPage />;
}
