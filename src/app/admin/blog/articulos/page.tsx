'use client'

import { useMemo, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Plus } from 'lucide-react'
import { adminBlogArticlesHooks } from '@/src/domains/blog/articles/admin-blog-articles.hooks'
import { adminBlogAuthorsHooks } from '@/src/domains/blog/authors/admin-blog-authors.hooks'
import { useDebouncedSearch } from '@/src/domains/admin/shared/useDebouncedSearch'
import { AdminDataTable } from '@/src/domains/admin/components/AdminDataTable'
import { AdminConfirmDialog } from '@/src/domains/admin/components/AdminConfirmDialog'
import { AdminPagination } from '@/src/domains/admin/components/AdminPagination'
import { ArticleFiltersToolbar } from './article-filters-toolbar'
import { getArticleColumns } from './article-columns'
import { Button } from '@/src/shared/components/UI/button'
import { PageHeader } from '@/src/shared/components/UI/PageHeader'
import type { BlogArticleDto, BlogArticleStatus } from '@/src/domains/blog/shared/blog.types'

type StatusFilter = 'all' | BlogArticleStatus

export default function AdminBlogArticlesPage() {
  const router = useRouter()
  const [page, setPage] = useState(1)
  const limit = 10

  const [search, setSearch] = useState('')
  const [authorId, setAuthorId] = useState('')
  const [status, setStatus] = useState<StatusFilter>('all')
  const [dateFrom, setDateFrom] = useState('')
  const [dateTo, setDateTo] = useState('')
  const debouncedSearch = useDebouncedSearch(search)

  const filters = useMemo(
    () => ({
      ...(debouncedSearch && { search: debouncedSearch }),
      ...(authorId && { authorId }),
      ...(status !== 'all' && { status }),
      ...(dateFrom && { dateFrom }),
      ...(dateTo && { dateTo }),
    }),
    [debouncedSearch, authorId, status, dateFrom, dateTo],
  )

  const { data, isLoading, error } = adminBlogArticlesHooks.useAdminBlogArticles(page, limit, filters)
  const { data: authorsPage } = adminBlogAuthorsHooks.useAdminBlogAuthors(1, 100)
  const { mutate: deleteArticle, isPending: isDeleting } = adminBlogArticlesHooks.useDeleteBlogArticle()
  const { mutate: publishArticle } = adminBlogArticlesHooks.usePublishBlogArticle()
  const { mutate: unpublishArticle } = adminBlogArticlesHooks.useUnpublishBlogArticle()

  const [deleteTarget, setDeleteTarget] = useState<BlogArticleDto | null>(null)

  const hasActiveFilters = !!(search || authorId || status !== 'all' || dateFrom || dateTo)
  const clearFilters = () => {
    setSearch('')
    setAuthorId('')
    setStatus('all')
    setDateFrom('')
    setDateTo('')
    setPage(1)
  }

  const columns = getArticleColumns({
    onEdit: (row) => router.push(`/admin/blog/articulos/${row.id}/editar`),
    onDelete: setDeleteTarget,
    onTogglePublish: (row) => (row.status === 'published' ? unpublishArticle(row.id) : publishArticle(row.id)),
  })

  return (
    <div className="space-y-6">
      <PageHeader
        title="Artículos del Blog"
        description={`${data?.total ?? '—'} artículos`}
        actions={
          <Button onClick={() => router.push('/admin/blog/articulos/new')} className="gap-2">
            <Plus className="h-4 w-4" />
            Nuevo Artículo
          </Button>
        }
      />

      <ArticleFiltersToolbar
        searchInput={search}
        onSearchInputChange={(value) => { setSearch(value); setPage(1) }}
        authors={authorsPage?.data ?? []}
        authorId={authorId}
        onAuthorIdChange={(value) => { setAuthorId(value); setPage(1) }}
        status={status}
        onStatusChange={(value) => { setStatus(value); setPage(1) }}
        dateFrom={dateFrom}
        onDateFromChange={(value) => { setDateFrom(value); setPage(1) }}
        dateTo={dateTo}
        onDateToChange={(value) => { setDateTo(value); setPage(1) }}
        hasActiveFilters={hasActiveFilters}
        onClearFilters={clearFilters}
      />

      <AdminDataTable
        columns={columns}
        data={data?.data ?? []}
        isLoading={isLoading}
        error={error ? 'Error al cargar los artículos' : null}
        emptyMessage="No hay artículos registrados"
        keyExtractor={(row) => row.id}
      />

      <AdminPagination total={data?.total ?? 0} page={page} limit={limit} onPageChange={setPage} />

      <AdminConfirmDialog
        isOpen={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={() => {
          if (deleteTarget) deleteArticle(deleteTarget.id, { onSuccess: () => setDeleteTarget(null) })
        }}
        isLoading={isDeleting}
        title="¿Eliminar artículo?"
        description={`Se eliminará "${deleteTarget?.title}" del blog de forma permanente.`}
      />
    </div>
  )
}
