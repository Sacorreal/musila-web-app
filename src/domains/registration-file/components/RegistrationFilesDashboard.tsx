'use client'

import { useEffect, useMemo, useState } from 'react'
import Link from 'next/link'
import { ArrowUpRight, Filter, Search, X } from 'lucide-react'
import { useAuthStore } from '@/src/domains/auth/store/use-auth-store'
import { UserPlanType, isAdminPlanType } from '@/src/domains/users/types/user.types'
import { AdminDataTable, type ColumnDef } from '@/src/domains/admin/components/AdminDataTable'
import { AdminPagination } from '@/src/domains/admin/components/AdminPagination'
import { AdminAccessDenied } from '@/src/domains/admin/components/AdminAccessDenied'
import { AdminEntitySelect } from '@/src/domains/admin/shared/AdminEntitySelect'
import { fetchUserOptions } from '@/src/domains/admin/shared/fetch-user-options'
import { useDebouncedSearch } from '@/src/domains/admin/shared/useDebouncedSearch'
import { Badge } from '@/src/shared/components/UI/badge'
import { Progress } from '@/src/shared/components/UI/progress'
import { useRegistrationFiles } from '../hooks/use-registration-file.hooks'
import { RegistrationFileBadge } from './RegistrationFileBadge'
import { RegistrationFileStatus, type RegistrationFileListItemDto } from '../types/registration-file.types'

const PAGE_SIZE = 10

const STATUS_FILTERS: { value: string; label: string }[] = [
  { value: '', label: 'Todos los estados' },
  { value: RegistrationFileStatus.EN_CONSTRUCCION, label: 'En construcción' },
  { value: RegistrationFileStatus.INCOMPLETO, label: 'Incompleto' },
  { value: RegistrationFileStatus.VALIDADO_PARCIALMENTE, label: 'Validado parcialmente' },
  { value: RegistrationFileStatus.LISTO_PARA_PRESENTAR, label: 'Listo para presentar' },
]

const OWNER_PLAN_TYPES = [UserPlanType.PLAN_AUTOR, UserPlanType.PLAN_360]

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString('es-CO', { day: '2-digit', month: 'short', year: 'numeric' })
}

function CompletenessCell({ percentage }: { percentage: number | null }) {
  if (percentage === null) {
    return <span className="text-xs text-muted-foreground">—</span>
  }
  return (
    <div className="w-full space-y-1">
      <span className="text-xs font-semibold text-foreground">{percentage}%</span>
      <Progress value={percentage} className="h-1.5" />
    </div>
  )
}

export function RegistrationFilesDashboard() {
  const { user } = useAuthStore()
  const isAdmin = isAdminPlanType(user?.planType)
  const isOwner = !!user?.planType && OWNER_PLAN_TYPES.includes(user.planType)

  const [searchInput, setSearchInput] = useState('')
  const [status, setStatus] = useState('')
  const [ownerId, setOwnerId] = useState<string | null>(null)
  const [page, setPage] = useState(1)

  const debouncedSearch = useDebouncedSearch(searchInput, 400)

  // Al cambiar cualquier filtro, volver a la primera página.
  useEffect(() => {
    setPage(1)
  }, [debouncedSearch, status, ownerId])

  const query = useMemo(
    () => ({
      page,
      limit: PAGE_SIZE,
      search: debouncedSearch.trim() || undefined,
      status: (status || undefined) as RegistrationFileStatus | undefined,
      ownerId: (isAdmin && ownerId) || undefined,
    }),
    [page, debouncedSearch, status, ownerId, isAdmin],
  )

  const { data, isLoading, isError } = useRegistrationFiles(query)

  const columns = useMemo<ColumnDef<RegistrationFileListItemDto>[]>(() => {
    const base: ColumnDef<RegistrationFileListItemDto>[] = [
      {
        key: 'caseNumber',
        header: 'N° Expediente',
        width: '1.2fr',
        render: (row) => <span className="font-mono text-xs text-foreground">{row.caseNumber}</span>,
      },
      {
        key: 'title',
        header: 'Título',
        width: '1.4fr',
        render: (row) => <span className="text-sm font-semibold text-foreground line-clamp-1">{row.title}</span>,
      },
      {
        key: 'status',
        header: 'Estado',
        width: '1fr',
        render: (row) => <RegistrationFileBadge status={row.status} />,
      },
      {
        key: 'completeness',
        header: 'Completitud',
        width: '1fr',
        render: (row) => <CompletenessCell percentage={row.completenessPercentage} />,
      },
      {
        key: 'profiles',
        header: 'Perfiles',
        width: '0.9fr',
        render: (row) => (
          <div className="flex flex-wrap gap-1">
            {row.activeProfileKeys.length ? (
              row.activeProfileKeys.map((key) => (
                <Badge key={key} variant="outline" className="text-[9px] font-bold uppercase">
                  {key}
                </Badge>
              ))
            ) : (
              <span className="text-xs text-muted-foreground">—</span>
            )}
          </div>
        ),
      },
    ]

    if (isAdmin) {
      base.push({
        key: 'owner',
        header: 'Propietario',
        width: '1fr',
        render: (row) => <span className="text-sm text-muted-foreground line-clamp-1">{row.ownerName}</span>,
      })
    }

    base.push(
      {
        key: 'updatedAt',
        header: 'Actualizado',
        width: '0.9fr',
        render: (row) => <span className="text-xs text-muted-foreground">{formatDate(row.updatedAt)}</span>,
      },
      {
        key: 'action',
        header: '',
        width: '0.7fr',
        render: (row) => (
          <Link
            href={`/music/tracks/${row.trackId}/expediente`}
            className="inline-flex items-center gap-1 rounded-lg border border-border px-2.5 py-1 text-xs font-bold text-foreground transition-colors hover:border-primary hover:text-primary"
          >
            Abrir
            <ArrowUpRight className="h-3.5 w-3.5" />
          </Link>
        ),
      },
    )

    return base
  }, [isAdmin])

  const hasActiveFilters = Boolean(searchInput || status || ownerId)

  const clearFilters = () => {
    setSearchInput('')
    setStatus('')
    setOwnerId(null)
  }

  if (!isAdmin && !isOwner) {
    return (
      <AdminAccessDenied message="Los expedientes de registro están disponibles para autores y administradores." />
    )
  }

  return (
    <div className="space-y-4">
      {/* Toolbar de filtros */}
      <div className="rounded-2xl border border-border bg-card p-4 shadow-sm space-y-3">
        <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          <Filter className="h-3.5 w-3.5" />
          Filtros
        </div>

        <div className="flex flex-wrap gap-3">
          {/* Búsqueda por número o título */}
          <div className="relative min-w-[240px] flex-1">
            <Search className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
            <input
              type="text"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              placeholder="Buscar por N° de expediente o título…"
              aria-label="Buscar expedientes"
              className="h-9 w-full rounded-lg border border-border bg-background pl-9 pr-9 text-sm outline-none transition-colors placeholder:text-muted-foreground focus:border-primary focus:ring-1 focus:ring-primary"
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

          {/* Estado */}
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            aria-label="Filtrar por estado"
            className="h-9 rounded-lg border border-border bg-background px-3 text-sm text-foreground outline-none transition-colors focus:border-primary focus:ring-1 focus:ring-primary"
          >
            {STATUS_FILTERS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>

          {/* Propietario (solo admin) */}
          {isAdmin && (
            <div className="min-w-[220px]">
              <AdminEntitySelect
                value={ownerId}
                onChange={setOwnerId}
                fetchOptions={fetchUserOptions}
                placeholder="Filtrar por propietario…"
                emptyMessage="Sin usuarios"
              />
            </div>
          )}

          {/* Limpiar filtros */}
          {hasActiveFilters && (
            <button
              onClick={clearFilters}
              className="flex h-9 items-center gap-1.5 rounded-lg border border-border px-3 text-sm text-muted-foreground transition-colors hover:border-destructive/40 hover:bg-destructive/5 hover:text-destructive"
            >
              <X className="h-3.5 w-3.5" />
              Limpiar
            </button>
          )}
        </div>
      </div>

      {/* Tabla */}
      <AdminDataTable
        columns={columns}
        data={data?.data ?? []}
        isLoading={isLoading}
        error={isError ? 'No se pudieron cargar los expedientes.' : null}
        emptyMessage={
          hasActiveFilters
            ? 'Ningún expediente coincide con los filtros aplicados.'
            : 'Aún no hay expedientes de registro.'
        }
        keyExtractor={(row) => row.id}
      />

      {data && (
        <AdminPagination total={data.total} page={data.page} limit={data.limit} onPageChange={setPage} />
      )}
    </div>
  )
}
