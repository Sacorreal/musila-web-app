'use client'

import { useState } from 'react'
import { Plus } from 'lucide-react'
import { adminCmsHooks } from '@/src/domains/admin/collective-management-societies/admin-cms.hooks'
import { AdminDataTable } from '@/src/domains/admin/components/AdminDataTable'
import { AdminConfirmDialog } from '@/src/domains/admin/components/AdminConfirmDialog'
import { AdminPagination } from '@/src/domains/admin/components/AdminPagination'
import { Button } from '@/src/shared/components/UI/button'
import { Input } from '@/src/shared/components/UI/input'
import { PageHeader } from '@/src/shared/components/UI/PageHeader'
import { CMSFormDialog } from './CMSFormDialog'
import { getCmsColumns } from './cms-columns'
import type { AdminCollectiveManagementSocietyDto } from '@/src/domains/admin/collective-management-societies/admin-cms.types'

export default function AdminCollectiveManagementSocietiesPage() {
  const [page, setPage] = useState(1)
  const [search, setSearch] = useState('')
  const limit = 10

  const { data, isLoading, error } = adminCmsHooks.useAdminCollectiveManagementSocieties(page, limit, search || undefined)
  const { mutate: deprecateCms, isPending: isDeprecating } = adminCmsHooks.useDeprecateCollectiveManagementSociety()

  const [deprecateTarget, setDeprecateTarget] = useState<AdminCollectiveManagementSocietyDto | null>(null)
  const [editTarget, setEditTarget] = useState<AdminCollectiveManagementSocietyDto | null>(null)
  const [showCreate, setShowCreate] = useState(false)

  const columns = getCmsColumns({ onEdit: setEditTarget, onDeprecate: setDeprecateTarget })

  return (
    <div className="space-y-6">
      <PageHeader
        title="Sociedades de Gestión Colectiva"
        description={`${data?.total ?? '—'} sociedades en el catálogo maestro`}
        actions={
          <Button onClick={() => setShowCreate(true)} className="gap-2">
            <Plus className="h-4 w-4" />
            Nueva sociedad
          </Button>
        }
      />

      <Input
        placeholder="Buscar por sigla o nombre..."
        value={search}
        onChange={(e) => {
          setSearch(e.target.value)
          setPage(1)
        }}
        className="max-w-sm"
      />

      <AdminDataTable
        columns={columns}
        data={data?.data ?? []}
        isLoading={isLoading}
        error={error ? 'Error al cargar el catálogo' : null}
        emptyMessage="No hay sociedades registradas"
        keyExtractor={(row) => row.id}
      />

      <AdminPagination total={data?.total ?? 0} page={page} limit={limit} onPageChange={setPage} />

      <AdminConfirmDialog
        isOpen={!!deprecateTarget}
        onClose={() => setDeprecateTarget(null)}
        onConfirm={() => {
          if (deprecateTarget) deprecateCms(deprecateTarget.id, { onSuccess: () => setDeprecateTarget(null) })
        }}
        isLoading={isDeprecating}
        title="¿Depreciar esta sociedad?"
        description="No se elimina del catálogo: queda marcada como DEPRECATED. Las afiliaciones y expedientes que ya la referencian no se ven afectados."
        confirmLabel="Depreciar"
      />

      <CMSFormDialog isOpen={showCreate} onClose={() => setShowCreate(false)} />
      <CMSFormDialog isOpen={!!editTarget} onClose={() => setEditTarget(null)} initialData={editTarget} />
    </div>
  )
}
