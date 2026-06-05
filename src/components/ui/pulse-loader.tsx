import { cn } from "@/lib/utils/tailwind-merge";

interface PulseLoaderProps {
  className?: string;
}

export function PulseLoader({ className }: PulseLoaderProps) {
  return (
    <div className={cn("flex items-center justify-center", className)}>
      <svg width="64px" height="48px" viewBox="0 0 64 48">
        <polyline
          points="0.157 23.954, 14 23.954, 21.843 48, 43 0, 50 24, 64 24"
          fill="none"
          stroke="#1e40af33"
          strokeWidth="3"
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        <polyline
          points="0.157 23.954, 14 23.954, 21.843 48, 43 0, 50 24, 64 24"
          fill="none"
          stroke="#1e40af"
          strokeWidth="3"
          strokeLinecap="round"
          strokeLinejoin="round"
          style={{
            strokeDasharray: "48, 144",
            strokeDashoffset: 192,
            animation: "pulse-loader 1.4s linear infinite",
          }}
        />
      </svg>
    </div>
  );
}
