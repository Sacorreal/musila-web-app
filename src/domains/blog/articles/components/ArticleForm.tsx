'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Loader2, Eye } from 'lucide-react'
import { toast } from 'sonner'
import { adminBlogArticlesHooks } from '../admin-blog-articles.hooks'
import { adminBlogAuthorsHooks } from '../../authors/admin-blog-authors.hooks'
import { adminBlogTagsHooks } from '../../tags/admin-blog-tags.hooks'
import { createBlogArticleSchema, updateBlogArticleSchema, type BlogArticleFormValues } from '../blog-article.schema'
import { ArticleCoverUploadField } from './ArticleCoverUploadField'
import { ArticlePreviewModal } from './ArticlePreviewModal'
import { MarkdownEditorField } from '../../shared/components/MarkdownEditorField'
import { Button } from '@/src/shared/components/UI/button'
import { Input } from '@/src/shared/components/UI/input'
import { Textarea } from '@/src/shared/components/UI/textarea'
import { Field, FieldError, FieldGroup, FieldLabel } from '@/src/shared/components/UI/field'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/src/shared/components/UI/select'
import { MultiSelect, type MultiSelectOption } from '@/src/shared/components/UI/multi-select'
import type { BlogArticleDto } from '../../shared/blog.types'

interface Props {
  initialData?: BlogArticleDto
}

export function ArticleForm({ initialData }: Props) {
  const router = useRouter()
  const isEdit = !!initialData
  const [showPreview, setShowPreview] = useState(false)

  const { data: authorsPage } = adminBlogAuthorsHooks.useAdminBlogAuthors(1, 100)
  const { data: tagsPage } = adminBlogTagsHooks.useAdminBlogTags(1, 100)

  const authorOptions: MultiSelectOption[] = (authorsPage?.data ?? []).map((author) => ({
    value: author.id,
    label: author.name,
  }))
  const tagOptions: MultiSelectOption[] = (tagsPage?.data ?? []).map((tag) => ({
    value: tag.id,
    label: tag.name,
  }))

  const {
    mutateAsync: createArticle,
    isPending: isCreating,
    uploadProgress: createProgress,
  } = adminBlogArticlesHooks.useCreateBlogArticleWithUpload()

  const {
    mutateAsync: updateArticle,
    isPending: isUpdating,
    uploadProgress: updateProgress,
  } = adminBlogArticlesHooks.useUpdateBlogArticleWithUpload(initialData?.id ?? '')

  const isPending = isCreating || isUpdating
  const uploadProgress = isEdit ? updateProgress : createProgress

  const {
    control,
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<BlogArticleFormValues>({
    resolver: zodResolver(isEdit ? updateBlogArticleSchema : createBlogArticleSchema),
    defaultValues: {
      title: initialData?.title ?? '',
      contentMarkdown: initialData?.contentMarkdown ?? '',
      excerpt: initialData?.excerpt ?? '',
      youtubeUrl: initialData?.youtubeUrl ?? '',
      status: initialData?.status ?? 'draft',
      authorIds: initialData?.authors.map((author) => author.id) ?? [],
      tagIds: initialData?.tags.map((tag) => tag.id) ?? [],
    },
  })

  const title = watch('title')
  const contentMarkdown = watch('contentMarkdown')
  const youtubeUrl = watch('youtubeUrl')
  const coverFile = watch('coverFile')

  const onSubmit = async (data: BlogArticleFormValues) => {
    if (!data.coverFile && !initialData?.coverImageUrl) {
      toast.warning('Se recomienda agregar una imagen destacada para una mejor visualización al compartir en redes sociales.')
    }

    try {
      if (isEdit && initialData) {
        await updateArticle(data)
      } else {
        await createArticle(data)
      }
      router.push('/admin/blog/articulos')
    } catch (error: any) {
      toast.error(error?.response?.data?.message ?? 'Error al guardar el artículo')
    }
  }

  return (
    <>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <FieldGroup className={isPending ? 'pointer-events-none opacity-60 transition-opacity' : ''}>
          <div className="space-y-6 rounded-2xl border border-border bg-card p-6 shadow-sm">
            <Field data-invalid={!!errors.title}>
              <FieldLabel>Título</FieldLabel>
              <Input placeholder="Ej: Cómo licenciar tu primera canción" {...register('title')} />
              {errors.title && <FieldError errors={[errors.title]} />}
            </Field>

            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              <Controller
                name="authorIds"
                control={control}
                render={({ field }) => (
                  <Field data-invalid={!!errors.authorIds}>
                    <FieldLabel>Autores</FieldLabel>
                    <MultiSelect
                      options={authorOptions}
                      value={field.value ?? []}
                      onChange={field.onChange}
                      placeholder="Selecciona autores..."
                    />
                    {errors.authorIds && <FieldError errors={[errors.authorIds]} />}
                  </Field>
                )}
              />

              <Controller
                name="tagIds"
                control={control}
                render={({ field }) => (
                  <Field data-invalid={!!errors.tagIds}>
                    <FieldLabel>Servicios Relacionados</FieldLabel>
                    <MultiSelect
                      options={tagOptions}
                      value={field.value ?? []}
                      onChange={field.onChange}
                      placeholder="Selecciona etiquetas..."
                    />
                    {errors.tagIds && <FieldError errors={[errors.tagIds]} />}
                  </Field>
                )}
              />
            </div>

            <Controller
              name="coverFile"
              control={control}
              render={({ field }) => (
                <ArticleCoverUploadField
                  value={field.value ?? null}
                  onChange={field.onChange}
                  existingUrl={initialData?.coverImageUrl}
                />
              )}
            />

            <Field>
              <FieldLabel>Enlace de YouTube (opcional)</FieldLabel>
              <Input placeholder="https://www.youtube.com/watch?v=..." {...register('youtubeUrl')} />
              {errors.youtubeUrl && <FieldError errors={[errors.youtubeUrl]} />}
            </Field>

            <Field>
              <FieldLabel>Resumen (opcional, se autogenera si se omite)</FieldLabel>
              <Textarea className="min-h-[80px] resize-y" placeholder="Resumen breve del artículo..." {...register('excerpt')} />
            </Field>

            <Controller
              name="status"
              control={control}
              render={({ field }) => (
                <Field>
                  <FieldLabel>Estado</FieldLabel>
                  <Select value={field.value} onValueChange={field.onChange}>
                    <SelectTrigger className="w-full max-w-xs">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="draft">Borrador</SelectItem>
                      <SelectItem value="published">Publicado</SelectItem>
                    </SelectContent>
                  </Select>
                </Field>
              )}
            />

            <Controller
              name="contentMarkdown"
              control={control}
              render={({ field }) => (
                <Field data-invalid={!!errors.contentMarkdown}>
                  <div className="mb-2 flex items-center justify-between">
                    <FieldLabel>Contenido (Markdown)</FieldLabel>
                    <Button type="button" variant="outline" size="sm" className="gap-2" onClick={() => setShowPreview(true)}>
                      <Eye className="h-3.5 w-3.5" />
                      Previsualizar
                    </Button>
                  </div>
                  <MarkdownEditorField value={field.value} onChange={field.onChange} />
                  {errors.contentMarkdown && <FieldError errors={[errors.contentMarkdown]} />}
                </Field>
              )}
            />
          </div>

          <div className="flex justify-end gap-3">
            <Button type="button" variant="outline" onClick={() => router.push('/admin/blog/articulos')} disabled={isPending}>
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
                'Crear Artículo'
              )}
            </Button>
          </div>
        </FieldGroup>
      </form>

      <ArticlePreviewModal
        isOpen={showPreview}
        onClose={() => setShowPreview(false)}
        title={title}
        contentMarkdown={contentMarkdown}
        youtubeUrl={youtubeUrl}
        coverPreviewUrl={coverFile instanceof File ? URL.createObjectURL(coverFile) : initialData?.coverImageUrl}
      />
    </>
  )
}
