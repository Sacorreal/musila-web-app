'use client'

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { fetchAdminWithdrawals } from './admin-wallet.actions'
import { payWithdrawal, processWithdrawal, rejectWithdrawal } from './admin-wallet.client'
import type { AdminWalletFilters } from './admin-wallet.types'

export function useAdminWithdrawals(page = 1, limit = 10, filters: AdminWalletFilters = {}) {
  return useQuery({
    queryKey: ['admin', 'wallet', 'withdrawals', page, limit, filters],
    queryFn: () => fetchAdminWithdrawals(page, limit, filters),
  })
}

export function useProcessWithdrawal() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => processWithdrawal(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['admin', 'wallet', 'withdrawals'] })
      toast.success('Solicitud marcada como en proceso')
    },
    onError: (error: any) => toast.error(error?.response?.data?.message ?? 'Error al procesar la solicitud'),
  })
}

export function usePayWithdrawal() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => payWithdrawal(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['admin', 'wallet', 'withdrawals'] })
      toast.success('Retiro marcado como pagado')
    },
    onError: (error: any) => toast.error(error?.response?.data?.message ?? 'Error al pagar el retiro'),
  })
}

export function useRejectWithdrawal() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ id, reason }: { id: string; reason: string }) => rejectWithdrawal(id, reason),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['admin', 'wallet', 'withdrawals'] })
      toast.success('Retiro rechazado')
    },
    onError: (error: any) => toast.error(error?.response?.data?.message ?? 'Error al rechazar el retiro'),
  })
}

export const adminWalletHooks = {
  useAdminWithdrawals,
  useProcessWithdrawal,
  usePayWithdrawal,
  useRejectWithdrawal,
}
