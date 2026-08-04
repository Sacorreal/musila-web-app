'use client'

import { useEffect, useState } from 'react'
import { Loader2 } from 'lucide-react'
import { staffRolesHooks } from '@/src/domains/admin/staff-roles/staff-roles.hooks'
import { staffMembersHooks } from '@/src/domains/admin/staff-members/staff-members.hooks'
import { AdminEntitySelect } from '@/src/domains/admin/shared/AdminEntitySelect'
import { fetchUserOptions } from '@/src/domains/admin/shared/fetch-user-options'
import { Button } from '@/src/shared/components/UI/button'
import { Input } from '@/src/shared/components/UI/input'
import { Field, FieldLabel, FieldError } from '@/src/shared/components/UI/field'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/src/shared/components/UI/select'
import { cn } from '@/src/shared/libs/cn'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/src/shared/components/UI/dialog'

interface Props {
  isOpen: boolean
  onClose: () => void
}

type Mode = 'existing' | 'invite'

/** Flow 1: selecciona o invita a un miembro del equipo, elige rol, revisa el resumen y confirma. */
export function AssignStaffMemberDialog({ isOpen, onClose }: Props) {
  const [mode, setMode] = useState<Mode>('existing')
  const [userId, setUserId] = useState<string | null>(null)
  const [name, setName] = useState('')
  const [lastName, setLastName] = useState('')
  const [email, setEmail] = useState('')
  const [staffRoleId, setStaffRoleId] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  const { data: rolesData } = staffRolesHooks.useStaffRoles(1, 50)
  const { mutateAsync: assignRole, isPending: isAssigning } = staffMembersHooks.useAssignStaffRole()
  const { mutateAsync: inviteMember, isPending: isInviting } = staffMembersHooks.useInviteStaffMember()
  const isPending = isAssigning || isInviting

  useEffect(() => {
    if (isOpen) {
      setMode('existing')
      setUserId(null)
      setName('')
      setLastName('')
      setEmail('')
      setStaffRoleId(null)
      setError(null)
    }
  }, [isOpen])

  const selectedRole = rolesData?.data.find((r) => r.id === staffRoleId)

  const handleClose = () => {
    if (isPending) return
    onClose()
  }

  const handleSubmit = async () => {
    if (!staffRoleId) {
      setError('Selecciona un rol interno')
      return
    }

    if (mode === 'existing') {
      if (!userId) {
        setError('Selecciona un miembro del equipo. Si el correo no está registrado, invítalo desde la otra pestaña.')
        return
      }
      await assignRole({ userId, input: { staffRoleId } })
    } else {
      if (!name.trim() || !lastName.trim() || !email.trim()) {
        setError('Completa nombre, apellido y correo')
        return
      }
      await inviteMember({ name: name.trim(), lastName: lastName.trim(), email: email.trim(), staffRoleId })
    }

    onClose()
  }

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && handleClose()}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>Asignar rol interno</DialogTitle>
          <DialogDescription>
            Selecciona a un miembro del equipo ya registrado o invita a alguien nuevo por correo.
          </DialogDescription>
        </DialogHeader>

        <div className="flex gap-1 rounded-lg bg-muted p-1">
          <button
            type="button"
            onClick={() => setMode('existing')}
            className={cn(
              'flex-1 rounded-md px-3 py-1.5 text-sm font-medium transition-colors',
              mode === 'existing' ? 'bg-background shadow-sm' : 'text-muted-foreground',
            )}
          >
            Miembro existente
          </button>
          <button
            type="button"
            onClick={() => setMode('invite')}
            className={cn(
              'flex-1 rounded-md px-3 py-1.5 text-sm font-medium transition-colors',
              mode === 'invite' ? 'bg-background shadow-sm' : 'text-muted-foreground',
            )}
          >
            Invitar por correo
          </button>
        </div>

        <div className="space-y-4 pt-2">
          {mode === 'existing' ? (
            <Field>
              <FieldLabel>Usuario</FieldLabel>
              <AdminEntitySelect
                fetchOptions={fetchUserOptions}
                value={userId}
                onChange={setUserId}
                placeholder="Buscar por nombre o email..."
                disabled={isPending}
              />
            </Field>
          ) : (
            <>
              <div className="grid grid-cols-2 gap-3">
                <Field>
                  <FieldLabel>Nombre</FieldLabel>
                  <Input value={name} onChange={(e) => setName(e.target.value)} disabled={isPending} />
                </Field>
                <Field>
                  <FieldLabel>Apellido</FieldLabel>
                  <Input value={lastName} onChange={(e) => setLastName(e.target.value)} disabled={isPending} />
                </Field>
              </div>
              <Field>
                <FieldLabel>Correo electrónico</FieldLabel>
                <Input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={isPending}
                  placeholder="nombre@musila.co"
                />
              </Field>
            </>
          )}

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

          {selectedRole && (
            <div className="rounded-lg border border-border bg-muted/30 p-3">
              <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                Resumen de permisos
              </p>
              <p className="mt-1 text-sm text-muted-foreground">
                {selectedRole.description ?? `Rol "${selectedRole.name}"`} — {selectedRole.permissions.length}{' '}
                permiso{selectedRole.permissions.length === 1 ? '' : 's'} otorgado
                {selectedRole.permissions.length === 1 ? '' : 's'}.
              </p>
            </div>
          )}

          {error && <FieldError errors={[{ message: error }]} />}

          <div className="flex justify-end gap-3 pt-2">
            <Button type="button" variant="outline" onClick={handleClose} disabled={isPending}>
              Cancelar
            </Button>
            <Button type="button" onClick={handleSubmit} disabled={isPending}>
              {isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Confirmando...
                </>
              ) : (
                'Confirmar asignación'
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
