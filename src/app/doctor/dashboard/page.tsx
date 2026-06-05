import dynamic from "next/dynamic";
import { PulseLoader } from "@/components/ui/pulse-loader";

export const metadata = {
  title: "Dashboard - Doctor Portal",
  description: "View your patient overview and recent activity.",
};
// dynamically import the DoctorDashboardPage component with a loading state
const DoctorDashboardPage = dynamic(
  () =>
    import("@/features/doctor/components/dashboard/doctor-dashboard-page").then(
      (m) => m.DoctorDashboardPage,
    ),
  { loading: () => <PulseLoader /> },
);

// doctor dashboard page component
export default function Page() {
  return <DoctorDashboardPage />;
}
