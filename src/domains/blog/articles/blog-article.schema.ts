import * as z from 'zod'

export const createBlogArticleSchema = z.object({
  title: z.string().min(1, 'El título es obligatorio'),
  contentMarkdown: z.string().min(1, 'El contenido es obligatorio'),
  excerpt: z.string().optional(),
  youtubeUrl: z.string().url('Ingresa una URL válida').optional().or(z.literal('')),
  status: z.enum(['draft', 'published']).default('draft'),
  coverFile: z.instanceof(File).optional(),
  authorIds: z.array(z.string()).min(1, 'Selecciona al menos un autor'),
  tagIds: z.array(z.string()).min(1, 'Selecciona al menos una etiqueta'),
})

export const updateBlogArticleSchema = createBlogArticleSchema.partial().extend({
  authorIds: z.array(z.string()).min(1, 'Selecciona al menos un autor'),
  tagIds: z.array(z.string()).min(1, 'Selecciona al menos una etiqueta'),
})

export type BlogArticleFormValues = z.infer<typeof createBlogArticleSchema>
