'use client'

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { fetchAdminCommissions } from './admin-commissions.actions'
import { payCommission, rejectCommission } from './admin-commissions.client'
import type { AdminCommissionFilters } from './admin-commissions.types'

export function useAdminCommissions(page = 1, limit = 10, filters: AdminCommissionFilters = {}) {
  return useQuery({
    queryKey: ['admin', 'commissions', page, limit, filters],
    queryFn: () => fetchAdminCommissions(page, limit, filters),
  })
}

export function usePayCommission() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => payCommission(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['admin', 'commissions'] })
      toast.success('Comisión marcada como pagada')
    },
    onError: (error: any) => toast.error(error?.response?.data?.message ?? 'Error al pagar la comisión'),
  })
}

export function useRejectCommission() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ id, reason }: { id: string; reason: string }) => rejectCommission(id, reason),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['admin', 'commissions'] })
      toast.success('Comisión rechazada')
    },
    onError: (error: any) => toast.error(error?.response?.data?.message ?? 'Error al rechazar la comisión'),
  })
}

export const adminCommissionsHooks = {
  useAdminCommissions,
  usePayCommission,
  useRejectCommission,
}
