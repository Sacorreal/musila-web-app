'use client'

import { useQuery } from '@tanstack/react-query'
import { fetchAdminPayments } from './admin-payments.actions'
import type { AdminPaymentFilters } from './admin-payments.types'

export function useAdminPayments(page = 1, limit = 10, filters: AdminPaymentFilters = {}) {
  return useQuery({
    queryKey: ['admin', 'payments', page, limit, filters],
    queryFn: () => fetchAdminPayments(page, limit, filters),
  })
}

export const adminPaymentsHooks = { useAdminPayments }
