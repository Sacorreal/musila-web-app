"use server";

import { getServerApiClient } from "@/src/shared/libs/axios/axios-server";
import { apiURLs } from "@/src/shared/constants/urls";
import type {
  AuthorFinancial,
  AuthorOverview,
  RightsCompliance,
  RightsIntelligence,
  SongDashboard,
} from "../types/dashboard.types";

export async function getAuthorOverviewAction(): Promise<AuthorOverview> {
  const client = await getServerApiClient();
  const response = await client.get<AuthorOverview>(apiURLs.authorDashboard.overview);
  return response.data;
}

export async function getSongDashboardAction(trackId: string): Promise<SongDashboard> {
  const client = await getServerApiClient();
  const response = await client.get<SongDashboard>(apiURLs.authorDashboard.songById(trackId));
  return response.data;
}

export async function getRightsIntelligenceAction(): Promise<RightsIntelligence> {
  const client = await getServerApiClient();
  const response = await client.get<RightsIntelligence>(apiURLs.authorDashboard.rightsIntelligence);
  return response.data;
}

export async function getRightsComplianceAction(): Promise<RightsCompliance> {
  const client = await getServerApiClient();
  const response = await client.get<RightsCompliance>(apiURLs.authorDashboard.rightsCompliance);
  return response.data;
}

export async function getAuthorFinancialAction(): Promise<AuthorFinancial> {
  const client = await getServerApiClient();
  const response = await client.get<AuthorFinancial>(apiURLs.authorDashboard.financial);
  return response.data;
}
