'use server'

import { getServerApiClient } from '@/src/shared/libs/axios/axios-server'
import { apiURLs } from '@/src/shared/constants/urls'
import type {
  BuyerOrganizationType,
  TransactionFeeHistoryEntry,
  TransactionFeeView,
} from './transaction-fees.types'

/** Matriz completa plan × tipo de organización × comisión vigente (§6). */
export async function fetchTransactionFees(): Promise<TransactionFeeView[]> {
  const client = await getServerApiClient()
  const response = await client.get<TransactionFeeView[]>(apiURLs.plansAdmin.transactionFees)
  return response.data
}

/** Historial de vigencia de la comisión de un plan (§21). */
export async function fetchTransactionFeeHistory(
  planId: string,
  organizationType?: BuyerOrganizationType,
): Promise<TransactionFeeHistoryEntry[]> {
  const client = await getServerApiClient()
  const response = await client.get<TransactionFeeHistoryEntry[]>(
    apiURLs.plansAdmin.transactionFeeHistory(planId),
    { params: organizationType ? { organizationType } : undefined },
  )
  return response.data
}
