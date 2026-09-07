'use client'

import { useState } from 'react'
import { CheckCircle2, SearchCheck, ShieldQuestion, XCircle } from 'lucide-react'
import { adminAuthorizationHooks } from '@/src/domains/admin/authorization/authorization.hooks'
import { adminOrganizationsHooks } from '@/src/domains/admin/organizations/organizations.hooks'
import { AdminEntitySelect } from '@/src/domains/admin/shared/AdminEntitySelect'
import { fetchUserOptions } from '@/src/domains/admin/shared/fetch-user-options'
import { Badge } from '@/src/shared/components/UI/badge'
import { Button } from '@/src/shared/components/UI/button'
import { Input } from '@/src/shared/components/UI/input'
import { PageHeader } from '@/src/shared/components/UI/PageHeader'
import { Progress } from '@/src/shared/components/UI/progress'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/src/shared/components/UI/select'
import type { CheckResponse } from '@/src/domains/admin/authorization/authorization.types'

const PERSONAL_CONTEXT = '__personal__'

export default function AuthorizationExplorerPage() {
  const [userId, setUserId] = useState<string | null>(null)
  const [organizationId, setOrganizationId] = useState(PERSONAL_CONTEXT)
  const [capabilityToCheck, setCapabilityToCheck] = useState('')
  const [checkResult, setCheckResult] = useState<CheckResponse | null>(null)

  const { data: organizations } = adminOrganizationsHooks.useOrganizations()
  const selectedOrganizationId = organizationId === PERSONAL_CONTEXT ? undefined : organizationId

  const { data: explanation, isLoading } = adminAuthorizationHooks.useAuthorizationExplain(
    userId ?? undefined,
    selectedOrganizationId,
  )
  const { mutate: runCheck, isPending: isChecking } = adminAuthorizationHooks.useAuthorizationCheck()

  return (
    <div className="space-y-6">
      <PageHeader
        title="Authorization Explorer"
        description="Consulta las capabilities efectivas de un usuario, su origen (rol o plan), sus entitlements y simula checks con diagnóstico de DENY."
      />

      {/* Selección de contexto */}
      <div className="grid gap-4 rounded-2xl border border-border bg-card p-5 shadow-sm md:grid-cols-2">
        <div className="space-y-1.5">
          <label className="text-sm font-medium">Usuario</label>
          <AdminEntitySelect
            value={userId}
            onChange={setUserId}
            fetchOptions={fetchUserOptions}
            placeholder="Buscar usuario por nombre o email..."
          />
        </div>
        <div className="space-y-1.5">
          <label className="text-sm font-medium">Contexto</label>
          <Select value={organizationId} onValueChange={setOrganizationId}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value={PERSONAL_CONTEXT}>Personal + plataforma</SelectItem>
              {(organizations ?? []).map((organization) => (
                <SelectItem key={organization.id} value={organization.id}>
                  {organization.name} ({organization.type})
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {!userId ? (
        <div className="rounded-2xl border border-dashed border-border p-12 text-center text-sm text-muted-foreground">
          <ShieldQuestion className="mx-auto mb-3 h-8 w-8" aria-hidden />
          Selecciona un usuario para explorar su autorización.
        </div>
      ) : isLoading ? (
        <div className="grid gap-4 lg:grid-cols-2">
          {Array.from({ length: 2 }).map((_, index) => (
            <div key={index} className="h-64 animate-pulse rounded-2xl bg-muted" />
          ))}
        </div>
      ) : (
        <>
          {explanation?.denied && (
            <div className="flex items-center gap-3 rounded-2xl border border-destructive/40 bg-destructive/5 p-4 text-sm">
              <XCircle className="h-5 w-5 shrink-0 text-destructive" aria-hidden />
              <p>
                El contexto fue denegado:{' '}
                <Badge variant="destructive">{explanation.denied.code}</Badge> — el usuario no tiene
                una membership ACTIVE en esta organización.
              </p>
            </div>
          )}

          <div className="grid gap-4 lg:grid-cols-2">
            {/* Capabilities efectivas con origen */}
            <section className="rounded-2xl border border-border bg-card p-5 shadow-sm">
              <h2 className="mb-3 text-sm font-black uppercase tracking-widest text-muted-foreground">
                Capabilities efectivas ({explanation?.grants.length ?? 0})
              </h2>
              {(explanation?.grants.length ?? 0) === 0 ? (
                <p className="text-sm text-muted-foreground">Sin capabilities en este contexto.</p>
              ) : (
                <ul className="max-h-96 space-y-2 overflow-y-auto pr-1">
                  {explanation!.grants.map((grant) => (
                    <li key={grant.key} className="rounded-xl border border-border/60 p-3">
                      <div className="flex items-center justify-between gap-2">
                        <span className="flex items-center gap-2 font-mono text-xs">
                          <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" aria-hidden />
                          {grant.key}
                        </span>
                        <Badge variant="outline" className="text-[10px]">
                          {grant.scope}
                        </Badge>
                      </div>
                      <p className="mt-1 text-xs text-muted-foreground">
                        Origen:{' '}
                        {grant.origins
                          .map((origin) => `${origin.type === 'ROLE' ? 'Rol' : 'Plan'} → ${origin.name}`)
                          .join(' · ')}
                      </p>
                    </li>
                  ))}
                </ul>
              )}

              {(explanation?.exclusions.length ?? 0) > 0 && (
                <div className="mt-4 border-t border-border pt-3">
                  <h3 className="mb-2 text-xs font-black uppercase tracking-widest text-muted-foreground">
                    Excluidas por el motor
                  </h3>
                  <ul className="space-y-1">
                    {explanation!.exclusions.map((exclusion) => (
                      <li key={exclusion.capability} className="flex items-center justify-between text-xs">
                        <span className="font-mono">{exclusion.capability}</span>
                        <Badge variant="destructive" className="text-[10px]">
                          {exclusion.code}
                        </Badge>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </section>

            {/* Memberships + entitlements */}
            <section className="space-y-4">
              <div className="rounded-2xl border border-border bg-card p-5 shadow-sm">
                <h2 className="mb-3 text-sm font-black uppercase tracking-widest text-muted-foreground">
                  Memberships
                </h2>
                {(explanation?.memberships.organizationMemberships.length ?? 0) === 0 &&
                (explanation?.memberships.rosterMemberships.length ?? 0) === 0 ? (
                  <p className="text-sm text-muted-foreground">Sin memberships.</p>
                ) : (
                  <ul className="space-y-1.5 text-sm">
                    {explanation!.memberships.organizationMemberships.map((membership) => (
                      <li key={membership.id} className="flex items-center justify-between">
                        <span>{membership.organization?.name} · Staff</span>
                        <Badge variant="secondary">{membership.status}</Badge>
                      </li>
                    ))}
                    {explanation!.memberships.rosterMemberships.map((membership) => (
                      <li key={membership.id} className="flex items-center justify-between">
                        <span>{membership.organization?.name} · Roster</span>
                        <Badge variant="secondary">{membership.status}</Badge>
                      </li>
                    ))}
                  </ul>
                )}
              </div>

              <div className="rounded-2xl border border-border bg-card p-5 shadow-sm">
                <h2 className="mb-3 text-sm font-black uppercase tracking-widest text-muted-foreground">
                  Entitlements
                </h2>
                {(explanation?.entitlements.length ?? 0) === 0 ? (
                  <p className="text-sm text-muted-foreground">Sin entitlements en este contexto.</p>
                ) : (
                  <ul className="space-y-3">
                    {explanation!.entitlements.map((entitlement) => (
                      <li key={entitlement.key}>
                        <div className="mb-1 flex items-center justify-between text-sm">
                          <span className="font-mono text-xs">{entitlement.key}</span>
                          <span className="text-xs text-muted-foreground">
                            {entitlement.unlimited
                              ? 'Ilimitado'
                              : `${entitlement.consumed} / ${entitlement.limit}`}
                          </span>
                        </div>
                        {!entitlement.unlimited && entitlement.limit !== null && (
                          <Progress
                            value={Math.min(
                              (entitlement.consumed / Math.max(entitlement.limit, 1)) * 100,
                              100,
                            )}
                            aria-label={`Consumo de ${entitlement.key}`}
                          />
                        )}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </section>
          </div>

          {/* Simulador de checks */}
          <section className="rounded-2xl border border-border bg-card p-5 shadow-sm">
            <h2 className="mb-3 text-sm font-black uppercase tracking-widest text-muted-foreground">
              Simular check de capability
            </h2>
            <div className="flex flex-col gap-3 sm:flex-row">
              <Input
                value={capabilityToCheck}
                onChange={(event) => setCapabilityToCheck(event.target.value)}
                placeholder="ej. private_pitching.create"
                className="font-mono"
                aria-label="Capability a verificar"
              />
              <Button
                className="gap-2"
                disabled={!capabilityToCheck || isChecking}
                onClick={() =>
                  runCheck(
                    {
                      userId: userId!,
                      organizationId: selectedOrganizationId,
                      capability: capabilityToCheck.trim(),
                    },
                    { onSuccess: setCheckResult },
                  )
                }
              >
                <SearchCheck className="h-4 w-4" />
                Verificar
              </Button>
            </div>

            {checkResult && (
              <div
                className={`mt-4 flex items-center gap-3 rounded-xl border p-4 text-sm ${
                  checkResult.allowed
                    ? 'border-emerald-500/40 bg-emerald-500/5'
                    : 'border-destructive/40 bg-destructive/5'
                }`}
                role="status"
              >
                {checkResult.allowed ? (
                  <CheckCircle2 className="h-5 w-5 text-emerald-500" aria-hidden />
                ) : (
                  <XCircle className="h-5 w-5 text-destructive" aria-hidden />
                )}
                <div>
                  <p className="font-medium">
                    {checkResult.capability} → {checkResult.allowed ? 'ALLOW' : 'DENY'}
                  </p>
                  {!checkResult.allowed && checkResult.code && (
                    <p className="text-xs text-muted-foreground">
                      Código: <Badge variant="destructive">{checkResult.code}</Badge>
                    </p>
                  )}
                </div>
              </div>
            )}
          </section>
        </>
      )}
    </div>
  )
}
