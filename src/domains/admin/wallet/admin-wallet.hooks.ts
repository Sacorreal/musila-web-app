'use client'

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { fetchAdminWithdrawals } from './admin-wallet.actions'
import { payWithdrawal, payWithdrawalsBatch, processWithdrawal, rejectWithdrawal } from './admin-wallet.client'
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

export function usePayWithdrawalsBatch() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (ids: string[]) => payWithdrawalsBatch(ids),
    onSuccess: (result) => {
      qc.invalidateQueries({ queryKey: ['admin', 'wallet', 'withdrawals'] })
      if (result.failed.length === 0) {
        toast.success(`${result.paid.length} retiro(s) marcado(s) como pagados`)
      } else {
        toast.warning(
          `${result.paid.length} pagado(s), ${result.failed.length} no se pudieron marcar (ya estaban en un estado final)`,
        )
      }
    },
    onError: (error: any) => toast.error(error?.response?.data?.message ?? 'Error al pagar los retiros seleccionados'),
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
  usePayWithdrawalsBatch,
  useRejectWithdrawal,
}
