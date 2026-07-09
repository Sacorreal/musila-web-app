'use client'

import { useState } from 'react'
import { Plus, Trash2 } from 'lucide-react'
import { adminNotificationsHooks } from '@/src/domains/admin/notifications/admin-notifications.hooks'
import { AdminDataTable, type ColumnDef } from '@/src/domains/admin/components/AdminDataTable'
import { AdminConfirmDialog } from '@/src/domains/admin/components/AdminConfirmDialog'
import { AdminPagination } from '@/src/domains/admin/components/AdminPagination'
import { Button } from '@/src/shared/components/UI/button'
import { NotificationFormDialog } from './NotificationFormDialog'
import type { AdminNotificationDto } from '@/src/domains/admin/notifications/admin-notifications.types'

export default function AdminNotificationsPage() {
  const [page, setPage] = useState(1)
  const limit = 10

  const { data, isLoading, error } = adminNotificationsHooks.useAdminNotifications(page, limit)
  const { mutate: deleteNotification, isPending: isDeleting } = adminNotificationsHooks.useDeleteNotification()

  const [deleteTarget, setDeleteTarget] = useState<AdminNotificationDto | null>(null)
  const [showCreate, setShowCreate] = useState(false)

  const columns: ColumnDef<AdminNotificationDto>[] = [
    {
      key: 'title',
      header: 'Notificación',
      width: '2fr',
      render: (row) => (
        <div className="min-w-0">
          <p className="truncate text-sm font-semibold">{row.title}</p>
          <p className="truncate text-xs text-muted-foreground">{row.message}</p>
        </div>
      ),
    },
    {
      key: 'recipient',
      header: 'Destinatario',
      width: '2fr',
      render: (row) => (
        <span className="text-xs text-muted-foreground">
          {row.recipient ? `${row.recipient.name} ${row.recipient.lastName}` : '—'}
        </span>
      ),
    },
    {
      key: 'type',
      header: 'Tipo',
      width: '100px',
      render: (row) => <span className="rounded-full bg-muted px-2 py-0.5 text-xs font-semibold">{row.type}</span>,
    },
    {
      key: 'isRead',
      header: 'Leída',
      width: '80px',
      render: (row) => (
        <span className={`text-xs font-medium ${row.isRead ? 'text-emerald-600' : 'text-muted-foreground'}`}>
          {row.isRead ? 'Sí' : 'No'}
        </span>
      ),
    },
    {
      key: 'createdAt',
      header: 'Fecha',
      width: '110px',
      render: (row) => (
        <span className="text-xs text-muted-foreground">
          {new Date(row.createdAt).toLocaleDateString('es-ES', { day: '2-digit', month: 'short', year: '2-digit' })}
        </span>
      ),
    },
    {
      key: 'actions',
      header: '',
      width: '48px',
      render: (row) => (
        <button
          onClick={() => setDeleteTarget(row)}
          className="flex h-8 w-8 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-destructive/10 hover:text-destructive"
          aria-label="Eliminar notificación"
        >
          <Trash2 className="h-3.5 w-3.5" />
        </button>
      ),
    },
  ]

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-black tracking-tight">Notificaciones</h2>
          <p className="text-sm text-muted-foreground">{data?.total ?? '—'} notificaciones en el sistema</p>
        </div>
        <Button onClick={() => setShowCreate(true)} className="gap-2">
          <Plus className="h-4 w-4" />
          Nueva Notificación
        </Button>
      </div>

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
