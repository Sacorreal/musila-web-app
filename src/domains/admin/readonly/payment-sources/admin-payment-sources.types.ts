import { PaginatedResponse } from '@shared/types/shared.types'

export interface AdminPaymentSourceDto {
  id: string
  user?: { id: string; name: string; lastName: string; email: string }
  brand?: string
  last4?: string
  status: string
  acceptanceTokenAccepted: boolean
  createdAt: string
}

export type PaginatedAdminPaymentSources = PaginatedResponse<AdminPaymentSourceDto>
