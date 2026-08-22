'use client';

import { apiClient } from '@/src/shared/libs/axios/axios-client';
import { apiURLs } from '@/src/shared/constants/urls';
import { BankAccountDto } from '../types/wallet.types';

export async function updatePublisherBankAccountAction(
  organizationId: string,
  data: BankAccountDto,
): Promise<BankAccountDto> {
  const response = await apiClient.put<BankAccountDto>(
    apiURLs.publisherWallet.bankAccount(organizationId),
    data,
  );
  return response.data;
}
