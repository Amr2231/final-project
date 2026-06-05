import { ReportForm } from "@/features/doctor";

export default async function ReportPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return <ReportForm patientId={id} />;
}
