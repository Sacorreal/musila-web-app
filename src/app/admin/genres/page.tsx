'use client'

import { useState } from 'react'
import { Plus, Pencil, Trash2 } from 'lucide-react'
import { adminHooks } from '@/src/domains/admin/hooks/admin.hooks'
import { AdminDataTable, type ColumnDef } from '@/src/domains/admin/components/AdminDataTable'
import { AdminConfirmDialog } from '@/src/domains/admin/components/AdminConfirmDialog'
import { AdminPagination } from '@/src/domains/admin/components/AdminPagination'
import { GenreFormDialog } from './GenreFormDialog'
import { Button } from '@/src/shared/components/UI/button'
import type { AdminGenreDto } from '@/src/domains/admin/types/admin.types'

export default function AdminGenresPage() {
  const [page, setPage] = useState(1)
  const limit = 10
  const { data, isLoading, error } = adminHooks.useAdminGenres(page, limit)
  const { mutate: deleteGenre, isPending: isDeleting } = adminHooks.useDeleteGenre()

  const [deleteTarget, setDeleteTarget] = useState<AdminGenreDto | null>(null)
  const [editTarget, setEditTarget] = useState<AdminGenreDto | null>(null)
  const [showCreate, setShowCreate] = useState(false)

  const columns: ColumnDef<AdminGenreDto>[] = [
    {
      key: 'genre',
      header: 'Género',
      width: '2fr',
      render: (row) => (
        <div>
          <p className="text-sm font-semibold">{row.genre}</p>
          {row.slug && <p className="text-xs text-muted-foreground">{row.slug}</p>}
        </div>
      ),
    },
    {
      key: 'subGenres',
      header: 'Subgéneros',
      width: '3fr',
      render: (row) => (
        <div className="flex flex-wrap gap-1">
          {row.subGenre?.slice(0, 4).map((sg) => (
            <span key={sg} className="rounded-full bg-muted px-2 py-0.5 text-xs text-muted-foreground">
              {sg}
            </span>
          ))}
          {(row.subGenre?.length ?? 0) > 4 && (
            <span className="text-xs text-muted-foreground">+{row.subGenre.length - 4}</span>
          )}
        </div>
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
      width: '90px',
      render: (row) => (
        <div className="flex items-center gap-1">
          <button
            onClick={() => setEditTarget(row)}
            className="flex h-7 w-7 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-primary/10 hover:text-primary"
            aria-label={`Editar ${row.genre}`}
          >
            <Pencil className="h-3.5 w-3.5" />
          </button>
          <button
            onClick={() => setDeleteTarget(row)}
            className="flex h-7 w-7 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-destructive/10 hover:text-destructive"
            aria-label={`Eliminar ${row.genre}`}
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
          <h2 className="text-xl font-black tracking-tight">Géneros Musicales</h2>
          <p className="text-sm text-muted-foreground">{data?.total ?? '—'} géneros en el catálogo</p>
        </div>
        <Button onClick={() => setShowCreate(true)} className="gap-2">
          <Plus className="h-4 w-4" />
          Nuevo Género
        </Button>
      </div>

      <AdminDataTable
        columns={columns}
        data={data?.data ?? []}
        isLoading={isLoading}
        error={error ? 'Error al cargar los géneros' : null}
        emptyMessage="No hay géneros registrados"
        keyExtractor={(row) => row.id}
      />

      <AdminPagination total={data?.total ?? 0} page={page} limit={limit} onPageChange={setPage} />

      <AdminConfirmDialog
        isOpen={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={() => {
          if (deleteTarget) deleteGenre(deleteTarget.id, { onSuccess: () => setDeleteTarget(null) })
        }}
        isLoading={isDeleting}
        title="¿Eliminar género?"
        description={`Se eliminará "${deleteTarget?.genre}" del catálogo. Los tracks asociados perderán su referencia de género.`}
      />

      <GenreFormDialog
        isOpen={showCreate}
        onClose={() => setShowCreate(false)}
      />

      <GenreFormDialog
        isOpen={!!editTarget}
        onClose={() => setEditTarget(null)}
        initialData={editTarget}
      />
    </div>
  )
}
