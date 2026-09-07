import type { CapabilityDto } from '../authorization/authorization.types'

export type PlanTier = 'FREE' | 'PREMIUM' | 'CUSTOM'
export type SubjectType = 'USER' | 'ORGANIZATION' | 'TRACKSPACE'
export type EntitlementPeriod = 'LIFETIME' | 'MONTH' | 'YEAR' | 'DAY' | 'BILLING_PERIOD' | 'NONE'

export interface EntitlementDto {
  id: string
  key: string
  name: string
  type: 'BOOLEAN' | 'QUOTA' | 'LIMIT' | 'STORAGE' | 'FEATURE' | 'COUNT'
  defaultPeriod: EntitlementPeriod
  scope: 'USER' | 'MEMBERSHIP' | 'ORGANIZATION' | 'TRACKSPACE'
  description?: string | null
}

export interface PlanEntitlementDto {
  id: string
  planId: string
  entitlementId: string
  limit: number | null
  unlimited: boolean
  period: EntitlementPeriod
  entitlement: EntitlementDto
}

export interface PlanCapabilityDto {
  id: string
  planId: string
  capabilityId: string
  capability: CapabilityDto
}

export interface PlanDto {
  id: string
  key: string
  name: string
  description?: string | null
  subjectType: SubjectType
  tier: PlanTier
  isActive: boolean
  planCapabilities: PlanCapabilityDto[]
  planEntitlements: PlanEntitlementDto[]
}

export interface SubscriptionDto {
  id: string
  subjectType: SubjectType
  subjectId: string
  planId: string
  plan: PlanDto
  status: 'ACTIVE' | 'PAST_DUE' | 'CANCELED' | 'EXPIRED'
  startAt: string
  endAt?: string | null
  billingProvider?: string | null
  createdAt: string
}

export interface PaginatedSubscriptions {
  data: SubscriptionDto[]
  total: number
  page: number
  limit: number
}
