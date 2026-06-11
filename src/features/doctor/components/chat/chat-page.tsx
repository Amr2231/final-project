"use client";

import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useSession } from "next-auth/react";
import { MessageSquare, Paperclip, Send, UserPlus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { EmptyState } from "@/components/ui/empty-state";
import { cn } from "@/lib/utils/tailwind-merge";
import { formatFullTimestamp } from "@/lib/utils/date-format";
import {
  DoctorLoadingState,
  DoctorPageShell,
  TableToolbar,
} from "../shared/ui";
import {
  useChatInbox,
  useConversation,
  useSendMessage,
} from "../../hooks/use-chat";
import { searchChatUsersAction } from "../../actions/chat.actions";

// types
type ChatPeer = {
  user_id: number;
  name: string;
  role_name: string;
};

// chat page
export function ChatPage() {
  // hooks
  const { data: session } = useSession();
  const [selectedUserId, setSelectedUserId] = useState(0);
  const [selectedPeer, setSelectedPeer] = useState<ChatPeer | null>(null);
  const [search, setSearch] = useState("");
  const [draft, setDraft] = useState("");
  const [showUserPicker, setShowUserPicker] = useState(false);
  const [userSearch, setUserSearch] = useState("");
  const { data: inboxData, isLoading } = useChatInbox();
  const { data: usersData } = useQuery({
    queryKey: ["chat-users", userSearch],
    queryFn: () => searchChatUsersAction(userSearch),
    enabled: showUserPicker,
  });
  // queries & mutations
  const { data: convData } = useConversation(selectedUserId);
  const { mutate: send, isPending } = useSendMessage();

  const inbox = useMemo(() => inboxData?.data ?? [], [inboxData?.data]);
  const messages = convData?.data ?? [];
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

  const selectUser = (peer: ChatPeer) => {
    setSelectedUserId(peer.user_id);
    setSelectedPeer(peer);
  };

  const handleSend = () => {
    if (!draft.trim() || !selectedUserId) return;
    send(
      { receiver_id: selectedUserId, message: draft.trim() },
      { onSuccess: () => setDraft("") },
    );
  };

  if (isLoading) return <DoctorLoadingState />;

  return (
    <DoctorPageShell
      title="Internal Chat"
      description="Secure messaging with staff and radiology"
    >
      <div className="grid grid-cols-1 lg:grid-cols-[320px_1fr] gap-4 h-[calc(100vh-220px)] min-h-125">
        {/* Sidebar */}
        <aside className="rounded-xl border border-gray-200 dark:border-white/10 bg-white dark:bg-gray-950 flex flex-col overflow-hidden">
          <div className="p-3 border-b border-gray-100 dark:border-white/10 flex items-center gap-2">
            <div className="flex-1">
              <TableToolbar
                search={search}
                onSearchChange={setSearch}
                searchPlaceholder="Search conversations..."
              />
            </div>
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="shrink-0 dark:border-white/10 dark:hover:bg-white/5"
              onClick={() => setShowUserPicker((v) => !v)}
            >
              <UserPlus className="w-4 h-4 mr-1" />
              New
            </Button>
          </div>

          {showUserPicker && (
            <div className="p-3 border-b border-gray-100 dark:border-white/10 space-y-2">
              <Input
                value={userSearch}
                onChange={(e) => setUserSearch(e.target.value)}
                placeholder="Search users by name, email, or username..."
              />
              <div className="max-h-40 overflow-y-auto space-y-1">
                {(usersData?.data ?? []).map((user) => (
                  <button
                    key={user.user_id}
                    type="button"
                    className="w-full text-left px-2 py-2 rounded-md hover:bg-gray-50 dark:hover:bg-white/5 text-sm text-gray-700 dark:text-gray-300 transition-colors"
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
                    <span className="block text-xs text-gray-400">
                      {user.role_name} · {user.email}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          )}

          <div className="flex-1 overflow-y-auto">
            {filteredInbox.length === 0 && !search.trim() ? (
              <div className="p-6 flex flex-col items-center justify-center h-full gap-3 text-center">
                <div className="w-12 h-12 rounded-full bg-blue-600/10 flex items-center justify-center">
                  <MessageSquare className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    No conversations yet
                  </p>
                  <p className="text-xs text-gray-400 mt-1">
                    Your chat history will appear here once other staff members
                    message you.
                  </p>
                </div>
              </div>
            ) : filteredInbox.length === 0 ? (
              <div className="p-4">
                <EmptyState
                  icon={MessageSquare}
                  title="No results"
                  description={`No conversations matching "${search}"`}
                />
              </div>
            ) : (
              filteredInbox.map((item) => (
                <button
                  key={item.user_id}
                  type="button"
                  onClick={() =>
                    selectUser({
                      user_id: item.user_id,
                      name: item.name,
                      role_name: item.role_name,
                    })
                  }
                  className={cn(
                    "w-full text-left px-4 py-3 border-b border-gray-50 dark:border-white/5 hover:bg-gray-50 dark:hover:bg-white/5 transition-colors",
                    selectedUserId === item.user_id &&
                      "bg-blue-600/5 border-l-2 border-l-blue-600 dark:bg-blue-600/10",
                  )}
                >
                  <div className="flex items-center justify-between gap-2">
                    <p className="text-sm font-medium text-gray-800 dark:text-gray-100 truncate">
                      {item.name}
                    </p>
                    {item.unread_count > 0 && (
                      <span className="shrink-0 text-[10px] font-bold bg-blue-600 text-white rounded-full px-1.5 py-0.5">
                        {item.unread_count}
                      </span>
                    )}
                  </div>
                  <p className="text-[10px] text-gray-400 uppercase tracking-wide">
                    {item.role_name}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 truncate mt-0.5">
                    {item.last_message}
                  </p>
                </button>
              ))
            )}
          </div>
        </aside>

        {/* Chat section */}
        <section className="rounded-xl border border-gray-200 dark:border-white/10 bg-white dark:bg-gray-950 flex flex-col overflow-hidden">
          {!selectedUserId ? (
            <div className="flex-1 flex items-center justify-center p-8">
              <EmptyState
                icon={MessageSquare}
                title="Select a conversation"
                description="Choose a colleague from the inbox or start a new chat."
              />
            </div>
          ) : (
            <>
              <header className="px-4 py-3 border-b border-gray-100 dark:border-white/10">
                <p className="text-sm font-semibold text-gray-800 dark:text-gray-100">
                  {selected?.name ?? "Conversation"}
                </p>
                <p className="text-xs text-gray-400">
                  {selected?.role_name ?? ""}
                </p>
              </header>

              <div className="flex-1 overflow-y-auto p-4 space-y-3">
                {messages.length === 0 ? (
                  <p className="text-sm text-gray-400 text-center py-8">
                    No messages yet. Say hello to start the conversation.
                  </p>
                ) : (
                  messages.map((msg) => {
                    const isMine = msg.sender_id === currentUserId;
                    return (
                      <div
                        key={msg.message_id}
                        className={cn(
                          "flex",
                          isMine ? "justify-end" : "justify-start",
                        )}
                      >
                        <div
                          className={cn(
                            "max-w-[75%] rounded-2xl px-3 py-2 text-sm",
                            isMine
                              ? "bg-blue-600 text-white rounded-br-sm"
                              : "bg-gray-100 dark:bg-white/10 text-gray-800 dark:text-gray-100 rounded-bl-sm",
                          )}
                        >
                          {!isMine && (
                            <p className="text-[10px] font-medium opacity-70 mb-0.5">
                              {msg.sender_name}
                            </p>
                          )}
                          <p>{msg.message}</p>
                          <p
                            className={cn(
                              "text-[10px] mt-1",
                              isMine ? "text-white/70" : "text-gray-400",
                            )}
                          >
                            {formatFullTimestamp(msg.created_at)}
                          </p>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>

              <footer className="p-3 border-t border-gray-100 dark:border-white/10 flex items-center gap-2">
                <Button
                  variant="ghost"
                  size="icon"
                  className="shrink-0 dark:hover:bg-white/5"
                  disabled
                  title="Attachments UI (backend pending)"
                >
                  <Paperclip className="w-4 h-4" />
                </Button>
                <Input
                  value={draft}
                  onChange={(e) => setDraft(e.target.value)}
                  placeholder="Type a message..."
                  onKeyDown={(e) =>
                    e.key === "Enter" &&
                    !e.shiftKey &&
                    (e.preventDefault(), handleSend())
                  }
                />
                <Button
                  onClick={handleSend}
                  disabled={isPending || !draft.trim()}
                  className="bg-blue-600 hover:bg-blue-700 text-white shrink-0"
                >
                  <Send className="w-4 h-4" />
                </Button>
              </footer>
            </>
          )}
        </section>
      </div>
    </DoctorPageShell>
  );
}
