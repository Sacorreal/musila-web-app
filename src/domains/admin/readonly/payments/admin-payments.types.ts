import { PaginatedResponse } from '@shared/types/shared.types'

export interface AdminPaymentDto {
  id: string
  user?: { id: string; name: string; lastName: string; email: string }
  provider: string
  wompiTransactionId?: string
  status: string
  amount?: number
  currency: string
  planType: string
  roleType: string
  paymentType: string
  billingPeriod?: string
  externalReference?: string
  createdAt: string
}

export interface AdminPaymentFilters {
  status?: string
  provider?: string
  paymentType?: string
  planType?: string
}

export type PaginatedAdminPayments = PaginatedResponse<AdminPaymentDto>
