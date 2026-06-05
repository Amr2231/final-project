type SettingsSectionCardProps = {
  title: string;
  children: React.ReactNode;
};

export function SettingsSectionCard({
  title,
  children,
}: SettingsSectionCardProps) {
  return (
    <div className="rounded-xl border border-gray-200 bg-white p-6 space-y-5">
      <h2 className="text-lg font-bold text-gray-900">{title}</h2>
      {children}
    </div>
  );
}
