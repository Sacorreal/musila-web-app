import { Pencil, ShieldOff } from 'lucide-react'
import type { ColumnDef } from '@/src/domains/admin/components/AdminDataTable'
import { CmoStatus, type AdminCollectiveManagementSocietyDto } from '@/src/domains/admin/collective-management-societies/admin-cms.types'

const STATUS_LABELS: Record<CmoStatus, string> = {
  [CmoStatus.ACTIVE]: 'Activa',
  [CmoStatus.INACTIVE]: 'Inactiva',
  [CmoStatus.DEPRECATED]: 'Depreciada',
}

const STATUS_CLASSNAMES: Record<CmoStatus, string> = {
  [CmoStatus.ACTIVE]: 'bg-primary/10 text-primary',
  [CmoStatus.INACTIVE]: 'bg-muted text-muted-foreground',
  [CmoStatus.DEPRECATED]: 'bg-destructive/10 text-destructive',
}

interface CmsColumnsOptions {
  onEdit: (row: AdminCollectiveManagementSocietyDto) => void
  onDeprecate: (row: AdminCollectiveManagementSocietyDto) => void
}

export function getCmsColumns({ onEdit, onDeprecate }: CmsColumnsOptions): ColumnDef<AdminCollectiveManagementSocietyDto>[] {
  return [
    {
      key: 'acronym',
      header: 'Sigla',
      width: '100px',
      render: (row) => <span className="text-sm font-bold">{row.acronym}</span>,
    },
    {
      key: 'officialName',
      header: 'Nombre oficial',
      width: '2fr',
      render: (row) => <p className="truncate text-sm">{row.officialName}</p>,
    },
    {
      key: 'country',
      header: 'País',
      width: '140px',
      render: (row) => (
        <span className="text-xs text-muted-foreground">
          {row.country} ({row.isoCountryCode})
        </span>
      ),
    },
    {
      key: 'cisacSocietyId',
      header: 'Código CISAC',
      width: '110px',
      render: (row) => <span className="text-xs text-muted-foreground">{row.cisacSocietyId ?? '—'}</span>,
    },
    {
      key: 'status',
      header: 'Estado',
      width: '110px',
      render: (row) => (
        <span className={`rounded-full px-2 py-0.5 text-xs font-semibold ${STATUS_CLASSNAMES[row.status]}`}>
          {STATUS_LABELS[row.status]}
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
            onClick={() => onEdit(row)}
            className="flex h-8 w-8 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-primary/10 hover:text-primary"
            aria-label="Editar sociedad"
          >
            <Pencil className="h-3.5 w-3.5" />
          </button>
          {row.status !== CmoStatus.DEPRECATED && (
            <button
              onClick={() => onDeprecate(row)}
              className="flex h-8 w-8 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-destructive/10 hover:text-destructive"
              aria-label="Depreciar sociedad"
            >
              <ShieldOff className="h-3.5 w-3.5" />
            </button>
          )}
        </div>
      ),
    },
  ]
}
