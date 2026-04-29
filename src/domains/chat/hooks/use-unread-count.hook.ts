import { useConversations } from "./use-chat.hooks";
import { useMemo } from "react";

/**
 * Devuelve el total de mensajes no leídos sumando todos los unreadCount
 * de las conversaciones activas del usuario.
 */
export function useTotalUnreadCount(): number {
  const { data: conversations } = useConversations();

  return useMemo(() => {
    if (!conversations) return 0;
    return conversations.reduce((acc: number, conv: any) => acc + (conv.unreadCount ?? 0), 0);
  }, [conversations]);
}
