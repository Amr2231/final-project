import dynamic from "next/dynamic";
import { PulseLoader } from "@/components/ui/pulse-loader";

export const metadata = {
  title: "Analytics - Doctor Portal",
  description: "View your performance metrics and patient analytics.",
}
const DoctorAnalyticsPage = dynamic(
  () =>
    import("@/features/doctor/components/analytics/doctor-analytics-page").then(
      (m) => m.DoctorAnalyticsPage,
    ),
  { loading: () => <PulseLoader /> },
);

export default function Page() {
  return <DoctorAnalyticsPage />;
}
