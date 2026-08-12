'use server';

import { getServerApiClient } from '@/src/shared/libs/axios/axios-server';
import { apiURLs } from '@/src/shared/constants/urls';
import { PublisherCommissionPolicyDto } from './publisher-commission.types';

export async function getPublisherCommissionPolicyAction(
  organizationId: string,
): Promise<PublisherCommissionPolicyDto> {
  const client = await getServerApiClient();
  const response = await client.get<PublisherCommissionPolicyDto>(
    apiURLs.publisherCommission.policy(organizationId),
  );
  return response.data;
}
