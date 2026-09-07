"use client";

import { useQuery } from "@tanstack/react-query";
import {
  getAuthorFinancialAction,
  getAuthorOverviewAction,
  getRightsComplianceAction,
  getRightsIntelligenceAction,
  getSongDashboardAction,
} from "../services/dashboard.actions";

export const DASHBOARD_OVERVIEW_QUERY_KEY = "author-dashboard-overview";
export const DASHBOARD_SONG_QUERY_KEY = "author-dashboard-song";
export const DASHBOARD_RIGHTS_INTELLIGENCE_QUERY_KEY = "author-dashboard-rights-intelligence";
export const DASHBOARD_RIGHTS_COMPLIANCE_QUERY_KEY = "author-dashboard-rights-compliance";
export const DASHBOARD_FINANCIAL_QUERY_KEY = "author-dashboard-financial";

export function useAuthorOverview() {
  return useQuery({
    queryKey: [DASHBOARD_OVERVIEW_QUERY_KEY],
    queryFn: () => getAuthorOverviewAction(),
  });
}

export function useSongDashboard(trackId: string) {
  return useQuery({
    queryKey: [DASHBOARD_SONG_QUERY_KEY, trackId],
    queryFn: () => getSongDashboardAction(trackId),
    enabled: Boolean(trackId),
  });
}

export function useRightsIntelligence() {
  return useQuery({
    queryKey: [DASHBOARD_RIGHTS_INTELLIGENCE_QUERY_KEY],
    queryFn: () => getRightsIntelligenceAction(),
  });
}

export function useRightsCompliance() {
  return useQuery({
    queryKey: [DASHBOARD_RIGHTS_COMPLIANCE_QUERY_KEY],
    queryFn: () => getRightsComplianceAction(),
  });
}

export function useAuthorFinancial() {
  return useQuery({
    queryKey: [DASHBOARD_FINANCIAL_QUERY_KEY],
    queryFn: () => getAuthorFinancialAction(),
  });
}
