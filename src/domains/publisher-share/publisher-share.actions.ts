'use server';

import { getServerApiClient } from '@/src/shared/libs/axios/axios-server';
import { apiURLs } from '@/src/shared/constants/urls';
import { MyPublisherShareDto, PublisherSharePolicyDto } from './publisher-share.types';

export async function getPublisherSharePolicyAction(
  organizationId: string,
): Promise<PublisherSharePolicyDto> {
  const client = await getServerApiClient();
  const response = await client.get<PublisherSharePolicyDto>(
    apiURLs.publisherShare.policy(organizationId),
  );
  return response.data;
}

export async function getMyPublisherSharesAction(): Promise<MyPublisherShareDto[]> {
  const client = await getServerApiClient();
  const response = await client.get<MyPublisherShareDto[]>(apiURLs.publisherShare.mine());
  return response.data;
}
