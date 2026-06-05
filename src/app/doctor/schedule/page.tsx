import dynamic from "next/dynamic";
import { PulseLoader } from "@/components/ui/pulse-loader";

export const metadata = {
  title: "Schedule - Doctor Portal",
  description:
    "View and manage your upcoming appointments and schedule in the Doctor Portal.",
};
const SchedulePage = dynamic(
  () =>
    import("@/features/doctor/components/schedule/schedule-page").then(
      (m) => m.SchedulePage,
    ),
  { loading: () => <PulseLoader /> },
);

export default function Page() {
  return <SchedulePage />;
}
