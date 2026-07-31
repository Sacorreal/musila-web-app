'use client'

import { useState } from 'react'
import { Plus } from 'lucide-react'
import { adminHooks } from '@/src/domains/admin/hooks/admin.hooks'
import { AdminDataTable } from '@/src/domains/admin/components/AdminDataTable'
import { AdminConfirmDialog } from '@/src/domains/admin/components/AdminConfirmDialog'
import { AdminPagination } from '@/src/domains/admin/components/AdminPagination'
import { ThemeFormDialog } from './ThemeFormDialog'
import { getThemeColumns } from './theme-columns'
import { Button } from '@/src/shared/components/UI/button'
import { PageHeader } from '@/src/shared/components/UI/PageHeader'
import type { AdminThemeDto } from '@/src/domains/admin/types/admin.types'

export default function AdminThemesPage() {
  const [page, setPage] = useState(1)
  const limit = 10
  const { data, isLoading, error } = adminHooks.useAdminThemes(page, limit)
  const { mutate: deleteTheme, isPending: isDeleting } = adminHooks.useDeleteTheme()

  const [deleteTarget, setDeleteTarget] = useState<AdminThemeDto | null>(null)
  const [editTarget, setEditTarget] = useState<AdminThemeDto | null>(null)
  const [showCreate, setShowCreate] = useState(false)

  const columns = getThemeColumns({ onEdit: setEditTarget, onDelete: setDeleteTarget })

  return (
    <div className="space-y-6">
      <PageHeader
        title="Temas"
        description={`${data?.total ?? '—'} temas en el catálogo`}
        actions={
          <Button onClick={() => setShowCreate(true)} className="gap-2">
            <Plus className="h-4 w-4" />
            Nuevo Tema
          </Button>
        }
      />

      <AdminDataTable
        columns={columns}
        data={data?.data ?? []}
        isLoading={isLoading}
        error={error ? 'Error al cargar los temas' : null}
        emptyMessage="No hay temas registrados"
        keyExtractor={(row) => row.id}
      />

      <AdminPagination total={data?.total ?? 0} page={page} limit={limit} onPageChange={setPage} />

      <AdminConfirmDialog
        isOpen={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={() => {
          if (deleteTarget) deleteTheme(deleteTarget.id, { onSuccess: () => setDeleteTarget(null) })
        }}
        isLoading={isDeleting}
        title="¿Eliminar tema?"
        description={`Se eliminará "${deleteTarget?.name}" del catálogo. Los tracks asociados perderán esta etiqueta.`}
      />

      <ThemeFormDialog
        isOpen={showCreate}
        onClose={() => setShowCreate(false)}
      />

      <ThemeFormDialog
        isOpen={!!editTarget}
        onClose={() => setEditTarget(null)}
        initialData={editTarget}
      />
    </div>
  )
}
