'use client';

import { apiClient } from '@/src/shared/libs/axios/axios-client';
import { apiURLs } from '@/src/shared/constants/urls';
import { PublisherShareItem, PublisherSharePolicyDto } from './publisher-share.types';

export async function updatePublisherSharesAction(
  organizationId: string,
  items: PublisherShareItem[],
): Promise<PublisherSharePolicyDto> {
  const response = await apiClient.put<PublisherSharePolicyDto>(
    apiURLs.publisherShare.roster(organizationId),
    { items },
  );
  return response.data;
}
