import * as z from 'zod';

// Esquema para el objeto ExternalIdInput
const externalIdSchema = z.object({
  type: z.string().min(1, 'El tipo es obligatorio (ej: ISRC)'),
  value: z.string().min(1, 'El valor es obligatorio'),
});

export const createTrackSchema = z.object({
  title: z.string().min(1, 'El título es obligatorio'),
  
  // Validamos que sea un UUID v4 como exige el DTO
  genreId: z.string().uuid('Debes seleccionar un género musical válido'),
  
  subGenre: z.string().optional(), 
  
  language: z.string().min(1, 'El idioma es obligatorio'),
  
  lyric: z.string().min(1, 'La letra es obligatoria'), 
  
  // Exigimos un array de strings (UUIDs) y al menos 1 elemento
  authorsIds: z.array(z.string().uuid('ID de autor inválido')).min(1, 'Debe haber al menos un autor seleccionado'),
  
  isAvailable: z.boolean().optional().default(true),
  
  isGospel: z.boolean({ required_error: 'Debes indicar si es Gospel o no' }),
  
  audio: z.instanceof(File, { message: "Audio requerido" }),
  coverImage: z.instanceof(File).optional(),
});

export type CreateTrackFormValues = z.infer<typeof createTrackSchema>;