'use client'

import { useQuery } from '@tanstack/react-query'
import {
  getMyEditorialRelationshipsAction,
  getOrganizationEditorialRelationshipsAction,
} from '../services/editorial-relationships.actions'

const keys = {
  mine: () => ['editorial-relationships', 'mine'] as const,
  forOrganization: (orgId: string) => ['editorial-relationships', 'organization', orgId] as const,
}

export function useMyEditorialRelationships() {
  return useQuery({
    queryKey: keys.mine(),
    queryFn: () => getMyEditorialRelationshipsAction(),
  })
}

export function useOrganizationEditorialRelationships(organizationId: string) {
  return useQuery({
    queryKey: keys.forOrganization(organizationId),
    queryFn: () => getOrganizationEditorialRelationshipsAction(organizationId),
    enabled: Boolean(organizationId),
  })
}
