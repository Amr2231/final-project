import dynamic from "next/dynamic";
import { PulseLoader } from "@/components/ui/pulse-loader";

/** Lazy-load DICOM / AI UI to reduce initial bundle on report list navigation */
const AiAnalysisForm = dynamic(
  () =>
    import("@/features/doctor/components/ai-analysis/ai-analysis-form").then(
      (module) => ({
        default: module.AiAnalysisForm,
      }),
    ),
  {
    loading: () => (
      <div className="flex justify-center py-20">
        <PulseLoader />
      </div>
    ),
  },
);

export default async function AiAnalysisPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return <AiAnalysisForm patientId={id} />;
}
