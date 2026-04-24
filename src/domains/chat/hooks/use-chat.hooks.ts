import { useQuery } from "@tanstack/react-query";
import { chatService } from "../services/chat.service";
import { chatListService } from "../services/chat-list.service";

export function useChatMessages(chatId: string) {
  return useQuery({
    queryKey: ["chat", chatId, "messages"],
    queryFn: () => chatService.getMessages(chatId),
    enabled: !!chatId,
  });
}

export function useConversations() {
  return useQuery({
    queryKey: ["chat", "conversations"],
    queryFn: () => chatListService.getConversations(),
  });
}
