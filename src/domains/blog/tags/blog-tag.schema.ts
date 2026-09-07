import * as z from 'zod'

export const createBlogTagSchema = z.object({
  name: z.string().min(1, 'El nombre de la etiqueta es obligatorio'),
  url: z.string().min(1, 'La URL del servicio es obligatoria'),
  icon: z.string().min(1, 'Selecciona un ícono'),
})

export const updateBlogTagSchema = createBlogTagSchema.partial()

export type BlogTagFormValues = z.infer<typeof createBlogTagSchema>
