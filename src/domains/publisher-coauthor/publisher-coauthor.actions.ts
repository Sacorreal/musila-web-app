'use server';

import { getServerApiClient } from '@/src/shared/libs/axios/axios-server';
import { apiURLs } from '@/src/shared/constants/urls';
import { MyPublisherCoauthorDto, PublisherCoauthorPolicyDto } from './publisher-coauthor.types';

export async function getPublisherCoauthorPolicyAction(
  organizationId: string,
): Promise<PublisherCoauthorPolicyDto> {
  const client = await getServerApiClient();
  const response = await client.get<PublisherCoauthorPolicyDto>(
    apiURLs.publisherCoauthor.policy(organizationId),
  );
  return response.data;
}

export async function getMyPublisherCoauthorsAction(): Promise<MyPublisherCoauthorDto[]> {
  const client = await getServerApiClient();
  const response = await client.get<MyPublisherCoauthorDto[]>(apiURLs.publisherCoauthor.mine());
  return response.data;
}
