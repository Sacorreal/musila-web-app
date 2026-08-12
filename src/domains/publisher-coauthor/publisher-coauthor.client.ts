'use client';

import { apiClient } from '@/src/shared/libs/axios/axios-client';
import { apiURLs } from '@/src/shared/constants/urls';
import { PublisherCoauthorPolicyDto, RosterCoauthorDefaultItem } from './publisher-coauthor.types';

export async function updateRosterCoauthorDefaultsAction(
  organizationId: string,
  items: RosterCoauthorDefaultItem[],
): Promise<PublisherCoauthorPolicyDto> {
  const response = await apiClient.put<PublisherCoauthorPolicyDto>(
    apiURLs.publisherCoauthor.roster(organizationId),
    { items },
  );
  return response.data;
}
