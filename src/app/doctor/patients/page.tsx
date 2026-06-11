import { ActivePatientsTable, DoctorPageShell } from "@/features/doctor";

// metadata for patients page
export const metadata = {
  title: "Active Patients | Echo vision",
  description: "View and manage your assigned patients",
};

// patients page
export default function PatientsPage() {
  return (
    <DoctorPageShell
      title="Active Patients"
      description="View and manage your assigned patients"
    >
      {/* active patients table */}
      <ActivePatientsTable />
    </DoctorPageShell>
  );
}
