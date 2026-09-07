import { Lock, Pencil, Trash2 } from 'lucide-react'
import type { ColumnDef } from '@/src/domains/admin/components/AdminDataTable'
import type { StaffRoleDto } from '@/src/domains/admin/staff-roles/staff-roles.types'

interface RoleColumnsOptions {
  onEdit: (row: StaffRoleDto) => void
  onDelete: (row: StaffRoleDto) => void
}

export function getRoleColumns({ onEdit, onDelete }: RoleColumnsOptions): ColumnDef<StaffRoleDto>[] {
  return [
    {
      key: 'name',
      header: 'Rol',
      width: '2fr',
      render: (row) => (
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium">{row.name}</span>
          {row.isSystem && <Lock className="h-3 w-3 text-muted-foreground" aria-label="Rol del sistema" />}
        </div>
      ),
    },
    {
      key: 'description',
      header: 'Descripción',
      width: '3fr',
      render: (row) => (
        <span className="text-xs text-muted-foreground">{row.description ?? '—'}</span>
      ),
    },
    {
      key: 'permissions',
      header: 'Permisos',
      width: '110px',
      render: (row) => (
        <span className="rounded-full bg-muted px-2 py-0.5 text-xs font-semibold text-muted-foreground">
          {row.permissions.length}
        </span>
      ),
    },
    {
      key: 'actions',
      header: '',
      width: '80px',
      render: (row) =>
        row.isSystem ? null : (
          <div className="flex items-center gap-1">
            <button
              onClick={() => onEdit(row)}
              className="flex h-8 w-8 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
              aria-label="Editar rol"
            >
              <Pencil className="h-3.5 w-3.5" />
            </button>
            <button
              onClick={() => onDelete(row)}
              className="flex h-8 w-8 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-destructive/10 hover:text-destructive"
              aria-label="Eliminar rol"
            >
              <Trash2 className="h-3.5 w-3.5" />
            </button>
          </div>
        ),
    },
  ]
}
