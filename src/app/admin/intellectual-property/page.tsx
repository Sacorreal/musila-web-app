'use client'

import { useState } from 'react'
import { Plus } from 'lucide-react'
import { adminIpHooks } from '@/src/domains/admin/intellectual-property/admin-ip.hooks'
import { AdminDataTable } from '@/src/domains/admin/components/AdminDataTable'
import { AdminConfirmDialog } from '@/src/domains/admin/components/AdminConfirmDialog'
import { AdminPagination } from '@/src/domains/admin/components/AdminPagination'
import { Button } from '@/src/shared/components/UI/button'
import { PageHeader } from '@/src/shared/components/UI/PageHeader'
import { IPFormDialog } from './IPFormDialog'
import { getIpColumns } from './ip-columns'
import type { AdminIntellectualPropertyDto } from '@/src/domains/admin/intellectual-property/admin-ip.types'

export default function AdminIntellectualPropertyPage() {
  const [page, setPage] = useState(1)
  const limit = 10

  const { data, isLoading, error } = adminIpHooks.useAdminIntellectualProperty(page, limit)
  const { mutate: deleteIp, isPending: isDeleting } = adminIpHooks.useDeleteIntellectualProperty()

  const [deleteTarget, setDeleteTarget] = useState<AdminIntellectualPropertyDto | null>(null)
  const [editTarget, setEditTarget] = useState<AdminIntellectualPropertyDto | null>(null)
  const [showCreate, setShowCreate] = useState(false)

  const columns = getIpColumns({ onEdit: setEditTarget, onDelete: setDeleteTarget })

  return (
    <div className="space-y-6">
      <PageHeader
        title="Propiedad Intelectual"
        description={`${data?.total ?? '—'} registros en el sistema`}
        actions={
          <Button onClick={() => setShowCreate(true)} className="gap-2">
            <Plus className="h-4 w-4" />
            Nuevo Registro
          </Button>
        }
      />

      <AdminDataTable
        columns={columns}
        data={data?.data ?? []}
        isLoading={isLoading}
        error={error ? 'Error al cargar los registros' : null}
        emptyMessage="No hay registros de propiedad intelectual"
        keyExtractor={(row) => row.id}
      />

      <AdminPagination total={data?.total ?? 0} page={page} limit={limit} onPageChange={setPage} />

      <AdminConfirmDialog
        isOpen={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={() => {
          if (deleteTarget) deleteIp(deleteTarget.id, { onSuccess: () => setDeleteTarget(null) })
        }}
        isLoading={isDeleting}
        title="¿Eliminar registro?"
        description="Se eliminará este registro de propiedad intelectual del track asociado."
      />

      <IPFormDialog isOpen={showCreate} onClose={() => setShowCreate(false)} />
      <IPFormDialog isOpen={!!editTarget} onClose={() => setEditTarget(null)} initialData={editTarget} />
    </div>
  )
}
