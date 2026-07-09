'use client'

import { useState } from 'react'
import { ExternalLink, Plus, Pencil, Trash2 } from 'lucide-react'
import { adminIpHooks } from '@/src/domains/admin/intellectual-property/admin-ip.hooks'
import { AdminDataTable, type ColumnDef } from '@/src/domains/admin/components/AdminDataTable'
import { AdminConfirmDialog } from '@/src/domains/admin/components/AdminConfirmDialog'
import { AdminPagination } from '@/src/domains/admin/components/AdminPagination'
import { Button } from '@/src/shared/components/UI/button'
import { IPFormDialog } from './IPFormDialog'
import type { AdminIntellectualPropertyDto } from '@/src/domains/admin/intellectual-property/admin-ip.types'

const TYPE_LABELS: Record<string, string> = {
  copyrightOffice: 'Copyright Office',
  cmo: 'CMO',
  splitSheet: 'Split Sheet',
}

export default function AdminIntellectualPropertyPage() {
  const [page, setPage] = useState(1)
  const limit = 10

  const { data, isLoading, error } = adminIpHooks.useAdminIntellectualProperty(page, limit)
  const { mutate: deleteIp, isPending: isDeleting } = adminIpHooks.useDeleteIntellectualProperty()

  const [deleteTarget, setDeleteTarget] = useState<AdminIntellectualPropertyDto | null>(null)
  const [editTarget, setEditTarget] = useState<AdminIntellectualPropertyDto | null>(null)
  const [showCreate, setShowCreate] = useState(false)

  const columns: ColumnDef<AdminIntellectualPropertyDto>[] = [
    {
      key: 'track',
      header: 'Track',
      width: '2fr',
      render: (row) => <p className="text-sm font-semibold truncate">{row.track?.title ?? '—'}</p>,
    },
    {
      key: 'type',
      header: 'Tipo',
      width: '140px',
      render: (row) => (
        <span className="rounded-full bg-muted px-2 py-0.5 text-xs font-semibold">{TYPE_LABELS[row.type]}</span>
      ),
    },
    {
      key: 'key',
      header: 'Clave',
      width: '120px',
      render: (row) => <span className="text-xs text-muted-foreground">{row.key}</span>,
    },
    {
      key: 'document',
      header: 'Documento',
      width: '100px',
      render: (row) => (
        <a
          href={row.documentUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-1 text-xs text-primary hover:underline"
        >
          Ver <ExternalLink className="h-3 w-3" />
        </a>
      ),
    },
    {
      key: 'createdAt',
      header: 'Creado',
      width: '110px',
      render: (row) => (
        <span className="text-xs text-muted-foreground">
          {new Date(row.createdAt).toLocaleDateString('es-ES', { day: '2-digit', month: 'short', year: '2-digit' })}
        </span>
      ),
    },
    {
      key: 'actions',
      header: 'Acciones',
      width: '80px',
      render: (row) => (
        <div className="flex items-center gap-1">
          <button
            onClick={() => setEditTarget(row)}
            className="flex h-8 w-8 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-primary/10 hover:text-primary"
            aria-label="Editar registro"
          >
            <Pencil className="h-3.5 w-3.5" />
          </button>
          <button
            onClick={() => setDeleteTarget(row)}
            className="flex h-8 w-8 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-destructive/10 hover:text-destructive"
            aria-label="Eliminar registro"
          >
            <Trash2 className="h-3.5 w-3.5" />
          </button>
        </div>
      ),
    },
  ]

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-black tracking-tight">Propiedad Intelectual</h2>
          <p className="text-sm text-muted-foreground">{data?.total ?? '—'} registros en el sistema</p>
        </div>
        <Button onClick={() => setShowCreate(true)} className="gap-2">
          <Plus className="h-4 w-4" />
          Nuevo Registro
        </Button>
      </div>

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
