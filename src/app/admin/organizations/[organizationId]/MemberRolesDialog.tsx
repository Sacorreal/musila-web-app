'use client'

import { useEffect, useState } from 'react'
import { Loader2 } from 'lucide-react'
import { adminOrganizationsHooks } from '@/src/domains/admin/organizations/organizations.hooks'
import { Badge } from '@/src/shared/components/UI/badge'
import { Button } from '@/src/shared/components/UI/button'
import { Checkbox } from '@/src/shared/components/UI/checkbox'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/src/shared/components/UI/dialog'
import type {
  MembershipDto,
  MembershipType,
  RoleDto,
} from '@/src/domains/admin/organizations/organizations.types'

interface MemberRolesDialogProps {
  organizationId: string
  member: MembershipDto | null
  membershipType: MembershipType
  onClose: () => void
}

/** Asignación multi-rol a una membership (§3: un usuario puede tener múltiples roles). */
export function MemberRolesDialog({
  organizationId,
  member,
  membershipType,
  onClose,
}: MemberRolesDialogProps) {
  const { data: roles, isLoading: isLoadingRoles } =
    adminOrganizationsHooks.useOrganizationRoles(member ? organizationId : undefined)
  const { data: currentRoles } = adminOrganizationsHooks.useMembershipRoles(
    member ? organizationId : undefined,
    member?.id,
  )
  const { mutate: setRoles, isPending } =
    adminOrganizationsHooks.useSetMembershipRoles(organizationId)

  const [selected, setSelected] = useState<string[]>([])

  useEffect(() => {
    setSelected((currentRoles ?? []).map((membershipRole) => membershipRole.roleId))
  }, [currentRoles])

  const expectedType = membershipType === 'ORGANIZATION' ? 'ORGANIZATION' : 'ROSTER'
  const assignableRoles = (roles ?? []).filter((role: RoleDto) => role.type === expectedType)

  const toggle = (roleId: string) => {
    setSelected((prev) =>
      prev.includes(roleId) ? prev.filter((id) => id !== roleId) : [...prev, roleId],
    )
  }

  return (
    <Dialog open={!!member} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Roles de {member?.user?.name ?? 'la membership'}</DialogTitle>
          <DialogDescription>
            Selecciona los roles del catálogo (SYSTEM compartidos y custom del tenant). El backend
            valida compatibilidad y escalamiento antes de guardar.
          </DialogDescription>
        </DialogHeader>

        {isLoadingRoles ? (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" aria-label="Cargando roles" />
          </div>
        ) : assignableRoles.length === 0 ? (
          <p className="py-6 text-center text-sm text-muted-foreground">
            No hay roles {expectedType === 'ROSTER' ? 'de roster' : 'de organización'} disponibles.
          </p>
        ) : (
          <ul className="max-h-72 space-y-2 overflow-y-auto pr-1">
            {assignableRoles.map((role) => (
              <li
                key={role.id}
                className="flex items-start gap-3 rounded-xl border border-border p-3 transition-colors hover:bg-muted/40"
              >
                <Checkbox
                  id={`role-${role.id}`}
                  checked={selected.includes(role.id)}
                  onCheckedChange={() => toggle(role.id)}
                />
                <label htmlFor={`role-${role.id}`} className="flex-1 cursor-pointer space-y-1">
                  <span className="flex items-center gap-2 text-sm font-medium">
                    {role.name}
                    {role.source === 'SYSTEM' && <Badge variant="secondary">SYSTEM</Badge>}
                  </span>
                  {role.description && (
                    <span className="block text-xs text-muted-foreground">{role.description}</span>
                  )}
                </label>
              </li>
            ))}
          </ul>
        )}

        <DialogFooter>
          <Button variant="outline" onClick={onClose} disabled={isPending}>
            Cancelar
          </Button>
          <Button
            onClick={() =>
              member && setRoles({ membershipId: member.id, roleIds: selected }, { onSuccess: onClose })
            }
            disabled={isPending || selected.length === 0}
            className="gap-2"
          >
            {isPending && <Loader2 className="h-4 w-4 animate-spin" />}
            Guardar roles
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
