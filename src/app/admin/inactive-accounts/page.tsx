import InactiveAccountsPage from "@/features/admin/components/users/inactivated-users-table";

// metadata for inactive accounts page
export const metadata = {
  title: "Inactive Accounts | Echo vision",
  description: "View and manage inactive accounts for your Echo vision account",
};

// Inactive Accounts Page
export default function page() {
  return (
    <div>
      <InactiveAccountsPage />
    </div>
  );
}
