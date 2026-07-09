'use client'

import { useEffect, useState } from 'react'
import { Plus, Pencil, Trash2, Search, X } from 'lucide-react'
import { adminGuestsHooks } from '@/src/domains/admin/guests/admin-guests.hooks'
import { AdminDataTable, type ColumnDef } from '@/src/domains/admin/components/AdminDataTable'
import { AdminConfirmDialog } from '@/src/domains/admin/components/AdminConfirmDialog'
import { AdminPagination } from '@/src/domains/admin/components/AdminPagination'
import { useDebouncedSearch } from '@/src/domains/admin/shared/useDebouncedSearch'
import { Button } from '@/src/shared/components/UI/button'
import { GuestFormDialog } from './GuestFormDialog'
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

  const columns: ColumnDef<AdminGuestDto>[] = [
    {
      key: 'name',
      header: 'Invitado',
      width: '2fr',
      render: (row) => (
        <div className="min-w-0">
          <p className="truncate text-sm font-semibold">{row.name} {row.lastName}</p>
          <p className="truncate text-xs text-muted-foreground">{row.email}</p>
        </div>
      ),
    },
    {
      key: 'invitedBy',
      header: 'Invitado por',
      width: '2fr',
      render: (row) => (
        <span className="text-xs text-muted-foreground">
          {row.invited_by ? `${row.invited_by.name} ${row.invited_by.lastName}` : '—'}
        </span>
      ),
    },
    {
      key: 'verified',
      header: 'Verificado',
      width: '100px',
      render: (row) => (
        <span className={`text-xs font-medium ${row.isVerified ? 'text-emerald-600' : 'text-muted-foreground'}`}>
          {row.isVerified ? 'Sí' : 'No'}
        </span>
      ),
    },
    {
      key: 'createdAt',
      header: 'Registro',
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
      width: '80px',
      render: (row) => (
        <div className="flex items-center gap-1">
          <button
            onClick={() => setEditTarget(row)}
            className="flex h-8 w-8 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-primary/10 hover:text-primary"
            aria-label={`Editar ${row.name}`}
          >
            <Pencil className="h-3.5 w-3.5" />
          </button>
          <button
            onClick={() => setDeleteTarget(row)}
            className="flex h-8 w-8 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-destructive/10 hover:text-destructive"
            aria-label={`Eliminar ${row.name}`}
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
          <h2 className="text-xl font-black tracking-tight">Invitados</h2>
          <p className="text-sm text-muted-foreground">{data?.total ?? '—'} invitados en el sistema</p>
        </div>
        <Button onClick={() => setShowCreate(true)} className="gap-2">
          <Plus className="h-4 w-4" />
          Nuevo Invitado
        </Button>
      </div>

      <div className="relative max-w-sm">
        <Search className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
        <input
          type="text"
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
          placeholder="Buscar por nombre o email…"
          className="h-9 w-full rounded-lg border border-border bg-background pl-9 pr-3 text-sm outline-none transition-colors placeholder:text-muted-foreground focus:border-primary focus:ring-1 focus:ring-primary"
        />
        {searchInput && (
          <button
            onClick={() => setSearchInput('')}
            className="absolute right-2.5 top-1/2 -translate-y-1/2 rounded p-0.5 text-muted-foreground hover:text-foreground"
            aria-label="Limpiar búsqueda"
          >
            <X className="h-3 w-3" />
          </button>
        )}
      </div>

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
