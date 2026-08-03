'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Plus, Search } from 'lucide-react'
import { adminBlogAuthorsHooks } from '@/src/domains/blog/authors/admin-blog-authors.hooks'
import { useDebouncedSearch } from '@/src/domains/admin/shared/useDebouncedSearch'
import { AdminDataTable } from '@/src/domains/admin/components/AdminDataTable'
import { AdminConfirmDialog } from '@/src/domains/admin/components/AdminConfirmDialog'
import { AdminPagination } from '@/src/domains/admin/components/AdminPagination'
import { getAuthorColumns } from './author-columns'
import { Button } from '@/src/shared/components/UI/button'
import { Input } from '@/src/shared/components/UI/input'
import { PageHeader } from '@/src/shared/components/UI/PageHeader'
import type { BlogAuthorDto } from '@/src/domains/blog/shared/blog.types'

export default function AdminBlogAuthorsPage() {
  const router = useRouter()
  const [page, setPage] = useState(1)
  const [search, setSearch] = useState('')
  const debouncedSearch = useDebouncedSearch(search)
  const limit = 10

  const { data, isLoading, error } = adminBlogAuthorsHooks.useAdminBlogAuthors(page, limit, debouncedSearch || undefined)
  const { mutate: deleteAuthor, isPending: isDeleting } = adminBlogAuthorsHooks.useDeleteBlogAuthor()

  const [deleteTarget, setDeleteTarget] = useState<BlogAuthorDto | null>(null)

  const columns = getAuthorColumns({
    onEdit: (row) => router.push(`/admin/blog/autores/${row.id}/editar`),
    onDelete: setDeleteTarget,
  })

  return (
    <div className="space-y-6">
      <PageHeader
        title="Autores del Blog"
        description={`${data?.total ?? '—'} autores registrados`}
        actions={
          <Button onClick={() => router.push('/admin/blog/autores/new')} className="gap-2">
            <Plus className="h-4 w-4" />
            Nuevo Autor
          </Button>
        }
      />

      <div className="relative max-w-sm">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder="Buscar autor por nombre..."
          className="pl-9"
          value={search}
          onChange={(e) => {
            setSearch(e.target.value)
            setPage(1)
          }}
        />
      </div>

      <AdminDataTable
        columns={columns}
        data={data?.data ?? []}
        isLoading={isLoading}
        error={error ? 'Error al cargar los autores' : null}
        emptyMessage="No hay autores registrados"
        keyExtractor={(row) => row.id}
      />

      <AdminPagination total={data?.total ?? 0} page={page} limit={limit} onPageChange={setPage} />

      <AdminConfirmDialog
        isOpen={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={() => {
          if (deleteTarget) deleteAuthor(deleteTarget.id, { onSuccess: () => setDeleteTarget(null) })
        }}
        isLoading={isDeleting}
        title="¿Eliminar autor?"
        description={`Se eliminará "${deleteTarget?.name}". No podrás eliminarlo si tiene artículos asociados.`}
      />
    </div>
  )
}
