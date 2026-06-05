import dynamic from "next/dynamic";
import { PulseLoader } from "@/components/ui/pulse-loader";

export const metadata = {
  title: "Compare Visits - Doctor Portal",
  description:
    "Compare patient visits side by side to track progress and outcomes.",
};
const CompareVisitsPage = dynamic(
  () =>
    import("@/features/doctor/components/compare-visits/compare-visits-page").then(
      (m) => m.CompareVisitsPage,
    ),
  { loading: () => <PulseLoader /> },
);

export default function Page() {
  return <CompareVisitsPage />;
}
