"use client";

import { useQuery } from "@tanstack/react-query";
import { getBuyerLicensesAction, getBuyerOverviewAction } from "../services/buyer-dashboard.actions";

const keys = {
  overview: (orgId: string) => ["buyer-dashboard", "overview", orgId] as const,
  licenses: (orgId: string, month?: string) => ["buyer-dashboard", "licenses", orgId, month] as const,
};

export function useBuyerOverview(organizationId: string) {
  return useQuery({
    queryKey: keys.overview(organizationId),
    queryFn: () => getBuyerOverviewAction(organizationId),
    enabled: Boolean(organizationId),
  });
}

export function useBuyerLicenses(organizationId: string, month?: string) {
  return useQuery({
    queryKey: keys.licenses(organizationId, month),
    queryFn: () => getBuyerLicensesAction(organizationId, month),
    enabled: Boolean(organizationId),
  });
}
