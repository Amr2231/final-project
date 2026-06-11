import { DoctorPageShell } from "@/features/doctor";
import { NotificationsPageContent } from "@/features/notifications";

// metadata for notifications page
export const metadata = {
  title: "Notifications | Echo vision",
  description:
    "Stay up to date with your patients, reports, and AI analysis in the Doctor Portal",
};

// notifications page
export default function DoctorNotificationsPage() {
  return (
    <DoctorPageShell
      title="Notifications"
      description="Stay up to date with your patients, reports, and AI analysis"
    >
      {/* Notifications content */}
      <NotificationsPageContent role="Doctor" />
    </DoctorPageShell>
  );
}
