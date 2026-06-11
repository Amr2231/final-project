import { PriorityQueuePage } from "@/features/reception-workspace";

// metadata for receptionist priority queue page
export const metadata = {
  title: "Priority Queue | Echo vision",
  description: "View and manage your priority queue in the Receptionist Portal",
};

// receptionist priority queue page
export default function Page() {
  return <PriorityQueuePage />;
}
