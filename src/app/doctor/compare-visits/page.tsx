import dynamic from "next/dynamic";
import { PulseLoader } from "@/components/ui/pulse-loader";

// metadata for compare visits page
export const metadata = {
  title: "Compare Visits | Echo vision",
  description:
    "Compare patient visits side by side to track progress and outcomes",
};

// dynamically import the CompareVisitsPage component with a loading state
const CompareVisitsPage = dynamic(
  () =>
    import("@/features/doctor/components/compare-visits/compare-visits-page").then(
      (m) => m.CompareVisitsPage,
    ),
  { loading: () => <PulseLoader /> },
);

// export the CompareVisitsPage
export default function Page() {
  return <CompareVisitsPage />;
}
