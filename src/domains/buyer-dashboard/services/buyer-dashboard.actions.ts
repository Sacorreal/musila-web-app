"use server";

import { getServerApiClient } from "@/src/shared/libs/axios/axios-server";
import { apiURLs } from "@/src/shared/constants/urls";
import type {
  BuyerDashboardLicensesResponse,
  BuyerOverview,
} from "../types/buyer-dashboard.types";

export async function getBuyerOverviewAction(organizationId: string): Promise<BuyerOverview> {
  const client = await getServerApiClient();
  const response = await client.get<BuyerOverview>(apiURLs.buyerDashboard.overview(organizationId));
  return response.data;
}

export async function getBuyerLicensesAction(
  organizationId: string,
  month?: string,
): Promise<BuyerDashboardLicensesResponse> {
  const client = await getServerApiClient();
  const response = await client.get<BuyerDashboardLicensesResponse>(
    apiURLs.buyerDashboard.licenses(organizationId, month),
  );
  return response.data;
}
