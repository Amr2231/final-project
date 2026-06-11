import { cn } from "@/lib/utils/tailwind-merge";

type BarChartProps = {
  title: string;
  data: { label: string; value: number }[];
  color?: string;
  className?: string;
};

export function BarChart({
  title,
  data,
  color = "bg-blue-900",
  className,
}: BarChartProps) {
  if (!data.length) return null;
  const max = Math.max(...data.map((d) => d.value), 1);

  return (
    <div
      className={cn(
        "rounded-xl border border-gray-200 bg-white dark:bg-gray-950 dark:border-gray-800 p-4",
        className,
      )}
    >
      <p className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-4">
        {title}
      </p>
      <div className="flex items-end flex-1 gap-3 h-72">
        {data.map((d , i) => (
          <div
            key={`${d.label}-${i}`}
            className="flex-1 flex flex-col items-center gap-1 min-w-0"
          >
            <span className="text-xs text-gray-400 tabular-nums">
              {d.value}
            </span>
            <div
              className={cn("w-full rounded-t transition-all", color)}
              style={{
                height: `${Math.max(4, (d.value / max) * 80)}px`,
              }}
            />
            <span className="text-xs text-gray-400 truncate w-full text-center">
              {d.label}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

type MiniBarProps = {
  label: string;
  value: number;
  max: number;
  color?: string;
};

export function MiniBar({
  label,
  value,
  max,
  color = "bg-blue-900",
}: MiniBarProps) {
  return (
    <div className="flex items-center gap-3">
      <span className="text-xs text-gray-500 w-24 shrink-0 truncate">
        {label}
      </span>
      <div className="flex-1 h-2 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
        <div
          className={cn("h-full rounded-full transition-all", color)}
          style={{ width: `${max > 0 ? (value / max) * 100 : 0}%` }}
        />
      </div>
      <span className="text-xs font-semibold text-gray-700 dark:text-gray-300 tabular-nums w-8 text-right">
        {value}
      </span>
    </div>
  );
}
