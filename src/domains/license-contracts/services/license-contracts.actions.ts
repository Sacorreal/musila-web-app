"use server";

import { getServerApiClient } from "@/src/shared/libs/axios/axios-server";
import { apiURLs } from "@/src/shared/constants/urls";
import {
  LicenseCollectionDto,
  LicenseContractDto,
  UpsertLicenseContractTermsInput,
} from "../types/license-contract.types";

export async function getLicenseContractByRequestedTrackAction(
  requestedTrackId: string,
): Promise<LicenseContractDto | null> {
  const client = await getServerApiClient();
  try {
    const response = await client.get<LicenseContractDto>(
      apiURLs.licenseContracts.byRequestedTrack(requestedTrackId),
    );
    return response.data;
  } catch (error: any) {
    if (error?.response?.status === 404) return null;
    throw error;
  }
}

export async function upsertLicenseContractTermsAction(
  requestedTrackId: string,
  data: UpsertLicenseContractTermsInput,
): Promise<LicenseContractDto> {
  const client = await getServerApiClient();
  const response = await client.post<LicenseContractDto>(
    apiURLs.licenseContracts.byRequestedTrack(requestedTrackId),
    data,
  );
  return response.data;
}

export async function generateLicenseContractPreviewAction(contractId: string): Promise<LicenseContractDto> {
  const client = await getServerApiClient();
  const response = await client.post<LicenseContractDto>(apiURLs.licenseContracts.generatePreview(contractId));
  return response.data;
}

export async function signLicenseContractAction(
  contractId: string,
  signatoryId: string,
): Promise<LicenseContractDto> {
  const client = await getServerApiClient();
  const response = await client.post<LicenseContractDto>(apiURLs.licenseContracts.sign(contractId, signatoryId));
  return response.data;
}

export async function rejectLicenseContractSignatoryAction(
  contractId: string,
  signatoryId: string,
  reason: string,
): Promise<LicenseContractDto> {
  const client = await getServerApiClient();
  const response = await client.post<LicenseContractDto>(
    apiURLs.licenseContracts.reject(contractId, signatoryId),
    { reason },
  );
  return response.data;
}

export async function confirmLicenseRecordingAction(
  contractId: string,
  isrc: string,
): Promise<LicenseContractDto> {
  const client = await getServerApiClient();
  const response = await client.post<LicenseContractDto>(
    apiURLs.licenseContracts.confirmRecording(contractId),
    { isrc },
  );
  return response.data;
}

export async function cancelLicenseContractAction(contractId: string): Promise<void> {
  const client = await getServerApiClient();
  await client.delete(apiURLs.licenseContracts.byId(contractId));
}

export async function getLicenseContractInstallmentsAction(
  contractId: string,
): Promise<LicenseCollectionDto[]> {
  const client = await getServerApiClient();
  const response = await client.get<LicenseCollectionDto[]>(apiURLs.licenseContracts.installments(contractId));
  return response.data;
}
