'use client'

import { useEffect, useState } from 'react'
import { Plus } from 'lucide-react'
import { adminGuestsHooks } from '@/src/domains/admin/guests/admin-guests.hooks'
import { AdminDataTable } from '@/src/domains/admin/components/AdminDataTable'
import { AdminConfirmDialog } from '@/src/domains/admin/components/AdminConfirmDialog'
import { AdminPagination } from '@/src/domains/admin/components/AdminPagination'
import { useDebouncedSearch } from '@/src/domains/admin/shared/useDebouncedSearch'
import { Button } from '@/src/shared/components/UI/button'
import { PageHeader } from '@/src/shared/components/UI/PageHeader'
import { GuestFormDialog } from './GuestFormDialog'
import { getGuestColumns } from './guest-columns'
import { GuestSearchToolbar } from './guest-search-toolbar'
import type { AdminGuestDto } from '@/src/domains/admin/guests/admin-guests.types'

export default function AdminGuestsPage() {
  const [page, setPage] = useState(1)
  const limit = 10
  const [searchInput, setSearchInput] = useState('')
  const debouncedSearch = useDebouncedSearch(searchInput, 400)

  useEffect(() => { setPage(1) }, [debouncedSearch])

  const { data, isLoading, error } = adminGuestsHooks.useAdminGuests(page, limit, {
    ...(debouncedSearch && { search: debouncedSearch }),
  })
  const { mutate: deleteGuest, isPending: isDeleting } = adminGuestsHooks.useDeleteGuest()

  const [deleteTarget, setDeleteTarget] = useState<AdminGuestDto | null>(null)
  const [editTarget, setEditTarget] = useState<AdminGuestDto | null>(null)
  const [showCreate, setShowCreate] = useState(false)

  const columns = getGuestColumns({ onEdit: setEditTarget, onDelete: setDeleteTarget })

  return (
    <div className="space-y-6">
      <PageHeader
        title="Invitados"
        description={`${data?.total ?? '—'} invitados en el sistema`}
        actions={
          <Button onClick={() => setShowCreate(true)} className="gap-2">
            <Plus className="h-4 w-4" />
            Nuevo Invitado
          </Button>
        }
      />

      <GuestSearchToolbar value={searchInput} onChange={setSearchInput} />

      <AdminDataTable
        columns={columns}
        data={data?.data ?? []}
        isLoading={isLoading}
        error={error ? 'Error al cargar los invitados' : null}
        emptyMessage="No hay invitados registrados"
        keyExtractor={(row) => row.id}
      />

      <AdminPagination total={data?.total ?? 0} page={page} limit={limit} onPageChange={setPage} />

      <AdminConfirmDialog
        isOpen={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={() => {
          if (deleteTarget) deleteGuest(deleteTarget.id, { onSuccess: () => setDeleteTarget(null) })
        }}
        isLoading={isDeleting}
        title="¿Eliminar invitado?"
        description={`Se eliminará a "${deleteTarget?.name} ${deleteTarget?.lastName}" del sistema.`}
      />

      <GuestFormDialog isOpen={showCreate} onClose={() => setShowCreate(false)} />
      <GuestFormDialog isOpen={!!editTarget} onClose={() => setEditTarget(null)} initialData={editTarget} />
    </div>
  )
}
