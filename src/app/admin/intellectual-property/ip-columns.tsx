import { ExternalLink, Pencil, Trash2 } from 'lucide-react'
import type { ColumnDef } from '@/src/domains/admin/components/AdminDataTable'
import type { AdminIntellectualPropertyDto } from '@/src/domains/admin/intellectual-property/admin-ip.types'

const TYPE_LABELS: Record<string, string> = {
  copyrightOffice: 'Copyright Office',
  cmo: 'CMO',
  splitSheet: 'Split Sheet',
}

interface IpColumnsOptions {
  onEdit: (row: AdminIntellectualPropertyDto) => void
  onDelete: (row: AdminIntellectualPropertyDto) => void
}

export function getIpColumns({ onEdit, onDelete }: IpColumnsOptions): ColumnDef<AdminIntellectualPropertyDto>[] {
  return [
    {
      key: 'track',
      header: 'Track',
      width: '2fr',
      render: (row) => <p className="text-sm font-semibold truncate">{row.track?.title ?? '—'}</p>,
    },
    {
      key: 'type',
      header: 'Tipo',
      width: '140px',
      render: (row) => (
        <span className="rounded-full bg-muted px-2 py-0.5 text-xs font-semibold">{TYPE_LABELS[row.type]}</span>
      ),
    },
    {
      key: 'key',
      header: 'Clave',
      width: '120px',
      render: (row) => <span className="text-xs text-muted-foreground">{row.key}</span>,
    },
    {
      key: 'document',
      header: 'Documento',
      width: '100px',
      render: (row) => (
        <a
          href={row.documentUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-1 text-xs text-primary hover:underline"
        >
          Ver <ExternalLink className="h-3 w-3" />
        </a>
      ),
    },
    {
      key: 'createdAt',
      header: 'Creado',
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
            onClick={() => onEdit(row)}
            className="flex h-8 w-8 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-primary/10 hover:text-primary"
            aria-label="Editar registro"
          >
            <Pencil className="h-3.5 w-3.5" />
          </button>
          <button
            onClick={() => onDelete(row)}
            className="flex h-8 w-8 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-destructive/10 hover:text-destructive"
            aria-label="Eliminar registro"
          >
            <Trash2 className="h-3.5 w-3.5" />
          </button>
        </div>
      ),
    },
  ]
}
