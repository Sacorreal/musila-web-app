import { z } from 'zod';

export const trackNoteFormSchema = z.object({
  content: z
    .string({ required_error: 'Escribe el contenido de la nota' })
    .trim()
    .min(1, 'Escribe el contenido de la nota')
    .max(2000, 'La nota no puede superar los 2000 caracteres'),
  timestampSeconds: z
    .number({ invalid_type_error: 'El minuto debe ser un número' })
    .int('El minuto debe ser un número entero')
    .min(0, 'El minuto no puede ser negativo')
    .optional(),
});

export type TrackNoteFormValues = z.infer<typeof trackNoteFormSchema>;

export const updateTrackNoteFormSchema = trackNoteFormSchema.partial();

export type UpdateTrackNoteFormValues = z.infer<typeof updateTrackNoteFormSchema>;
