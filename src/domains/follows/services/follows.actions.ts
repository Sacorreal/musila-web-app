"use server";

import { getServerApiClient } from "@/src/shared/libs/axios/axios-server";
import { apiURLs } from "@/src/shared/constants/urls";

export async function followArtistAction(userId: string): Promise<void> {
  const client = await getServerApiClient();
  await client.post(apiURLs.follows.byUserId(userId));
}

export async function unfollowArtistAction(userId: string): Promise<void> {
  const client = await getServerApiClient();
  await client.delete(apiURLs.follows.byUserId(userId));
}
