'use client'

import { useEffect, useState } from 'react'
import { Plus } from 'lucide-react'
import { adminInvitesHooks } from '@/src/domains/admin/invites/admin-invites.hooks'
import { AdminDataTable } from '@/src/domains/admin/components/AdminDataTable'
import { AdminConfirmDialog } from '@/src/domains/admin/components/AdminConfirmDialog'
import { AdminPagination } from '@/src/domains/admin/components/AdminPagination'
import { Button } from '@/src/shared/components/UI/button'
import { PageHeader } from '@/src/shared/components/UI/PageHeader'
import { InviteFormDialog } from './InviteFormDialog'
import { getInviteColumns } from './invite-columns'
import { InviteFiltersToolbar } from './invite-filters-toolbar'
import type { AdminInviteDto, AdminInviteFilters } from '@/src/domains/admin/invites/admin-invites.types'

export default function AdminInvitesPage() {
  const [page, setPage] = useState(1)
  const limit = 10
  const [status, setStatus] = useState<'all' | 'used' | 'pending'>('all')

  const filters: AdminInviteFilters = {
    ...(status !== 'all' && { isUsed: status === 'used' }),
  }

  useEffect(() => { setPage(1) }, [status])

  const { data, isLoading, error } = adminInvitesHooks.useAdminInvites(page, limit, filters)
  const { mutate: revokeInvite, isPending: isRevoking } = adminInvitesHooks.useRevokeInvite()

  const [revokeTarget, setRevokeTarget] = useState<AdminInviteDto | null>(null)
  const [showCreate, setShowCreate] = useState(false)

  const columns = getInviteColumns({ onRevoke: setRevokeTarget })

  return (
    <div className="space-y-6">
      <PageHeader
        title="Invitaciones"
        description={`${data?.total ?? '—'} invitaciones generadas`}
        actions={
          <Button onClick={() => setShowCreate(true)} className="gap-2">
            <Plus className="h-4 w-4" />
            Nueva Invitación
          </Button>
        }
      />

      <InviteFiltersToolbar status={status} onStatusChange={setStatus} />

      <AdminDataTable
        columns={columns}
        data={data?.data ?? []}
        isLoading={isLoading}
        error={error ? 'Error al cargar las invitaciones' : null}
        emptyMessage="No hay invitaciones registradas"
        keyExtractor={(row) => row.id}
      />

      <AdminPagination total={data?.total ?? 0} page={page} limit={limit} onPageChange={setPage} />

      <AdminConfirmDialog
        isOpen={!!revokeTarget}
        onClose={() => setRevokeTarget(null)}
        onConfirm={() => {
          if (revokeTarget) revokeInvite(revokeTarget.id, { onSuccess: () => setRevokeTarget(null) })
        }}
        isLoading={isRevoking}
        title="¿Revocar invitación?"
        description={`Se eliminará la invitación para "${revokeTarget?.email ?? revokeTarget?.token}". Si aún no fue usada, el enlace dejará de funcionar.`}
        confirmLabel="Revocar"
      />

      <InviteFormDialog isOpen={showCreate} onClose={() => setShowCreate(false)} />
    </div>
  )
}
