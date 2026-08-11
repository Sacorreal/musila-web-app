'use client'

import { apiClient } from '@/src/shared/libs/axios/axios-client'
import { apiURLs } from '@/src/shared/constants/urls'
import type { TransactionFeeView, UpdateTransactionFeeInput } from './transaction-fees.types'

/** Actualiza (versionando) la comisión de un plan para un tipo de organización (§7/§8). */
export async function updateTransactionFee(
  planId: string,
  input: UpdateTransactionFeeInput,
): Promise<TransactionFeeView[]> {
  const response = await apiClient.put<TransactionFeeView[]>(
    apiURLs.plansAdmin.transactionFee(planId),
    input,
  )
  return response.data
}
