'use client'

import { apiClient } from '@/src/shared/libs/axios/axios-client'
import { apiURLs } from '@/src/shared/constants/urls'
import type { EntitlementPeriod, PlanDto, PlanEntitlementDto, SubscriptionDto } from './plans.types'

export async function updatePlan(
  planId: string,
  input: { name?: string; description?: string; isActive?: boolean },
): Promise<PlanDto> {
  const response = await apiClient.patch<PlanDto>(apiURLs.plansAdmin.byId(planId), input)
  return response.data
}

export async function upsertPlanEntitlement(
  planId: string,
  entitlementId: string,
  input: { limit: number | null; unlimited: boolean; period: EntitlementPeriod },
): Promise<PlanEntitlementDto> {
  const response = await apiClient.put<PlanEntitlementDto>(
    apiURLs.plansAdmin.entitlement(planId, entitlementId),
    input,
  )
  return response.data
}

export async function setPlanCapabilities(
  planId: string,
  capabilityIds: string[],
): Promise<PlanDto> {
  const response = await apiClient.put<PlanDto>(apiURLs.plansAdmin.capabilities(planId), {
    capabilityIds,
  })
  return response.data
}

export async function updateSubscription(
  id: string,
  input: { planId?: string; status?: string; endAt?: string | null },
): Promise<SubscriptionDto> {
  const response = await apiClient.patch<SubscriptionDto>(apiURLs.subscriptionsAdmin.byId(id), input)
  return response.data
}
