'use client'

import { useState } from 'react'
import { ShieldCheck, UserPlus } from 'lucide-react'
import { adminOrganizationsHooks } from '@/src/domains/admin/organizations/organizations.hooks'
import { AdminDataTable, type ColumnDef } from '@/src/domains/admin/components/AdminDataTable'
import { AdminEntitySelect } from '@/src/domains/admin/shared/AdminEntitySelect'
import { fetchUserOptions } from '@/src/domains/admin/shared/fetch-user-options'
import { Badge } from '@/src/shared/components/UI/badge'
import { Button } from '@/src/shared/components/UI/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/src/shared/components/UI/dialog'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/src/shared/components/UI/select'
import type {
  MembershipDto,
  MembershipStatus,
  MembershipType,
} from '@/src/domains/admin/organizations/organizations.types'
import { MemberRolesDialog } from './MemberRolesDialog'

const STATUS_VARIANT: Record<MembershipStatus, 'default' | 'secondary' | 'destructive' | 'outline'> = {
  ACTIVE: 'default',
  INVITED: 'secondary',
  PENDING: 'secondary',
  SUSPENDED: 'outline',
  REMOVED: 'destructive',
}

interface OrganizationMembersTabProps {
  organizationId: string
  membershipType: MembershipType
}

/** Tab de miembros (staff u roster) con invitación, cambio de estado y asignación de roles. */
export function OrganizationMembersTab({
  organizationId,
  membershipType,
}: OrganizationMembersTabProps) {
  const { data, isLoading, error } = adminOrganizationsHooks.useOrganizationMembers(
    organizationId,
    membershipType,
  )
  const { mutate: invite, isPending: isInviting } =
    adminOrganizationsHooks.useInviteOrganizationMember(organizationId)
  const { mutate: changeStatus } = adminOrganizationsHooks.useChangeMembershipStatus(organizationId)

  const [showInvite, setShowInvite] = useState(false)
  const [inviteUserId, setInviteUserId] = useState<string | null>(null)
  const [rolesTarget, setRolesTarget] = useState<MembershipDto | null>(null)

  const columns: ColumnDef<MembershipDto>[] = [
    {
      key: 'user',
      header: 'Usuario',
      render: (member) => (
        <div className="min-w-0">
          <p className="truncate font-medium">
            {member.user ? `${member.user.name} ${member.user.lastName ?? ''}`.trim() : member.userId}
          </p>
          {member.user?.email && (
            <p className="truncate text-xs text-muted-foreground">{member.user.email}</p>
          )}
        </div>
      ),
    },
    {
      key: 'status',
      header: 'Estado',
      width: '140px',
      render: (member) => <Badge variant={STATUS_VARIANT[member.status]}>{member.status}</Badge>,
    },
    {
      key: 'actions',
      header: 'Acciones',
      width: '260px',
      render: (member) => (
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" className="gap-1" onClick={() => setRolesTarget(member)}>
            <ShieldCheck className="h-3.5 w-3.5" />
            Roles
          </Button>
          <Select
            value=""
            onValueChange={(status) =>
              changeStatus({
                membershipId: member.id,
                status: status as 'ACTIVE' | 'SUSPENDED' | 'REMOVED',
              })
            }
          >
            <SelectTrigger className="h-8 w-[130px] text-xs">
              <SelectValue placeholder="Cambiar estado" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ACTIVE">Activar</SelectItem>
              <SelectItem value="SUSPENDED">Suspender</SelectItem>
              <SelectItem value="REMOVED">Retirar</SelectItem>
            </SelectContent>
          </Select>
        </div>
      ),
    },
  ]

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <Button size="sm" className="gap-2" onClick={() => setShowInvite(true)}>
          <UserPlus className="h-4 w-4" />
          Invitar {membershipType === 'ROSTER' ? 'al roster' : 'al staff'}
        </Button>
      </div>

      <AdminDataTable
        columns={columns}
        data={data ?? []}
        isLoading={isLoading}
        error={error ? 'Error al cargar los miembros' : null}
        emptyMessage={
          membershipType === 'ROSTER'
            ? 'El roster está vacío. Invita al primer artista.'
            : 'Sin miembros de staff todavía.'
        }
        keyExtractor={(row) => row.id}
      />

      <Dialog open={showInvite} onOpenChange={(open) => !open && setShowInvite(false)}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>
              Invitar {membershipType === 'ROSTER' ? 'al roster' : 'miembro del staff'}
            </DialogTitle>
            <DialogDescription>
              El usuario queda INVITED hasta que acepte (trazabilidad de la incorporación, §4).
            </DialogDescription>
          </DialogHeader>

          <AdminEntitySelect
            value={inviteUserId}
            onChange={setInviteUserId}
            fetchOptions={fetchUserOptions}
            placeholder="Buscar usuario por nombre o email..."
          />

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowInvite(false)} disabled={isInviting}>
              Cancelar
            </Button>
            <Button
              disabled={!inviteUserId || isInviting}
              onClick={() =>
                inviteUserId &&
                invite(
                  { type: membershipType, userId: inviteUserId },
                  {
                    onSuccess: () => {
                      setShowInvite(false)
                      setInviteUserId(null)
                    },
                  },
                )
              }
            >
              Enviar invitación
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <MemberRolesDialog
        organizationId={organizationId}
        member={rolesTarget}
        membershipType={membershipType}
        onClose={() => setRolesTarget(null)}
      />
    </div>
  )
}
