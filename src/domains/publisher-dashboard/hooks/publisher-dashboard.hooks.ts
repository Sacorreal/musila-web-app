"use client";

import { useQuery } from "@tanstack/react-query";
import {
  getPublisherFinancialAction,
  getPublisherOverviewAction,
  getPublisherRightsComplianceAction,
  getPublisherRightsIntelligenceAction,
  getPublisherSongDashboardAction,
} from "../services/publisher-dashboard.actions";

const keys = {
  overview: (orgId: string) => ["publisher-dashboard", "overview", orgId] as const,
  song: (orgId: string, trackId: string) => ["publisher-dashboard", "song", orgId, trackId] as const,
  rightsIntelligence: (orgId: string) => ["publisher-dashboard", "rights-intelligence", orgId] as const,
  rightsCompliance: (orgId: string) => ["publisher-dashboard", "rights-compliance", orgId] as const,
  financial: (orgId: string) => ["publisher-dashboard", "financial", orgId] as const,
};

export function usePublisherOverview(organizationId: string) {
  return useQuery({
    queryKey: keys.overview(organizationId),
    queryFn: () => getPublisherOverviewAction(organizationId),
    enabled: Boolean(organizationId),
  });
}

export function usePublisherSongDashboard(organizationId: string, trackId: string) {
  return useQuery({
    queryKey: keys.song(organizationId, trackId),
    queryFn: () => getPublisherSongDashboardAction(organizationId, trackId),
    enabled: Boolean(organizationId) && Boolean(trackId),
  });
}

export function usePublisherRightsIntelligence(organizationId: string) {
  return useQuery({
    queryKey: keys.rightsIntelligence(organizationId),
    queryFn: () => getPublisherRightsIntelligenceAction(organizationId),
    enabled: Boolean(organizationId),
  });
}

export function usePublisherRightsCompliance(organizationId: string) {
  return useQuery({
    queryKey: keys.rightsCompliance(organizationId),
    queryFn: () => getPublisherRightsComplianceAction(organizationId),
    enabled: Boolean(organizationId),
  });
}

export function usePublisherFinancial(organizationId: string) {
  return useQuery({
    queryKey: keys.financial(organizationId),
    queryFn: () => getPublisherFinancialAction(organizationId),
    enabled: Boolean(organizationId),
  });
}
