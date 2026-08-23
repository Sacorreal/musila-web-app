"use client";

import { useQuery } from "@tanstack/react-query";
import {
  getMyCatalogHealthScoreAction,
  getMyTrackHealthScoreAction,
  getOrganizationCatalogHealthScoreAction,
  getOrganizationTrackHealthScoreAction,
} from "../services/editorial-command-center.actions";

const keys = {
  myOverview: () => ["editorial-command-center", "overview"] as const,
  myTrack: (trackId: string) => ["editorial-command-center", "track", trackId] as const,
  orgOverview: (orgId: string) => ["editorial-command-center", "overview", orgId] as const,
  orgTrack: (orgId: string, trackId: string) => ["editorial-command-center", "track", orgId, trackId] as const,
};

export function useMyCatalogHealthScore() {
  return useQuery({
    queryKey: keys.myOverview(),
    queryFn: () => getMyCatalogHealthScoreAction(),
  });
}

export function useMyTrackHealthScore(trackId: string) {
  return useQuery({
    queryKey: keys.myTrack(trackId),
    queryFn: () => getMyTrackHealthScoreAction(trackId),
    enabled: Boolean(trackId),
  });
}

export function useOrganizationCatalogHealthScore(organizationId: string) {
  return useQuery({
    queryKey: keys.orgOverview(organizationId),
    queryFn: () => getOrganizationCatalogHealthScoreAction(organizationId),
    enabled: Boolean(organizationId),
  });
}

export function useOrganizationTrackHealthScore(organizationId: string, trackId: string) {
  return useQuery({
    queryKey: keys.orgTrack(organizationId, trackId),
    queryFn: () => getOrganizationTrackHealthScoreAction(organizationId, trackId),
    enabled: Boolean(organizationId) && Boolean(trackId),
  });
}
