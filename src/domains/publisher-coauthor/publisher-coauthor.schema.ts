import { z } from 'zod';
import { CoauthorRole } from '@/src/domains/splits/types/splits.types';

export const rosterCoauthorDefaultItemSchema = z.object({
  userId: z.string().uuid(),
  enabled: z.boolean(),
  role: z.nativeEnum(CoauthorRole),
  percentage: z
    .number({ invalid_type_error: 'Ingresa un porcentaje' })
    .min(0, 'Mínimo 0%')
    .max(100, 'Máximo 100%'),
});

export const rosterCoauthorDefaultsFormSchema = z.object({
  items: z.array(rosterCoauthorDefaultItemSchema).superRefine((items, ctx) => {
    items.forEach((item, index) => {
      if (item.enabled && item.percentage <= 0) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'Para activar la coautoría el porcentaje debe ser mayor a 0',
          path: [index, 'percentage'],
        });
      }
    });
  }),
});

export type RosterCoauthorDefaultsFormValues = z.infer<typeof rosterCoauthorDefaultsFormSchema>;
