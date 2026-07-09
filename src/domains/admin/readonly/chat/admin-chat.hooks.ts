'use client'

import { useQuery } from '@tanstack/react-query'
import { fetchAdminChatMessages, fetchAdminChats } from './admin-chat.actions'

export function useAdminChats(page = 1, limit = 10) {
  return useQuery({
    queryKey: ['admin', 'chats', page, limit],
    queryFn: () => fetchAdminChats(page, limit),
  })
}

export function useAdminChatMessages(chatId: string | null) {
  return useQuery({
    queryKey: ['admin', 'chats', 'messages', chatId],
    queryFn: () => fetchAdminChatMessages(chatId as string),
    enabled: !!chatId,
  })
}

export const adminChatHooks = { useAdminChats, useAdminChatMessages }
