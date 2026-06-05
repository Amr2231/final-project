import { NotificationsPageContent } from "@/features/notifications";

export default function ReceptionistNotificationsPage() {
  return (
    <div className="min-h-screen bg-gray-50/50 dark:bg-gray-950/50 p-6 lg:p-8">
      <div className="max-w-2xl mx-auto space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
            Notifications
          </h1>
          <p className="text-sm text-gray-500 mt-0.5">
            Patient and system activity updates
          </p>
        </div>
        <NotificationsPageContent role="Receptionist" />
      </div>
    </div>
  );
}
