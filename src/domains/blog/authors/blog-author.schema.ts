import * as z from 'zod'

export const createBlogAuthorSchema = z.object({
  name: z.string().min(1, 'El nombre del autor es obligatorio'),
  role: z.string().min(1, 'El rol del autor es obligatorio'),
  bio: z.string().min(1, 'La biografía es obligatoria').max(500, 'Máximo 500 caracteres'),
  avatarFile: z.instanceof(File).optional(),
})

export const updateBlogAuthorSchema = createBlogAuthorSchema.partial()

export type BlogAuthorFormValues = z.infer<typeof createBlogAuthorSchema>
