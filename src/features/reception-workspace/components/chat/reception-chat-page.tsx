"use client";

import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useSession } from "next-auth/react";
import { MessageSquare, Paperclip, Send, UserPlus, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { EmptyState } from "@/components/ui/empty-state";
import { cn } from "@/lib/utils/tailwind-merge";
import { formatFullTimestamp } from "@/lib/utils/date-format";
import { ReceptionPageShell } from "../shared/reception-page-shell";
import { TableToolbar, ReceptionLoadingState } from "../shared/ui";
import {
  useChatInbox,
  useChatConversation,
  useSendChatMessage,
  usePatientChatThreads,
  useChatTyping,
} from "../../hooks/use-reception";
import { searchChatUsers } from "../../actions/reception.actions";

type ChatPeer = {
  user_id: number;
  name: string;
  role_name: string;
};

export function ReceptionChatPage() {
  const { data: session } = useSession();
  const [tab, setTab] = useState<"direct" | "patient">("direct");
  const [selectedUserId, setSelectedUserId] = useState(0);
  const [selectedPeer, setSelectedPeer] = useState<ChatPeer | null>(null);
  const [patientContext, setPatientContext] = useState<string | undefined>();
  const [search, setSearch] = useState("");
  const [draft, setDraft] = useState("");
  const [showUserPicker, setShowUserPicker] = useState(false);
  const [userSearch, setUserSearch] = useState("");

  const { data: inbox = [], isLoading } = useChatInbox();
  const { data: patientThreads = [] } = usePatientChatThreads();
  const { data: messages = [] } = useChatConversation(
    selectedUserId,
    patientContext,
  );
  const { mutate: send, isPending } = useSendChatMessage();
  const { mutate: setTyping } = useChatTyping();
  const { data: usersData } = useQuery({
    queryKey: ["reception", "chat-users", userSearch],
    queryFn: () => searchChatUsers(userSearch),
    enabled: showUserPicker,
  });

  const currentUserId = Number(session?.user?.id ?? 0);

  const filteredInbox = useMemo(() => {
    if (!search.trim()) return inbox;
    const q = search.toLowerCase();
    return inbox.filter(
      (c) =>
        c.name.toLowerCase().includes(q) ||
        c.role_name.toLowerCase().includes(q) ||
        c.last_message.toLowerCase().includes(q),
    );
  }, [inbox, search]);

  const selected =
    inbox.find((c) => c.user_id === selectedUserId) ??
    (selectedPeer?.user_id === selectedUserId ? selectedPeer : null);

  const selectUser = (peer: ChatPeer, patientId?: string) => {
    setSelectedUserId(peer.user_id);
    setSelectedPeer(peer);
    setPatientContext(patientId);
  };

  const handleSend = () => {
    if (!draft.trim() || !selectedUserId) return;
    send(
      {
        receiver_id: selectedUserId,
        message: draft.trim(),
        patient_id: patientContext,
      },
      { onSuccess: () => setDraft("") },
    );
  };

  const handleDraftChange = (v: string) => {
    setDraft(v);
    if (selectedUserId) setTyping(selectedUserId);
  };

  if (isLoading) return <ReceptionLoadingState />;

  return (
    <ReceptionPageShell
      title="Internal Chat"
      description="Secure staff messaging with patient context threads"
    >
      <div className="grid grid-cols-1 lg:grid-cols-[320px_1fr] gap-4 h-[calc(100vh-220px)] min-h-125">
        <aside className="rounded-xl border bg-card flex flex-col overflow-hidden">
          {/* Tabs */}
          <div className="flex border-b">
            <button
              type="button"
              onClick={() => setTab("direct")}
              className={cn(
                "flex-1 py-2.5 text-sm font-medium transition-colors",
                tab === "direct"
                  ? "text-blue-700 border-b-2 border-blue-600 bg-blue-50/50"
                  : "text-muted-foreground hover:text-foreground hover:bg-muted/40",
              )}
            >
              Direct
            </button>
          </div>

          {tab === "direct" ? (
            <>
              {/* Search + New */}
              <div className="p-3 border-b flex items-center gap-2">
                <div className="flex-1">
                  <TableToolbar
                    search={search}
                    onSearchChange={setSearch}
                    searchPlaceholder="Search..."
                  />
                </div>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  className="shrink-0"
                  onClick={() => setShowUserPicker((v) => !v)}
                >
                  <UserPlus className="w-4 h-4 mr-1" />
                  New
                </Button>
              </div>

              {/* User picker */}
              {showUserPicker && (
                <div className="p-3 border-b space-y-2 bg-muted/30">
                  <Input
                    value={userSearch}
                    onChange={(e) => setUserSearch(e.target.value)}
                    placeholder="Search by name, email, or username..."
                  />
                  <div className="max-h-40 overflow-y-auto space-y-0.5">
                    {(usersData?.data ?? []).map((user) => (
                      <button
                        key={user.user_id}
                        type="button"
                        className="w-full text-left px-3 py-2 rounded-md hover:bg-blue-50 hover:text-blue-800 text-sm transition-colors"
                        onClick={() => {
                          selectUser({
                            user_id: user.user_id,
                            name: `${user.first_name} ${user.last_name}`,
                            role_name: user.role_name,
                          });
                          setShowUserPicker(false);
                          setUserSearch("");
                        }}
                      >
                        <span className="font-medium">
                          {user.first_name} {user.last_name}
                        </span>
                        <span className="block text-xs text-muted-foreground">
                          {user.role_name} · {user.email}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Inbox list */}
              <div className="flex-1 overflow-y-auto">
                {filteredInbox.length === 0 ? (
                  <EmptyState
                    icon={MessageSquare}
                    title="No conversations"
                    description="Search for a staff member to start chatting"
                  />
                ) : (
                  filteredInbox.map((item) => (
                    <button
                      key={item.user_id}
                      type="button"
                      onClick={() =>
                        selectUser(
                          {
                            user_id: item.user_id,
                            name: item.name,
                            role_name: item.role_name,
                          },
                          item.patient_id ?? undefined,
                        )
                      }
                      className={cn(
                        "w-full text-left px-4 py-3 border-b transition-colors hover:bg-muted/40",
                        selectedUserId === item.user_id
                          ? "bg-blue-50 border-l-2 border-l-blue-600"
                          : "border-l-2 border-l-transparent",
                      )}
                    >
                      <div className="flex items-center justify-between gap-2 mb-0.5">
                        <p className="text-sm font-medium truncate">
                          {item.name}
                        </p>
                        <div className="flex items-center gap-1.5 shrink-0">
                          {item.is_online && (
                            <span
                              className="h-2 w-2 rounded-full bg-green-500"
                              title="Online"
                            />
                          )}
                          {item.unread_count > 0 && (
                            <span className="min-w-[18px] text-center text-[10px] font-bold bg-blue-600 text-white rounded-full px-1.5 py-0.5">
                              {item.unread_count}
                            </span>
                          )}
                        </div>
                      </div>
                      <p className="text-[10px] font-medium text-blue-600 uppercase tracking-wide mb-0.5">
                        {item.role_name}
                      </p>
                      <p className="text-xs text-muted-foreground truncate">
                        {item.last_message}
                      </p>
                    </button>
                  ))
                )}
              </div>
            </>
          ) : (
            <div className="flex-1 overflow-y-auto p-2">
              {patientThreads.length === 0 ? (
                <EmptyState
                  icon={Users}
                  title="No patient threads"
                  description="Messages tagged with patient context appear here"
                />
              ) : (
                patientThreads.map((t) => (
                  <button
                    key={`${t.patient_id}-${t.appointment_id}`}
                    type="button"
                    onClick={() => setPatientContext(t.patient_id)}
                    className={cn(
                      "w-full text-left p-3 rounded-lg border mb-2 transition-colors hover:bg-blue-50",
                      patientContext === t.patient_id &&
                        "border-blue-300 bg-blue-50",
                    )}
                  >
                    <p className="text-sm font-medium">
                      Patient #{t.patient_id.slice(-4)}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {t.patient_name}
                    </p>
                    <p className="text-[10px] text-muted-foreground mt-1">
                      {t.message_count} messages ·{" "}
                      {t.unread_count > 0 && (
                        <span className="text-blue-600 font-medium">
                          {t.unread_count} unread
                        </span>
                      )}
                    </p>
                  </button>
                ))
              )}
            </div>
          )}
        </aside>

        <section className="rounded-xl border bg-card flex flex-col overflow-hidden">
          {!selectedUserId ? (
            <div className="flex-1 flex items-center justify-center">
              <EmptyState
                icon={MessageSquare}
                title="Select a conversation"
                description="Choose a staff member from the inbox"
              />
            </div>
          ) : (
            <>
              <div className="p-4 border-b">
                <p className="font-semibold">
                  {selected?.name ?? "Conversation"}
                </p>
                <p className="text-xs text-muted-foreground">
                  {selected?.role_name ?? ""}
                </p>
                {patientContext && (
                  <p className="text-xs text-[#8B1A2B] mt-1">
                    Patient context: #{patientContext.slice(-4)}
                  </p>
                )}
              </div>
              <div className="flex-1 overflow-y-auto p-4 space-y-3">
                {messages.length === 0 ? (
                  <p className="text-sm text-muted-foreground text-center py-8">
                    No messages yet. Start the conversation below.
                  </p>
                ) : (
                  messages.map((m) => (
                    <div
                      key={m.message_id}
                      className={cn(
                        "max-w-[80%] rounded-xl px-3 py-2 text-sm",
                        m.sender_id === currentUserId
                          ? "ml-auto bg-[#8B1A2B] text-white"
                          : "bg-muted",
                      )}
                    >
                      <p>{m.message}</p>
                      <div
                        className={cn(
                          "flex items-center gap-2 mt-1 text-[10px]",
                          m.sender_id === currentUserId
                            ? "text-white/70"
                            : "text-muted-foreground",
                        )}
                      >
                        <span>{formatFullTimestamp(m.created_at)}</span>
                        {m.sender_id === currentUserId && m.is_read ? (
                          <span>
                            Read
                            {m.read_at
                              ? ` · ${formatFullTimestamp(m.read_at)}`
                              : ""}
                          </span>
                        ) : null}
                      </div>
                      {m.attachment_path && (
                        <a
                          href={m.attachment_path}
                          className="flex items-center gap-1 text-xs underline mt-1"
                        >
                          <Paperclip className="w-3 h-3" /> Attachment
                        </a>
                      )}
                    </div>
                  ))
                )}
              </div>
              <div className="p-3 border-t flex gap-2">
                <Input
                  value={draft}
                  onChange={(e) => handleDraftChange(e.target.value)}
                  placeholder="Type a message..."
                  onKeyDown={(e) =>
                    e.key === "Enter" && !e.shiftKey && handleSend()
                  }
                />
                <Button
                  onClick={handleSend}
                  disabled={isPending || !draft.trim()}
                >
                  <Send className="w-4 h-4" />
                </Button>
              </div>
            </>
          )}
        </section>
      </div>
    </ReceptionPageShell>
  );
}
