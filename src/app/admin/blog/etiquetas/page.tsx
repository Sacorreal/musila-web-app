'use client'

import { useState } from 'react'
import { Plus } from 'lucide-react'
import { adminBlogTagsHooks } from '@/src/domains/blog/tags/admin-blog-tags.hooks'
import { AdminDataTable } from '@/src/domains/admin/components/AdminDataTable'
import { AdminConfirmDialog } from '@/src/domains/admin/components/AdminConfirmDialog'
import { AdminPagination } from '@/src/domains/admin/components/AdminPagination'
import { TagFormDialog } from './TagFormDialog'
import { getTagColumns } from './tag-columns'
import { Button } from '@/src/shared/components/UI/button'
import { PageHeader } from '@/src/shared/components/UI/PageHeader'
import type { BlogTagDto } from '@/src/domains/blog/shared/blog.types'

export default function AdminBlogTagsPage() {
  const [page, setPage] = useState(1)
  const limit = 20
  const { data, isLoading, error } = adminBlogTagsHooks.useAdminBlogTags(page, limit)
  const { mutate: deleteTag, isPending: isDeleting } = adminBlogTagsHooks.useDeleteBlogTag()

  const [deleteTarget, setDeleteTarget] = useState<BlogTagDto | null>(null)
  const [editTarget, setEditTarget] = useState<BlogTagDto | null>(null)
  const [showCreate, setShowCreate] = useState(false)

  const columns = getTagColumns({ onEdit: setEditTarget, onDelete: setDeleteTarget })

  return (
    <div className="space-y-6">
      <PageHeader
        title="Etiquetas del Blog"
        description={`${data?.total ?? '—'} servicios relacionados en el catálogo`}
        actions={
          <Button onClick={() => setShowCreate(true)} className="gap-2">
            <Plus className="h-4 w-4" />
            Nueva Etiqueta
          </Button>
        }
      />

      <AdminDataTable
        columns={columns}
        data={data?.data ?? []}
        isLoading={isLoading}
        error={error ? 'Error al cargar las etiquetas' : null}
        emptyMessage="No hay etiquetas registradas"
        keyExtractor={(row) => row.id}
      />

      <AdminPagination total={data?.total ?? 0} page={page} limit={limit} onPageChange={setPage} />

      <AdminConfirmDialog
        isOpen={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={() => {
          if (deleteTarget) deleteTag(deleteTarget.id, { onSuccess: () => setDeleteTarget(null) })
        }}
        isLoading={isDeleting}
        title="¿Eliminar etiqueta?"
        description={`Se eliminará "${deleteTarget?.name}" del catálogo. No podrás eliminarla si tiene artículos asociados.`}
      />

      <TagFormDialog isOpen={showCreate} onClose={() => setShowCreate(false)} />
      <TagFormDialog isOpen={!!editTarget} onClose={() => setEditTarget(null)} initialData={editTarget} />
    </div>
  )
}
