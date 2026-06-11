import dynamic from "next/dynamic";
import { PulseLoader } from "@/components/ui/pulse-loader";

// metadata for radiology page
export const metadata = {
  title: "Radiology | Echo vision",
  description:
    "Access and review radiology reports and images for your patients in the Doctor Portal",
};

// dynamically import the RadiologyPage component with a loading state
const RadiologyPage = dynamic(
  () =>
    import("@/features/doctor/components/radiology/radiology-page").then(
      (m) => m.RadiologyPage,
    ),
  { loading: () => <PulseLoader /> },
);

// default export for the RadiologyPage
export default function Page() {
  return <RadiologyPage />;
}
