'use client'

import { useState, useEffect, useCallback } from 'react'
import { ShieldPlus } from 'lucide-react'
import { adminHooks } from '@/src/domains/admin/hooks/admin.hooks'
import { AdminDataTable } from '@/src/domains/admin/components/AdminDataTable'
import { AdminConfirmDialog } from '@/src/domains/admin/components/AdminConfirmDialog'
import { AdminPagination } from '@/src/domains/admin/components/AdminPagination'
import { CreateAdminDialog } from './CreateAdminDialog'
import { UserFormDialog } from './UserFormDialog'
import { getUserColumns } from './user-columns'
import { UserFiltersToolbar } from './user-filters-toolbar'
import { Button } from '@/src/shared/components/UI/button'
import { PageHeader } from '@/src/shared/components/UI/PageHeader'
import { type AdminUserDto } from '@/src/domains/admin/types/admin.types'
import type { UserFilters } from '@/src/domains/admin/types/admin.types'

function useDebounce<T>(value: T, ms = 400): T {
  const [debounced, setDebounced] = useState(value)
  useEffect(() => {
    const t = setTimeout(() => setDebounced(value), ms)
    return () => clearTimeout(t)
  }, [value, ms])
  return debounced
}

export default function AdminUsersPage() {
  const [page, setPage] = useState(1)
  const limit = 10

  // Filtros locales
  const [searchInput, setSearchInput] = useState('')
  const [planType, setPlanType] = useState('')
  const [isVerified, setIsVerified] = useState<'all' | 'true' | 'false'>('all')

  const debouncedSearch = useDebounce(searchInput, 400)

  const filters: UserFilters = {
    ...(debouncedSearch && { search: debouncedSearch }),
    ...(planType && { planType }),
    ...(isVerified !== 'all' && { isVerified: isVerified === 'true' }),
  }

  const hasActiveFilters = !!debouncedSearch || !!planType || isVerified !== 'all'

  const resetFilters = useCallback(() => {
    setSearchInput('')
    setPlanType('')
    setIsVerified('all')
    setPage(1)
  }, [])

  useEffect(() => { setPage(1) }, [debouncedSearch, planType, isVerified])

  const { data, isLoading, error } = adminHooks.useAdminUsers(page, limit, filters)
  const { mutate: deleteUser, isPending: isDeleting } = adminHooks.useDeleteUser()
  const { mutate: updatePlanType } = adminHooks.useUpdatePlanType()
  const { mutate: updateMusicRole } = adminHooks.useUpdateUserMusicRole()

  const [deleteTarget, setDeleteTarget] = useState<AdminUserDto | null>(null)
  const [editTarget, setEditTarget] = useState<AdminUserDto | null>(null)
  const [showCreateAdmin, setShowCreateAdmin] = useState(false)

  const columns = getUserColumns({
    onEdit: setEditTarget,
    onDelete: setDeleteTarget,
    onUpdatePlanType: updatePlanType,
    onUpdateMusicRole: updateMusicRole,
  })

  return (
    <div className="space-y-6">
      <PageHeader
        title="Usuarios"
        description={`${data?.total ?? '—'} usuarios registrados`}
        actions={
          <Button
            onClick={() => setShowCreateAdmin(true)}
            className="gap-2 bg-red-600 hover:bg-red-700 text-white"
          >
            <ShieldPlus className="h-4 w-4" />
            Crear Administrador
          </Button>
        }
      />

      <UserFiltersToolbar
        searchInput={searchInput}
        onSearchInputChange={setSearchInput}
        planType={planType}
        onPlanTypeChange={setPlanType}
        isVerified={isVerified}
        onIsVerifiedChange={setIsVerified}
        hasActiveFilters={hasActiveFilters}
        onClearFilters={resetFilters}
      />

      <AdminDataTable
        columns={columns}
        data={data?.data ?? []}
        isLoading={isLoading}
        error={error ? 'Error al cargar los usuarios' : null}
        emptyMessage={hasActiveFilters ? 'No se encontraron usuarios con esos filtros' : 'No hay usuarios registrados'}
        keyExtractor={(row) => row.id}
      />

      <AdminPagination
        total={data?.total ?? 0}
        page={page}
        limit={limit}
        onPageChange={setPage}
      />

      <AdminConfirmDialog
        isOpen={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={() => {
          if (deleteTarget) {
            deleteUser(deleteTarget.id, { onSuccess: () => setDeleteTarget(null) })
          }
        }}
        isLoading={isDeleting}
        title="¿Eliminar usuario?"
        description={`Esta acción eliminará a "${deleteTarget?.name} ${deleteTarget?.lastName}" del sistema. Esta operación es reversible desde la base de datos (soft delete).`}
      />

      <CreateAdminDialog isOpen={showCreateAdmin} onClose={() => setShowCreateAdmin(false)} />

      <UserFormDialog user={editTarget} onClose={() => setEditTarget(null)} />
    </div>
  )
}
