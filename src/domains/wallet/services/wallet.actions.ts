"use server";

import { getServerApiClient } from "@/src/shared/libs/axios/axios-server";
import { apiURLs } from "@/src/shared/constants/urls";
import {
  BankAccountDto,
  PaginatedWalletEarnings,
  PaginatedWalletWithdrawals,
  WalletBalanceDto,
  WalletEarningRole,
  WalletWithdrawalDto,
  WalletWithdrawalStatus,
} from "../types/wallet.types";

export async function getWalletBalanceAction(): Promise<WalletBalanceDto> {
  const client = await getServerApiClient();
  const response = await client.get<WalletBalanceDto>(apiURLs.wallet.balance);
  return response.data;
}

export async function getWalletEarningsAction(
  limit = 10,
  offset = 0,
  role?: WalletEarningRole,
): Promise<PaginatedWalletEarnings> {
  const client = await getServerApiClient();
  const response = await client.get<PaginatedWalletEarnings>(apiURLs.wallet.earnings, {
    params: { limit, offset, ...(role ? { role } : {}) },
  });
  return response.data;
}

export async function getWalletWithdrawalsAction(
  limit = 10,
  offset = 0,
  status?: WalletWithdrawalStatus,
): Promise<PaginatedWalletWithdrawals> {
  const client = await getServerApiClient();
  const response = await client.get<PaginatedWalletWithdrawals>(apiURLs.wallet.withdrawals, {
    params: { limit, offset, ...(status ? { status } : {}) },
  });
  return response.data;
}

export async function getWalletWithdrawalByIdAction(id: string): Promise<WalletWithdrawalDto> {
  const client = await getServerApiClient();
  const response = await client.get<WalletWithdrawalDto>(apiURLs.wallet.withdrawalById(id));
  return response.data;
}

export async function getBankAccountAction(): Promise<BankAccountDto | null> {
  const client = await getServerApiClient();
  const response = await client.get<BankAccountDto | null>(apiURLs.me.bankAccount);
  return response.data;
}
