"use server";

import { getServerApiClient } from "@/src/shared/libs/axios/axios-server";
import { apiURLs } from "@/src/shared/constants/urls";
import { BankInformationDto, PendingBankInformationStatusDto, TransferOptionsDto } from "../types/bank-information.types";

export async function getPendingBankInformationStatusAction(): Promise<PendingBankInformationStatusDto> {
  const client = await getServerApiClient();
  const response = await client.get<PendingBankInformationStatusDto>(apiURLs.bankInformation.pending);
  return response.data;
}

export async function getTransferOptionsAction(): Promise<TransferOptionsDto> {
  const client = await getServerApiClient();
  const response = await client.get<TransferOptionsDto>(apiURLs.bankInformation.transferOptions);
  return response.data;
}

export async function getMyBankInformationAction(): Promise<BankInformationDto | null> {
  const client = await getServerApiClient();
  const response = await client.get<BankInformationDto | null>(apiURLs.bankInformation.me);
  return response.data;
}
