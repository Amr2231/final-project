import { RecordedTable } from "@/features/receptionist";

// metadata for receptionist historical data page
export const metadata = {
  title: "Historical Data | Echo vision",
  description:
    "View and manage your historical data in the Receptionist Portal",
};

// receptionist historical data page
export default function HistoricalDataPage() {
  return <RecordedTable />;
}
