type SettingsSectionCardProps = {
  title: string;
  children: React.ReactNode;
};

export function SettingsSectionCard({
  title,
  children,
}: SettingsSectionCardProps) {
  return (
    <div className="rounded-2xl border border-gray-200 dark:border-gray-700  dark:bg-gray-900 overflow-hidden p-6 space-y-5">
      <h2 className="text-lg font-bold text-gray-900 dark:text-gray-100">{title}</h2>
      {children}
    </div>
  );
}
