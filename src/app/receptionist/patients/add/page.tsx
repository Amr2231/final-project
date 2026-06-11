import { AddPatientForm } from "@/features/receptionist";

// metadata for receptionist add patient page
export const metadata = {
  title: "Add Patient | Echo vision",
  description: "Add a new patient to your Receptionist Portal",
};

// AddPatientPage component
export default function AddPatientPage() {
  return (
    <div className=" p-6 lg:p-8">
      <AddPatientForm />
    </div>
  );
}
