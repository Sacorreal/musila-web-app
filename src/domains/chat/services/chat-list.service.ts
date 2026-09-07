import { apiClient } from "@shared/libs/axios/axios-client";
import { apiURLs } from "@/src/shared/constants/urls";
import { ConversationItem } from "../types/chat.types";

export const chatListService = {
  async getConversations(): Promise<ConversationItem[]> {
    const { data } = await apiClient.get<{ data: ConversationItem[]; total: number }>(
      apiURLs.chats.base,
    );
    return data.data; // El backend devuelve { data: [], total: N }
  }
};
