import dynamic from "next/dynamic";
import { PulseLoader } from "@/components/ui/pulse-loader";

const PatientProfilePage = dynamic(
  () =>
    import("@/features/doctor/components/patient-profile/patient-profile-page").then(
      (m) => m.PatientProfilePage,
    ),
  { loading: () => <PulseLoader /> },
);

export default async function Page({
  params,
}: {
  params: Promise<{ nationalId: string }>;
}) {
  const { nationalId } = await params;
  return <PatientProfilePage nationalId={nationalId} />;
}
