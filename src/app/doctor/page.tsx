import { redirect } from "next/navigation";

// default export for the DoctorPage
export default function DoctorPage() {
  redirect("/doctor/dashboard");
}
