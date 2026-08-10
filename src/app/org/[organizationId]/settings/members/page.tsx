'use client'

import { use, useEffect, useState } from 'react'
import { ShieldCheck, UserPlus } from 'lucide-react'
import { organizationsHooks } from '@/src/domains/organizations/organizations.hooks'
import type {
  MembershipDto,
  MembershipType,
  RoleDto,
} from '@/src/domains/organizations/organizations.types'
import { AdminDataTable, type ColumnDef } from '@/src/domains/admin/components/AdminDataTable'
import { AdminEntitySelect } from '@/src/domains/admin/shared/AdminEntitySelect'
import { fetchUserOptions } from '@/src/domains/admin/shared/fetch-user-options'
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

function MembersTable({
  organizationId,
  membershipType,
}: {
  organizationId: string
  membershipType: MembershipType
}) {
  const { data, isLoading, error } = organizationsHooks.useOrgMembers(organizationId, membershipType)
  const { data: roles } = organizationsHooks.useOrgRoles(organizationId)
  const { mutate: invite, isPending: isInviting } =
    organizationsHooks.useInviteOrgMember(organizationId)
  const { mutate: setRoles, isPending: isSettingRoles } =
    organizationsHooks.useSetOrgMemberRoles(organizationId)

  const [showInvite, setShowInvite] = useState(false)
  const [inviteUserId, setInviteUserId] = useState<string | null>(null)
  const [rolesTarget, setRolesTarget] = useState<MembershipDto | null>(null)
  const [selectedRoleIds, setSelectedRoleIds] = useState<string[]>([])

  const expectedRoleType = membershipType === 'ORGANIZATION' ? 'ORGANIZATION' : 'ROSTER'
  const assignableRoles = (roles ?? []).filter((role: RoleDto) => role.type === expectedRoleType)

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
        <Badge variant={member.status === 'ACTIVE' ? 'default' : 'secondary'}>{member.status}</Badge>
      ),
    },
    {
      key: 'actions',
      header: '',
      width: '120px',
      render: (member) => (
        <Button
          variant="outline"
          size="sm"
          className="gap-1"
          onClick={() => setRolesTarget(member)}
        >
          <ShieldCheck className="h-3.5 w-3.5" />
          Roles
        </Button>
      ),
    },
  ]

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <Button size="sm" className="gap-2" onClick={() => setShowInvite(true)}>
          <UserPlus className="h-4 w-4" />
          Invitar
        </Button>
      </div>

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

      {/* Invitación */}
      <Dialog open={showInvite} onOpenChange={(open) => !open && setShowInvite(false)}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Invitar {membershipType === 'ROSTER' ? 'al roster' : 'al staff'}</DialogTitle>
            <DialogDescription>
              El usuario queda INVITED hasta que acepte la invitación.
            </DialogDescription>
          </DialogHeader>
          <AdminEntitySelect
            value={inviteUserId}
            onChange={setInviteUserId}
            fetchOptions={fetchUserOptions}
            placeholder="Buscar usuario..."
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
                  { onSuccess: () => { setShowInvite(false); setInviteUserId(null) } },
                )
              }
            >
              Enviar invitación
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

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

  return (
    <div className="space-y-6">
      <PageHeader
        title="Miembros"
        description="Staff de la organización y roster de artistas administrados. Toda incorporación pasa por invitación y aceptación."
      />

      <Tabs defaultValue="staff" className="space-y-4">
        <TabsList>
          <TabsTrigger value="staff">Staff</TabsTrigger>
          <TabsTrigger value="roster">Roster</TabsTrigger>
        </TabsList>
        <TabsContent value="staff">
          <MembersTable organizationId={organizationId} membershipType="ORGANIZATION" />
        </TabsContent>
        <TabsContent value="roster">
          <MembersTable organizationId={organizationId} membershipType="ROSTER" />
        </TabsContent>
      </Tabs>
    </div>
  )
}
