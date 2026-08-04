'use client'

import { useState } from 'react'
import { Plus } from 'lucide-react'
import { staffRolesHooks } from '@/src/domains/admin/staff-roles/staff-roles.hooks'
import { AdminDataTable } from '@/src/domains/admin/components/AdminDataTable'
import { AdminConfirmDialog } from '@/src/domains/admin/components/AdminConfirmDialog'
import { AdminPagination } from '@/src/domains/admin/components/AdminPagination'
import { Button } from '@/src/shared/components/UI/button'
import { PageHeader } from '@/src/shared/components/UI/PageHeader'
import { RoleFormDialog } from './RoleFormDialog'
import { getRoleColumns } from './role-columns'
import type { StaffRoleDto } from '@/src/domains/admin/staff-roles/staff-roles.types'

export default function AdminRolesPage() {
  const [page, setPage] = useState(1)
  const limit = 20

  const { data, isLoading, error } = staffRolesHooks.useStaffRoles(page, limit)
  const { mutate: deleteRole, isPending: isDeleting } = staffRolesHooks.useDeleteStaffRole()

  const [editTarget, setEditTarget] = useState<StaffRoleDto | null>(null)
  const [deleteTarget, setDeleteTarget] = useState<StaffRoleDto | null>(null)
  const [showCreate, setShowCreate] = useState(false)

  const columns = getRoleColumns({ onEdit: setEditTarget, onDelete: setDeleteTarget })

  return (
    <div className="space-y-6">
      <PageHeader
        title="Roles internos"
        description={`${data?.total ?? '—'} roles configurados (base + personalizados)`}
        actions={
          <Button onClick={() => setShowCreate(true)} className="gap-2">
            <Plus className="h-4 w-4" />
            Nuevo rol
          </Button>
        }
      />

      <AdminDataTable
        columns={columns}
        data={data?.data ?? []}
        isLoading={isLoading}
        error={error ? 'Error al cargar los roles internos' : null}
        emptyMessage="No hay roles internos configurados"
        keyExtractor={(row) => row.id}
      />

      <AdminPagination total={data?.total ?? 0} page={page} limit={limit} onPageChange={setPage} />

      <AdminConfirmDialog
        isOpen={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={() => {
          if (deleteTarget) deleteRole(deleteTarget.id, { onSuccess: () => setDeleteTarget(null) })
        }}
        isLoading={isDeleting}
        title="¿Eliminar rol interno?"
        description={`Se eliminará el rol "${deleteTarget?.name}". Si tiene miembros del equipo asignados, la eliminación fallará hasta que los reasignes.`}
        confirmLabel="Eliminar"
      />

      <RoleFormDialog isOpen={showCreate} onClose={() => setShowCreate(false)} />
      <RoleFormDialog isOpen={!!editTarget} onClose={() => setEditTarget(null)} role={editTarget} />
    </div>
  )
}
