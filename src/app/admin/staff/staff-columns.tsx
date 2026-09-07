import { Pencil, UserMinus } from 'lucide-react'
import type { ColumnDef } from '@/src/domains/admin/components/AdminDataTable'
import type { StaffMemberAssignmentDto } from '@/src/domains/admin/staff-members/staff-members.types'

interface StaffColumnsOptions {
  onChangeRole: (row: StaffMemberAssignmentDto) => void
  onRevoke: (row: StaffMemberAssignmentDto) => void
}

export function getStaffColumns({ onChangeRole, onRevoke }: StaffColumnsOptions): ColumnDef<StaffMemberAssignmentDto>[] {
  return [
    {
      key: 'user',
      header: 'Miembro',
      width: '2fr',
      render: (row) => (
        <div className="flex flex-col">
          <span className="text-sm font-medium">
            {row.user.name} {row.user.lastName}
          </span>
          <span className="text-xs text-muted-foreground">{row.user.email}</span>
        </div>
      ),
    },
    {
      key: 'role',
      header: 'Rol interno',
      width: '1.5fr',
      render: (row) => (
        <span className="rounded-full bg-primary/10 px-2 py-0.5 text-xs font-semibold text-primary">
          {row.staffRole.name}
        </span>
      ),
    },
    {
      key: 'assignedAt',
      header: 'Asignado',
      width: '110px',
      render: (row) => (
        <span className="text-xs text-muted-foreground">
          {new Date(row.assignedAt).toLocaleDateString('es-ES', { day: '2-digit', month: 'short', year: '2-digit' })}
        </span>
      ),
    },
    {
      key: 'actions',
      header: '',
      width: '80px',
      render: (row) => (
        <div className="flex items-center gap-1">
          <button
            onClick={() => onChangeRole(row)}
            className="flex h-8 w-8 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
            aria-label="Cambiar rol"
          >
            <Pencil className="h-3.5 w-3.5" />
          </button>
          <button
            onClick={() => onRevoke(row)}
            className="flex h-8 w-8 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-destructive/10 hover:text-destructive"
            aria-label="Revocar rol interno"
          >
            <UserMinus className="h-3.5 w-3.5" />
          </button>
        </div>
      ),
    },
  ]
}
