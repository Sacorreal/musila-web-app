'use client'

import { useEffect, useState } from 'react'
import { Plus } from 'lucide-react'
import { adminAffiliatesHooks } from '@/src/domains/admin/affiliates/admin-affiliates.hooks'
import { AdminDataTable } from '@/src/domains/admin/components/AdminDataTable'
import { AdminConfirmDialog } from '@/src/domains/admin/components/AdminConfirmDialog'
import { AdminPagination } from '@/src/domains/admin/components/AdminPagination'
import { useDebouncedSearch } from '@/src/domains/admin/shared/useDebouncedSearch'
import { Button } from '@/src/shared/components/UI/button'
import { PageHeader } from '@/src/shared/components/UI/PageHeader'
import { AffiliateFormDialog } from './AffiliateFormDialog'
import { getAffiliateColumns } from './affiliate-columns'
import { AffiliateFiltersToolbar } from './affiliate-filters-toolbar'
import {
  AffiliateStatus,
  AffiliateTier,
  type AdminAffiliateDto,
  type AdminAffiliateFilters,
} from '@/src/domains/admin/affiliates/admin-affiliates.types'

export default function AdminAffiliatesPage() {
  const [page, setPage] = useState(1)
  const limit = 10

  const [searchInput, setSearchInput] = useState('')
  const [status, setStatus] = useState('')
  const [tier, setTier] = useState('')
  const debouncedSearch = useDebouncedSearch(searchInput, 400)

  const filters: AdminAffiliateFilters = {
    ...(debouncedSearch && { q: debouncedSearch }),
    ...(status && { status: status as AffiliateStatus }),
    ...(tier && { tier: tier as AffiliateTier }),
  }
  const hasActiveFilters = !!debouncedSearch || !!status || !!tier

  useEffect(() => { setPage(1) }, [debouncedSearch, status, tier])

  const { data, isLoading, error } = adminAffiliatesHooks.useAdminAffiliates(page, limit, filters)
  const { mutate: updateStatus } = adminAffiliatesHooks.useUpdateAffiliateStatus()
  const { mutate: updateTier } = adminAffiliatesHooks.useUpdateAffiliateTier()
  const { mutate: deleteAffiliate, isPending: isDeleting } = adminAffiliatesHooks.useDeleteAffiliate()

  const [deleteTarget, setDeleteTarget] = useState<AdminAffiliateDto | null>(null)
  const [showCreate, setShowCreate] = useState(false)

  const columns = getAffiliateColumns({
    onDelete: setDeleteTarget,
    onUpdateTier: updateTier,
    onUpdateStatus: updateStatus,
  })

  return (
    <div className="space-y-6">
      <PageHeader
        title="Afiliados"
        description={`${data?.total ?? '—'} afiliados en el programa de referidos`}
        actions={
          <Button onClick={() => setShowCreate(true)} className="gap-2">
            <Plus className="h-4 w-4" />
            Nuevo Afiliado
          </Button>
        }
      />

      <AffiliateFiltersToolbar
        searchInput={searchInput}
        onSearchInputChange={setSearchInput}
        status={status}
        onStatusChange={setStatus}
        tier={tier}
        onTierChange={setTier}
        hasActiveFilters={hasActiveFilters}
        onClearFilters={() => { setSearchInput(''); setStatus(''); setTier('') }}
      />

      <AdminDataTable
        columns={columns}
        data={data?.data ?? []}
        isLoading={isLoading}
        error={error ? 'Error al cargar los afiliados' : null}
        emptyMessage={hasActiveFilters ? 'No se encontraron afiliados con esos filtros' : 'No hay afiliados registrados'}
        keyExtractor={(row) => row.id}
      />

      <AdminPagination total={data?.total ?? 0} page={page} limit={limit} onPageChange={setPage} />

      <AdminConfirmDialog
        isOpen={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={() => {
          if (deleteTarget) deleteAffiliate(deleteTarget.id, { onSuccess: () => setDeleteTarget(null) })
        }}
        isLoading={isDeleting}
        title="¿Eliminar afiliado?"
        description={`Se eliminará a "${deleteTarget?.name} ${deleteTarget?.lastName}" del programa de afiliados. Sus comisiones históricas se conservan.`}
      />

      <AffiliateFormDialog isOpen={showCreate} onClose={() => setShowCreate(false)} />
    </div>
  )
}
