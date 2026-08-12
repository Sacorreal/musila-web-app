'use client'

import { use, useEffect, useState } from 'react'
import { MoreVertical, ShieldCheck, UserPlus, Users } from 'lucide-react'
import { organizationsHooks } from '@/src/domains/organizations/organizations.hooks'
import type {
  MembershipDto,
  MembershipStatus,
  MembershipType,
  RoleDto,
} from '@/src/domains/organizations/organizations.types'
import { AccessRequestsPanel } from '@/src/domains/organizations/components/AccessRequestsPanel'
import { InviteLinkDialog } from '@/src/domains/organizations/components/InviteLinkDialog'
import { AdminDataTable, type ColumnDef } from '@/src/domains/admin/components/AdminDataTable'
import { Badge } from '@/src/shared/components/UI/badge'
import { Button } from '@/src/shared/components/UI/button'
import { Checkbox } from '@/src/shared/components/UI/checkbox'
import { PageHeader } from '@/src/shared/components/UI/PageHeader'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/src/shared/components/UI/tabs'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/src/shared/components/UI/dialog'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/src/shared/components/UI/dropdown-menu'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/src/shared/components/UI/alert-dialog'

const STATUS_VARIANT: Record<string, 'default' | 'secondary' | 'destructive' | 'outline'> = {
  ACTIVE: 'default',
  SUSPENDED: 'secondary',
  REMOVED: 'destructive',
  INVITED: 'outline',
  PENDING: 'outline',
}

function MemberActions({
  organizationId,
  member,
  onManageRoles,
}: {
  organizationId: string
  member: MembershipDto
  onManageRoles: (member: MembershipDto) => void
}) {
  const { mutate: changeStatus, isPending } =
    organizationsHooks.useChangeMemberStatus(organizationId)
  const [confirmRevoke, setConfirmRevoke] = useState(false)

  const setStatus = (status: MembershipStatus) =>
    changeStatus({ membershipId: member.id, status })

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon" aria-label="Acciones del miembro" disabled={isPending}>
            <MoreVertical className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem onClick={() => onManageRoles(member)}>
            <ShieldCheck className="mr-2 h-4 w-4" />
            Editar roles
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          {member.status === 'ACTIVE' && (
            <DropdownMenuItem onClick={() => setStatus('SUSPENDED')}>Suspender</DropdownMenuItem>
          )}
          {member.status === 'SUSPENDED' && (
            <DropdownMenuItem onClick={() => setStatus('ACTIVE')}>Reactivar</DropdownMenuItem>
          )}
          <DropdownMenuItem
            className="text-red-500 focus:text-red-600"
            onClick={() => setConfirmRevoke(true)}
          >
            Revocar acceso
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <AlertDialog open={confirmRevoke} onOpenChange={setConfirmRevoke}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>¿Revocar el acceso de este miembro?</AlertDialogTitle>
            <AlertDialogDescription>
              El miembro perderá acceso al workspace de inmediato. Podrás volver a incorporarlo más
              adelante mediante una nueva invitación.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => setStatus('REMOVED')}
              className="bg-destructive text-white hover:bg-destructive/90"
            >
              Revocar acceso
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}

function MembersTable({
  organizationId,
  membershipType,
}: {
  organizationId: string
  membershipType: MembershipType
}) {
  const { data, isLoading, error } = organizationsHooks.useOrgMembers(organizationId, membershipType)
  const { data: roles } = organizationsHooks.useOrgRoles(organizationId)
  const { mutate: setRoles, isPending: isSettingRoles } =
    organizationsHooks.useSetOrgMemberRoles(organizationId)

  const [rolesTarget, setRolesTarget] = useState<MembershipDto | null>(null)
  const [selectedRoleIds, setSelectedRoleIds] = useState<string[]>([])

  const assignableRoles = (roles ?? []).filter((role: RoleDto) => role.type === membershipType)

  useEffect(() => {
    if (!rolesTarget) setSelectedRoleIds([])
  }, [rolesTarget])

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
      width: '130px',
      render: (member) => (
        <Badge variant={STATUS_VARIANT[member.status] ?? 'secondary'}>{member.status}</Badge>
      ),
    },
    {
      key: 'actions',
      header: '',
      width: '60px',
      render: (member) => (
        <MemberActions
          organizationId={organizationId}
          member={member}
          onManageRoles={setRolesTarget}
        />
      ),
    },
  ]

  return (
    <div className="space-y-4">
      <AdminDataTable
        columns={columns}
        data={data ?? []}
        isLoading={isLoading}
        error={error ? 'Error al cargar los miembros' : null}
        emptyMessage={
          membershipType === 'ROSTER' ? 'El roster está vacío.' : 'Sin miembros de staff todavía.'
        }
        keyExtractor={(row) => row.id}
      />

      {/* Asignación multi-rol */}
      <Dialog open={!!rolesTarget} onOpenChange={(open) => !open && setRolesTarget(null)}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Roles de {rolesTarget?.user?.name ?? 'la membership'}</DialogTitle>
            <DialogDescription>
              Reemplaza el set de roles (multi-rol permitido). No puedes otorgar capabilities que no
              posees.
            </DialogDescription>
          </DialogHeader>
          <ul className="max-h-64 space-y-2 overflow-y-auto pr-1">
            {assignableRoles.map((role) => (
              <li key={role.id} className="flex items-center gap-3 rounded-xl border border-border p-3">
                <Checkbox
                  id={`member-role-${role.id}`}
                  checked={selectedRoleIds.includes(role.id)}
                  onCheckedChange={() =>
                    setSelectedRoleIds((prev) =>
                      prev.includes(role.id)
                        ? prev.filter((id) => id !== role.id)
                        : [...prev, role.id],
                    )
                  }
                />
                <label htmlFor={`member-role-${role.id}`} className="flex-1 cursor-pointer text-sm">
                  {role.name}
                  {role.source === 'SYSTEM' && (
                    <Badge variant="secondary" className="ml-2">SYSTEM</Badge>
                  )}
                </label>
              </li>
            ))}
          </ul>
          <DialogFooter>
            <Button variant="outline" onClick={() => setRolesTarget(null)} disabled={isSettingRoles}>
              Cancelar
            </Button>
            <Button
              disabled={isSettingRoles || selectedRoleIds.length === 0}
              onClick={() =>
                rolesTarget &&
                setRoles(
                  { membershipId: rolesTarget.id, roleIds: selectedRoleIds },
                  { onSuccess: () => setRolesTarget(null) },
                )
              }
            >
              Guardar roles
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

export default function OrgMembersPage({
  params,
}: {
  params: Promise<{ organizationId: string }>
}) {
  const { organizationId } = use(params)
  const [showInviteLink, setShowInviteLink] = useState(false)
  const { data: pendingRequests } = organizationsHooks.useAccessRequests(organizationId, 'PENDING')
  const pendingCount = pendingRequests?.length ?? 0

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <PageHeader
          title="Miembros"
          description="Staff de la organización y roster de artistas. Invita con un enlace, aprueba solicitudes y gestiona el acceso de cada miembro."
        />
        <Button className="gap-2" onClick={() => setShowInviteLink(true)}>
          <UserPlus className="h-4 w-4" />
          Invitar usuarios
        </Button>
      </div>

      <Tabs defaultValue={pendingCount > 0 ? 'requests' : 'staff'} className="space-y-4">
        <TabsList>
          <TabsTrigger value="requests" className="gap-2">
            Solicitudes
            {pendingCount > 0 && (
              <Badge variant="secondary" className="px-1.5">
                {pendingCount}
              </Badge>
            )}
          </TabsTrigger>
          <TabsTrigger value="staff" className="gap-2">
            <Users className="h-3.5 w-3.5" />
            Staff
          </TabsTrigger>
          <TabsTrigger value="roster">Roster</TabsTrigger>
        </TabsList>
        <TabsContent value="requests">
          <AccessRequestsPanel organizationId={organizationId} />
        </TabsContent>
        <TabsContent value="staff">
          <MembersTable organizationId={organizationId} membershipType="ORGANIZATION" />
        </TabsContent>
        <TabsContent value="roster">
          <MembersTable organizationId={organizationId} membershipType="ROSTER" />
        </TabsContent>
      </Tabs>

      <InviteLinkDialog
        organizationId={organizationId}
        open={showInviteLink}
        onOpenChange={setShowInviteLink}
      />
    </div>
  )
}
