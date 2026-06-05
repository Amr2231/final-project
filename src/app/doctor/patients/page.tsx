import { ActivePatientsTable, DoctorPageShell } from "@/features/doctor";

export const metadata = {
  title: "Active Patients - Doctor Portal",
  description: "View and manage your assigned patients in the Doctor Portal.",
};
export default function PatientsPage() {
  return (
    <DoctorPageShell
      title="Active Patients"
      description="View and manage your assigned patients"
    >
      <ActivePatientsTable />
    </DoctorPageShell>
  );
}
