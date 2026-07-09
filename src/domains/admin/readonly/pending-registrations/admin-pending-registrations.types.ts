import { PaginatedResponse } from '@shared/types/shared.types'

export interface AdminPendingRegistrationDto {
  id: string
  externalReference: string
  role: string
  plan: string
  status: string
  userId?: string
  expiresAt: string
  createdAt: string
}

export type PaginatedAdminPendingRegistrations = PaginatedResponse<AdminPendingRegistrationDto>
