import * as z from 'zod';

// Esquema para el objeto ExternalIdInput
const externalIdSchema = z.object({
  type: z.string().min(1, 'El tipo es obligatorio (ej: ISRC)'),
  value: z.string().min(1, 'El valor es obligatorio'),
});

export const createTrackSchema = z.object({
  title: z.string().min(1, 'El título es obligatorio'),

  // Para la UI basta con que haya un género seleccionado (id string)
  genreId: z.string().min(1, 'Debes seleccionar un género musical'),
  
  subGenre: z.string().optional(), 
  
  language: z.string().min(1, 'El idioma es obligatorio'),
  
  lyric: z.string().min(1, 'La letra es obligatoria'), 
  
  // IDs de autores (opcional en la UI; el backend puede inferir el autor principal)
  authorsIds: z
    .array(z.string().min(1, 'ID de autor inválido'))
    .optional()
    .default([]),
  
  isAvailable: z.boolean().optional().default(true),
  
  isGospel: z.boolean({ required_error: 'Debes indicar si es Gospel o no' }),
  
  audio: z.instanceof(File, { message: "Audio requerido" }),
  coverImage: z.instanceof(File).optional(),
});

export type CreateTrackFormValues = z.infer<typeof createTrackSchema>;