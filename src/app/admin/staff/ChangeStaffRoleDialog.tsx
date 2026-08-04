'use client'

import { useEffect, useState } from 'react'
import { Loader2 } from 'lucide-react'
import { staffRolesHooks } from '@/src/domains/admin/staff-roles/staff-roles.hooks'
import { staffMembersHooks } from '@/src/domains/admin/staff-members/staff-members.hooks'
import { Button } from '@/src/shared/components/UI/button'
import { Field, FieldLabel } from '@/src/shared/components/UI/field'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/src/shared/components/UI/select'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/src/shared/components/UI/dialog'
import type { StaffMemberAssignmentDto } from '@/src/domains/admin/staff-members/staff-members.types'

interface Props {
  member: StaffMemberAssignmentDto | null
  onClose: () => void
}

export function ChangeStaffRoleDialog({ member, onClose }: Props) {
  const { data: rolesData } = staffRolesHooks.useStaffRoles(1, 50)
  const { mutateAsync: assignRole, isPending } = staffMembersHooks.useAssignStaffRole()
  const [staffRoleId, setStaffRoleId] = useState<string | null>(null)

  useEffect(() => {
    setStaffRoleId(member?.staffRoleId ?? null)
  }, [member])

  const handleClose = () => {
    if (isPending) return
    onClose()
  }

  const handleSubmit = async () => {
    if (!member || !staffRoleId) return
    await assignRole({ userId: member.userId, input: { staffRoleId } })
    onClose()
  }

  return (
    <Dialog open={!!member} onOpenChange={(open) => !open && handleClose()}>
      <DialogContent className="max-w-sm">
        <DialogHeader>
          <DialogTitle>Cambiar rol interno</DialogTitle>
          <DialogDescription>
            {member ? `${member.user.name} ${member.user.lastName}` : ''}
          </DialogDescription>
        </DialogHeader>

        <Field>
          <FieldLabel>Rol interno</FieldLabel>
          <Select value={staffRoleId ?? undefined} onValueChange={setStaffRoleId} disabled={isPending}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Selecciona un rol" />
            </SelectTrigger>
            <SelectContent>
              {rolesData?.data.map((role) => (
                <SelectItem key={role.id} value={role.id}>
                  {role.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </Field>

        <div className="flex justify-end gap-3 pt-2">
          <Button type="button" variant="outline" onClick={handleClose} disabled={isPending}>
            Cancelar
          </Button>
          <Button type="button" onClick={handleSubmit} disabled={isPending || !staffRoleId}>
            {isPending ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Guardando...
              </>
            ) : (
              'Guardar'
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
