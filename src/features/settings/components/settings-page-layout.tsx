type SettingsPageLayoutProps = {
  title?: string;
  description?: string;
  children: React.ReactNode;
};

/** Shared shell for role settings pages (admin, doctor, …) */
export function SettingsPageLayout({
  title = "Settings",
  description = "Manage your account settings and preferences",
  children,
}: SettingsPageLayoutProps) {
  return (
    <div className=" p-6 lg:p-8">
      <div className="max-w-350 mx-auto space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">{title}</h1>
          <p className="text-sm text-gray-500 mt-0.5">{description}</p>
        </div>
        {children}
      </div>
    </div>
  );
}
