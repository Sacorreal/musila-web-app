'use client'

import { useState } from 'react'
import { Plus } from 'lucide-react'
import { adminNotificationsHooks } from '@/src/domains/admin/notifications/admin-notifications.hooks'
import { AdminDataTable } from '@/src/domains/admin/components/AdminDataTable'
import { AdminConfirmDialog } from '@/src/domains/admin/components/AdminConfirmDialog'
import { AdminPagination } from '@/src/domains/admin/components/AdminPagination'
import { Button } from '@/src/shared/components/UI/button'
import { PageHeader } from '@/src/shared/components/UI/PageHeader'
import { NotificationFormDialog } from './NotificationFormDialog'
import { getNotificationColumns } from './notification-columns'
import type { AdminNotificationDto } from '@/src/domains/admin/notifications/admin-notifications.types'

export default function AdminNotificationsPage() {
  const [page, setPage] = useState(1)
  const limit = 10

  const { data, isLoading, error } = adminNotificationsHooks.useAdminNotifications(page, limit)
  const { mutate: deleteNotification, isPending: isDeleting } = adminNotificationsHooks.useDeleteNotification()

  const [deleteTarget, setDeleteTarget] = useState<AdminNotificationDto | null>(null)
  const [showCreate, setShowCreate] = useState(false)

  const columns = getNotificationColumns({ onDelete: setDeleteTarget })

  return (
    <div className="space-y-6">
      <PageHeader
        title="Notificaciones"
        description={`${data?.total ?? '—'} notificaciones en el sistema`}
        actions={
          <Button onClick={() => setShowCreate(true)} className="gap-2">
            <Plus className="h-4 w-4" />
            Nueva Notificación
          </Button>
        }
      />

      <AdminDataTable
        columns={columns}
        data={data?.data ?? []}
        isLoading={isLoading}
        error={error ? 'Error al cargar las notificaciones' : null}
        emptyMessage="No hay notificaciones registradas"
        keyExtractor={(row) => row.id}
      />

      <AdminPagination total={data?.total ?? 0} page={page} limit={limit} onPageChange={setPage} />

      <AdminConfirmDialog
        isOpen={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={() => {
          if (deleteTarget) deleteNotification(deleteTarget.id, { onSuccess: () => setDeleteTarget(null) })
        }}
        isLoading={isDeleting}
        title="¿Eliminar notificación?"
        description={`Se eliminará "${deleteTarget?.title}" permanentemente.`}
      />

      <NotificationFormDialog isOpen={showCreate} onClose={() => setShowCreate(false)} />
    </div>
  )
}
