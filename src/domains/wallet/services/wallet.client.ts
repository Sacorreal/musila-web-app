"use client";

import { apiClient } from "@/src/shared/libs/axios/axios-client";
import { apiURLs } from "@/src/shared/constants/urls";
import { BankAccountDto, CreateWithdrawalInput, WalletWithdrawalDto } from "../types/wallet.types";

export async function createWithdrawalAction(data: CreateWithdrawalInput): Promise<WalletWithdrawalDto> {
  const response = await apiClient.post<WalletWithdrawalDto>(apiURLs.wallet.withdrawals, data);
  return response.data;
}

export async function updateBankAccountAction(data: BankAccountDto): Promise<BankAccountDto> {
  const response = await apiClient.patch<BankAccountDto>(apiURLs.me.bankAccount, data);
  return response.data;
}
