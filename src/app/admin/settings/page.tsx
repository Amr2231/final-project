import { getServerSession } from "next-auth";
import { authOptions } from "@/auth";
import {
  ChangePasswordForm,
  DeleteAccountSection,
  PersonalInfoForm,
  SettingsInfoRow,
  SettingsPageLayout,
  SettingsSectionCard,
} from "@/features/settings";

export default async function AdminSettingsPage() {
  const session = await getServerSession(authOptions);

  return (
    <SettingsPageLayout>
      <SettingsSectionCard title="Personal Information">
        <PersonalInfoForm />
      </SettingsSectionCard>

      <SettingsSectionCard title="Change Password">
        <ChangePasswordForm variant="admin" />
      </SettingsSectionCard>

      <SettingsSectionCard title="Account Information">
        <SettingsInfoRow label="Role" value={session?.user?.role ?? "N/A"} />
        <SettingsInfoRow
          label="Account Status"
          value={session?.user?.account_status ?? "N/A"}
          valueClassName={
            session?.user?.account_status === "Active"
              ? "text-green-600"
              : "text-red-600"
          }
        />
        <SettingsInfoRow
          label="Member Since"
          value={
            session?.user?.created_at
              ? new Date(session.user.created_at).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "long",
                })
              : "N/A"
          }
        />
      </SettingsSectionCard>

      <SettingsSectionCard title="Danger Zone">
        <DeleteAccountSection />
      </SettingsSectionCard>
    </SettingsPageLayout>
  );
}
