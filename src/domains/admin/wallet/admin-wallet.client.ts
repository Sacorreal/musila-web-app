'use client'

import { apiClient } from '@/src/shared/libs/axios/axios-client'
import { apiURLs } from '@/src/shared/constants/urls'
import type { AdminWalletWithdrawalDto, PayWithdrawalsBatchResult } from './admin-wallet.types'

export async function processWithdrawal(id: string): Promise<AdminWalletWithdrawalDto> {
  const response = await apiClient.patch<AdminWalletWithdrawalDto>(apiURLs.wallet.admin.process(id))
  return response.data
}

export async function payWithdrawal(id: string): Promise<AdminWalletWithdrawalDto> {
  const response = await apiClient.patch<AdminWalletWithdrawalDto>(apiURLs.wallet.admin.pay(id))
  return response.data
}

export async function payWithdrawalsBatch(ids: string[]): Promise<PayWithdrawalsBatchResult> {
  const response = await apiClient.patch<PayWithdrawalsBatchResult>(apiURLs.wallet.admin.payBatch, { ids })
  return response.data
}

export async function rejectWithdrawal(id: string, reason: string): Promise<AdminWalletWithdrawalDto> {
  const response = await apiClient.patch<AdminWalletWithdrawalDto>(apiURLs.wallet.admin.reject(id), { reason })
  return response.data
}
