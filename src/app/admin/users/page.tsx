'use client'

import { useState, useEffect, useCallback } from 'react'
import { ShieldPlus, Trash2, Pencil, Search, X, Filter } from 'lucide-react'
import { adminHooks } from '@/src/domains/admin/hooks/admin.hooks'
import { AdminDataTable, type ColumnDef } from '@/src/domains/admin/components/AdminDataTable'
import { AdminConfirmDialog } from '@/src/domains/admin/components/AdminConfirmDialog'
import { AdminPagination } from '@/src/domains/admin/components/AdminPagination'
import { CreateAdminDialog } from './CreateAdminDialog'
import { UserFormDialog } from './UserFormDialog'
import { Button } from '@/src/shared/components/UI/button'
import { type AdminUserDto } from '@/src/domains/admin/types/admin.types'
import { UserRole } from '@/src/domains/users/types/user.types'
import type { UserFilters } from '@/src/domains/admin/types/admin.types'

const ROLE_COLORS: Record<string, string> = {
  admin: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
  autor: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
  interprete: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400',
  cantautor: 'bg-violet-100 text-violet-700 dark:bg-violet-900/30 dark:text-violet-400',
  invitado: 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400',
  editor: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400',
}

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
  const [role, setRole] = useState('')
  const [isVerified, setIsVerified] = useState<'all' | 'true' | 'false'>('all')

  const debouncedSearch = useDebounce(searchInput, 400)

  const filters: UserFilters = {
    ...(debouncedSearch && { search: debouncedSearch }),
    ...(role && { role }),
    ...(isVerified !== 'all' && { isVerified: isVerified === 'true' }),
  }

  const hasActiveFilters = !!debouncedSearch || !!role || isVerified !== 'all'

  const resetFilters = useCallback(() => {
    setSearchInput('')
    setRole('')
    setIsVerified('all')
    setPage(1)
  }, [])

  useEffect(() => { setPage(1) }, [debouncedSearch, role, isVerified])

  const { data, isLoading, error } = adminHooks.useAdminUsers(page, limit, filters)
  const { mutate: deleteUser, isPending: isDeleting } = adminHooks.useDeleteUser()
  const { mutate: updateRole } = adminHooks.useUpdateUserRole()

  const [deleteTarget, setDeleteTarget] = useState<AdminUserDto | null>(null)
  const [editTarget, setEditTarget] = useState<AdminUserDto | null>(null)
  const [showCreateAdmin, setShowCreateAdmin] = useState(false)

  const columns: ColumnDef<AdminUserDto>[] = [
    {
      key: 'name',
      header: 'Usuario',
      width: '2fr',
      render: (row) => (
        <div className="min-w-0">
          <p className="truncate text-sm font-semibold">{row.name} {row.lastName}</p>
          <p className="truncate text-xs text-muted-foreground">{row.email}</p>
        </div>
      ),
    },
    {
      key: 'role',
      header: 'Rol',
      width: '160px',
      render: (row) => (
        <select
          value={row.role}
          onChange={(e) => updateRole({ id: row.id, role: e.target.value as UserRole })}
          className={`rounded-full px-2 py-0.5 text-xs font-semibold border-0 cursor-pointer focus:outline-none focus:ring-2 focus:ring-primary/30 ${ROLE_COLORS[row.role] ?? 'bg-muted text-foreground'}`}
          aria-label={`Rol de ${row.name}`}
        >
          {Object.values(UserRole).map((r) => (
            <option key={r} value={r}>{r}</option>
          ))}
        </select>
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
      width: '120px',
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
          <h2 className="text-xl font-black tracking-tight">Usuarios</h2>
          <p className="text-sm text-muted-foreground">
            {data?.total ?? '—'} usuarios registrados
          </p>
        </div>
        <Button
          onClick={() => setShowCreateAdmin(true)}
          className="gap-2 bg-red-600 hover:bg-red-700 text-white"
        >
          <ShieldPlus className="h-4 w-4" />
          Crear Administrador
        </Button>
      </div>

      {/* Barra de filtros */}
      <div className="rounded-2xl border border-border bg-card p-4 shadow-sm space-y-3">
        <div className="flex items-center gap-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
          <Filter className="h-3.5 w-3.5" />
          Filtros
        </div>

        <div className="flex flex-wrap gap-3">
          {/* Búsqueda por nombre / email */}
          <div className="relative min-w-[240px] flex-1">
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

          {/* Rol */}
          <select
            value={role}
            onChange={(e) => setRole(e.target.value)}
            className="h-9 rounded-lg border border-border bg-background px-3 text-sm text-foreground outline-none transition-colors focus:border-primary focus:ring-1 focus:ring-primary"
          >
            <option value="">Todos los roles</option>
            {Object.values(UserRole).map((r) => (
              <option key={r} value={r}>{r}</option>
            ))}
          </select>

          {/* Verificación */}
          <select
            value={isVerified}
            onChange={(e) => setIsVerified(e.target.value as 'all' | 'true' | 'false')}
            className="h-9 rounded-lg border border-border bg-background px-3 text-sm text-foreground outline-none transition-colors focus:border-primary focus:ring-1 focus:ring-primary"
          >
            <option value="all">Todos los estados</option>
            <option value="true">Verificados</option>
            <option value="false">Sin verificar</option>
          </select>

          {/* Limpiar filtros */}
          {hasActiveFilters && (
            <button
              onClick={resetFilters}
              className="flex h-9 items-center gap-1.5 rounded-lg border border-border px-3 text-sm text-muted-foreground transition-colors hover:border-destructive/40 hover:bg-destructive/5 hover:text-destructive"
            >
              <X className="h-3.5 w-3.5" />
              Limpiar
            </button>
          )}
        </div>
      </div>

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
