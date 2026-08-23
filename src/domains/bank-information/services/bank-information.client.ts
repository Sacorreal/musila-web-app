"use client";

import { apiClient } from "@/src/shared/libs/axios/axios-client";
import { apiURLs } from "@/src/shared/constants/urls";
import { BankInformationDto } from "../types/bank-information.types";
import { ColombiaBankInformationFormValues, ForeignBankInformationFormValues } from "../bank-information.schema";

export async function saveColombiaBankInformationAction(
  data: ColombiaBankInformationFormValues,
): Promise<BankInformationDto> {
  const response = await apiClient.post<BankInformationDto>(apiURLs.bankInformation.colombia, data);
  return response.data;
}

export async function saveForeignBankInformationAction(
  data: ForeignBankInformationFormValues,
): Promise<BankInformationDto> {
  const response = await apiClient.post<BankInformationDto>(apiURLs.bankInformation.foreign, data);
  return response.data;
}
