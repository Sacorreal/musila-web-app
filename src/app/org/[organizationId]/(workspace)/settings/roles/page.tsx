'use client'

import { use, useMemo, useState } from 'react'
import { Pencil, Plus, Trash2 } from 'lucide-react'
import { organizationsHooks } from '@/src/domains/organizations/organizations.hooks'
import type { RoleDto } from '@/src/domains/organizations/organizations.types'
import { AdminConfirmDialog } from '@/src/domains/admin/components/AdminConfirmDialog'
import { AdminDataTable, type ColumnDef } from '@/src/domains/admin/components/AdminDataTable'
import { Badge } from '@/src/shared/components/UI/badge'
import { Button } from '@/src/shared/components/UI/button'
import { PageHeader } from '@/src/shared/components/UI/PageHeader'
import { RoleBuilderDialog } from './RoleBuilderDialog'

export default function OrgRolesPage({
  params,
}: {
  params: Promise<{ organizationId: string }>
}) {
  const { organizationId } = use(params)

  const { data: roles, isLoading, error } = organizationsHooks.useOrgRoles(organizationId)
  const { data: memberships } = organizationsHooks.useMyMemberships()
  const { mutate: deleteRole, isPending: isDeleting } =
    organizationsHooks.useDeleteOrgRole(organizationId)

  const [showBuilder, setShowBuilder] = useState(false)
  const [editTarget, setEditTarget] = useState<RoleDto | null>(null)
  const [deleteTarget, setDeleteTarget] = useState<RoleDto | null>(null)

  const organizationType = useMemo(() => {
    const all = [
      ...(memberships?.organizationMemberships ?? []),
      ...(memberships?.rosterMemberships ?? []),
    ]
    return all.find((membership) => membership.organizationId === organizationId)?.organization?.type
  }, [memberships, organizationId])

  const columns: ColumnDef<RoleDto>[] = [
    {
      key: 'name',
      header: 'Rol',
      render: (role) => (
        <div>
          <span className="flex items-center gap-2 font-medium">
            {role.name}
            {role.source === 'SYSTEM' && <Badge variant="secondary">SYSTEM</Badge>}
          </span>
          {role.description && (
            <p className="mt-0.5 line-clamp-1 text-xs text-muted-foreground">{role.description}</p>
          )}
        </div>
      ),
    },
    {
      key: 'type',
      header: 'Tipo',
      width: '120px',
      render: (role) => <Badge variant="outline">{role.type}</Badge>,
    },
    {
      key: 'capabilities',
      header: 'Capabilities',
      width: '140px',
      render: (role) => (
        <span className="text-sm text-muted-foreground">
          {role.roleCapabilities?.length ?? 0} capabilities
        </span>
      ),
    },
    {
      key: 'actions',
      header: '',
      width: '110px',
      render: (role) =>
        role.source === 'SYSTEM' ? (
          <span className="text-xs text-muted-foreground">Solo lectura</span>
        ) : (
          <div className="flex gap-1">
            <Button
              variant="ghost"
              size="icon"
              aria-label={`Editar ${role.name}`}
              onClick={() => setEditTarget(role)}
            >
              <Pencil className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              aria-label={`Eliminar ${role.name}`}
              onClick={() => setDeleteTarget(role)}
            >
              <Trash2 className="h-4 w-4 text-destructive" />
            </Button>
          </div>
        ),
    },
  ]

  return (
    <div className="space-y-6">
      <PageHeader
        title="Roles"
        description="Roles del sistema (solo lectura) y roles propios construidos con capabilities del catálogo global."
        actions={
          <Button className="gap-2" onClick={() => setShowBuilder(true)}>
            <Plus className="h-4 w-4" />
            Crear rol
          </Button>
        }
      />

      <AdminDataTable
        columns={columns}
        data={roles ?? []}
        isLoading={isLoading}
        error={error ? 'Error al cargar los roles' : null}
        emptyMessage="Aún no hay roles. Crea el primero con el Role Builder."
        keyExtractor={(row) => row.id}
      />

      <RoleBuilderDialog
        organizationId={organizationId}
        organizationType={organizationType}
        isOpen={showBuilder || !!editTarget}
        editingRole={editTarget}
        onClose={() => {
          setShowBuilder(false)
          setEditTarget(null)
        }}
      />

      <AdminConfirmDialog
        isOpen={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={() => {
          if (deleteTarget) deleteRole(deleteTarget.id, { onSuccess: () => setDeleteTarget(null) })
        }}
        isLoading={isDeleting}
        title="¿Eliminar rol?"
        description={`Se eliminará "${deleteTarget?.name}". Debe estar sin memberships asignadas.`}
      />
    </div>
  )
}
