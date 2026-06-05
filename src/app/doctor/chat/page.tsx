import dynamic from "next/dynamic";
import { PulseLoader } from "@/components/ui/pulse-loader";

export const metadata = {
  title: "Chat - Doctor Portal",
  description: "Communicate with your patients and colleagues in real-time.",
};
const ChatPage = dynamic(
  () =>
    import("@/features/doctor/components/chat/chat-page").then(
      (m) => m.ChatPage,
    ),
  { loading: () => <PulseLoader /> },
);

export default function Page() {
  return <ChatPage />;
}
