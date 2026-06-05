import dynamic from "next/dynamic";
import { PulseLoader } from "@/components/ui/pulse-loader";

export const metadata = {
  title: "Watchlist - Doctor Portal",
  description:
    "Monitor and manage your patient watchlist for early detection and intervention in the Doctor Portal.",
};
const WatchlistPage = dynamic(
  () =>
    import("@/features/doctor/components/watchlist/watchlist-page").then(
      (m) => m.WatchlistPage,
    ),
  { loading: () => <PulseLoader /> },
);

export default function Page() {
  return <WatchlistPage />;
}
