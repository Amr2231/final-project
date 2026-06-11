import { DoctorPageShell, HistoricalPatientsTable } from "@/features/doctor";

// metadata for historical patients page
export const metadata = {
  title: "Historical Patients | Echo vision",
  description: "View all completed patient records in the Doctor Portal",
};

// historical patients page
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
  // get search params
  const resolved = (await searchParams) ?? {};

  // return historical patients table
  return (
    <DoctorPageShell
      title="Historical Patients"
      description="View all completed patient records"
    >
      {/* historical patients table */}
      <HistoricalPatientsTable searchParams={resolved} />
    </DoctorPageShell>
  );
}
