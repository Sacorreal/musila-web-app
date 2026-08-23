"use server";

import { getServerApiClient } from "@/src/shared/libs/axios/axios-server";
import { apiURLs } from "@/src/shared/constants/urls";
import type { CatalogHealthScore, TrackHealthScore } from "../types/editorial-command-center.types";

export async function getMyCatalogHealthScoreAction(): Promise<CatalogHealthScore> {
  const client = await getServerApiClient();
  const response = await client.get<CatalogHealthScore>(apiURLs.editorialCommandCenter.overview);
  return response.data;
}

export async function getMyTrackHealthScoreAction(trackId: string): Promise<TrackHealthScore> {
  const client = await getServerApiClient();
  const response = await client.get<TrackHealthScore>(apiURLs.editorialCommandCenter.trackById(trackId));
  return response.data;
}

export async function getOrganizationCatalogHealthScoreAction(
  organizationId: string,
): Promise<CatalogHealthScore> {
  const client = await getServerApiClient();
  const response = await client.get<CatalogHealthScore>(
    apiURLs.editorialCommandCenter.organizationOverview(organizationId),
  );
  return response.data;
}

export async function getOrganizationTrackHealthScoreAction(
  organizationId: string,
  trackId: string,
): Promise<TrackHealthScore> {
  const client = await getServerApiClient();
  const response = await client.get<TrackHealthScore>(
    apiURLs.editorialCommandCenter.organizationTrackById(organizationId, trackId),
  );
  return response.data;
}
