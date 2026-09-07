import { PaginatedResponse } from '@shared/types/shared.types'

export interface AdminInviteDto {
  id: string
  token: string
  email?: string
  isUsed: boolean
  expiresAt: string
  createdAt: string
  invitedBy?: { id: string; name: string; lastName: string; email: string }
}

export interface CreateInviteAdminInput {
  email: string
  guestName: string
}

export interface AdminInviteFilters {
  isUsed?: boolean
  email?: string
}

export type PaginatedAdminInvites = PaginatedResponse<AdminInviteDto>
