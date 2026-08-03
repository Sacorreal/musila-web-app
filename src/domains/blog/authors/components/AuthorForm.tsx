'use client'

import { useRouter } from 'next/navigation'
import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Loader2 } from 'lucide-react'
import { toast } from 'sonner'
import { adminBlogAuthorsHooks } from '../admin-blog-authors.hooks'
import { createBlogAuthorSchema, type BlogAuthorFormValues } from '../blog-author.schema'
import { AvatarUploadField } from './AvatarUploadField'
import { Button } from '@/src/shared/components/UI/button'
import { Input } from '@/src/shared/components/UI/input'
import { Textarea } from '@/src/shared/components/UI/textarea'
import { Field, FieldError, FieldGroup, FieldLabel } from '@/src/shared/components/UI/field'
import type { BlogAuthorDto } from '../../shared/blog.types'

interface Props {
  initialData?: BlogAuthorDto
}

export function AuthorForm({ initialData }: Props) {
  const router = useRouter()
  const isEdit = !!initialData

  const {
    mutateAsync: createAuthor,
    isPending: isCreating,
    uploadProgress: createProgress,
  } = adminBlogAuthorsHooks.useCreateBlogAuthorWithUpload()

  const {
    mutateAsync: updateAuthor,
    isPending: isUpdating,
    uploadProgress: updateProgress,
  } = adminBlogAuthorsHooks.useUpdateBlogAuthorWithUpload(initialData?.id ?? '')

  const isPending = isCreating || isUpdating
  const uploadProgress = isEdit ? updateProgress : createProgress

  const {
    control,
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<BlogAuthorFormValues>({
    resolver: zodResolver(createBlogAuthorSchema),
    defaultValues: {
      name: initialData?.name ?? '',
      role: initialData?.role ?? '',
      bio: initialData?.bio ?? '',
    },
  })

  const onSubmit = async (data: BlogAuthorFormValues) => {
    try {
      if (isEdit && initialData) {
        await updateAuthor(data)
      } else {
        await createAuthor(data)
      }
      router.push('/admin/blog/autores')
    } catch (error: any) {
      toast.error(error?.response?.data?.message ?? 'Error al guardar el autor')
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <FieldGroup className={isPending ? 'pointer-events-none opacity-60 transition-opacity' : ''}>
        <div className="space-y-6 rounded-2xl border border-border bg-card p-6 shadow-sm">
          <Controller
            name="avatarFile"
            control={control}
            render={({ field }) => (
              <AvatarUploadField value={field.value ?? null} onChange={field.onChange} existingUrl={initialData?.avatarUrl} />
            )}
          />

          <Field data-invalid={!!errors.name}>
            <FieldLabel>Nombre</FieldLabel>
            <Input placeholder="Ej: Jesse Sumrak" {...register('name')} />
            {errors.name && <FieldError errors={[errors.name]} />}
          </Field>

          <Field data-invalid={!!errors.role}>
            <FieldLabel>Rol</FieldLabel>
            <Input placeholder="Ej: Sr. Content Marketing Manager" {...register('role')} />
            {errors.role && <FieldError errors={[errors.role]} />}
          </Field>

          <Field data-invalid={!!errors.bio}>
            <FieldLabel>Biografía corta</FieldLabel>
            <Textarea className="min-h-[120px] resize-y" placeholder="Cuéntanos sobre este autor..." {...register('bio')} />
            {errors.bio && <FieldError errors={[errors.bio]} />}
          </Field>
        </div>

        <div className="flex justify-end gap-3">
          <Button type="button" variant="outline" onClick={() => router.push('/admin/blog/autores')} disabled={isPending}>
            Cancelar
          </Button>
          <Button type="submit" disabled={isPending}>
            {isPending ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                {uploadProgress > 0 && uploadProgress < 100 ? `Subiendo ${uploadProgress}%...` : 'Guardando...'}
              </>
            ) : isEdit ? (
              'Guardar Cambios'
            ) : (
              'Crear Autor'
            )}
          </Button>
        </div>
      </FieldGroup>
    </form>
  )
}
