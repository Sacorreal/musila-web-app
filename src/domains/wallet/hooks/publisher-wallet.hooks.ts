'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import {
  getPublisherBankAccountAction,
  getPublisherWalletBalanceAction,
  getPublisherWalletEarningsAction,
  getPublisherWalletWithdrawalsAction,
} from '../services/publisher-wallet.actions';
import { updatePublisherBankAccountAction } from '../services/publisher-wallet.client';
import { BankAccountDto, WalletWithdrawalStatus } from '../types/wallet.types';

const keys = {
  balance: (orgId: string) => ['publisher-wallet', 'balance', orgId] as const,
  earnings: (orgId: string) => ['publisher-wallet', 'earnings', orgId] as const,
  withdrawals: (orgId: string) => ['publisher-wallet', 'withdrawals', orgId] as const,
  bankAccount: (orgId: string) => ['publisher-wallet', 'bank-account', orgId] as const,
};

export function usePublisherWalletBalance(organizationId: string) {
  return useQuery({
    queryKey: keys.balance(organizationId),
    queryFn: () => getPublisherWalletBalanceAction(organizationId),
    enabled: Boolean(organizationId),
  });
}

export function usePublisherWalletEarnings(organizationId: string, limit = 8, offset = 0) {
  return useQuery({
    queryKey: [...keys.earnings(organizationId), limit, offset],
    queryFn: () => getPublisherWalletEarningsAction(organizationId, limit, offset),
    enabled: Boolean(organizationId),
  });
}

export function usePublisherWalletWithdrawals(
  organizationId: string,
  limit = 8,
  offset = 0,
  status?: WalletWithdrawalStatus,
) {
  return useQuery({
    queryKey: [...keys.withdrawals(organizationId), limit, offset, status],
    queryFn: () => getPublisherWalletWithdrawalsAction(organizationId, limit, offset, status),
    enabled: Boolean(organizationId),
  });
}

export function usePublisherBankAccount(organizationId: string) {
  return useQuery({
    queryKey: keys.bankAccount(organizationId),
    queryFn: () => getPublisherBankAccountAction(organizationId),
    enabled: Boolean(organizationId),
  });
}

export function useUpdatePublisherBankAccount(organizationId: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: BankAccountDto) => updatePublisherBankAccountAction(organizationId, data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: keys.bankAccount(organizationId) });
      toast.success('Datos bancarios de la organización actualizados');
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message ?? 'No se pudieron guardar los datos bancarios');
    },
  });
}
