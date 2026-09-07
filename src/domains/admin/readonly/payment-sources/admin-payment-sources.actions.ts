'use server'

import { getServerApiClient } from '@/src/shared/libs/axios/axios-server'
import { apiURLs } from '@/src/shared/constants/urls'
import type { PaginatedAdminPaymentSources } from './admin-payment-sources.types'

export async function fetchAdminPaymentSources(page = 1, limit = 10): Promise<PaginatedAdminPaymentSources> {
  const client = await getServerApiClient()
  const offset = (page - 1) * limit
  const response = await client.get<PaginatedAdminPaymentSources>(apiURLs.paymentsAdmin.paymentSources, {
    params: { limit, offset },
  })
  return response.data
}
