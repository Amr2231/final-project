import dynamic from "next/dynamic";
import { PulseLoader } from "@/components/ui/pulse-loader";

export const metadata = {
  title: "Radiology - Doctor Portal",
  description:
    "Access and review radiology reports and images for your patients in the Doctor Portal.",
};
const RadiologyPage = dynamic(
  () =>
    import("@/features/doctor/components/radiology/radiology-page").then(
      (m) => m.RadiologyPage,
    ),
  { loading: () => <PulseLoader /> },
);

export default function Page() {
  return <RadiologyPage />;
}
