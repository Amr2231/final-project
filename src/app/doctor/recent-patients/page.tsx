import dynamic from "next/dynamic";
import { PulseLoader } from "@/components/ui/pulse-loader";

export const metadata = {
  title: "Recent Patients - Doctor Portal",
  description:
    "View and manage your recently seen patients in the Doctor Portal.",
};
const RecentPatientsPage = dynamic(
  () =>
    import("@/features/doctor/components/recent-patients/recent-patients-page").then(
      (m) => m.RecentPatientsPage,
    ),
  { loading: () => <PulseLoader /> },
);

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ page?: string }>;
}) {
  const params = await searchParams;
  return <RecentPatientsPage searchParams={params} />;
}
