'use client'

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { fetchEntitlementsCatalog, fetchPlans, fetchSubscriptions } from './plans.actions'
import {
  setPlanCapabilities,
  updatePlan,
  updateSubscription,
  upsertPlanEntitlement,
} from './plans.client'
import type { EntitlementPeriod } from './plans.types'

export function usePlans() {
  return useQuery({ queryKey: ['admin', 'plans'], queryFn: () => fetchPlans() })
}

export function useEntitlementsCatalog() {
  return useQuery({
    queryKey: ['admin', 'entitlements-catalog'],
    queryFn: () => fetchEntitlementsCatalog(),
    staleTime: 5 * 60 * 1000,
  })
}

export function useSubscriptions(params: {
  page?: number
  limit?: number
  subjectType?: string
  status?: string
} = {}) {
  return useQuery({
    queryKey: ['admin', 'subscriptions', params],
    queryFn: () => fetchSubscriptions(params),
  })
}

export function useUpdatePlan() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ planId, input }: { planId: string; input: { name?: string; description?: string; isActive?: boolean } }) =>
      updatePlan(planId, input),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['admin', 'plans'] })
      toast.success('Plan actualizado')
    },
    onError: (error: any) => toast.error(error?.response?.data?.message ?? 'Error al actualizar el plan'),
  })
}

export function useUpsertPlanEntitlement() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({
      planId,
      entitlementId,
      input,
    }: {
      planId: string
      entitlementId: string
      input: { limit: number | null; unlimited: boolean; period: EntitlementPeriod }
    }) => upsertPlanEntitlement(planId, entitlementId, input),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['admin', 'plans'] })
      toast.success('Entitlement del plan actualizado')
    },
    onError: (error: any) =>
      toast.error(error?.response?.data?.message ?? 'Error al actualizar el entitlement'),
  })
}

export function useSetPlanCapabilities() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ planId, capabilityIds }: { planId: string; capabilityIds: string[] }) =>
      setPlanCapabilities(planId, capabilityIds),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['admin', 'plans'] })
      toast.success('Capabilities del plan actualizadas')
    },
    onError: (error: any) =>
      toast.error(error?.response?.data?.message ?? 'Error al actualizar las capabilities'),
  })
}

export function useUpdateSubscription() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ id, input }: { id: string; input: { planId?: string; status?: string; endAt?: string | null } }) =>
      updateSubscription(id, input),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['admin', 'subscriptions'] })
      toast.success('Subscription actualizada')
    },
    onError: (error: any) =>
      toast.error(error?.response?.data?.message ?? 'Error al actualizar la subscription'),
  })
}

export const adminPlansHooks = {
  usePlans,
  useEntitlementsCatalog,
  useSubscriptions,
  useUpdatePlan,
  useUpsertPlanEntitlement,
  useSetPlanCapabilities,
  useUpdateSubscription,
}
