'use client'

import { useQuery } from '@tanstack/react-query'
import { fetchAdminPaymentSources } from './admin-payment-sources.actions'

export function useAdminPaymentSources(page = 1, limit = 10) {
  return useQuery({
    queryKey: ['admin', 'payment-sources', page, limit],
    queryFn: () => fetchAdminPaymentSources(page, limit),
  })
}

export const adminPaymentSourcesHooks = { useAdminPaymentSources }
