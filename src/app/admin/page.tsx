import { redirect } from "next/navigation";

// Admin Page Redirect
export default function AdminPage() {
  redirect("/admin/dashboard");
}
