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

export const metadata = {
  title: "Settings - Doctor Portal",
  description:
    "Manage your account settings, personal information, and security preferences in the Doctor Portal.",
};
export default async function DoctorSettingsPage() {
  const session = await getServerSession(authOptions);

  return (
    <SettingsPageLayout>
      <SettingsSectionCard title="Personal Information">
        <PersonalInfoForm />
      </SettingsSectionCard>

      <SettingsSectionCard title="Change Password">
        <ChangePasswordForm variant="doctor" />
      </SettingsSectionCard>

      <SettingsSectionCard title="Account Information">
        <SettingsInfoRow label="Role" value={session?.user?.role ?? "Doctor"} />
        <SettingsInfoRow
          label="Account Status"
          value={session?.user?.account_status ?? "Active"}
          valueClassName="text-green-600"
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
