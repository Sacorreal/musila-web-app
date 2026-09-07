'use client'

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { fetchTransactionFeeHistory, fetchTransactionFees } from './transaction-fees.actions'
import { updateTransactionFee } from './transaction-fees.client'
import type { BuyerOrganizationType, UpdateTransactionFeeInput } from './transaction-fees.types'

export function useTransactionFees() {
  return useQuery({
    queryKey: ['admin', 'transaction-fees'],
    queryFn: () => fetchTransactionFees(),
  })
}

export function useTransactionFeeHistory(
  planId: string | null,
  organizationType?: BuyerOrganizationType,
) {
  return useQuery({
    queryKey: ['admin', 'transaction-fee-history', planId, organizationType ?? 'all'],
    queryFn: () => fetchTransactionFeeHistory(planId as string, organizationType),
    enabled: !!planId,
  })
}

export function useUpdateTransactionFee() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ planId, input }: { planId: string; input: UpdateTransactionFeeInput }) =>
      updateTransactionFee(planId, input),
    onSuccess: (_data, { planId }) => {
      qc.invalidateQueries({ queryKey: ['admin', 'transaction-fees'] })
      qc.invalidateQueries({ queryKey: ['admin', 'transaction-fee-history', planId] })
      toast.success('Comisión actualizada. Aplica solo a nuevas operaciones.')
    },
    onError: (error: any) =>
      toast.error(error?.response?.data?.message ?? 'Error al actualizar la comisión'),
  })
}

export const adminTransactionFeesHooks = {
  useTransactionFees,
  useTransactionFeeHistory,
  useUpdateTransactionFee,
}
