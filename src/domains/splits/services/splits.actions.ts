"use server";

import { getServerApiClient } from "@/src/shared/libs/axios/axios-server";
import { apiURLs } from "@/src/shared/constants/urls";
import { CoauthorSearchResult, CreateSplitInput, SplitResponse } from "../types/splits.types";

export async function getSplitByTrackAction(trackId: string): Promise<SplitResponse | null> {
  const client = await getServerApiClient();
  try {
    const response = await client.get<SplitResponse>(apiURLs.splits.byTrack(trackId));
    return response.data;
  } catch (error: any) {
    if (error?.response?.status === 404) return null;
    throw error;
  }
}

export async function createSplitAction(trackId: string, data: CreateSplitInput): Promise<SplitResponse> {
  const client = await getServerApiClient();
  const response = await client.post<SplitResponse>(apiURLs.splits.byTrack(trackId), data);
  return response.data;
}

export async function updateSplitAction(splitId: string, data: CreateSplitInput): Promise<SplitResponse> {
  const client = await getServerApiClient();
  const response = await client.put<SplitResponse>(apiURLs.splits.byId(splitId), data);
  return response.data;
}

export async function approveSplitAction(splitId: string): Promise<SplitResponse> {
  const client = await getServerApiClient();
  const response = await client.post<SplitResponse>(apiURLs.splits.approve(splitId));
  return response.data;
}

export async function rejectSplitAction(splitId: string, reason: string): Promise<SplitResponse> {
  const client = await getServerApiClient();
  const response = await client.post<SplitResponse>(apiURLs.splits.reject(splitId), { reason });
  return response.data;
}

export async function searchCoauthorByCreatorIdAction(
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
