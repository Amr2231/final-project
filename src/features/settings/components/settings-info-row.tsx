type SettingsInfoRowProps = {
  label: string;
  value: string;
  valueClassName?: string;
};

export function SettingsInfoRow({
  label,
  value,
  valueClassName,
}: SettingsInfoRowProps) {
  return (
    <div className="flex items-center justify-between py-3 border-b border-gray-100 last:border-0">
      <span className="text-sm text-blue-700 dark:text-blue-400">{label}</span>
      <span
        className={`text-sm font-semibold text-gray-900 dark:text-gray-100 ${valueClassName ?? ""}`}
      >
        {value}
      </span>
    </div>
  );
}
