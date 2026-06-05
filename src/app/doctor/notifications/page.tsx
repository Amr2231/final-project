import { DoctorPageShell } from "@/features/doctor";
import { NotificationsPageContent } from "@/features/notifications";

export const metadata = {
  title: "Notifications - Doctor Portal",
  description:
    "Stay up to date with your patients, reports, and AI analysis in the Doctor Portal.",
};
export default function DoctorNotificationsPage() {
  return (
    <DoctorPageShell
      title="Notifications"
      description="Stay up to date with your patients, reports, and AI analysis"
    >
      <NotificationsPageContent role="Doctor" />
    </DoctorPageShell>
  );
}
