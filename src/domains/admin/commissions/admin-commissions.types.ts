import { PaginatedResponse } from '@shared/types/shared.types'
import { AffiliateTier } from '../affiliates/admin-affiliates.types'

export enum AffiliateCommissionType {
  FIRST_PURCHASE = 'first_purchase',
  RECURRING = 'recurring',
}

export enum AffiliateCommissionStatus {
  PENDING = 'pending',
  APPROVED = 'approved',
  PAID = 'paid',
  REJECTED = 'rejected',
}

export interface AdminCommissionDto {
  id: string
  affiliateId: string
  affiliate?: { id: string; name: string; lastName: string; email: string }
  referredUserId: string
  paymentId: string
  externalReference?: string
  commissionType: AffiliateCommissionType
  tier: AffiliateTier
  commissionRate: number
  saleAmount: number
  commissionAmount: number
  currency: string
  status: AffiliateCommissionStatus
  planRole: string
  billingPeriod?: string
  isFirstPurchase: boolean
  approvalDueAt: string
  approvedAt?: string
  paidAt?: string
  rejectedAt?: string
  rejectionReason?: string
  createdAt: string
}

export interface AdminCommissionFilters {
  status?: AffiliateCommissionStatus
  affiliateId?: string
}

export type PaginatedAdminCommissions = PaginatedResponse<AdminCommissionDto>
