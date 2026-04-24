import { apiClient } from "@shared/libs/axios/axios-client";
import { Message } from "../types/chat.types";

export const chatService = {
  async getMessages(chatId: string): Promise<Message[]> {
    const { data } = await apiClient.get<Message[]>(`/chats/${chatId}/messages`);
    return data;
  }
};
