import { apiClient } from "@shared/libs/axios/axios-client";
import { apiURLs } from "@/src/shared/constants/urls";
import { Message } from "../types/chat.types";

export const chatService = {
  async getMessages(chatId: string): Promise<Message[]> {
    const { data } = await apiClient.get<Message[]>(apiURLs.chats.messages(chatId));
    return data;
  },

  async createDirectChat(targetUserId: string): Promise<{ chatId: string }> {
    const { data } = await apiClient.post<{ chatId: string }>(
      apiURLs.chats.direct,
      { targetUserId },
    );
    return data;
  },
};
