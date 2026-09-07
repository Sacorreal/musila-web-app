'use client'

import { useState } from 'react'
import { Plus } from 'lucide-react'
import { adminHooks } from '@/src/domains/admin/hooks/admin.hooks'
import { AdminDataTable } from '@/src/domains/admin/components/AdminDataTable'
import { AdminConfirmDialog } from '@/src/domains/admin/components/AdminConfirmDialog'
import { AdminPagination } from '@/src/domains/admin/components/AdminPagination'
import { MoodFormDialog } from './MoodFormDialog'
import { getMoodColumns } from './mood-columns'
import { Button } from '@/src/shared/components/UI/button'
import { PageHeader } from '@/src/shared/components/UI/PageHeader'
import type { AdminMoodDto } from '@/src/domains/admin/types/admin.types'

export default function AdminMoodsPage() {
  const [page, setPage] = useState(1)
  const limit = 10
  const { data, isLoading, error } = adminHooks.useAdminMoods(page, limit)
  const { mutate: deleteMood, isPending: isDeleting } = adminHooks.useDeleteMood()

  const [deleteTarget, setDeleteTarget] = useState<AdminMoodDto | null>(null)
  const [editTarget, setEditTarget] = useState<AdminMoodDto | null>(null)
  const [showCreate, setShowCreate] = useState(false)

  const columns = getMoodColumns({ onEdit: setEditTarget, onDelete: setDeleteTarget })

  return (
    <div className="space-y-6">
      <PageHeader
        title="Moods"
        description={`${data?.total ?? '—'} moods en el catálogo`}
        actions={
          <Button onClick={() => setShowCreate(true)} className="gap-2">
            <Plus className="h-4 w-4" />
            Nuevo Mood
          </Button>
        }
      />

      <AdminDataTable
        columns={columns}
        data={data?.data ?? []}
        isLoading={isLoading}
        error={error ? 'Error al cargar los moods' : null}
        emptyMessage="No hay moods registrados"
        keyExtractor={(row) => row.id}
      />

      <AdminPagination total={data?.total ?? 0} page={page} limit={limit} onPageChange={setPage} />

      <AdminConfirmDialog
        isOpen={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={() => {
          if (deleteTarget) deleteMood(deleteTarget.id, { onSuccess: () => setDeleteTarget(null) })
        }}
        isLoading={isDeleting}
        title="¿Eliminar mood?"
        description={`Se eliminará "${deleteTarget?.name}" del catálogo. Los tracks asociados perderán esta etiqueta.`}
      />

      <MoodFormDialog
        isOpen={showCreate}
        onClose={() => setShowCreate(false)}
      />

      <MoodFormDialog
        isOpen={!!editTarget}
        onClose={() => setEditTarget(null)}
        initialData={editTarget}
      />
    </div>
  )
}
