"use server";

import { getServerApiClient } from "@/src/shared/libs/axios/axios-server";
import { apiURLs } from "@/src/shared/constants/urls";
import { LegalIdentityDto } from "../types/legal-identity.types";
import { LegalIdentityFormValues } from "../schema/legal-identity.schema";

export async function getMyLegalIdentityAction(): Promise<LegalIdentityDto | null> {
  const client = await getServerApiClient();
  const response = await client.get<LegalIdentityDto | null>(apiURLs.users.legalIdentity);
  return response.data;
}

export async function updateMyLegalIdentityAction(
  data: LegalIdentityFormValues,
): Promise<{ identidadLegalVerificada: boolean }> {
  const client = await getServerApiClient();
  const response = await client.patch(apiURLs.users.legalIdentity, data);
  return response.data;
}
