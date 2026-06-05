import { DoctorPageShell, HistoricalPatientsTable } from "@/features/doctor";

export const metadata = {
  title: "Historical Patients - Doctor Portal",
  description: "View all completed patient records in the Doctor Portal.",
};
export default async function HistoricalPatientsPage({
  searchParams,
}: {
  searchParams?: Promise<{
    page?: string;
    study_type?: string;
    date?: string;
    sort?: string;
  }>;
}) {
  const resolved = (await searchParams) ?? {};

  return (
    <DoctorPageShell
      title="Historical Patients"
      description="View all completed patient records"
    >
      <HistoricalPatientsTable searchParams={resolved} />
    </DoctorPageShell>
  );
}
