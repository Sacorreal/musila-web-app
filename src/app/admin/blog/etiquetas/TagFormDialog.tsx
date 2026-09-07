'use client'

import { useEffect } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Loader2 } from 'lucide-react'
import { adminBlogTagsHooks } from '@/src/domains/blog/tags/admin-blog-tags.hooks'
import { createBlogTagSchema, type BlogTagFormValues } from '@/src/domains/blog/tags/blog-tag.schema'
import { RELATED_SERVICE_ICONS, RELATED_SERVICE_ICON_NAMES } from '@/src/domains/blog/tags/components/RelatedServicesSection'
import { Button } from '@/src/shared/components/UI/button'
import { Input } from '@/src/shared/components/UI/input'
import { Field, FieldLabel, FieldError } from '@/src/shared/components/UI/field'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/src/shared/components/UI/select'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/src/shared/components/UI/dialog'
import type { BlogTagDto } from '@/src/domains/blog/shared/blog.types'

interface Props {
  isOpen: boolean
  onClose: () => void
  initialData?: BlogTagDto | null
}

export function TagFormDialog({ isOpen, onClose, initialData }: Props) {
  const isEdit = !!initialData
  const { mutateAsync: createTag, isPending: isCreating } = adminBlogTagsHooks.useCreateBlogTag()
  const { mutateAsync: updateTag, isPending: isUpdating } = adminBlogTagsHooks.useUpdateBlogTag()
  const isPending = isCreating || isUpdating

  const {
    register,
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<BlogTagFormValues>({ resolver: zodResolver(createBlogTagSchema) })

  useEffect(() => {
    if (isOpen) {
      reset({
        name: initialData?.name ?? '',
        url: initialData?.url ?? '',
        icon: initialData?.icon ?? '',
      })
    }
  }, [isOpen, initialData, reset])

  const onSubmit = async (data: BlogTagFormValues) => {
    if (isEdit && initialData) {
      await updateTag({ id: initialData.id, input: data })
    } else {
      await createTag(data)
    }
    reset()
    onClose()
  }

  return (
    <Dialog open={isOpen} onOpenChange={(open) => { if (!open) { reset(); onClose() } }}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>{isEdit ? 'Editar Etiqueta' : 'Nueva Etiqueta'}</DialogTitle>
          <DialogDescription>
            Servicio relacionado que se mostrará como "Servicios Relacionados" en los artículos.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 pt-2">
          <Field data-invalid={!!errors.name}>
            <FieldLabel>Nombre del servicio</FieldLabel>
            <Input placeholder="Ej: Mastering" {...register('name')} />
            {errors.name && <FieldError errors={[errors.name]} />}
          </Field>

          <Field data-invalid={!!errors.url}>
            <FieldLabel>URL del servicio</FieldLabel>
            <Input placeholder="/servicios/mastering" {...register('url')} />
            {errors.url && <FieldError errors={[errors.url]} />}
          </Field>

          <Field data-invalid={!!errors.icon}>
            <FieldLabel>Ícono</FieldLabel>
            <Controller
              control={control}
              name="icon"
              render={({ field }) => {
                const Icon = RELATED_SERVICE_ICONS[field.value]
                return (
                  <Select value={field.value} onValueChange={field.onChange}>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Selecciona un ícono">
                        {field.value && (
                          <span className="flex items-center gap-2">
                            {Icon && <Icon className="h-4 w-4" />}
                            {field.value}
                          </span>
                        )}
                      </SelectValue>
                    </SelectTrigger>
                    <SelectContent>
                      {RELATED_SERVICE_ICON_NAMES.map((iconName) => {
                        const OptionIcon = RELATED_SERVICE_ICONS[iconName]
                        return (
                          <SelectItem key={iconName} value={iconName}>
                            <span className="flex items-center gap-2">
                              <OptionIcon className="h-4 w-4" />
                              {iconName}
                            </span>
                          </SelectItem>
                        )
                      })}
                    </SelectContent>
                  </Select>
                )
              }}
            />
            {errors.icon && <FieldError errors={[errors.icon]} />}
          </Field>

          <div className="flex justify-end gap-3 pt-2">
            <Button type="button" variant="outline" onClick={() => { reset(); onClose() }} disabled={isPending}>
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
                'Crear Etiqueta'
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
