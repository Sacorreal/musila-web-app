'use client'

import { useState } from 'react'
import { adminHooks } from '@/src/domains/admin/hooks/admin.hooks'
import { adminRequestedTracksHooks } from '@/src/domains/admin/requested-tracks/admin-requested-tracks.hooks'
import { AdminDataTable } from '@/src/domains/admin/components/AdminDataTable'
import { AdminConfirmDialog } from '@/src/domains/admin/components/AdminConfirmDialog'
import { AdminPagination } from '@/src/domains/admin/components/AdminPagination'
import { PageHeader } from '@/src/shared/components/UI/PageHeader'
import { RequestFormDialog } from './RequestFormDialog'
import { getRequestColumns } from './request-columns'
import type { AdminRequestDto } from '@/src/domains/admin/types/admin.types'

export default function AdminRequestsPage() {
  const [page, setPage] = useState(1)
  const limit = 10
  const { data, isLoading, error } = adminHooks.useAdminRequests(page, limit)
  const { mutate: deleteRequest, isPending: isDeleting } = adminRequestedTracksHooks.useDeleteRequestedTrack()

  const [editTarget, setEditTarget] = useState<AdminRequestDto | null>(null)
  const [deleteTarget, setDeleteTarget] = useState<AdminRequestDto | null>(null)

  const columns = getRequestColumns({ onEdit: setEditTarget, onDelete: setDeleteTarget })

  return (
    <div className="space-y-6">
      <PageHeader
        title="Solicitudes de Licencia"
        description={`${data?.total ?? '—'} solicitudes en el sistema`}
      />

      <AdminDataTable
        columns={columns}
        data={data?.data ?? []}
        isLoading={isLoading}
        error={error ? 'Error al cargar las solicitudes' : null}
        emptyMessage="No hay solicitudes registradas"
        keyExtractor={(row) => row.id}
      />

      <AdminPagination total={data?.total ?? 0} page={page} limit={limit} onPageChange={setPage} />

      <AdminConfirmDialog
        isOpen={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={() => {
          if (deleteTarget) deleteRequest(deleteTarget.id, { onSuccess: () => setDeleteTarget(null) })
        }}
        isLoading={isDeleting}
        title="¿Eliminar solicitud?"
        description={`Se eliminará la solicitud de "${deleteTarget?.track?.title ?? 'este track'}".`}
      />

      <RequestFormDialog request={editTarget} onClose={() => setEditTarget(null)} />
    </div>
  )
}
