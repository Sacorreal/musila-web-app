'use client'

import { useState } from 'react'
import { UserPlus } from 'lucide-react'
import { staffMembersHooks } from '@/src/domains/admin/staff-members/staff-members.hooks'
import { AdminDataTable } from '@/src/domains/admin/components/AdminDataTable'
import { AdminConfirmDialog } from '@/src/domains/admin/components/AdminConfirmDialog'
import { AdminPagination } from '@/src/domains/admin/components/AdminPagination'
import { Button } from '@/src/shared/components/UI/button'
import { PageHeader } from '@/src/shared/components/UI/PageHeader'
import { AssignStaffMemberDialog } from './AssignStaffMemberDialog'
import { ChangeStaffRoleDialog } from './ChangeStaffRoleDialog'
import { getStaffColumns } from './staff-columns'
import type { StaffMemberAssignmentDto } from '@/src/domains/admin/staff-members/staff-members.types'

export default function AdminStaffPage() {
  const [page, setPage] = useState(1)
  const limit = 10

  const { data, isLoading, error } = staffMembersHooks.useStaffMembers(page, limit)
  const { mutate: revokeRole, isPending: isRevoking } = staffMembersHooks.useRevokeStaffRole()

  const [changeRoleTarget, setChangeRoleTarget] = useState<StaffMemberAssignmentDto | null>(null)
  const [revokeTarget, setRevokeTarget] = useState<StaffMemberAssignmentDto | null>(null)
  const [showAssign, setShowAssign] = useState(false)

  const columns = getStaffColumns({ onChangeRole: setChangeRoleTarget, onRevoke: setRevokeTarget })

  return (
    <div className="space-y-6">
      <PageHeader
        title="Equipo"
        description={`${data?.total ?? '—'} miembros del staff con rol interno activo`}
        actions={
          <Button onClick={() => setShowAssign(true)} className="gap-2">
            <UserPlus className="h-4 w-4" />
            Asignar rol
          </Button>
        }
      />

      <AdminDataTable
        columns={columns}
        data={data?.data ?? []}
        isLoading={isLoading}
        error={error ? 'Error al cargar el equipo' : null}
        emptyMessage="Ningún miembro del equipo tiene un rol interno asignado todavía"
        keyExtractor={(row) => row.id}
      />

      <AdminPagination total={data?.total ?? 0} page={page} limit={limit} onPageChange={setPage} />

      <AdminConfirmDialog
        isOpen={!!revokeTarget}
        onClose={() => setRevokeTarget(null)}
        onConfirm={() => {
          if (revokeTarget) revokeRole(revokeTarget.userId, { onSuccess: () => setRevokeTarget(null) })
        }}
        isLoading={isRevoking}
        title="¿Revocar rol interno?"
        description={`"${revokeTarget?.user.name} ${revokeTarget?.user.lastName}" perderá el acceso al panel de administración.`}
        confirmLabel="Revocar"
      />

      <AssignStaffMemberDialog isOpen={showAssign} onClose={() => setShowAssign(false)} />
      <ChangeStaffRoleDialog member={changeRoleTarget} onClose={() => setChangeRoleTarget(null)} />
    </div>
  )
}
