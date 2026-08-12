"use server";

import { getServerApiClient } from "@/src/shared/libs/axios/axios-server";
import { apiURLs } from "@/src/shared/constants/urls";
import type {
  PublisherFinancial,
  PublisherOverview,
  PublisherRightsCompliance,
  PublisherRightsIntelligence,
  PublisherSongDashboard,
} from "../types/publisher-dashboard.types";

export async function getPublisherOverviewAction(
  organizationId: string,
): Promise<PublisherOverview> {
  const client = await getServerApiClient();
  const response = await client.get<PublisherOverview>(apiURLs.publisherDashboard.overview(organizationId));
  return response.data;
}

export async function getPublisherSongDashboardAction(
  organizationId: string,
  trackId: string,
): Promise<PublisherSongDashboard> {
  const client = await getServerApiClient();
  const response = await client.get<PublisherSongDashboard>(
    apiURLs.publisherDashboard.songById(organizationId, trackId),
  );
  return response.data;
}

export async function getPublisherRightsIntelligenceAction(
  organizationId: string,
): Promise<PublisherRightsIntelligence> {
  const client = await getServerApiClient();
  const response = await client.get<PublisherRightsIntelligence>(
    apiURLs.publisherDashboard.rightsIntelligence(organizationId),
  );
  return response.data;
}

export async function getPublisherRightsComplianceAction(
  organizationId: string,
): Promise<PublisherRightsCompliance> {
  const client = await getServerApiClient();
  const response = await client.get<PublisherRightsCompliance>(
    apiURLs.publisherDashboard.rightsCompliance(organizationId),
  );
  return response.data;
}

export async function getPublisherFinancialAction(
  organizationId: string,
): Promise<PublisherFinancial> {
  const client = await getServerApiClient();
  const response = await client.get<PublisherFinancial>(apiURLs.publisherDashboard.financial(organizationId));
  return response.data;
}
