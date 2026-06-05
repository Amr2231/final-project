import { PulseLoader } from "@/components/ui/pulse-loader";

export function AdminLoadingState() {
  return (
    <div className="flex items-center justify-center py-20">
      <PulseLoader />
    </div>
  );
}
