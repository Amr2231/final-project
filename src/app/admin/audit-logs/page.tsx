import { AuditLogsTable } from "@/features/admin";

// metadata for audit logs page
export const metadata = {
  title: "Audit Logs | Echo vision",
  description: "View and manage audit logs for your Echo vision account",
};

// Audit Logs Page
export default function AuditLogsPage() {
  return <AuditLogsTable />;
}
