'use server'

import { getServerApiClient } from '@/src/shared/libs/axios/axios-server'
import { apiURLs } from '@/src/shared/constants/urls'
import type { EntitlementDto, PaginatedSubscriptions, PlanDto } from './plans.types'

export async function fetchPlans(): Promise<PlanDto[]> {
  const client = await getServerApiClient()
  const response = await client.get<PlanDto[]>(apiURLs.plansAdmin.base)
  return response.data
}

export async function fetchEntitlementsCatalog(): Promise<EntitlementDto[]> {
  const client = await getServerApiClient()
  const response = await client.get<EntitlementDto[]>(apiURLs.plansAdmin.entitlementsCatalog)
  return response.data
}

export async function fetchSubscriptions(params: {
  page?: number
  limit?: number
  subjectType?: string
  subjectId?: string
  status?: string
} = {}): Promise<PaginatedSubscriptions> {
  const client = await getServerApiClient()
  const response = await client.get<PaginatedSubscriptions>(apiURLs.subscriptionsAdmin.base, {
    params,
  })
  return response.data
}
