'use client'

import { useState } from 'react'
import { Pencil } from 'lucide-react'
import { adminPlansHooks } from '@/src/domains/admin/plans/plans.hooks'
import { Badge } from '@/src/shared/components/UI/badge'
import { Button } from '@/src/shared/components/UI/button'
import { PageHeader } from '@/src/shared/components/UI/PageHeader'
import type { PlanDto, PlanEntitlementDto } from '@/src/domains/admin/plans/plans.types'
import { PlanEntitlementDialog } from './PlanEntitlementDialog'

const TIER_VARIANT = {
  FREE: 'secondary',
  PREMIUM: 'default',
  CUSTOM: 'outline',
} as const

export default function AdminPlansPage() {
  const { data: plans, isLoading, error } = adminPlansHooks.usePlans()
  const [editTarget, setEditTarget] = useState<{
    plan: PlanDto
    planEntitlement: PlanEntitlementDto
  } | null>(null)

  return (
    <div className="space-y-6">
      <PageHeader
        title="Planes"
        description={`${plans?.length ?? '—'} planes comerciales. Un plan agrupa capabilities (qué puede hacer) y entitlements (cuánto puede hacer).`}
      />

      {isLoading ? (
        <div className="grid gap-4 md:grid-cols-2">
          {Array.from({ length: 4 }).map((_, index) => (
            <div key={index} className="h-52 animate-pulse rounded-2xl bg-muted" />
          ))}
        </div>
      ) : error ? (
        <div className="rounded-2xl border border-destructive/40 bg-destructive/5 p-6 text-sm text-destructive">
          Error al cargar los planes.
        </div>
      ) : (plans?.length ?? 0) === 0 ? (
        <div className="rounded-2xl border border-dashed border-border p-10 text-center text-sm text-muted-foreground">
          No hay planes sembrados todavía.
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {plans!.map((plan) => (
            <article
              key={plan.id}
              className="space-y-4 rounded-2xl border border-border bg-card p-5 shadow-sm"
            >
              <header className="flex items-start justify-between gap-2">
                <div>
                  <h2 className="font-semibold">{plan.name}</h2>
                  <p className="font-mono text-xs text-muted-foreground">{plan.key}</p>
                </div>
                <div className="flex gap-1">
                  <Badge variant={TIER_VARIANT[plan.tier]}>{plan.tier}</Badge>
                  <Badge variant="outline">{plan.subjectType}</Badge>
                </div>
              </header>

              <section aria-label={`Capabilities de ${plan.name}`}>
                <h3 className="mb-1.5 text-[11px] font-black uppercase tracking-widest text-muted-foreground">
                  Capabilities
                </h3>
                <div className="flex flex-wrap gap-1">
                  {plan.planCapabilities.length === 0 ? (
                    <span className="text-xs text-muted-foreground">Sin capabilities</span>
                  ) : (
                    plan.planCapabilities.map((planCapability) => (
                      <Badge
                        key={planCapability.id}
                        variant="secondary"
                        className="font-mono text-[10px]"
                      >
                        {planCapability.capability.key}
                      </Badge>
                    ))
                  )}
                </div>
              </section>

              <section aria-label={`Entitlements de ${plan.name}`}>
                <h3 className="mb-1.5 text-[11px] font-black uppercase tracking-widest text-muted-foreground">
                  Entitlements
                </h3>
                {plan.planEntitlements.length === 0 ? (
                  <p className="text-xs text-muted-foreground">Sin límites configurados</p>
                ) : (
                  <ul className="space-y-1.5">
                    {plan.planEntitlements.map((planEntitlement) => (
                      <li
                        key={planEntitlement.id}
                        className="flex items-center justify-between rounded-lg border border-border/60 px-3 py-1.5 text-sm"
                      >
                        <span className="font-mono text-xs">{planEntitlement.entitlement.key}</span>
                        <span className="flex items-center gap-2">
                          <Badge variant="outline" className="text-[10px]">
                            {planEntitlement.unlimited
                              ? 'Ilimitado'
                              : `${planEntitlement.limit} / ${planEntitlement.period}`}
                          </Badge>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-7 w-7"
                            aria-label={`Editar ${planEntitlement.entitlement.key} de ${plan.name}`}
                            onClick={() => setEditTarget({ plan, planEntitlement })}
                          >
                            <Pencil className="h-3.5 w-3.5" />
                          </Button>
                        </span>
                      </li>
                    ))}
                  </ul>
                )}
              </section>
            </article>
          ))}
        </div>
      )}

      <PlanEntitlementDialog
        plan={editTarget?.plan ?? null}
        planEntitlement={editTarget?.planEntitlement ?? null}
        onClose={() => setEditTarget(null)}
      />
    </div>
  )
}
