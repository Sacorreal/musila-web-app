'use server'

import { getServerApiClient } from '@/src/shared/libs/axios/axios-server'
import { apiURLs } from '@/src/shared/constants/urls'
import type { AdminMessageDto, PaginatedAdminChats } from './admin-chat.types'

export async function fetchAdminChats(page = 1, limit = 10): Promise<PaginatedAdminChats> {
  const client = await getServerApiClient()
  const offset = (page - 1) * limit
  const response = await client.get<PaginatedAdminChats>(apiURLs.chatAdmin.base, { params: { limit, offset } })
  return response.data
}

export async function fetchAdminChatMessages(chatId: string): Promise<AdminMessageDto[]> {
  const client = await getServerApiClient()
  const response = await client.get<AdminMessageDto[]>(apiURLs.chatAdmin.messages(chatId))
  return response.data
}
