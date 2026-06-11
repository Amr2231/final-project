import { UsersTable } from "@/features/admin";

// metadata for users page
export const metadata = {
  title: "Users | Echo vision",
  description: "View and manage users for your Echo vision account",
};

// Users Page
export default function UsersPage() {
  return <UsersTable />;
}
