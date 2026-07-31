import * as z from 'zod';

// Esquema para el objeto ExternalIdInput
const externalIdSchema = z.object({
  type: z.string().min(1, 'El tipo es obligatorio (ej: ISRC)'),
  value: z.string().min(1, 'El valor es obligatorio'),
});

export const createTrackSchema = z.object({
  title: z.string().min(1, 'El título es obligatorio').trim(),

  // Para la UI basta con que haya un género seleccionado (id string)
  genreId: z.string().min(1, 'Debes seleccionar un género musical'),
  
  subGenre: z.string().optional(), 
  
  language: z.string().min(1, 'El idioma es obligatorio'),
  
  lyric: z.string().min(1, 'La letra es obligatoria').transform((val) => val.replace(/\s+/g, " ")), 
  
  // IDs de autores (opcional en la UI; el backend puede inferir el autor principal)
  authorsIds: z
    .array(z.string().min(1, 'ID de autor inválido'))
    .optional()
    .default([]),
  
  isAvailable: z.boolean().optional().default(true),

  isGospel: z.boolean({ required_error: 'Debes indicar si es Gospel o no' }),

  moodsIds: z
    .array(z.string())
    .min(1, 'Selecciona al menos 1 mood')
    .max(2, 'Máximo 2 moods por canción'),

  themeId: z.string().optional(),

  isFeat: z.boolean().optional().default(false),

  iswc: z.string().optional(),
  
  audio: z.instanceof(File, { message: "Audio requerido" }),
  coverImage: z.instanceof(File).optional(),

  // Propiedad intelectual (opcional)
  intellectualProperties: z
    .array(
      z.object({
        type: z.enum(["copyrightOffice", "cmo"]),
        key: z.string().min(1, "Debes seleccionar una opción o ingresar un valor"),
        file: z.instanceof(File, {
          message: "El documento PDF es obligatorio",
        }),
      })
    )
    .optional()
    .default([]),
});

export const updateTrackSchema = createTrackSchema.partial().extend({
  // Override audio to be completely optional during update
  audio: z.instanceof(File, { message: "Audio requerido" }).optional(),
  title: z.string().min(1, 'El título es obligatorio').trim(),
  genreId: z.string().min(1, 'Debes seleccionar un género musical'),
  language: z.string().min(1, 'El idioma es obligatorio'),
  lyric: z.string().min(1, 'La letra es obligatoria').transform((val) => val.replace(/\s+/g, " ")),
  moodsIds: z
    .array(z.string())
    .min(1, 'Selecciona al menos 1 mood')
    .max(2, 'Máximo 2 moods por canción'),
});

export type UpdateTrackFormValues = z.infer<typeof updateTrackSchema>;

export type CreateTrackFormValues = z.infer<typeof createTrackSchema>;

/** Tipo individual para usar en useFieldArray */
export type IntellectualPropertyEntry = CreateTrackFormValues["intellectualProperties"][number];