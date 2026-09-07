'use server';

import { getServerApiClient } from '@/src/shared/libs/axios/axios-server';
import { apiURLs } from '@/src/shared/constants/urls';
import {
  BankAccountDto,
  PaginatedWalletEarnings,
  PaginatedWalletWithdrawals,
  WalletBalanceDto,
  WalletWithdrawalStatus,
} from '../types/wallet.types';

export async function getPublisherWalletBalanceAction(
  organizationId: string,
): Promise<WalletBalanceDto> {
  const client = await getServerApiClient();
  const response = await client.get<WalletBalanceDto>(apiURLs.publisherWallet.balance(organizationId));
  return response.data;
}

export async function getPublisherWalletEarningsAction(
  organizationId: string,
  limit = 10,
  offset = 0,
): Promise<PaginatedWalletEarnings> {
  const client = await getServerApiClient();
  const response = await client.get<PaginatedWalletEarnings>(
    apiURLs.publisherWallet.earnings(organizationId),
    { params: { limit, offset } },
  );
  return response.data;
}

export async function getPublisherWalletWithdrawalsAction(
  organizationId: string,
  limit = 10,
  offset = 0,
  status?: WalletWithdrawalStatus,
): Promise<PaginatedWalletWithdrawals> {
  const client = await getServerApiClient();
  const response = await client.get<PaginatedWalletWithdrawals>(
    apiURLs.publisherWallet.withdrawals(organizationId),
    { params: { limit, offset, ...(status ? { status } : {}) } },
  );
  return response.data;
}

export async function getPublisherBankAccountAction(
  organizationId: string,
): Promise<BankAccountDto | null> {
  const client = await getServerApiClient();
  const response = await client.get<BankAccountDto | null>(
    apiURLs.publisherWallet.bankAccount(organizationId),
  );
  return response.data;
}
