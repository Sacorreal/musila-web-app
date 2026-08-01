"use server";

import { getServerApiClient } from "@/src/shared/libs/axios/axios-server";
import { apiURLs } from "@/src/shared/constants/urls";
import {
  AuthorizedRecipient,
  CoauthorSearchResult,
  PaginatedShareAccessLog,
  ShareLinkResponse,
  ValidateAccessResponse,
} from "../types/sharing.types";

export async function createProfileShareLinkAction(expiresInDays?: number): Promise<ShareLinkResponse> {
  const client = await getServerApiClient();
  const response = await client.post<ShareLinkResponse>(apiURLs.sharing.profile, { expiresInDays });
  return response.data;
}

export async function createPlaylistShareLinkAction(
  playlistId: string,
  expiresInDays?: number,
): Promise<ShareLinkResponse> {
  const client = await getServerApiClient();
  const response = await client.post<ShareLinkResponse>(apiURLs.sharing.byPlaylist(playlistId), {
    expiresInDays,
  });
  return response.data;
}

export async function createTrackShareLinkAction(
  trackId: string,
  expiresInDays?: number,
): Promise<ShareLinkResponse> {
  const client = await getServerApiClient();
  const response = await client.post<ShareLinkResponse>(apiURLs.sharing.byTrack(trackId), { expiresInDays });
  return response.data;
}

export async function listMyShareLinksAction(): Promise<ShareLinkResponse[]> {
  const client = await getServerApiClient();
  const response = await client.get<ShareLinkResponse[]>(apiURLs.sharing.mine);
  return response.data;
}

export async function revokeShareLinkAction(shareLinkId: string): Promise<{ message: string }> {
  const client = await getServerApiClient();
  const response = await client.delete<{ message: string }>(apiURLs.sharing.byId(shareLinkId));
  return response.data;
}

export async function authorizeRecipientAction(
  shareLinkId: string,
  musilaCreatorId: string,
): Promise<AuthorizedRecipient> {
  const client = await getServerApiClient();
  const response = await client.post<AuthorizedRecipient>(apiURLs.sharing.recipients(shareLinkId), {
    musilaCreatorId,
  });
  return response.data;
}

export async function listAuthorizedRecipientsAction(shareLinkId: string): Promise<AuthorizedRecipient[]> {
  const client = await getServerApiClient();
  const response = await client.get<AuthorizedRecipient[]>(apiURLs.sharing.recipients(shareLinkId));
  return response.data;
}

export async function revokeRecipientAction(
  shareLinkId: string,
  recipientId: string,
): Promise<{ message: string }> {
  const client = await getServerApiClient();
  const response = await client.delete<{ message: string }>(
    apiURLs.sharing.recipientById(shareLinkId, recipientId),
  );
  return response.data;
}

export async function validateShareAccessAction(token: string): Promise<ValidateAccessResponse | null> {
  const client = await getServerApiClient();
  try {
    const response = await client.get<ValidateAccessResponse>(apiURLs.sharing.validateAccess(token));
    return response.data;
  } catch (error: any) {
    if (error?.response?.status === 401 || error?.response?.status === 403) return null;
    throw error;
  }
}

export async function listShareAccessLogAction(
  shareLinkId: string,
  pagination: { limit?: number; offset?: number } = {},
): Promise<PaginatedShareAccessLog> {
  const client = await getServerApiClient();
  const response = await client.get<PaginatedShareAccessLog>(apiURLs.sharing.accessLog(shareLinkId), {
    params: pagination,
  });
  return response.data;
}

export async function searchUserByCreatorIdAction(
  musilaCreatorId: string,
): Promise<CoauthorSearchResult | null> {
  const client = await getServerApiClient();
  try {
    const response = await client.get<CoauthorSearchResult>(apiURLs.users.byCreatorId(musilaCreatorId));
    return response.data;
  } catch (error: any) {
    if (error?.response?.status === 404) return null;
    throw error;
  }
}
