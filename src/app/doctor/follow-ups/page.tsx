import dynamic from "next/dynamic";
import { PulseLoader } from "@/components/ui/pulse-loader";

export const metadata = {
  title: "Follow-ups - Doctor Portal",
  description: "Manage and review your patient follow-ups.",
};
const FollowUpsPage = dynamic(
  () =>
    import("@/features/doctor/components/follow-ups/follow-ups-page").then(
      (m) => m.FollowUpsPage,
    ),
  { loading: () => <PulseLoader /> },
);

export default function Page() {
  return <FollowUpsPage />;
}
