"use server";

import * as chatApi from "../api/chat.api";

export async function getChatInboxAction() {
  return chatApi.fetchChatInbox();
}

export async function getChatUnreadAction() {
  return chatApi.fetchChatUnread();
}

export async function getConversationAction(userId: number, page = 1) {
  return chatApi.fetchConversation(userId, page);
}

export async function searchChatUsersAction(query = "") {
  return chatApi.searchChatUsers(query);
}

export async function sendChatMessageAction(payload: {
  receiver_id: number;
  message: string;
}) {
  return chatApi.sendChatMessage(payload);
}
