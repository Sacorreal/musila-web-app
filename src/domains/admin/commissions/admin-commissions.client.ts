'use client'

import { apiClient } from '@/src/shared/libs/axios/axios-client'
import { apiURLs } from '@/src/shared/constants/urls'
import type { AdminCommissionDto } from './admin-commissions.types'

export async function payCommission(id: string): Promise<AdminCommissionDto> {
  const response = await apiClient.patch<AdminCommissionDto>(apiURLs.affiliates.admin.commissionPay(id))
  return response.data
}

export async function rejectCommission(id: string, reason: string): Promise<AdminCommissionDto> {
  const response = await apiClient.patch<AdminCommissionDto>(apiURLs.affiliates.admin.commissionReject(id), {
    reason,
  })
  return response.data
}
