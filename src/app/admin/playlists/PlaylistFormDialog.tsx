'use client'

import { useEffect } from 'react'
import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { Loader2 } from 'lucide-react'
import { adminPlaylistsHooks } from '@/src/domains/admin/playlists/admin-playlists.hooks'
import { AdminEntitySelect } from '@/src/domains/admin/shared/AdminEntitySelect'
import { fetchUserOptions } from '@/src/domains/admin/shared/fetch-user-options'
import { Button } from '@/src/shared/components/UI/button'
import { Input } from '@/src/shared/components/UI/input'
import { Field, FieldLabel, FieldError } from '@/src/shared/components/UI/field'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/src/shared/components/UI/dialog'
import type { AdminPlaylistDto } from '@/src/domains/admin/playlists/admin-playlists.types'

const createSchema = z.object({
  title: z.string().min(1, 'El título es obligatorio'),
  ownerId: z.string().min(1, 'Debes seleccionar un propietario'),
})

const editSchema = z.object({
  title: z.string().min(1, 'El título es obligatorio'),
})

interface Props {
  isOpen: boolean
  onClose: () => void
  initialData?: AdminPlaylistDto | null
}

export function PlaylistFormDialog({ isOpen, onClose, initialData }: Props) {
  const isEdit = !!initialData
  const schema = isEdit ? editSchema : createSchema
  const { mutateAsync: createPlaylist, isPending: isCreating } = adminPlaylistsHooks.useCreatePlaylist()
  const { mutateAsync: updatePlaylist, isPending: isUpdating } = adminPlaylistsHooks.useUpdatePlaylist()
  const isPending = isCreating || isUpdating

  const {
    register,
    handleSubmit,
    reset,
    control,
    formState: { errors },
  } = useForm<any>({ resolver: zodResolver(schema) })

  useEffect(() => {
    if (isOpen) {
      reset({ title: initialData?.title ?? '', ownerId: initialData?.owner?.id ?? '' })
    }
  }, [isOpen, initialData, reset])

  const handleClose = () => {
    reset()
    onClose()
  }

  const onSubmit = async (data: any) => {
    if (isEdit && initialData) {
      await updatePlaylist({ id: initialData.id, input: { title: data.title } })
    } else {
      await createPlaylist(data)
    }
    handleClose()
  }

  const ownerOptions = initialData?.owner
    ? [{ value: initialData.owner.id, label: `${initialData.owner.name} ${initialData.owner.lastName}`, description: initialData.owner.email }]
    : []

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && handleClose()}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>{isEdit ? 'Editar Playlist' : 'Nueva Playlist'}</DialogTitle>
          <DialogDescription>
            {isEdit ? 'Modifica el título de la playlist.' : 'Crea una playlist en nombre de un usuario.'}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 pt-2">
          <Field data-invalid={!!errors.title}>
            <FieldLabel>Título</FieldLabel>
            <Input placeholder="Playlist de Verano 2025" {...register('title')} />
            {errors.title && <FieldError errors={[errors.title as any]} />}
          </Field>

          {!isEdit && (
            <Controller
              name="ownerId"
              control={control}
              render={({ field }) => (
                <Field data-invalid={!!errors.ownerId}>
                  <FieldLabel>Propietario</FieldLabel>
                  <AdminEntitySelect
                    value={field.value || null}
                    onChange={field.onChange}
                    fetchOptions={fetchUserOptions}
                    selectedOptions={ownerOptions}
                    placeholder="Buscar usuario propietario..."
                  />
                  {errors.ownerId && <FieldError errors={[errors.ownerId as any]} />}
                </Field>
              )}
            />
          )}

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
              ) : isEdit ? (
                'Guardar Cambios'
              ) : (
                'Crear Playlist'
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
