import dynamic from "next/dynamic";
import { PulseLoader } from "@/components/ui/pulse-loader";

// metadata for watchlist page
export const metadata = {
  title: "Watchlist | Echo vision",
  description:
    "Monitor and manage your patient watchlist for early detection and intervention in the Doctor Portal",
};

// dynamically import the WatchlistPage component with a loading state
const WatchlistPage = dynamic(
  () =>
    import("@/features/doctor/components/watchlist/watchlist-page").then(
      (m) => m.WatchlistPage,
    ),
  { loading: () => <PulseLoader /> },
);

// export the WatchlistPage
export default function Page() {
  return <WatchlistPage />;
}
