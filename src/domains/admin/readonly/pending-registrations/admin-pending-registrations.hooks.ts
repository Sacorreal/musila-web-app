'use client'

import { useQuery } from '@tanstack/react-query'
import { fetchAdminPendingRegistrations } from './admin-pending-registrations.actions'

export function useAdminPendingRegistrations(page = 1, limit = 10) {
  return useQuery({
    queryKey: ['admin', 'pending-registrations', page, limit],
    queryFn: () => fetchAdminPendingRegistrations(page, limit),
  })
}

export const adminPendingRegistrationsHooks = { useAdminPendingRegistrations }
