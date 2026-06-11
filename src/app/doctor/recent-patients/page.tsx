import dynamic from "next/dynamic";
import { PulseLoader } from "@/components/ui/pulse-loader";

// metadata for recent patients page
export const metadata = {
  title: "Recent Patients | Echo vision",
  description:
    "View and manage your recently seen patients in the Doctor Portal",
};

// dynamically import the RecentPatientsPage component with a loading state
const RecentPatientsPage = dynamic(
  () =>
    import("@/features/doctor/components/recent-patients/recent-patients-page").then(
      (m) => m.RecentPatientsPage,
    ),
  { loading: () => <PulseLoader /> },
);

// export the RecentPatientsPage
export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ page?: string }>;
}) {
  // get search params
  const params = await searchParams;
  return <RecentPatientsPage searchParams={params} />;
}
