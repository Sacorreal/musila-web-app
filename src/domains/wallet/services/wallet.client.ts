"use client";

import { apiClient } from "@/src/shared/libs/axios/axios-client";
import { apiURLs } from "@/src/shared/constants/urls";
import { BankAccountDto } from "../types/wallet.types";

export async function updateBankAccountAction(data: BankAccountDto): Promise<BankAccountDto> {
  const response = await apiClient.patch<BankAccountDto>(apiURLs.me.bankAccount, data);
  return response.data;
}
