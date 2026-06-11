import dynamic from "next/dynamic";
import { PulseLoader } from "@/components/ui/pulse-loader";

// metadata for ai analysis page
export const metadata = {
  title: "AI Analysis | Echo vision",
  description: "View and manage AI analysis for your Echo vision account",
};

// dynamically import the AiAnalysisForm component with a loading state
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

// export the AiAnalysisPage
export default async function AiAnalysisPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  // get patient id from params
  const { id } = await params;
  return <AiAnalysisForm patientId={id} />;
}
