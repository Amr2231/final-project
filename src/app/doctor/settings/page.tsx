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

// metadata for settings page
export const metadata = {
  title: "Settings | Echo vision",
  description:
    "Manage your account settings, personal information, and security preferences in the Doctor Portal",
};

// settings page 
export default async function DoctorSettingsPage() {
  // get session data
  const session = await getServerSession(authOptions);

  return (
    // settings page layout
    <SettingsPageLayout>
      {/* settings section card */}
      <SettingsSectionCard title="Personal Information">
        {/* personal info form */}
        <PersonalInfoForm />
      </SettingsSectionCard>

      {/* settings section card */}
      <SettingsSectionCard title="Change Password">
        {/* change password form */}
        <ChangePasswordForm variant="doctor" />
      </SettingsSectionCard>

      {/* settings section card */}
      <SettingsSectionCard title="Account Information">
        {/* settings label row */}
        <SettingsInfoRow label="Role" value={session?.user?.role ?? "Doctor"} />
        {/* settings status row */}
        <SettingsInfoRow
          label="Account Status"
          value={session?.user?.account_status ?? "Active"}
          valueClassName="text-green-600"
        />
        {/* settings date row */}
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

      {/* settings section card */}
      <SettingsSectionCard title="Danger Zone">
        {/* delete account section */}
        <DeleteAccountSection />
      </SettingsSectionCard>
    </SettingsPageLayout>
  );
}
