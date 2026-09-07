'use client'

import { useState } from 'react'
import { Plus } from 'lucide-react'
import { adminHooks } from '@/src/domains/admin/hooks/admin.hooks'
import { AdminDataTable } from '@/src/domains/admin/components/AdminDataTable'
import { AdminConfirmDialog } from '@/src/domains/admin/components/AdminConfirmDialog'
import { AdminPagination } from '@/src/domains/admin/components/AdminPagination'
import { GenreFormDialog } from './GenreFormDialog'
import { getGenreColumns } from './genre-columns'
import { Button } from '@/src/shared/components/UI/button'
import { PageHeader } from '@/src/shared/components/UI/PageHeader'
import type { AdminGenreDto } from '@/src/domains/admin/types/admin.types'

export default function AdminGenresPage() {
  const [page, setPage] = useState(1)
  const limit = 10
  const { data, isLoading, error } = adminHooks.useAdminGenres(page, limit)
  const { mutate: deleteGenre, isPending: isDeleting } = adminHooks.useDeleteGenre()

  const [deleteTarget, setDeleteTarget] = useState<AdminGenreDto | null>(null)
  const [editTarget, setEditTarget] = useState<AdminGenreDto | null>(null)
  const [showCreate, setShowCreate] = useState(false)

  const columns = getGenreColumns({ onEdit: setEditTarget, onDelete: setDeleteTarget })

  return (
    <div className="space-y-6">
      <PageHeader
        title="Géneros Musicales"
        description={`${data?.total ?? '—'} géneros en el catálogo`}
        actions={
          <Button onClick={() => setShowCreate(true)} className="gap-2">
            <Plus className="h-4 w-4" />
            Nuevo Género
          </Button>
        }
      />

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
