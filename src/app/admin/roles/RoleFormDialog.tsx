'use client'

import { useEffect, useState, type FormEvent } from 'react'
import { Loader2 } from 'lucide-react'
import { staffRolesHooks } from '@/src/domains/admin/staff-roles/staff-roles.hooks'
import { PermissionMatrix } from '@/src/domains/admin/staff-roles/components/PermissionMatrix'
import { Button } from '@/src/shared/components/UI/button'
import { Input } from '@/src/shared/components/UI/input'
import { Textarea } from '@/src/shared/components/UI/textarea'
import { Field, FieldLabel, FieldError } from '@/src/shared/components/UI/field'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/src/shared/components/UI/dialog'
import type { StaffRoleDto } from '@/src/domains/admin/staff-roles/staff-roles.types'

interface Props {
  isOpen: boolean
  onClose: () => void
  role?: StaffRoleDto | null
}

/** Crea o edita un rol interno personalizado (Flow 3): nombre, descripción y permisos con vista previa. */
export function RoleFormDialog({ isOpen, onClose, role }: Props) {
  const isEditing = !!role
  const { data: permissionsByModule, isLoading: isLoadingPermissions } = staffRolesHooks.useStaffPermissions()
  const { mutateAsync: createRole, isPending: isCreating } = staffRolesHooks.useCreateStaffRole()
  const { mutateAsync: updateRole, isPending: isUpdating } = staffRolesHooks.useUpdateStaffRole()
  const isPending = isCreating || isUpdating

  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [permissionIds, setPermissionIds] = useState<string[]>([])
  const [nameError, setNameError] = useState<string | null>(null)
  const [permissionError, setPermissionError] = useState<string | null>(null)

  useEffect(() => {
    if (isOpen) {
      setName(role?.name ?? '')
      setDescription(role?.description ?? '')
      setPermissionIds(role?.permissions.map((p) => p.id) ?? [])
      setNameError(null)
      setPermissionError(null)
    }
  }, [isOpen, role])

  const handleClose = () => {
    if (isPending) return
    onClose()
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()

    const trimmedName = name.trim()
    let hasError = false
    if (!trimmedName) {
      setNameError('El nombre es obligatorio')
      hasError = true
    } else {
      setNameError(null)
    }
    if (permissionIds.length === 0) {
      setPermissionError('Selecciona al menos un permiso')
      hasError = true
    } else {
      setPermissionError(null)
    }
    if (hasError) return

    const input = { name: trimmedName, description: description.trim() || undefined, permissionIds }

    if (isEditing) {
      await updateRole({ id: role.id, input })
    } else {
      await createRole(input)
    }
    onClose()
  }

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && handleClose()}>
      <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{isEditing ? 'Editar rol interno' : 'Nuevo rol interno'}</DialogTitle>
          <DialogDescription>
            Combina los permisos individuales necesarios para esta función operativa.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 pt-2">
          <Field data-invalid={!!nameError}>
            <FieldLabel>Nombre del rol</FieldLabel>
            <Input
              placeholder="Editor de blog"
              value={name}
              onChange={(e) => setName(e.target.value)}
              disabled={isPending}
            />
            {nameError && <FieldError errors={[{ message: nameError }]} />}
          </Field>

          <Field>
            <FieldLabel>Descripción (opcional)</FieldLabel>
            <Textarea
              placeholder="Gestiona artículos y etiquetas del blog"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              disabled={isPending}
              rows={2}
            />
          </Field>

          <Field data-invalid={!!permissionError}>
            <FieldLabel>Permisos</FieldLabel>
            <PermissionMatrix
              permissionsByModule={permissionsByModule}
              isLoading={isLoadingPermissions}
              selectedIds={permissionIds}
              onChange={(ids) => {
                setPermissionIds(ids)
                if (ids.length > 0) setPermissionError(null)
              }}
              disabled={isPending}
            />
            {permissionError && <FieldError errors={[{ message: permissionError }]} />}
          </Field>

          <div className="flex justify-end gap-3 pt-2">
            <Button type="button" variant="outline" onClick={handleClose} disabled={isPending}>
              Cancelar
            </Button>
            <Button type="submit" disabled={isPending}>
              {isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Guardando...
                </>
              ) : isEditing ? (
                'Guardar cambios'
              ) : (
                'Crear rol'
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
