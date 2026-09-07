'use client'

import { use } from 'react'
import { Building2 } from 'lucide-react'
import { adminOrganizationsHooks } from '@/src/domains/admin/organizations/organizations.hooks'
import { AdminDataTable, type ColumnDef } from '@/src/domains/admin/components/AdminDataTable'
import { Badge } from '@/src/shared/components/UI/badge'
import { PageHeader } from '@/src/shared/components/UI/PageHeader'
import { Progress } from '@/src/shared/components/UI/progress'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/src/shared/components/UI/tabs'
import type { RoleDto } from '@/src/domains/admin/organizations/organizations.types'
import { OrganizationMembersTab } from './OrganizationMembersTab'

export default function AdminOrganizationDetailPage({
  params,
}: {
  params: Promise<{ organizationId: string }>
}) {
  const { organizationId } = use(params)

  const { data: organization, isLoading } = adminOrganizationsHooks.useOrganization(organizationId)
  const { data: roles, isLoading: isLoadingRoles, error: rolesError } =
    adminOrganizationsHooks.useOrganizationRoles(organizationId)
  const { data: entitlements, isLoading: isLoadingEntitlements } =
    adminOrganizationsHooks.useOrganizationEntitlements(organizationId)

  const roleColumns: ColumnDef<RoleDto>[] = [
    {
      key: 'name',
      header: 'Rol',
      render: (role) => (
        <span className="flex items-center gap-2 font-medium">
          {role.name}
          {role.source === 'SYSTEM' && <Badge variant="secondary">SYSTEM</Badge>}
          {!role.isActive && <Badge variant="destructive">Inactivo</Badge>}
        </span>
      ),
    },
    { key: 'type', header: 'Tipo', width: '140px', render: (role) => <Badge variant="outline">{role.type}</Badge> },
    {
      key: 'capabilities',
      header: 'Capabilities',
      render: (role) => (
        <div className="flex max-w-xl flex-wrap gap-1">
          {(role.roleCapabilities ?? []).slice(0, 6).map((roleCapability) => (
            <Badge key={roleCapability.id} variant="secondary" className="font-mono text-[10px]">
              {roleCapability.capability.key}
            </Badge>
          ))}
          {(role.roleCapabilities?.length ?? 0) > 6 && (
            <Badge variant="outline" className="text-[10px]">
              +{(role.roleCapabilities?.length ?? 0) - 6} más
            </Badge>
          )}
        </div>
      ),
    },
  ]

  return (
    <div className="space-y-6">
      <PageHeader
        title={
          isLoading ? 'Cargando organización…' : (organization?.name ?? 'Organización')
        }
        description={
          organization
            ? `${organization.type} · ${organization.slug} · ${organization.isActive ? 'Activa' : 'Inactiva'}`
            : undefined
        }
      />

      <Tabs defaultValue="staff" className="space-y-4">
        <TabsList>
          <TabsTrigger value="staff">Staff</TabsTrigger>
          <TabsTrigger value="roster">Roster</TabsTrigger>
          <TabsTrigger value="roles">Roles</TabsTrigger>
          <TabsTrigger value="billing">Plan y entitlements</TabsTrigger>
        </TabsList>

        <TabsContent value="staff">
          <OrganizationMembersTab organizationId={organizationId} membershipType="ORGANIZATION" />
        </TabsContent>

        <TabsContent value="roster">
          <OrganizationMembersTab organizationId={organizationId} membershipType="ROSTER" />
        </TabsContent>

        <TabsContent value="roles">
          <AdminDataTable
            columns={roleColumns}
            data={roles ?? []}
            isLoading={isLoadingRoles}
            error={rolesError ? 'Error al cargar los roles' : null}
            emptyMessage="La organización no tiene roles todavía"
            keyExtractor={(row) => row.id}
          />
        </TabsContent>

        <TabsContent value="billing">
          {isLoadingEntitlements ? (
            <div className="space-y-3">
              {Array.from({ length: 3 }).map((_, index) => (
                <div key={index} className="h-16 animate-pulse rounded-2xl bg-muted" />
              ))}
            </div>
          ) : (entitlements?.length ?? 0) === 0 ? (
            <div className="rounded-2xl border border-dashed border-border p-8 text-center text-sm text-muted-foreground">
              <Building2 className="mx-auto mb-2 h-6 w-6" aria-hidden />
              La organización no tiene una subscription B2B activa.
            </div>
          ) : (
            <ul className="space-y-3">
              {entitlements!.map((entitlement) => {
                const percentage =
                  entitlement.unlimited || entitlement.limit === null
                    ? 0
                    : Math.min((entitlement.consumed / Math.max(entitlement.limit, 1)) * 100, 100)
                return (
                  <li
                    key={entitlement.key}
                    className="rounded-2xl border border-border bg-card p-4 shadow-sm"
                  >
                    <div className="mb-2 flex items-center justify-between gap-4">
                      <div>
                        <p className="text-sm font-medium">{entitlement.name}</p>
                        <p className="font-mono text-xs text-muted-foreground">{entitlement.key}</p>
                      </div>
                      <Badge variant="secondary">
                        {entitlement.unlimited
                          ? 'Ilimitado'
                          : `${entitlement.consumed} / ${entitlement.limit}`}
                      </Badge>
                    </div>
                    {!entitlement.unlimited && entitlement.limit !== null && (
                      <Progress value={percentage} aria-label={`Consumo de ${entitlement.name}`} />
                    )}
                  </li>
                )
              })}
            </ul>
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}
