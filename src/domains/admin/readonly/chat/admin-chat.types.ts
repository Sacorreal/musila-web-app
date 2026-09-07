import { PaginatedResponse } from '@shared/types/shared.types'

export interface AdminChatDto {
  id: string
  request?: {
    id: string
    track?: { id: string; title: string }
    requester?: { id: string; name: string; lastName: string }
    owner?: { id: string; name: string; lastName: string }
  }
  guests?: { id: string; name: string; lastName: string }[]
  createdAt: string
}

export interface AdminMessageDto {
  id: string
  content: string
  isSystem: boolean
  isRead: boolean
  type: string
  fileUrl?: string
  fileName?: string
  sender?: { id: string; name: string; lastName: string }
  createdAt: string
}

export type PaginatedAdminChats = PaginatedResponse<AdminChatDto>
